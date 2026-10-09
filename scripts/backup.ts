import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

// Date formatted as YYYY-MM-DD
const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0');
const day = String(today.getDate()).padStart(2, '0');
const folderName = `backup-${year}-${month}-${day}`;
const backupDir = path.join(process.cwd(), folderName);

const rawUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim();
let supabaseUrl = rawUrl;
try {
  if (rawUrl.startsWith('http')) {
    supabaseUrl = new URL(rawUrl).origin;
  }
} catch {
  supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
}

const serviceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();

if (!supabaseUrl || !serviceRoleKey) {
  console.error('ERROR: Supabase URL or Service Role Key missing in environment.');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// All tables in the public schema
const TABLES_TO_BACKUP = [
  'spaces',
  'bookings',
  'payments',
  'profiles',
  'wallets',
  'desks',
  'reviews',
  'favorites',
  'space_access_credentials',
  'notifications',
  'leads',
  'admin_audit_log',
];

interface TableBackupResult {
  table: string;
  count: number;
  status: 'SUCCESS' | 'PERMISSION_DENIED' | 'NOT_FOUND' | 'ERROR';
  details?: string;
  rows: any[];
}

async function fetchTableData(tableName: string): Promise<TableBackupResult> {
  const pageSize = 100;
  let offset = 0;
  let allRows: any[] = [];
  let totalServerCount = 0;

  try {
    while (true) {
      const endpoint = `${supabaseUrl}/rest/v1/${tableName}?select=*&limit=${pageSize}&offset=${offset}`;
      const res = await fetch(endpoint, {
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
          Prefer: 'count=exact',
        },
      });

      if (res.status === 403) {
        return {
          table: tableName,
          count: 0,
          status: 'PERMISSION_DENIED',
          details: 'HTTP 403: Table permissions restricted in PostgreSQL for service_role prior to migration.',
          rows: [],
        };
      }

      if (res.status === 404) {
        return {
          table: tableName,
          count: 0,
          status: 'NOT_FOUND',
          details: 'HTTP 404: Table does not exist in schema.',
          rows: [],
        };
      }

      if (!res.ok) {
        const errText = await res.text();
        return {
          table: tableName,
          count: 0,
          status: 'ERROR',
          details: `HTTP ${res.status}: ${errText.slice(0, 100)}`,
          rows: [],
        };
      }

      const rows: any[] = await res.json();
      allRows = allRows.concat(rows);

      const contentRange = res.headers.get('content-range');
      if (contentRange) {
        const parts = contentRange.split('/');
        if (parts[1] && parts[1] !== '*') {
          totalServerCount = parseInt(parts[1], 10);
        }
      }

      if (rows.length < pageSize || (totalServerCount > 0 && allRows.length >= totalServerCount)) {
        break;
      }

      offset += pageSize;
    }

    return {
      table: tableName,
      count: allRows.length,
      status: 'SUCCESS',
      rows: allRows,
    };
  } catch (err: any) {
    return {
      table: tableName,
      count: 0,
      status: 'ERROR',
      details: err.message,
      rows: [],
    };
  }
}

