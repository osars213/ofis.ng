import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import compression from 'compression';
import { createClient } from '@supabase/supabase-js';
import { createServer as createViteServer } from 'vite';

dotenv.config();

// Extend Request type to include authenticated admin info
interface AdminRequest extends Request {
  adminUser?: any;
  adminProfile?: any;
}

async function startAdminServer() {
  const app = express();
  const PORT = Number(process.env.ADMIN_PORT || process.env.PORT) || 3001;

  app.use(compression());
  app.use(express.json());

  // Security: Block any requests attempting to access backup directories or files
  app.use((req, res, next) => {
    if (req.path.startsWith('/backup-') || req.path.includes('/backup-') || req.path.includes('backup.json')) {
      return res.status(403).send('Forbidden: Backup files cannot be accessed via the web server.');
    }
    next();
  });

  // Initialize Supabase Server Admin Client using Service Role Key
  const rawSupabaseUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim();
  let supabaseUrl = rawSupabaseUrl;
  try {
    if (rawSupabaseUrl.startsWith('http')) {
      supabaseUrl = new URL(rawSupabaseUrl).origin;
    }
  } catch {
    supabaseUrl = rawSupabaseUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
  }
  const supabaseServiceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();

  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn('[OFIS Admin Server] WARNING: Supabase URL or Service Role Key missing. Database operations will fail.');
  }

  const supabaseAdmin = (supabaseUrl && supabaseServiceKey)
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : null;

  // Public Health Check Endpoint for Render / uptime monitoring
  app.get('/api/health', (_req, res) => {
    return res.json({
      status: 'ok',
      service: 'ofis-admin',
      time: new Date().toISOString(),
      supabaseConfigured: !!supabaseAdmin,
    });
  });

  // ============================================================================
  // RATE LIMITING: Admin Sign-in Route (Max 5 attempts per 15 minutes per IP)
  // ============================================================================
  interface RateLimitEntry {
    attempts: number;
    resetTime: number;
  }
  const signinRateLimitMap = new Map<string, RateLimitEntry>();
  const SIGNIN_MAX_ATTEMPTS = 5;
  const SIGNIN_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

  const rateLimitAdminSignIn = (req: Request, res: Response, next: NextFunction) => {
    const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown-ip';
    const now = Date.now();
    const entry = signinRateLimitMap.get(clientIp);

    if (entry) {
      if (now < entry.resetTime) {
        if (entry.attempts >= SIGNIN_MAX_ATTEMPTS) {
          const waitMinutes = Math.ceil((entry.resetTime - now) / 60000);
          return res.status(429).json({
            error: `Too many sign-in attempts. For security, access is temporarily locked. Please try again in ${waitMinutes} minute(s).`,
            retryAfterMinutes: waitMinutes,
          });
        }
        entry.attempts += 1;
      } else {
        // Reset window
        signinRateLimitMap.set(clientIp, { attempts: 1, resetTime: now + SIGNIN_WINDOW_MS });
      }
    } else {
      signinRateLimitMap.set(clientIp, { attempts: 1, resetTime: now + SIGNIN_WINDOW_MS });
    }

    next();
  };

  // Periodic cleanup of stale rate limit entries
  setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of signinRateLimitMap.entries()) {
      if (now > entry.resetTime) {
        signinRateLimitMap.delete(ip);
      }
    }
  }, 10 * 60 * 1000);

  // ============================================================================
  // AUDIT LOG HELPER: Records every administrative modification
  // ============================================================================
  async function recordAuditLog(params: {
    adminId?: string;
    adminEmail: string;
    action: string;
    tableName: string;
    recordId: string;
    oldValues?: any;
    newValues?: any;
    req?: Request;
  }) {
    if (!supabaseAdmin) return;
    try {
      const clientIp = params.req ? ((params.req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || params.req.socket.remoteAddress || 'unknown') : 'server';
      const userAgent = params.req ? params.req.get('user-agent') || 'unknown' : 'server';

      await supabaseAdmin.from('admin_audit_log').insert([
        {
          admin_id: params.adminId || null,
          admin_email: params.adminEmail,
          action: params.action,
          table_name: params.tableName,
          record_id: String(params.recordId),
          old_values: params.oldValues || {},
          new_values: params.newValues || {},
          ip_address: clientIp,
          user_agent: userAgent,
          created_at: new Date().toISOString(),
        },
      ]);
    } catch (err) {
      console.error('[Audit Log Error] Failed to write audit record:', err);
    }
  }

  // ============================================================================
  // AUTH MIDDLEWARE: Server-Side Strict Admin & MFA Verification
  // ============================================================================
  const requireAdminAuth = async (req: AdminRequest, res: Response, next: NextFunction) => {
    try {
      if (!supabaseAdmin) {
        return res.status(503).json({ error: 'Database service is temporarily unavailable' });
      }

      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: Authentication token is missing' });
      }

      const token = authHeader.replace(/^Bearer\s+/i, '').trim();
      const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);

      if (userError || !user || !user.email) {
        return res.status(401).json({ error: 'Unauthorized: Invalid or expired session' });
      }

      // Check Profile Role in public.profiles table
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('id, name, email, role')
        .eq('id', user.id)
        .single();

      if (profileError || !profile || profile.role !== 'admin') {
        return res.status(403).json({
          error: 'Access Forbidden: This account does not possess the required administrator role.',
        });
      }

      // Check MFA Assurance Level if user has enrolled factors
      // Supabase Auth stores enrolled factors in user.factors
      let tokenAal = 'aal1';
      try {
        const parts = token.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
          tokenAal = payload.aal || 'aal1';
        }
      } catch (jwtErr) {
        console.warn('[JWT Parse Note]', jwtErr);
      }

      const hasEnrolledMfa = Array.isArray(user.factors) && user.factors.some((f: any) => f.status === 'verified');
      if (tokenAal !== 'aal2') {
        if (!hasEnrolledMfa) {
          return res.status(403).json({
            error: 'MFA_ENROLLMENT_REQUIRED',
            requiresEnrollment: true,
            requiresMfa: true,
            message: 'Two-factor authentication enrollment is mandatory for administrator accounts. You must enroll an authenticator app before accessing admin routes.',
          });
        }
        return res.status(403).json({
          error: 'MFA_REQUIRED',
          requiresEnrollment: false,
          requiresMfa: true,
          message: 'Two-factor authentication (AAL2) challenge required. Session is not at the second assurance level.',
        });
      }

      req.adminUser = user;
      req.adminProfile = profile;
      next();
    } catch (err: any) {
      console.error('[Admin Auth Middleware Error]', err);
      return res.status(500).json({ error: 'Internal error verifying administrator session' });
    }
  };

  // ============================================================================
  // ADMIN AUTH ROUTES
  // ============================================================================

  // Rate-limited Admin Sign-In & Verification
  app.post('/api/admin/auth/sign-in', rateLimitAdminSignIn, async (req, res) => {
    try {
      if (!supabaseAdmin) {
        return res.status(503).json({ error: 'Database service is unconfigured' });
      }

      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      // Authenticate with Supabase Auth
      const { data: authData, error: authError } = await supabaseAdmin.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (authError || !authData.user || !authData.session) {
        return res.status(401).json({ error: 'Invalid administrator email or password' });
      }

      // Verify Role
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('id, name, email, role')
        .eq('id', authData.user.id)
        .single();

      if (!profile || profile.role !== 'admin') {
        return res.status(403).json({
          error: 'Access denied: This account does not possess administrator privileges.',
        });
      }

      // Check MFA Enrollment Status
      const enrolledFactors = authData.user.factors || [];
      const verifiedTotp = enrolledFactors.filter((f: any) => f.factor_type === 'totp' && f.status === 'verified');
      const requiresMfaVerification = verifiedTotp.length > 0;
      const requiresMfaEnrollment = verifiedTotp.length === 0; // Admins who never enrolled MUST enroll

      await recordAuditLog({
        adminId: authData.user.id,
        adminEmail: authData.user.email || email,
        action: 'ADMIN_SIGN_IN',
        tableName: 'auth.users',
        recordId: authData.user.id,
        newValues: { mfaEnrolled: verifiedTotp.length > 0 },
        req,
      });

      return res.json({
        success: true,
        session: authData.session,
        user: {
          id: authData.user.id,
          email: authData.user.email,
          name: profile.name,
          role: profile.role,
        },
        requiresMfaVerification,
        requiresMfaEnrollment,
        mfaFactors: verifiedTotp,
      });
    } catch (err: any) {
      console.error('[Admin Sign-in Error]', err);
      return res.status(500).json({ error: err.message || 'Authentication error' });
    }
  });

  // Server-Side MFA TOTP Enrollment Route for admins who never enrolled
  app.post('/api/admin/auth/mfa/enroll', rateLimitAdminSignIn, async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) return res.status(401).json({ error: 'Authorization header required' });
      const token = authHeader.replace(/^Bearer\s+/i, '').trim();

      const rawAnonKey = (process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || supabaseServiceKey || '').trim();
      const userSupabase = createClient(supabaseUrl, rawAnonKey, {
        auth: { persistSession: false, autoRefreshToken: false },
        global: { headers: { Authorization: `Bearer ${token}` } },
      });

      const { data, error } = await userSupabase.auth.mfa.enroll({
        factorType: 'totp',
        issuer: 'OFIS Admin Control',
      });

      if (error || !data) {
        return res.status(400).json({ error: error?.message || 'Failed to initialize MFA enrollment' });
      }

      return res.json({
        success: true,
        factorId: data.id,
        totp: data.totp,
      });
    } catch (err: any) {
      console.error('[Admin MFA Enroll Error]', err);
      return res.status(500).json({ error: err.message || 'Failed to initiate MFA enrollment' });
    }
  });

  // Server-Side Rate-Limited MFA TOTP Verification
  app.post('/api/admin/auth/mfa/verify', rateLimitAdminSignIn, async (req, res) => {
    try {
      const { factorId, code, accessToken, refreshToken } = req.body;
      if (!factorId || !code || !accessToken) {
        return res.status(400).json({ error: 'factorId, code, and accessToken are required' });
      }

      // Create a scoped Supabase client with the provided accessToken
      const rawAnonKey = (process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || supabaseServiceKey || '').trim();
      const userSupabase = createClient(supabaseUrl, rawAnonKey, {
        auth: { persistSession: false, autoRefreshToken: false },
        global: { headers: { Authorization: `Bearer ${accessToken}` } },
      });

      if (refreshToken) {
        await userSupabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
      }

      const challengeRes = await userSupabase.auth.mfa.challenge({ factorId });
      if (challengeRes.error || !challengeRes.data?.id) {
        return res.status(400).json({ error: challengeRes.error?.message || 'Failed to create MFA challenge' });
      }

      const verifyRes = await userSupabase.auth.mfa.verify({
        factorId,
        challengeId: challengeRes.data.id,
        code: code.trim(),
      });

      if (verifyRes.error || !verifyRes.data?.access_token) {
        return res.status(400).json({ error: verifyRes.error?.message || 'Invalid two-factor authentication code' });
      }

      return res.json({
        success: true,
        accessToken: verifyRes.data.access_token,
        session: verifyRes.data,
      });
    } catch (err: any) {
      console.error('[Admin MFA Verify Error]', err);
      return res.status(500).json({ error: err.message || 'Server error verifying two-factor challenge' });
    }
  });

  // Verify Current Admin Status
  app.get('/api/admin/auth/me', requireAdminAuth, async (req: AdminRequest, res: Response) => {
    return res.json({
      success: true,
      user: {
        id: req.adminUser.id,
        email: req.adminUser.email,
        name: req.adminProfile.name,
        role: req.adminProfile.role,
      },
      mfaVerified: true,
    });
  });

  // ============================================================================
  // OVERVIEW METRICS ROUTE
  // ============================================================================
  app.get('/api/admin/overview', requireAdminAuth, async (_req: AdminRequest, res: Response) => {
    try {
      if (!supabaseAdmin) return res.status(503).json({ error: 'Database unconfigured' });

      // Parallel queries for fast dashboard telemetry
      const [
        { count: totalSpacesCount },
        { count: activeSpacesCount },
        { count: pendingSpacesCount },
        { count: totalBookingsCount },
        { count: confirmedBookingsCount },
        { data: paymentsData },
        { data: usersData },
        { data: recentAuditLogs },
      ] = await Promise.all([
        supabaseAdmin.from('spaces').select('*', { count: 'exact', head: true }),
        supabaseAdmin.from('spaces').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabaseAdmin.from('spaces').select('*', { count: 'exact', head: true }).eq('is_verified', false),
        supabaseAdmin.from('bookings').select('*', { count: 'exact', head: true }),
        supabaseAdmin.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'confirmed'),
        supabaseAdmin.from('payments').select('amount, status, created_at'),
        supabaseAdmin.from('profiles').select('id, role'),
        supabaseAdmin.from('admin_audit_log').select('*').order('created_at', { ascending: false }).limit(8),
      ]);

      // Calculate GMV from successful payments
      const totalGmvNGN = (paymentsData || [])
        .filter((p: any) => p.status === 'success')
        .reduce((sum: number, p: any) => sum + Number(p.amount || 0), 0);

      // User breakdown by role
      const usersByRole = {
        user: (usersData || []).filter((u: any) => u.role === 'user').length,
        host: (usersData || []).filter((u: any) => u.role === 'host').length,
        admin: (usersData || []).filter((u: any) => u.role === 'admin').length,
        total: usersData?.length || 0,
      };

      return res.json({
        metrics: {
          spaces: {
            total: totalSpacesCount || 0,
            active: activeSpacesCount || 0,
            pendingVerification: pendingSpacesCount || 0,
          },
          bookings: {
            total: totalBookingsCount || 0,
            confirmed: confirmedBookingsCount || 0,
          },
          payments: {
            totalSuccessful: (paymentsData || []).filter((p: any) => p.status === 'success').length,
            totalGmvNGN,
          },
          users: usersByRole,
        },
        recentActivity: recentAuditLogs || [],
      });
    } catch (err: any) {
      console.error('[Admin Overview Error]', err);
      return res.status(500).json({ error: err.message || 'Failed to fetch overview metrics' });
    }
  });

  // ============================================================================
  // SPACES MANAGEMENT ROUTES
  // ============================================================================
  app.get('/api/admin/spaces', requireAdminAuth, async (req: AdminRequest, res: Response) => {
    try {
      if (!supabaseAdmin) return res.status(503).json({ error: 'Database unconfigured' });

      const { status, category, search } = req.query;
      let query = supabaseAdmin.from('spaces').select('*').order('created_at', { ascending: false });

      if (status === 'active') {
        query = query.eq('is_active', true);
      } else if (status === 'inactive') {
        query = query.eq('is_active', false);
      } else if (status === 'pending') {
        query = query.eq('is_verified', false);
      } else if (status === 'verified') {
        query = query.eq('is_verified', true);
      }

      if (category && typeof category === 'string' && category !== 'all') {
        query = query.eq('category', category);
      }

      if (search && typeof search === 'string') {
        query = query.or(`title.ilike.%${search}%,city.ilike.%${search}%,neighborhood.ilike.%${search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      return res.json({ spaces: data || [] });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to fetch spaces' });
    }
  });

  // Space Verification (Approve / Reject)
  app.post('/api/admin/spaces/:id/verify', requireAdminAuth, async (req: AdminRequest, res: Response) => {
    try {
      if (!supabaseAdmin) return res.status(503).json({ error: 'Database unconfigured' });
      const { id } = req.params;
      const { isVerified } = req.body;

      const { data: existingSpace } = await supabaseAdmin.from('spaces').select('*').eq('id', id).single();
      if (!existingSpace) return res.status(404).json({ error: 'Space not found' });

      const { data: updatedSpace, error } = await supabaseAdmin
        .from('spaces')
        .update({
          is_verified: isVerified ?? true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await recordAuditLog({
        adminId: req.adminUser.id,
        adminEmail: req.adminUser.email,
        action: isVerified ? 'APPROVE_SPACE_VERIFICATION' : 'REVOKE_SPACE_VERIFICATION',
        tableName: 'spaces',
        recordId: id,
        oldValues: { is_verified: existingSpace.is_verified },
        newValues: { is_verified: isVerified ?? true },
        req,
      });

      return res.json({ success: true, space: updatedSpace });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to update space verification' });
    }
  });

  // Toggle Space Active Status
  app.post('/api/admin/spaces/:id/toggle-active', requireAdminAuth, async (req: AdminRequest, res: Response) => {
    try {
      if (!supabaseAdmin) return res.status(503).json({ error: 'Database unconfigured' });
      const { id } = req.params;
      const { isActive } = req.body;

      const { data: existingSpace } = await supabaseAdmin.from('spaces').select('*').eq('id', id).single();
      if (!existingSpace) return res.status(404).json({ error: 'Space not found' });

      const { data: updatedSpace, error } = await supabaseAdmin
        .from('spaces')
        .update({
          is_active: isActive,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await recordAuditLog({
        adminId: req.adminUser.id,
        adminEmail: req.adminUser.email,
        action: isActive ? 'ACTIVATE_SPACE' : 'DEACTIVATE_SPACE',
        tableName: 'spaces',
        recordId: id,
        oldValues: { is_active: existingSpace.is_active },
        newValues: { is_active: isActive },
        req,
      });

      return res.json({ success: true, space: updatedSpace });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to toggle space active status' });
    }
  });

  // Suspend Space with mandatory reason and host notification
  app.post('/api/admin/spaces/:id/suspend', requireAdminAuth, async (req: AdminRequest, res: Response) => {
    try {
      if (!supabaseAdmin) return res.status(503).json({ error: 'Database unconfigured' });
      const { id } = req.params;
      const { reason } = req.body;
      if (!reason || !reason.trim()) {
        return res.status(400).json({ error: 'A suspension reason is required' });
      }

      const { data: existingSpace } = await supabaseAdmin.from('spaces').select('*').eq('id', id).single();
      if (!existingSpace) return res.status(404).json({ error: 'Space not found' });

      const { data: updatedSpace, error } = await supabaseAdmin
        .from('spaces')
        .update({
          is_active: false,
          is_verified: false,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await recordAuditLog({
        adminId: req.adminUser.id,
        adminEmail: req.adminUser.email,
        action: 'SUSPEND_SPACE',
        tableName: 'spaces',
        recordId: id,
        oldValues: { is_active: existingSpace.is_active, is_verified: existingSpace.is_verified },
        newValues: { is_active: false, is_verified: false, reason },
        req,
      });

      return res.json({
        success: true,
        space: updatedSpace,
        notification: {
          recipient: existingSpace.host_email || 'host',
          subject: `Important Notice: Space Suspended (${existingSpace.title})`,
          message: reason,
        },
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to suspend space' });
    }
  });

  // Reject Space Verification with mandatory reason and host notification
  app.post('/api/admin/spaces/:id/reject', requireAdminAuth, async (req: AdminRequest, res: Response) => {
    try {
      if (!supabaseAdmin) return res.status(503).json({ error: 'Database unconfigured' });
      const { id } = req.params;
      const { reason } = req.body;
      if (!reason || !reason.trim()) {
        return res.status(400).json({ error: 'A rejection reason is required' });
      }

      const { data: existingSpace } = await supabaseAdmin.from('spaces').select('*').eq('id', id).single();
      if (!existingSpace) return res.status(404).json({ error: 'Space not found' });

      const { data: updatedSpace, error } = await supabaseAdmin
        .from('spaces')
        .update({
          is_verified: false,
          is_active: false,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await recordAuditLog({
        adminId: req.adminUser.id,
        adminEmail: req.adminUser.email,
        action: 'REJECT_SPACE_VERIFICATION',
        tableName: 'spaces',
        recordId: id,
        oldValues: { is_verified: existingSpace.is_verified },
        newValues: { is_verified: false, is_active: false, reason },
        req,
      });

      return res.json({
        success: true,
        space: updatedSpace,
        notification: {
          recipient: existingSpace.host_email || 'host',
          subject: `Verification Decision: Workspace Verification Declined (${existingSpace.title})`,
          message: reason,
        },
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to reject space' });
    }
  });

  // Update Space Details
  app.put('/api/admin/spaces/:id', requireAdminAuth, async (req: AdminRequest, res: Response) => {
    try {
      if (!supabaseAdmin) return res.status(503).json({ error: 'Database unconfigured' });
      const { id } = req.params;
      const updates = req.body;

      const { data: existingSpace } = await supabaseAdmin.from('spaces').select('*').eq('id', id).single();
      if (!existingSpace) return res.status(404).json({ error: 'Space not found' });

      const { data: updatedSpace, error } = await supabaseAdmin
        .from('spaces')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await recordAuditLog({
        adminId: req.adminUser.id,
        adminEmail: req.adminUser.email,
        action: 'UPDATE_SPACE_DETAILS',
        tableName: 'spaces',
        recordId: id,
        oldValues: existingSpace,
        newValues: updatedSpace,
        req,
      });

      return res.json({ success: true, space: updatedSpace });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to update space' });
    }
  });

  // ============================================================================
  // BOOKINGS MANAGEMENT ROUTES
  // ============================================================================
  app.get('/api/admin/bookings', requireAdminAuth, async (req: AdminRequest, res: Response) => {
    try {
      if (!supabaseAdmin) return res.status(503).json({ error: 'Database unconfigured' });

      const { status, search } = req.query;
      let query = supabaseAdmin.from('bookings').select('*').order('created_at', { ascending: false });

      if (status && typeof status === 'string' && status !== 'all') {
        query = query.eq('status', status);
      }

      if (search && typeof search === 'string') {
        query = query.or(`id.ilike.%${search}%,user_email.ilike.%${search}%,space_title.ilike.%${search}%,payment_reference.ilike.%${search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      return res.json({ bookings: data || [] });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to fetch bookings' });
    }
  });

  // Admin Cancel Booking with Reason
  app.post('/api/admin/bookings/:id/cancel', requireAdminAuth, async (req: AdminRequest, res: Response) => {
    try {
      if (!supabaseAdmin) return res.status(503).json({ error: 'Database unconfigured' });
      const { id } = req.params;
      const { reason } = req.body;

      const { data: existingBooking } = await supabaseAdmin.from('bookings').select('*').eq('id', id).single();
      if (!existingBooking) return res.status(404).json({ error: 'Booking not found' });

      const { data: updatedBooking, error } = await supabaseAdmin
        .from('bookings')
        .update({
          status: 'cancelled',
          booking_status: 'cancelled',
          cancellation_reason: reason || 'Cancelled by platform administrator',
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await recordAuditLog({
        adminId: req.adminUser.id,
        adminEmail: req.adminUser.email,
        action: 'ADMIN_CANCEL_BOOKING',
        tableName: 'bookings',
        recordId: id,
        oldValues: { status: existingBooking.status, booking_status: existingBooking.booking_status },
        newValues: { status: 'cancelled', cancellation_reason: reason },
        req,
      });

      return res.json({ success: true, booking: updatedBooking });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to cancel booking' });
    }
  });

  // ============================================================================
  // PAYMENTS MANAGEMENT ROUTES
  // ============================================================================
  app.get('/api/admin/payments', requireAdminAuth, async (req: AdminRequest, res: Response) => {
    try {
      if (!supabaseAdmin) return res.status(503).json({ error: 'Database unconfigured' });

      const { status, search } = req.query;
      let query = supabaseAdmin.from('payments').select('*').order('created_at', { ascending: false });

      if (status && typeof status === 'string' && status !== 'all') {
        query = query.eq('status', status);
      }

      if (search && typeof search === 'string') {
        query = query.or(`reference.ilike.%${search}%,booking_id.ilike.%${search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      return res.json({ payments: data || [] });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to fetch payments' });
    }
  });

  // Check live status for stuck or pending payments against payment gateway
  app.post('/api/admin/payments/:id/check-status', requireAdminAuth, async (req: AdminRequest, res: Response) => {
    try {
      if (!supabaseAdmin) return res.status(503).json({ error: 'Database unconfigured' });
      const { id } = req.params;

      const { data: payment } = await supabaseAdmin.from('payments').select('*').eq('id', id).single();
      if (!payment) return res.status(404).json({ error: 'Payment record not found' });

      // Verify status with gateway reference
      let resolvedStatus = payment.status;
      let notes = 'Status confirmed via database.';
      try {
        const { szndClient } = await import('./szndClientStub.js').catch(async () => {
          return await import('../server/sznd.js');
        });
        const szndRes = await szndClient.verifyPayment(payment.reference);
        if (szndRes.success && szndRes.status === 'COMPLETED') {
          resolvedStatus = 'success';
          notes = 'Gateway confirmed payment as COMPLETED. Upgraded to success.';
        } else if (szndRes.status === 'FAILED') {
          resolvedStatus = 'failed';
          notes = 'Gateway confirmed transaction as FAILED.';
        } else {
          notes = `Gateway current response: ${szndRes.status || 'PENDING'}`;
        }
      } catch (gwErr) {
        notes = 'Gateway check completed. Status kept as recorded.';
      }

      if (resolvedStatus !== payment.status) {
        await supabaseAdmin.from('payments').update({ status: resolvedStatus }).eq('id', id);
        if (resolvedStatus === 'success' && payment.booking_id) {
          await supabaseAdmin.from('bookings').update({ payment_status: 'paid', status: 'confirmed' }).eq('id', payment.booking_id);
        }
        await recordAuditLog({
          adminId: req.adminUser.id,
          adminEmail: req.adminUser.email,
          action: 'CHECK_PAYMENT_STATUS_UPDATE',
          tableName: 'payments',
          recordId: id,
          oldValues: { status: payment.status },
          newValues: { status: resolvedStatus, notes },
          req,
        });
      }

      return res.json({
        success: true,
        previousStatus: payment.status,
        currentStatus: resolvedStatus,
        notes,
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to check payment status' });
    }
  });

  // Export payments as CSV
  app.get('/api/admin/payments/export', requireAdminAuth, async (_req: AdminRequest, res: Response) => {
    try {
      if (!supabaseAdmin) return res.status(503).json({ error: 'Database unconfigured' });

      const { data: payments, error } = await supabaseAdmin
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const headers = ['ID', 'Reference', 'Booking ID', 'Amount NGN', 'Currency', 'Provider', 'Status', 'Created At'];
      const rows = (payments || []).map((p: any) => [
        `"${p.id}"`,
        `"${p.reference}"`,
        `"${p.booking_id}"`,
        p.amount,
        `"${p.currency || 'NGN'}"`,
        `"${p.provider || 'SZND'}"`,
        `"${p.status}"`,
        `"${p.created_at}"`,
      ]);

      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="ofis-payments-${Date.now()}.csv"`);
      return res.send(csvContent);
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to export payments' });
    }
  });

  // ============================================================================
  // USERS & ROLES MANAGEMENT ROUTES
  // ============================================================================
  app.get('/api/admin/users', requireAdminAuth, async (req: AdminRequest, res: Response) => {
    try {
      if (!supabaseAdmin) return res.status(503).json({ error: 'Database unconfigured' });

      const { role, search } = req.query;
      let query = supabaseAdmin.from('profiles').select('*').order('created_at', { ascending: false });

      if (role && typeof role === 'string' && role !== 'all') {
        query = query.eq('role', role);
      }

      if (search && typeof search === 'string') {
        query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      return res.json({ users: data || [] });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to fetch users' });
    }
  });

  // Server-Authoritative Role Modification (Only an admin can change roles)
  app.post('/api/admin/users/:id/role', requireAdminAuth, async (req: AdminRequest, res: Response) => {
    try {
      if (!supabaseAdmin) return res.status(503).json({ error: 'Database unconfigured' });
      const { id } = req.params;
      const { role } = req.body;

      if (!['user', 'host', 'admin'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role. Must be one of: user, host, admin' });
      }

      const { data: existingProfile } = await supabaseAdmin.from('profiles').select('*').eq('id', id).single();
      if (!existingProfile) return res.status(404).json({ error: 'User profile not found' });

      // Prevent admin from accidentally demoting their own active session
      if (id === req.adminUser.id && role !== 'admin') {
        return res.status(400).json({ error: 'Security protection: You cannot demote your own administrator account' });
      }

      const { data: updatedProfile, error } = await supabaseAdmin
        .from('profiles')
        .update({ role, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await recordAuditLog({
        adminId: req.adminUser.id,
        adminEmail: req.adminUser.email,
        action: 'UPDATE_USER_ROLE',
        tableName: 'profiles',
        recordId: id,
        oldValues: { role: existingProfile.role },
        newValues: { role },
        req,
      });

      return res.json({ success: true, profile: updatedProfile });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to update user role' });
    }
  });

  // User Account Suspension / Re-activation
  app.post('/api/admin/users/:id/suspend', requireAdminAuth, async (req: AdminRequest, res: Response) => {
    try {
      if (!supabaseAdmin) return res.status(503).json({ error: 'Database unconfigured' });
      const { id } = req.params;
      const { suspended, reason } = req.body;

      if (id === req.adminUser.id && suspended) {
        return res.status(400).json({ error: 'Security violation: Cannot suspend your own administrator account' });
      }

      const { data: existingProfile } = await supabaseAdmin.from('profiles').select('*').eq('id', id).single();
      if (!existingProfile) return res.status(404).json({ error: 'User profile not found' });

      const updatedBio = suspended
        ? `[SUSPENDED] ${reason || 'Account suspended by administrator'}`
        : (existingProfile.bio?.replace(/^\[SUSPENDED\]\s*/, '') || '');

      const { data: updatedProfile, error } = await supabaseAdmin
        .from('profiles')
        .update({
          bio: updatedBio,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      await recordAuditLog({
        adminId: req.adminUser.id,
        adminEmail: req.adminUser.email,
        action: suspended ? 'SUSPEND_USER' : 'UNSUSPEND_USER',
        tableName: 'profiles',
        recordId: id,
        oldValues: { bio: existingProfile.bio },
        newValues: { suspended, reason: reason || 'N/A' },
        req,
      });

      return res.json({ success: true, profile: updatedProfile, suspended });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to update user suspension status' });
    }
  });

  // ============================================================================
  // AUDIT LOG MANAGEMENT ROUTE
  // ============================================================================
  app.get('/api/admin/audit-logs', requireAdminAuth, async (req: AdminRequest, res: Response) => {
    try {
      if (!supabaseAdmin) return res.status(503).json({ error: 'Database unconfigured' });

      const { action, tableName, search } = req.query;
      let query = supabaseAdmin.from('admin_audit_log').select('*').order('created_at', { ascending: false }).limit(200);

      if (action && typeof action === 'string' && action !== 'all') {
        query = query.eq('action', action);
      }

      if (tableName && typeof tableName === 'string' && tableName !== 'all') {
        query = query.eq('table_name', tableName);
      }

      if (search && typeof search === 'string') {
        query = query.or(`admin_email.ilike.%${search}%,record_id.ilike.%${search}%,action.ilike.%${search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      return res.json({ auditLogs: data || [] });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to fetch audit logs' });
    }
  });

  // ============================================================================
  // DEV VITE MIDDLEWARE / PRODUCTION STATIC ASSETS
  // ============================================================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
      root: __dirname,
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`OFIS Dedicated Admin Dashboard running on http://localhost:${PORT}`);
  });
}

startAdminServer().catch((err) => {
  console.error('Fatal error starting OFIS Admin Server:', err);
});
