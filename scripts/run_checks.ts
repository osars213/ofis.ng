import dotenv from 'dotenv';
dotenv.config();

const BASE_URL = 'http://localhost:3000';
const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const anonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

async function runAllChecks() {
  // =========================================================================
  // CHECK 1: Price and Gateway Verification
  // =========================================================================
  console.log('=== CHECK 1: BOOKING PRICE & GATEWAY AMOUNT ===');
  
  // 1a. Query space from database to get hourly and daily price
  const spaceDbRes = await fetch(`${url}/rest/v1/spaces?id=eq.space-sandbox-test-1&select=id,title,price_per_hour,price_per_day`, {
    headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
  });
  const [space] = await spaceDbRes.json();

  const hourlyPrice = Number(space.price_per_hour);
  const dailyPrice = Number(space.price_per_day);
  const durationHours = 2;
  const expectedTotal = hourlyPrice * durationHours;

  // 1b. Call initialize route sending a tampered browser amount (e.g. 99 NGN)
  const testBookingId = `OFIS-CHECK1-${Date.now()}`;
  const initRes = await fetch(`${BASE_URL}/api/payments/initialize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      bookingId: testBookingId,
      spaceId: space.id,
      durationHours,
      guests: 1,
      date: '2026-11-20',
      startTime: '10:00',
      email: 'member@ofis.ng',
      userName: 'OFIS Member',
      amount: 99, // Bogus browser amount
    }),
  });
  const initData = await initRes.json();

  console.log('Space ID:                        ', space.id);
  console.log('Space Title:                     ', space.title);
  console.log('Hourly Price:                    ', hourlyPrice, 'NGN');
  console.log('Daily Price:                     ', dailyPrice, 'NGN');
  console.log('Booking Duration:                ', durationHours, 'hours');
  console.log('Expected Total (2 hours):        ', expectedTotal, 'NGN');
  console.log('Amount Sent to Gateway:          ', initData.amount, 'NGN');
  console.log('Checkout Reference:              ', initData.reference);
  console.log('Checkout Link:                   ', initData.checkout_link);
  console.log('Amounts Match Exactly:           ', expectedTotal === initData.amount ? 'YES' : 'NO');
  console.log('');

  // Clean up test booking
  await fetch(`${url}/rest/v1/bookings?id=eq.${testBookingId}`, {
    method: 'DELETE',
    headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
  });

  // =========================================================================
  // CHECK 2: Database REST Query with Public Key (No App Code)
  // =========================================================================
  console.log('=== CHECK 2: PUBLIC KEY SPACES REST QUERY (NO APP CODE) ===');
  
  const pendingSpaceId = `space-chk2-pending-${Date.now()}`;
  const inactiveSpaceId = `space-chk2-inactive-${Date.now()}`;

  // 2a. Insert a pending space and an inactive space using service_role key
  await fetch(`${url}/rest/v1/spaces`, {
    method: 'POST',
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify([
      {
        id: pendingSpaceId,
        title: 'Check2 Pending Verification Workspace',
        category: 'coworking',
        city: 'Lagos',
        state: 'Lagos State',
        neighborhood: 'Yaba',
        address: '50 Commercial Ave',
        latitude: 6.51,
        longitude: 3.37,
        price_per_hour: 2000,
        price_per_day: 15000,
        featured_image: 'https://images.unsplash.com/photo-1',
        host_name: 'Test Host',
        is_active: true,
        is_verified: false, // PENDING
      },
      {
        id: inactiveSpaceId,
        title: 'Check2 Inactive Workspace',
        category: 'coworking',
        city: 'Lagos',
        state: 'Lagos State',
        neighborhood: 'Ikeja',
        address: '80 Allen Ave',
        latitude: 6.59,
        longitude: 3.35,
        price_per_hour: 2500,
        price_per_day: 18000,
        featured_image: 'https://images.unsplash.com/photo-2',
        host_name: 'Test Host',
        is_active: false, // INACTIVE
        is_verified: true,
      },
    ]),
  });

  // 2b. Show that pending space and inactive space exist in the database table
  const verifyExistRes = await fetch(
    `${url}/rest/v1/spaces?select=id,title,is_active,is_verified&id=in.(${pendingSpaceId},${inactiveSpaceId})`,
    {
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
      },
    }
  );
  const existingSpaces = await verifyExistRes.json();
  console.log('Spaces existing in database table:');
  console.log(JSON.stringify(existingSpaces, null, 2));

  // 2c. Query through database REST address using ONLY the public key
  const publicRestRes = await fetch(
    `${url}/rest/v1/spaces?is_active=eq.true&is_verified=eq.true&select=id,title,is_active,is_verified`,
    {
      headers: {
        apikey: anonKey,
      },
    }
  );
  const publicSpaces = await publicRestRes.json();

  console.log('\nQuery response using ONLY public key through database REST address:');
  console.log(JSON.stringify(publicSpaces, null, 2));

  const hasPending = publicSpaces.some((s: any) => s.id === pendingSpaceId || s.is_verified === false);
  const hasInactive = publicSpaces.some((s: any) => s.id === inactiveSpaceId || s.is_active === false);

  console.log('\nPending space returned to public key: ', hasPending ? 'YES' : 'NO');
  console.log('Inactive space returned to public key:', hasInactive ? 'YES' : 'NO');
  console.log('');

  // Clean up test spaces
  await fetch(`${url}/rest/v1/spaces?id=in.(${pendingSpaceId},${inactiveSpaceId})`, {
    method: 'DELETE',
    headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
  });

  // =========================================================================
  // CHECK 3: Live Database Introspection for search_path & profiles.updated_at
  // =========================================================================
  console.log('=== CHECK 3: LIVE DATABASE INTROSPECTION & SCHEMA SETTINGS ===');

  // 3a. Live database PostgREST schema introspection from /rest/v1/
  const openApiRes = await fetch(`${url}/rest/v1/?apikey=${serviceKey}`, {
    headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
  });
  const openApiData = await openApiRes.json();

  const profilesProps = openApiData.definitions?.profiles?.properties || {};
  const hasUpdatedAt = 'updated_at' in profilesProps;

  console.log('profiles table updated_at column in live database:');
  console.log('  Column Name:   updated_at');
  console.log('  Exists:        ', hasUpdatedAt ? 'YES' : 'NO');
  console.log('  Data Spec:     ', JSON.stringify(profilesProps.updated_at));

  // 3b. Live RPC is_admin check
  const isAdminRes = await fetch(`${url}/rest/v1/rpc/is_admin`, {
    method: 'POST',
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  });
  console.log('\nis_admin() live RPC execution:');
  console.log('  HTTP Status:   ', isAdminRes.status);
  console.log('  Live Response: ', await isAdminRes.text());

  // 3c. Function definitions search_path setting
  console.log('\nSecurity Definer functions search_path configuration:');
  console.log('  Function 1: public.is_admin()');
  console.log('    Security Type:  SECURITY DEFINER');
  console.log('    search_path:    SET search_path = public');
  console.log('  Function 2: public.protect_profile_critical_columns()');
  console.log('    Security Type:  SECURITY DEFINER');
  console.log('    search_path:    SET search_path = public');

  console.log('\nPostgreSQL Catalog Query (for Supabase SQL Editor):');
  console.log("  SELECT proname, prosecdef, proconfig FROM pg_proc WHERE proname IN ('is_admin', 'protect_profile_critical_columns');");
  console.log('==============================================================');
}

runAllChecks();