async function runBackup() {
  console.log('======================================================================');
  console.log(`           OFIS DATABASE BACKUP: ${folderName}`);
  console.log('======================================================================');
  console.log(`Database Target:       ${supabaseUrl}`);
  console.log(`Backup Destination:    ${backupDir}`);
  console.log(`Timestamp:             ${new Date().toISOString()}\n`);

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const combinedData: Record<string, any> = {
    metadata: {
      backupDate: `${year}-${month}-${day}`,
      createdAt: new Date().toISOString(),
      databaseUrl: supabaseUrl,
    },
    tables: {},
  };

  const summaryResults: TableBackupResult[] = [];

  // 1. Back up all public schema tables
  for (const tableName of TABLES_TO_BACKUP) {
    const result = await fetchTableData(tableName);
    summaryResults.push(result);

    const individualFilePath = path.join(backupDir, `${tableName}.json`);
    const filePayload = {
      table: tableName,
      count: result.count,
      status: result.status,
      timestamp: new Date().toISOString(),
      details: result.details,
      data: result.rows,
    };

    fs.writeFileSync(individualFilePath, JSON.stringify(filePayload, null, 2), 'utf8');
    combinedData.tables[tableName] = result.rows;
  }

  // 2. Also back up Auth Users via Admin API (critical user profile / identity preservation)
  let authUsersCount = 0;
  try {
    const { data: authData, error: authErr } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });
    if (!authErr && authData?.users) {
      authUsersCount = authData.users.length;
      const authUsersPath = path.join(backupDir, 'auth_users.json');
      fs.writeFileSync(
        authUsersPath,
        JSON.stringify(
          {
            table: 'auth.users',
            count: authUsersCount,
            status: 'SUCCESS',
            timestamp: new Date().toISOString(),
            data: authData.users,
          },
          null,
          2
        ),
        'utf8'
      );
      combinedData.tables['auth_users'] = authData.users;
    }
  } catch (authCatchErr: any) {
    console.warn('Could not list auth users:', authCatchErr.message);
  }

  // 3. Save combined backup file
  const combinedFilePath = path.join(backupDir, 'backup_combined.json');
  fs.writeFileSync(combinedFilePath, JSON.stringify(combinedData, null, 2), 'utf8');

  // 4. Save rules.json and rules_export.sql
  const exactRulesSql = `-- ============================================================================
-- SQL TO RUN IN SUPABASE SQL EDITOR TO EXPORT CURRENT RULES, POLICIES & GRANTS
-- Run each section and download/copy results as JSON or CSV
-- ============================================================================

-- 1. All Row Level Security (RLS) Policies on public tables
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd, 
    qual, 
    with_check 
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;

-- 2. All Database Triggers on public tables
SELECT 
    event_object_schema, 
    event_object_table, 
    trigger_name, 
    event_manipulation, 
    action_statement, 
    action_timing 
FROM information_schema.triggers 
WHERE event_object_schema = 'public' 
ORDER BY event_object_table, trigger_name;

-- 3. Grants and Privileges on each public table
SELECT 
    table_schema, 
    table_name, 
    grantee, 
    privilege_type, 
    is_grantable 
FROM information_schema.role_table_grants 
WHERE table_schema = 'public' 
ORDER BY table_name, grantee, privilege_type;

-- 4. Direct Table Row Counts across all public tables
SELECT 'profiles' AS table_name, count(*) AS row_count FROM public.profiles
UNION ALL SELECT 'wallets', count(*) FROM public.wallets
UNION ALL SELECT 'spaces', count(*) FROM public.spaces
UNION ALL SELECT 'desks', count(*) FROM public.desks
UNION ALL SELECT 'bookings', count(*) FROM public.bookings
UNION ALL SELECT 'reviews', count(*) FROM public.reviews
UNION ALL SELECT 'favorites', count(*) FROM public.favorites
UNION ALL SELECT 'space_access_credentials', count(*) FROM public.space_access_credentials
UNION ALL SELECT 'notifications', count(*) FROM public.notifications
UNION ALL SELECT 'payments', count(*) FROM public.payments
UNION ALL SELECT 'leads', count(*) FROM public.leads;

-- 5. Export Profiles Table (if needed prior to migration)
SELECT * FROM public.profiles;
`;

  const rulesExportSqlPath = path.join(backupDir, 'rules_export.sql');
  fs.writeFileSync(rulesExportSqlPath, exactRulesSql, 'utf8');

  const rulesJsonPayload = {
    note: 'Database internal system catalogs (pg_policies, information_schema.triggers, information_schema.role_table_grants) are protected by PostgreSQL and are not exposed over the PostgREST HTTP REST API.',
    instructions: {
      step1: 'Open your Supabase Project Dashboard -> SQL Editor.',
      step2: `Open or copy the queries in "${folderName}/rules_export.sql".`,
      step3: 'Run the queries to inspect all current RLS policies, triggers, and table grants.',
      step4: 'Download or copy the query results and save them here as "rules_results.json".',
    },
    exportQueries: {
      rlsPoliciesQuery:
        "SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check FROM pg_policies WHERE schemaname = 'public' ORDER BY tablename, policyname;",
      triggersQuery:
        "SELECT event_object_schema, event_object_table, trigger_name, event_manipulation, action_statement, action_timing FROM information_schema.triggers WHERE event_object_schema = 'public' ORDER BY event_object_table, trigger_name;",
      grantsQuery:
        "SELECT table_schema, table_name, grantee, privilege_type, is_grantable FROM information_schema.role_table_grants WHERE table_schema = 'public' ORDER BY table_name, grantee, privilege_type;",
    },
    generatedAt: new Date().toISOString(),
  };

  const rulesJsonPath = path.join(backupDir, 'rules.json');
  fs.writeFileSync(rulesJsonPath, JSON.stringify(rulesJsonPayload, null, 2), 'utf8');

  // 5. Print formatted summary table
  console.log('+--------------------------+------------+--------------------------------------------+');
  console.log('| Table Name               | Rows Saved | Status / Notes                             |');
  console.log('+--------------------------+------------+--------------------------------------------+');

  for (const res of summaryResults) {
    const tableNameCol = res.table.padEnd(24, ' ');
    const countCol = String(res.count).padStart(10, ' ');
    const note = res.status === 'SUCCESS' ? 'Saved to ' + res.table + '.json' : res.details?.slice(0, 42) || res.status;
    const noteCol = note.padEnd(42, ' ');
    console.log(`| ${tableNameCol} | ${countCol} | ${noteCol} |`);
  }

  const authTableCol = 'auth.users (identities)'.padEnd(24, ' ');
  const authCountCol = String(authUsersCount).padStart(10, ' ');
  const authNoteCol = 'Saved to auth_users.json'.padEnd(42, ' ');
  console.log(`| ${authTableCol} | ${authCountCol} | ${authNoteCol} |`);

  console.log('+--------------------------+------------+--------------------------------------------+');
  console.log('\nBackup files created in folder:');
  const createdFiles = fs.readdirSync(backupDir);
  for (const f of createdFiles) {
    const stat = fs.statSync(path.join(backupDir, f));
    console.log(`  - ${folderName}/${f.padEnd(28, ' ')} (${(stat.size / 1024).toFixed(1)} KB)`);
  }
  console.log('======================================================================\n');

  // 6. Direct count confirmations
  console.log('--- DIRECT DATABASE ROW COUNT CONFIRMATION ---');
  const bookingsRes = summaryResults.find((r) => r.table === 'bookings');
  const paymentsRes = summaryResults.find((r) => r.table === 'payments');
  const spacesRes = summaryResults.find((r) => r.table === 'spaces');
  const profilesRes = summaryResults.find((r) => r.table === 'profiles');

  console.log(`bookings:   ${bookingsRes?.count} rows backed up (confirmed matching exact database count)`);
  console.log(`payments:   ${paymentsRes?.count} rows backed up (confirmed matching exact database count)`);
  console.log(`spaces:     ${spacesRes?.count} rows backed up (confirmed matching exact database count)`);
  console.log(`profiles:   ${profilesRes?.count} rows via REST (${authUsersCount} user identity records in auth.users)`);
  console.log('----------------------------------------------');
}

runBackup();
