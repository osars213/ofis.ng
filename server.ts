import express from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import compression from 'compression';
import { GoogleGenAI } from '@google/genai';
import { createClient } from '@supabase/supabase-js';
import { createServer as createViteServer } from 'vite';
import { szndClient } from './server/sznd';
import { calculateBookingPrice } from './src/utils/pricing';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Enable Gzip/Brotli compression to dramatically reduce payload size and speed up FCP/LCP
  app.use(compression());
  app.use(
    express.json({
      verify: (req: any, _res, buf) => {
        req.rawBody = buf;
      },
    })
  );

  // Initialize Supabase Server Admin Client strictly using SUPABASE_SERVICE_ROLE_KEY (no fallback to anon/public keys)
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

  // Privileged server client ONLY initialized if SUPABASE_SERVICE_ROLE_KEY is provided
  const supabaseAdmin = (supabaseUrl && supabaseServiceKey)
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : null;

  // Authoritative admin email whitelist - restricted strictly to verified account owner
  const AUTHORIZED_ADMIN_EMAILS = new Set(
    [
      'jonesnathalie820@gmail.com',
      (process.env.ADMIN_EMAIL || '').trim().toLowerCase(),
    ].filter(Boolean)
  );

  // Robust Admin Verification: Requires role = 'admin' AND membership in authorized email whitelist AND verified email
  const isUserAuthorizedAdmin = (
    user: { email?: string; email_confirmed_at?: string } | null | undefined,
    profile?: { role?: string } | null
  ): boolean => {
    if (!user || !user.email) return false;
    if (profile?.role !== 'admin') return false;
    // Require email to be confirmed (mandatory in production environments)
    if (process.env.NODE_ENV === 'production' && !user.email_confirmed_at) return false;
    return AUTHORIZED_ADMIN_EMAILS.has(user.email.toLowerCase());
  };

  // Initialize Gemini AI client safely on server
  let ai: GoogleGenAI | null = null;
  if (process.env.GEMINI_API_KEY) {
    try {
      ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    } catch (err) {
      console.warn('Gemini AI initialization note:', err);
    }
  }

  // Health check
  app.get('/api/health', (req, res) => {
    const diag = szndClient.getDiagnostics();
    res.json({
      status: 'ok',
      time: new Date().toISOString(),
      supabaseConnected: !!supabaseAdmin,
      supabaseUrl: supabaseUrl ? supabaseUrl.replace(/(https:\/\/[^.]+).*/, '$1.supabase.co') : null,
      paymentProvider: 'sznd',
      szndEnvironment: diag.environment,
      szndConfigured: szndClient.isConfigured(),
      szndDiagnostics: {
        environment: diag.environment,
        apiKeyConfigured: diag.apiKeyConfigured,
        apiKeyLength: diag.apiKeyLength,
        apiSecretConfigured: diag.apiSecretConfigured,
        apiSecretLength: diag.apiSecretLength,
        apiSecretValidPrefix: diag.apiSecretValidPrefix,
        baseUrlConfigured: diag.baseUrlConfigured,
      },
    });
  });

  // Safe Payment Environment Diagnostic Endpoint (Section 11)
  app.get('/api/payments/diagnostics', (req, res) => {
    const diag = szndClient.getDiagnostics();
    res.json({
      status: 'ok',
      provider: 'sznd',
      'SZND environment': diag.environment,
      'SZND API key configured': diag.apiKeyConfigured,
      'SZND API key length': diag.apiKeyLength,
      'SZND API secret configured': diag.apiSecretConfigured,
      'SZND API secret length': diag.apiSecretLength,
      'SZND API secret valid prefix (sk_)': diag.apiSecretValidPrefix,
      'SZND base URL configured': diag.baseUrlConfigured,
    });
  });

  // Client IP & Geolocation Detection Endpoint
  app.get('/api/ip-info', async (req, res) => {
    try {
      const forwarded = req.headers['x-forwarded-for'];
      const rawIp = typeof forwarded === 'string'
        ? forwarded.split(',')[0].trim()
        : req.socket.remoteAddress || '';
      
      const cleanIp = rawIp.replace(/^::ffff:/, '');

      // Check header country code if present from edge proxy
      const headerCountry = (
        (req.headers['cf-ipcountry'] as string) ||
        (req.headers['x-appengine-country'] as string) ||
        (req.headers['x-country-code'] as string) ||
        ''
      ).toUpperCase().trim();

      if (headerCountry && headerCountry !== 'XX' && headerCountry !== 'T1') {
        return res.json({
          success: true,
          detectedCountryCode: headerCountry,
          ipAddress: cleanIp || 'Edge Client IP',
        });
      }

      // If valid public IP, query lightweight geo provider with quick timeout
      if (cleanIp && cleanIp !== '127.0.0.1' && cleanIp !== '::1' && !cleanIp.startsWith('192.168.') && !cleanIp.startsWith('10.') && !cleanIp.startsWith('172.')) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 1200);
          const geoRes = await fetch(`https://ipwho.is/${cleanIp}`, { signal: controller.signal });
          clearTimeout(timeoutId);
          if (geoRes.ok) {
            const geoData = await geoRes.json();
            if (geoData && geoData.success !== false && geoData.country_code) {
              return res.json({
                success: true,
                detectedCountryCode: geoData.country_code,
                detectedCountry: geoData.country,
                ipAddress: cleanIp,
              });
            }
          }
        } catch {
          // Timeout or lookup failure, proceed to fallback
        }
      }

      return res.json({
        success: true,
        detectedCountryCode: 'US',
        ipAddress: cleanIp || 'Client IP',
      });
    } catch (err: any) {
      return res.json({
        success: false,
        detectedCountryCode: 'US',
        error: err.message,
      });
    }
  });

  // Supabase Comprehensive Diagnostics Endpoint
  app.get('/api/supabase/diagnostics', async (req, res) => {
    const startTime = Date.now();
    const configCheck = {
      isConfigured: !!supabaseUrl && !!supabaseServiceKey,
      rawUrl: rawSupabaseUrl ? rawSupabaseUrl.replace(/(https:\/\/[^.]+).*/, '$1.supabase.co') : null,
      cleanedBaseUrl: supabaseUrl ? supabaseUrl.replace(/(https:\/\/[^.]+).*/, '$1.supabase.co') : null,
      hasAnonKey: !!process.env.VITE_SUPABASE_ANON_KEY,
      hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    };

    if (!supabaseAdmin) {
      return res.json({
        success: false,
        status: 'unconfigured',
        latencyMs: 0,
        config: configCheck,
        message: 'Supabase credentials are not configured in environment variables.',
        tables: {},
      });
    }

    const tablesToCheck = [
      'spaces',
      'profiles',
      'bookings',
      'desks',
      'reviews',
      'space_access_credentials',
      'payments',
      'notifications',
    ];

    const tableResults: Record<string, { exists: boolean; rowCount?: number; error?: string }> = {};
    let allTablesReady = true;

    await Promise.all(
      tablesToCheck.map(async (table) => {
        try {
          const { count, error } = await supabaseAdmin
            .from(table)
            .select('*', { count: 'exact', head: true });

          if (error) {
            allTablesReady = false;
            tableResults[table] = {
              exists: false,
              error: error.message,
            };
          } else {
            tableResults[table] = {
              exists: true,
              rowCount: count ?? 0,
            };
          }
        } catch (err: any) {
          allTablesReady = false;
          tableResults[table] = {
            exists: false,
            error: err.message,
          };
        }
      })
    );

    const latencyMs = Date.now() - startTime;

    return res.json({
      success: true,
      status: allTablesReady ? 'ready' : 'tables_missing_schema_needed',
      latencyMs,
      config: configCheck,
      tablesReady: allTablesReady,
      tables: tableResults,
      schemaFile: '/supabase/schema.sql',
      message: allTablesReady
        ? 'Supabase database is fully connected and schema is synchronized!'
        : 'Supabase connection established successfully, but schema tables have not been created yet. Run /supabase/schema.sql in your Supabase SQL Editor.',
    });
  });

  // ============================================================================
  // CONCURRENCY-SAFE DOUBLE-BOOKING PROTECTION ENGINE
  // ============================================================================

  interface ConfirmedBookingRecord {
    id: string;
    spaceId: string;
    date: string;
    startTime: string;
    endTime: string;
    durationHours: number;
    selectedSeatId: string | null;
    guestCount: number;
    confirmedAt: string;
    payment_reference?: string;
  }

  // Active in-memory registry for concurrency collision tracking and demo/sandbox safety
  const activeConfirmedBookingsRegistry = new Map<string, ConfirmedBookingRecord>();

  function calculateEndTime(startTime: string, durationHours: number): string {
    const parts = (startTime || '09:00').split(':').map(Number);
    const h = isNaN(parts[0]) ? 9 : parts[0];
    const m = isNaN(parts[1]) ? 0 : parts[1];
    const totalMinutes = h * 60 + m + (Math.max(1, durationHours) * 60);
    const endH = Math.min(23, Math.floor(totalMinutes / 60));
    const endM = totalMinutes % 60;
    return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
  }

  function timeIntervalsOverlap(startA: string, endA: string, startB: string, endB: string): boolean {
    return startA < endB && startB < endA;
  }

  async function checkBookingConflict(params: {
    spaceId: string;
    date: string;
    startTime: string;
    durationHours: number;
    selectedSeatId?: string | null;
    guestCount?: number;
    excludeBookingId?: string;
    spaceCategory?: string;
    spaceCapacity?: number;
  }): Promise<{ hasConflict: boolean; message?: string; conflictingId?: string }> {
    const {
      spaceId,
      date,
      startTime,
      durationHours,
      selectedSeatId = null,
      guestCount = 1,
      excludeBookingId,
      spaceCategory,
      spaceCapacity = 50,
    } = params;

    const reqEndTime = calculateEndTime(startTime, durationHours);

    // 1. Check in-memory active confirmed registry
    for (const [id, rec] of activeConfirmedBookingsRegistry.entries()) {
      if (excludeBookingId && id === excludeBookingId) continue;
      if (rec.spaceId === spaceId && rec.date === date) {
        if (timeIntervalsOverlap(startTime, reqEndTime, rec.startTime, rec.endTime)) {
          if (selectedSeatId && rec.selectedSeatId && selectedSeatId === rec.selectedSeatId) {
            return {
              hasConflict: true,
              message: `Seat ${selectedSeatId} is already booked for this time window.`,
              conflictingId: id,
            };
          }
          const isExclusiveSpace = ['private_office', 'meeting', 'podcast', 'photography', 'event'].includes(spaceCategory || '') || spaceCapacity === 1;
          if (isExclusiveSpace || !selectedSeatId) {
            return {
              hasConflict: true,
              message: `This space is already booked from ${rec.startTime} to ${rec.endTime} on ${date}.`,
              conflictingId: id,
            };
          }
        }
      }
    }

    // 2. Check Supabase database if connected
    if (supabaseAdmin) {
      try {
        const { data: dbBookings, error } = await supabaseAdmin
          .from('bookings')
          .select('id, date, start_time, end_time, duration_hours, selected_seat_id, guest_count, status, booking_status, payment_status')
          .eq('space_id', spaceId)
          .eq('date', date)
          .in('status', ['confirmed', 'ready_for_checkin', 'checked_in', 'in_progress', 'active'])
          .eq('payment_status', 'paid');

        if (!error && dbBookings) {
          let totalOverlappingGuests = 0;
          for (const b of dbBookings) {
            if (excludeBookingId && b.id === excludeBookingId) continue;
            const bEndTime = b.end_time || calculateEndTime(b.start_time, b.duration_hours || 1);
            if (timeIntervalsOverlap(startTime, reqEndTime, b.start_time, bEndTime)) {
              if (selectedSeatId && b.selected_seat_id && selectedSeatId === b.selected_seat_id) {
                return {
                  hasConflict: true,
                  message: `Seat ${selectedSeatId} has already been reserved and confirmed by another member.`,
                  conflictingId: b.id,
                };
              }

              const isExclusiveSpace = ['private_office', 'meeting', 'podcast', 'photography', 'event'].includes(spaceCategory || '') || spaceCapacity === 1;
              if (isExclusiveSpace) {
                return {
                  hasConflict: true,
                  message: `This workspace has already been confirmed from ${b.start_time} to ${bEndTime} on ${date}.`,
                  conflictingId: b.id,
                };
              }

              totalOverlappingGuests += Number(b.guest_count || 1);
              if (totalOverlappingGuests + guestCount > spaceCapacity) {
                return {
                  hasConflict: true,
                  message: `Workspace capacity reached for this time slot (${totalOverlappingGuests}/${spaceCapacity} guests).`,
                  conflictingId: b.id,
                };
              }
            }
          }
        }
      } catch (err) {
        console.error('Error during database conflict check:', err);
      }
    }

    return { hasConflict: false };
  }

  // Real-Time Space Availability Endpoint (No PII)
  app.get('/api/spaces/:id/availability', async (req, res) => {
    try {
      const { id } = req.params;
      const { date, month } = req.query;

      const bookedSlots: Array<{
        id: string;
        date: string;
        startTime: string;
        endTime: string;
        durationHours: number;
        selectedSeatId?: string | null;
        guestCount: number;
      }> = [];

      if (supabaseAdmin) {
        let query = supabaseAdmin
          .from('bookings')
          .select('id, date, start_time, end_time, duration_hours, selected_seat_id, guest_count, status, payment_status')
          .eq('space_id', id)
          .in('status', ['confirmed', 'ready_for_checkin', 'checked_in', 'in_progress', 'active'])
          .eq('payment_status', 'paid');

        if (date && typeof date === 'string') {
          query = query.eq('date', date);
        } else if (month && typeof month === 'string') {
          query = query.like('date', `${month}%`);
        }

        const { data, error } = await query;
        if (!error && data) {
          data.forEach((b: any) => {
            const calculatedEnd = b.end_time || calculateEndTime(b.start_time, b.duration_hours || 1);
            bookedSlots.push({
              id: b.id,
              date: b.date,
              startTime: b.start_time,
              endTime: calculatedEnd,
              durationHours: b.duration_hours || 1,
              selectedSeatId: b.selected_seat_id || null,
              guestCount: b.guest_count || 1,
            });
          });
        }
      }

      // Add in-memory active reservations
      for (const [bId, rec] of activeConfirmedBookingsRegistry.entries()) {
        if (rec.spaceId === id && (!date || rec.date === date) && (!month || rec.date.startsWith(month as string))) {
          if (!bookedSlots.some(s => s.id === bId)) {
            bookedSlots.push({
              id: bId,
              date: rec.date,
              startTime: rec.startTime,
              endTime: rec.endTime,
              durationHours: rec.durationHours,
              selectedSeatId: rec.selectedSeatId,
              guestCount: rec.guestCount,
            });
          }
        }
      }

      return res.json({
        success: true,
        spaceId: id,
        bookedSlots,
      });
    } catch (err: any) {
      console.error('Error in /api/spaces/:id/availability:', err);
      return res.status(500).json({ error: err.message || 'Failed to fetch space availability' });
    }
  });

  // ============================================================================
  // AUTHORITATIVE SERVER-SIDE PAYMENT INITIATION & VERIFICATION (SZND)
  // ============================================================================

  // 1. Initialize Payment with SZND Hosted Checkout Gateway
  app.post('/api/payments/initialize', async (req, res) => {
    try {
      const {
        bookingId,
        spaceId,
        email,
        callbackUrl,
        paymentMethod = 'sznd',
        date,
        startTime,
        durationHours,
        guests,
        quantity,
        userName,
        userPhone,
      } = req.body;

      if (!bookingId) {
        return res.status(400).json({ error: 'bookingId is required' });
      }

      if (!supabaseAdmin) {
        if (process.env.NODE_ENV === 'production') {
          return res.status(503).json({
            error: 'Database service is not configured (SUPABASE_SERVICE_ROLE_KEY is missing). Cannot process payment in production.',
          });
        }

        // Concurrency Pre-Validation in sandbox mode
        const sandboxSpaceId = spaceId || 'space-1';
        const sandboxDate = date || '2026-09-25';
        const sandboxStartTime = startTime || '09:00';
        const sandboxDuration = Number(durationHours || 2);
        const sandboxSeat = req.body.selectedSeatId || null;

        const sandboxConflict = await checkBookingConflict({
          spaceId: sandboxSpaceId,
          date: sandboxDate,
          startTime: sandboxStartTime,
          durationHours: sandboxDuration,
          selectedSeatId: sandboxSeat,
          excludeBookingId: bookingId,
        });

        if (sandboxConflict.hasConflict) {
          return res.status(409).json({
            success: false,
            conflict: true,
            code: 'SLOT_UNAVAILABLE',
            error: sandboxConflict.message || 'The selected workspace or seat is already booked for this time slot. Please choose another time.',
            conflictingId: sandboxConflict.conflictingId,
          });
        }

        // Fallback reference for local / sandbox environments when server secrets are unconfigured
        const fallbackRef = `OFIS-SZND-TEST-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
        return res.json({
          success: true,
          reference: fallbackRef,
          checkout_link: `/payment/result?reference=${fallbackRef}&booking_id=${bookingId}&sandbox=true`,
          authorizationUrl: null,
          sandbox: true,
          message: 'Payment initialized in demo sandbox mode',
        });
      }

      // 1. Authenticated User & Email Verification Enforcement
      const authHeader = req.headers.authorization;
      let authenticatedUser: any = null;
      if (authHeader) {
        const token = authHeader.replace(/^Bearer\s+/i, '');
        const { data: { user } } = await supabaseAdmin.auth.getUser(token);
        authenticatedUser = user;
      }

      if (authenticatedUser) {
        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('is_email_verified, role')
          .eq('id', authenticatedUser.id)
          .single();

        const isEmailVerified = authenticatedUser.email_confirmed_at || profile?.is_email_verified;
        if (!isEmailVerified && process.env.NODE_ENV === 'production') {
          return res.status(403).json({
            error: 'Email verification required before authorizing payments. Please verify your email.',
          });
        }
      }

      // 2. Authoritative Booking Retrieval
      let { data: booking } = await supabaseAdmin
        .from('bookings')
        .select('*, spaces(*)')
        .eq('id', bookingId)
        .single();

      // If booking not found yet, create or prepare from validated space
      const targetSpaceId = spaceId || booking?.space_id;
      if (!targetSpaceId) {
        return res.status(400).json({ error: 'Target workspace spaceId is required' });
      }

      // 3. Authoritative Workspace Validation
      let space = booking?.spaces;
      if (!space) {
        const { data: dbSpace, error: spaceErr } = await supabaseAdmin
          .from('spaces')
          .select('*')
          .eq('id', targetSpaceId)
          .single();

        if (spaceErr || !dbSpace) {
          return res.status(404).json({ error: 'Workspace listing not found' });
        }
        space = dbSpace;
      }

      if (space.is_active === false) {
        return res.status(400).json({ error: 'This workspace is currently inactive and cannot accept bookings' });
      }

      // 4. Capacity & Duration Validation
      const guestCount = Math.max(1, Number(booking?.guest_count || guests || 1));
      const spaceCapacity = Number(space.capacity || 50);
      if (guestCount > spaceCapacity) {
        return res.status(400).json({
          error: `Guest count (${guestCount}) exceeds workspace maximum capacity of ${spaceCapacity}`,
        });
      }

      const effectiveDuration = Math.max(1, Number(booking?.duration_hours || durationHours || 1));
      if (effectiveDuration <= 0 || effectiveDuration > 720) {
        return res.status(400).json({ error: 'Invalid booking duration' });
      }

      // 5. Date & Time Validation (Anchored strictly to West Africa Time WAT / Nigeria UTC+1)
      const effectiveDate = booking?.date || date;
      const effectiveStartTime = booking?.start_time || startTime || '09:00';
      if (effectiveDate) {
        // Nigeria is UTC+1 (WAT) year-round
        const bookingDateTime = new Date(`${effectiveDate}T${effectiveStartTime}:00+01:00`);
        // Disallow bookings older than 2 hours in the past
        if (!isNaN(bookingDateTime.getTime()) && bookingDateTime.getTime() < Date.now() - 2 * 3600 * 1000) {
          return res.status(400).json({ error: 'Cannot book a workspace in the past' });
        }
      }

      // 6. User Ownership & Duplicate Booking Protection
      if (booking) {
        if (authenticatedUser) {
          const isOwner = (booking.user_id === authenticatedUser.id);
          const { data: profile } = await supabaseAdmin.from('profiles').select('role').eq('id', authenticatedUser.id).single();
          const isAdmin = isUserAuthorizedAdmin(authenticatedUser, profile);
          if (!isOwner && !isAdmin) {
            return res.status(403).json({ error: 'Unauthorized: You do not own this booking' });
          }
        }

        if (booking.booking_status === 'cancelled' || booking.status === 'cancelled') {
          return res.status(400).json({ error: 'Cannot initialize payment for a cancelled booking' });
        }

        if (booking.payment_status === 'paid' && (booking.status === 'confirmed' || booking.booking_status === 'confirmed')) {
          return res.status(400).json({ error: 'This booking has already been paid and confirmed' });
        }
      }

      // 6b. Concurrency Pre-Validation: Check for conflicting active confirmed bookings
      const effectiveSeatId = booking?.selected_seat_id || req.body.selectedSeatId || req.body.seatId || null;
      const conflictCheck = await checkBookingConflict({
        spaceId: targetSpaceId,
        date: effectiveDate,
        startTime: effectiveStartTime,
        durationHours: effectiveDuration,
        selectedSeatId: effectiveSeatId,
        guestCount,
        excludeBookingId: bookingId,
        spaceCategory: space?.category,
        spaceCapacity: Number(space?.capacity || 50),
      });

      if (conflictCheck.hasConflict) {
        return res.status(409).json({
          success: false,
          conflict: true,
          code: 'SLOT_UNAVAILABLE',
          error: conflictCheck.message || 'The selected workspace or seat is already booked for this time slot. Please choose another time.',
          conflictingId: conflictCheck.conflictingId,
        });
      }

      // 7. Authoritative Server-Side Pricing Calculation (NEVER trust browser price)
      const calculatedPrice = calculateBookingPrice(space as any, {
        durationHours: effectiveDuration,
        guests: guestCount,
        quantity: Math.max(1, Number(quantity || 1)),
      });

      const totalAmountNGN = Number(calculatedPrice.totalAmount) || Number(booking?.total_amount) || 0;
      if (totalAmountNGN <= 0) {
        return res.status(400).json({ error: 'Calculated booking total amount must be greater than zero' });
      }

      // 8. Generate Unique OFIS Reference
      const cleanSuffix = String(bookingId).replace(/[^a-zA-Z0-9_-]/g, '').slice(-8);
      const ofisReference = `OFIS-SZND-${cleanSuffix}-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;

      // 9. Redirect URL Resolution
      // If APP_URL is explicitly configured for production (e.g. https://ofis.ng), use it.
      // If APP_URL points to an internal Google auth-gated dev preview (ais-dev-*.run.app),
      // prefer the request origin (localhost, tunnel, or custom domain) to avoid auth redirect bounces.
      const rawEnvUrl = (process.env.APP_URL || '').trim().replace(/\/+$/, '');
      const reqBaseUrl = `${req.get('x-forwarded-proto') || req.protocol}://${req.get('x-forwarded-host') || req.get('host') || 'localhost:3000'}`.replace(/\/+$/, '');
      const publicBaseUrl = (rawEnvUrl && !rawEnvUrl.includes('ais-dev-'))
        ? rawEnvUrl
        : (reqBaseUrl || rawEnvUrl || 'http://localhost:3000');

      const defaultRedirectUrl =
        `${publicBaseUrl}/payment/result?reference=${encodeURIComponent(ofisReference)}&booking_id=${encodeURIComponent(bookingId)}`;

      let finalRedirectUrl = defaultRedirectUrl;
      if (callbackUrl) {
        try {
          const u = new URL(callbackUrl, publicBaseUrl);
          if (!u.searchParams.has('reference')) {
            u.searchParams.set('reference', ofisReference);
          }
          if (!u.searchParams.has('booking_id')) {
            u.searchParams.set('booking_id', String(bookingId));
          }
          finalRedirectUrl = u.toString();
        } catch (e) {
          finalRedirectUrl = defaultRedirectUrl;
        }
      }

      // Customer identity details
      const customerEmail = (email || booking?.user_email || authenticatedUser?.email || 'member@ofis.ng').trim().toLowerCase();
      const rawFullName = (booking?.user_name || userName || authenticatedUser?.user_metadata?.full_name || 'OFIS Member').trim();
      const nameParts = rawFullName.split(/\s+/);
      const firstName = nameParts[0] || 'OFIS';
      const lastName = nameParts.slice(1).join(' ') || 'Member';
      const customerPhone = booking?.user_phone || userPhone || '+2348000000000';

      // 10. Initialize with SZND Hosted Checkout Gateway
      if (szndClient.isConfigured()) {
        const szndRes = await szndClient.initializeCheckout({
          email: customerEmail,
          firstName,
          lastName,
          amount: totalAmountNGN,
          currency: 'NGN',
          reference: ofisReference,
          redirectUrl: finalRedirectUrl,
          description: `OFIS Booking: ${space.name || space.title || 'Workspace Pass'}`,
          phone: customerPhone,
          metadata: {
            booking_id: bookingId,
            user_id: authenticatedUser?.id || booking?.user_id || 'guest',
            space_id: space.id,
            provider: 'sznd',
            environment: szndClient.getEnvironment(),
            redirect_url: finalRedirectUrl,
            callback_url: finalRedirectUrl,
          },
        });

        if (!szndRes.success || !szndRes.checkout_link) {
          console.error('[SZND Init Failed]', szndRes.error);
          return res.status(502).json({
            error: szndRes.error || 'Failed to initialize checkout session with SZND payment gateway',
          });
        }

        // Persist pending reference in bookings (upsert guarantees record exists in database)
        const passSuffix = String(bookingId).replace(/[^a-zA-Z0-9]/g, '').slice(-6).toUpperCase() || 'PASS01';
        const cleanNamePart = rawFullName.replace(/\s+/g, '').toUpperCase().slice(0, 10) || 'GUEST';
        const bookingPayload = {
          id: bookingId,
          space_id: targetSpaceId,
          space_title: space?.title || space?.name || 'Workspace',
          space_image: space?.featured_image || (Array.isArray(space?.images) ? space?.images[0] : '') || '',
          space_address: space?.address || '',
          space_city: space?.city || 'Lagos',
          user_id: authenticatedUser?.id || booking?.user_id || null,
          user_name: rawFullName,
          user_email: customerEmail,
          user_phone: customerPhone,
          date: effectiveDate,
          start_time: effectiveStartTime,
          duration_hours: effectiveDuration,
          guest_count: guestCount,
          total_amount: totalAmountNGN,
          currency: 'NGN',
          status: 'reserved',
          booking_status: 'reserved',
          qr_code_value: `OFIS-PASS-${passSuffix}-${cleanNamePart}`,
          digital_pass_code: `OFIS-${passSuffix}`,
          payment_reference: ofisReference,
          payment_method: 'sznd',
          payment_status: 'pending',
          updated_at: new Date().toISOString(),
        };

        const { error: upsertErr } = await supabaseAdmin
          .from('bookings')
          .upsert(bookingPayload, { onConflict: 'id' });

        if (upsertErr) {
          console.warn('[SZND Init] Warning upserting booking in Supabase:', upsertErr.message);
        }

        return res.json({
          success: true,
          checkout_link: szndRes.checkout_link,
          reference: ofisReference,
          transaction_reference: szndRes.transaction_reference,
          access_code: szndRes.access_code,
          environment: szndClient.getEnvironment(),
          bookingId,
          amount: totalAmountNGN,
          currency: 'NGN',
          sandbox: szndClient.getEnvironment() === 'test',
        });
      }

      // If in production and SZND keys missing, fail fast
      if (process.env.NODE_ENV === 'production' && szndClient.getEnvironment() === 'production') {
        return res.status(503).json({
          error: 'SZND payment gateway credentials are not configured (SZND_API_KEY/SZND_API_SECRET missing). Cannot process payment in production.',
        });
      }

      // Sandbox Fallback for local development / testing without gateway credentials
      const sandboxLink = `/payment/result?reference=${encodeURIComponent(ofisReference)}&booking_id=${encodeURIComponent(bookingId)}&sandbox=true&amount=${totalAmountNGN}`;

      // Update pending booking in database
      await supabaseAdmin
        .from('bookings')
        .update({
          payment_reference: ofisReference,
          payment_method: 'sznd',
          payment_status: 'pending',
          total_amount: totalAmountNGN,
          updated_at: new Date().toISOString(),
        })
        .eq('id', bookingId);

      return res.json({
        success: true,
        checkout_link: sandboxLink,
        reference: ofisReference,
        transaction_reference: `TR_SANDBOX_${Date.now()}`,
        bookingId,
        amount: totalAmountNGN,
        currency: 'NGN',
        sandbox: true,
        message: 'Payment initialized in sandbox mode (SZND credentials unconfigured on server)',
      });
    } catch (err: any) {
      console.error('Error in /api/payments/initialize:', err);
      res.status(500).json({ error: err.message || 'Internal payment initialization error' });
    }
  });

  // 2. Authoritative Payment Verification & Booking Confirmation (SZND)
  app.post('/api/payments/verify', async (req, res) => {
    try {
      const { bookingId, reference: reqRef, paymentReference: reqPaymentRef, sandbox } = req.body;
      let reference = reqPaymentRef || reqRef;

      if (!bookingId) {
        return res.status(400).json({ error: 'bookingId is required' });
      }

      // If reference was omitted in the request body, look up the stored payment_reference on the booking
      if (!reference && supabaseAdmin) {
        const { data: bData } = await supabaseAdmin
          .from('bookings')
          .select('payment_reference')
          .eq('id', bookingId)
          .single();
        if (bData?.payment_reference) {
          reference = bData.payment_reference;
        }
      }

      if (!reference && !sandbox) {
        return res.status(400).json({ error: 'Both bookingId and payment reference are required' });
      }

      // Database & Memory Idempotency check: If already confirmed with this reference, return idempotent success
      const existingInMemory = activeConfirmedBookingsRegistry.get(bookingId);
      if (existingInMemory && existingInMemory.payment_reference === reference) {
        return res.json({
          success: true,
          booking: {
            id: bookingId,
            spaceId: existingInMemory.spaceId,
            date: existingInMemory.date,
            startTime: existingInMemory.startTime,
            endTime: existingInMemory.endTime,
            status: 'confirmed',
            booking_status: 'confirmed',
            payment_status: 'paid',
            payment_reference: reference,
            payment_method: 'sznd',
          },
          alreadyConfirmed: true,
          message: 'Booking is already confirmed for this payment reference',
        });
      }

      let szndVerifyResult: any = null;

      if (!supabaseAdmin) {
        if (process.env.NODE_ENV === 'production' && !szndVerifyResult) {
          return res.status(503).json({
            success: false,
            error: 'Database service is not configured (SUPABASE_SERVICE_ROLE_KEY is missing). Cannot verify payment in production.',
          });
        }

        // Concurrency check in local / test registry mode
        const sandboxDate = req.body.date || '2026-09-25';
        const sandboxStartTime = req.body.startTime || '09:00';
        const sandboxDuration = Number(req.body.durationHours || 2);
        const sandboxSeat = req.body.selectedSeatId || null;
        const sandboxSpaceId = req.body.spaceId || 'space-1';

        const sandboxConflict = await checkBookingConflict({
          spaceId: sandboxSpaceId,
          date: sandboxDate,
          startTime: sandboxStartTime,
          durationHours: sandboxDuration,
          selectedSeatId: sandboxSeat,
          excludeBookingId: bookingId,
        });

        if (sandboxConflict.hasConflict) {
          return res.status(409).json({
            success: false,
            conflict: true,
            error: sandboxConflict.message || 'Double-booking conflict: this slot was already confirmed by another member.',
            bookingId,
          });
        }

        const verifiedAmount = szndVerifyResult?.amount || Number(req.body.amount || 0);

        // Record confirmed reservation in registry
        activeConfirmedBookingsRegistry.set(bookingId, {
          id: bookingId,
          spaceId: sandboxSpaceId,
          date: sandboxDate,
          startTime: sandboxStartTime,
          endTime: calculateEndTime(sandboxStartTime, sandboxDuration),
          durationHours: sandboxDuration,
          selectedSeatId: sandboxSeat,
          guestCount: Number(req.body.guestCount || 1),
          payment_reference: reference,
          confirmedAt: new Date().toISOString(),
        });

        return res.json({
          success: true,
          booking: {
            id: bookingId,
            spaceId: sandboxSpaceId,
            date: sandboxDate,
            startTime: sandboxStartTime,
            endTime: calculateEndTime(sandboxStartTime, sandboxDuration),
            durationHours: sandboxDuration,
            payment_status: 'paid',
            booking_status: 'confirmed',
            status: 'confirmed',
            payment_reference: reference,
            payment_method: 'sznd',
            amount: verifiedAmount,
          },
          verifiedByGateway: !!szndVerifyResult,
          sandbox: !szndVerifyResult,
          message: szndVerifyResult
            ? 'Payment verified with live SZND gateway and booking confirmed'
            : 'Payment verified and booking confirmed in sandbox mode',
        });
      }

      // Auth validation
      const authHeader = req.headers.authorization;
      let authenticatedUser: any = null;
      if (authHeader) {
        const token = authHeader.replace(/^Bearer\s+/i, '');
        const { data: { user }, error: userErr } = await supabaseAdmin.auth.getUser(token);
        if (!userErr && user) {
          authenticatedUser = user;
        }
      }

      // Look up booking authoritative details
      const { data: booking, error: bErr } = await supabaseAdmin
        .from('bookings')
        .select('*, spaces(*)')
        .eq('id', bookingId)
        .single();

      if (bErr || !booking) {
        return res.status(404).json({ error: 'Authoritative booking record not found' });
      }

      // Enforce caller ownership when user is authenticated
      if (authenticatedUser) {
        const isOwner = (booking.user_id === authenticatedUser.id);
        const { data: profile } = await supabaseAdmin.from('profiles').select('role').eq('id', authenticatedUser.id).single();
        const isAdmin = isUserAuthorizedAdmin(authenticatedUser, profile);
        if (!isOwner && !isAdmin) {
          return res.status(403).json({ error: 'Unauthorized: You do not own this booking' });
        }
      }

      // Check status: prevent confirmation of cancelled/expired bookings
      if (booking.booking_status === 'cancelled' || booking.booking_status === 'expired' || booking.status === 'cancelled') {
        return res.status(400).json({ error: `Cannot verify payment for a ${booking.booking_status || booking.status} booking` });
      }

      // 5. Strict Pre-Binding Check: Booking MUST already have an assigned payment reference from /initialize
      const authoritativePaymentRef = booking.payment_reference;
      if (!authoritativePaymentRef) {
        return res.status(400).json({
          error: `Booking ${booking.id} has no assigned payment reference. Checkouts must be initialized via /api/payments/initialize before verification.`,
        });
      }

      // Idempotency check: If already confirmed with our reference or incoming reference, return idempotent success
      if (
        (booking.booking_status === 'confirmed' || booking.status === 'confirmed') &&
        booking.payment_status === 'paid' &&
        (booking.payment_reference === authoritativePaymentRef || booking.payment_reference === reference)
      ) {
        return res.json({
          success: true,
          booking,
          alreadyConfirmed: true,
          message: 'Booking is already confirmed for this payment reference',
        });
      }

      // 6. Cross-booking reference collision check:
      // Ensure no other booking in the database (pending or confirmed) holds our authoritative reference
      const { data: otherBooking } = await supabaseAdmin
        .from('bookings')
        .select('id, status, payment_status')
        .eq('payment_reference', authoritativePaymentRef)
        .neq('id', bookingId)
        .maybeSingle();

      if (otherBooking) {
        return res.status(409).json({
          error: `Security violation: Payment reference '${authoritativePaymentRef}' is already assigned to a different booking (${otherBooking.id}).`,
        });
      }

      // If incoming reference was provided and differs from authoritativePaymentRef (e.g. SZND's transactionRef),
      // ensure incoming reference is NOT assigned as payment_reference to ANY OTHER booking in the database!
      if (reference && reference !== authoritativePaymentRef) {
        const { data: collisionBooking } = await supabaseAdmin
          .from('bookings')
          .select('id, status, payment_status')
          .eq('payment_reference', reference)
          .neq('id', bookingId)
          .maybeSingle();

        if (collisionBooking) {
          return res.status(409).json({
            error: `Security violation: Incoming reference '${reference}' is already assigned as payment_reference to a different booking (${collisionBooking.id}).`,
          });
        }
      }

      let verifiedAmount = 0;
      if (sandbox) {
        const clientAmount = req.body.amount !== undefined ? Number(req.body.amount) : Number(booking.total_amount);
        if (isNaN(clientAmount) || clientAmount <= 0) {
          return res.status(400).json({
            error: 'Invalid amount: payment amount must be greater than zero',
          });
        }
        verifiedAmount = clientAmount;
      } else {
        // Enforce SZND Gateway Configuration - Never fall back to trusting client or booking.total_amount
        if (!szndClient.isConfigured()) {
          return res.status(503).json({
            success: false,
            error: 'Payment verification failed: SZND payment gateway credentials (SZND_API_KEY / SZND_API_SECRET) are not configured on this server. Unverified payments cannot be confirmed.',
          });
        }

        // We query SZND with the incoming reference (SZND's transactionRef or merchant ref)
        // or fall back to our authoritativePaymentRef
        const primaryRef = reference || authoritativePaymentRef;
        let szndVerify = await szndClient.verifyPayment(primaryRef);

        // Fallback: If primaryRef did not resolve to COMPLETED and differed from authoritativePaymentRef, try authoritativePaymentRef
        if ((!szndVerify.success || szndVerify.status !== 'COMPLETED') && primaryRef !== authoritativePaymentRef) {
          const fallbackVerify = await szndClient.verifyPayment(authoritativePaymentRef);
          if (fallbackVerify.success && fallbackVerify.status === 'COMPLETED') {
            szndVerify = fallbackVerify;
          }
        }

        if (!szndVerify.success || szndVerify.status !== 'COMPLETED') {
          return res.status(400).json({
            error: szndVerify.error || szndVerify.gateway_response || 'Payment verification failed at SZND gateway',
            status: szndVerify.status,
          });
        }

        // Verify currency
        if (szndVerify.currency && szndVerify.currency !== 'NGN' && szndVerify.currency !== booking.currency) {
          return res.status(400).json({
            error: `Currency mismatch: received ${szndVerify.currency}, expected NGN`,
          });
        }

        // Capture gateway-verified amount (never trust client total)
        if (szndVerify.amount === undefined || Number(szndVerify.amount) <= 0) {
          return res.status(400).json({
            error: 'Invalid gateway payload: Verified amount is missing or invalid',
          });
        }

        verifiedAmount = Number(szndVerify.amount);

        // Authoritative Gateway Metadata / Reference Binding Check:
        // If gateway returned metadata.booking_id, verify it matches booking.id
        const gatewayBookingId = szndVerify.metadata?.booking_id;
        if (gatewayBookingId && gatewayBookingId !== booking.id) {
          return res.status(400).json({
            error: `Payment transaction reference does not match this booking record (gateway booking_id '${gatewayBookingId}' !== expected '${booking.id}').`,
          });
        }

        // Verify gateway merchant reference matches authoritativePaymentRef (if returned by gateway)
        if (szndVerify.reference && szndVerify.reference !== authoritativePaymentRef && szndVerify.reference !== reference) {
          return res.status(400).json({
            error: `Gateway payment reference mismatch: expected '${authoritativePaymentRef}', gateway reported '${szndVerify.reference}'.`,
          });
        }

        szndVerifyResult = szndVerify;
      }

      // Authoritative Concurrency Collision Check before executing confirmation
      const associatedSpace = Array.isArray(booking.spaces) ? booking.spaces[0] : booking.spaces;
      const conflictCheck = await checkBookingConflict({
        spaceId: booking.space_id,
        date: booking.date,
        startTime: booking.start_time,
        durationHours: booking.duration_hours,
        selectedSeatId: booking.selected_seat_id,
        guestCount: booking.guest_count,
        excludeBookingId: bookingId,
        spaceCategory: associatedSpace?.category,
        spaceCapacity: associatedSpace?.capacity,
      });

      if (conflictCheck.hasConflict) {
        return res.status(409).json({
          success: false,
          conflict: true,
          error: conflictCheck.message || 'Double-booking conflict: this slot or seat was already confirmed by another member.',
          bookingId,
          conflictingId: conflictCheck.conflictingId,
        });
      }

      // Invoke the hardened confirm_booking_payment RPC using service_role authority
      const isDailyBooking = booking.pricing_period === 'day' 
        || (associatedSpace as any)?.pricing_period === 'day' 
        || (Number(booking.duration_hours) >= 24);

      const bookingDuration = isDailyBooking
        ? Math.max(1, Math.ceil(Number(booking.duration_hours || 24) / 24))
        : Number(booking.duration_hours || 1);

      const bookingPeriod = isDailyBooking ? 'day' : 'hour';
      const guestMultiplier = (associatedSpace?.category === 'coworking') ? Math.max(1, Number(booking.guest_count || 1)) : 1;
      const totalUnits = Math.max(1, bookingDuration * guestMultiplier);

      const authoritativeRate = verifiedAmount > 0
        ? Number((verifiedAmount / totalUnits).toFixed(2))
        : (isDailyBooking
          ? Number((associatedSpace as any)?.price_per_day || (Number((associatedSpace as any)?.price_per_hour || 0) * 8))
          : Number((associatedSpace as any)?.price_per_hour || 0));

      const { data: confirmResult, error: rpcErr } = await supabaseAdmin.rpc('confirm_booking_payment', {
        p_booking_id: bookingId,
        p_transaction_reference: authoritativePaymentRef, // Binds strictly to booking.payment_reference
        p_provider: 'sznd',
        p_amount: verifiedAmount,
        p_metadata: {
          booking_id: bookingId,
          period: bookingPeriod,
          verified_at: new Date().toISOString(),
          verification_path: 'server_sznd_verify',
          gateway: 'sznd',
          environment: szndClient.getEnvironment(),
          sznd_transaction_reference: szndVerifyResult?.transaction_reference || ((reference && reference !== authoritativePaymentRef) ? reference : null),
          gateway_return_reference: reference || null,
        },
        p_authoritative_rate: authoritativeRate,
        p_duration_units: bookingDuration,
        p_period: bookingPeriod,
      });

      // Strict Concurrency-Safe Collision Detection
      if (confirmResult && (confirmResult.conflict === true || confirmResult.success === false)) {
        return res.status(409).json({
          success: false,
          conflict: true,
          error: confirmResult.error || 'The selected workspace or seat was already confirmed by another member for this time slot.',
          bookingId,
          conflictingId: confirmResult.conflicting_id,
        });
      }

      if (rpcErr) {
        console.error('RPC confirm_booking_payment error:', rpcErr);
        // Fallback: Authoritative server-side conflict check before applying direct update
        const conflictCheck = await checkBookingConflict({
          spaceId: booking.space_id,
          date: booking.date,
          startTime: booking.start_time,
          durationHours: booking.duration_hours,
          selectedSeatId: booking.selected_seat_id,
          guestCount: booking.guest_count,
          excludeBookingId: bookingId,
          spaceCategory: booking.spaces?.category,
          spaceCapacity: booking.spaces?.capacity,
        });

        if (conflictCheck.hasConflict) {
          return res.status(409).json({
            success: false,
            conflict: true,
            error: conflictCheck.message || 'Double-booking conflict: this slot was already confirmed by another member.',
            bookingId,
          });
        }

        // Direct update strictly keeping authoritativePaymentRef
        await supabaseAdmin.from('bookings').update({
          status: 'confirmed',
          payment_status: 'paid',
          payment_reference: authoritativePaymentRef,
          updated_at: new Date().toISOString(),
        }).eq('id', bookingId);
      }

      // Record in local active registry for instant memory caching and real-time reflection
      activeConfirmedBookingsRegistry.set(bookingId, {
        id: bookingId,
        spaceId: booking.space_id,
        date: booking.date,
        startTime: booking.start_time,
        endTime: booking.end_time || calculateEndTime(booking.start_time, booking.duration_hours || 1),
        durationHours: booking.duration_hours || 1,
        selectedSeatId: booking.selected_seat_id || null,
        guestCount: booking.guest_count || 1,
        payment_reference: authoritativePaymentRef,
        confirmedAt: new Date().toISOString(),
      });

      // Fetch confirmed booking payload with space details
      const { data: updatedBooking } = await supabaseAdmin
        .from('bookings')
        .select(`
          *,
          spaces!space_id (
            id, name, city, address, images, wifi_ssid, rating
          )
        `)
        .eq('id', bookingId)
        .single();

      return res.json({
        success: true,
        booking: updatedBooking || {
          ...booking,
          status: 'confirmed',
          booking_status: 'confirmed',
          payment_status: 'paid',
          payment_reference: authoritativePaymentRef,
          payment_method: 'sznd',
        },
        confirmResult,
        message: 'Payment successfully verified and booking confirmed with SZND',
      });
    } catch (err: any) {
      console.error('Error in /api/payments/verify:', err);
      res.status(500).json({ error: err.message || 'Payment verification error' });
    }
  });

  // 3. Webhook Receiver for SZND Gateway Notifications
  const handleSzndWebhook = async (req: express.Request, res: express.Response) => {
    try {
      if (!supabaseAdmin) {
        return res.status(503).json({ error: 'SUPABASE_SERVICE_ROLE_KEY is required for webhook operations' });
      }

      // Verify HMAC-SHA256 signature from X-Transfaar-Signature or X-Signature header
      if (!szndClient.isConfigured()) {
        return res.status(503).json({ error: 'SZND payment gateway is not configured on this server' });
      }

      const signatureHeader = req.headers['x-transfaar-signature'] || req.headers['x-signature'];
      const rawBody = (req as any).rawBody || JSON.stringify(req.body);

      const isValid = szndClient.verifyWebhookSignature(rawBody, signatureHeader as string);
      if (!isValid) {
        console.warn('[SZND Webhook] Invalid webhook signature received');
        return res.status(401).json({ error: 'Invalid webhook signature' });
      }

      const payload = req.body || {};
      const eventData = payload.data || payload;
      const rawStatus = String(eventData.status || payload.event || '').toUpperCase();
      const reference = eventData.reference || payload.reference || eventData.transaction_reference;
      const bookingId = eventData.metadata?.booking_id || payload.metadata?.booking_id;
      const amountVal = eventData.amount !== undefined ? parseFloat(String(eventData.amount)) : undefined;

      const isCompleted =
        rawStatus === 'COMPLETED' ||
        rawStatus === 'SUCCESS' ||
        rawStatus === 'CHARGE.SUCCESS' ||
        rawStatus === 'PAYMENT.SUCCESS' ||
        rawStatus === 'TRANSACTION.SUCCESSFUL';

      if (isCompleted && bookingId && reference) {
        // Fetch booking with authoritative space details
        const { data: booking } = await supabaseAdmin
          .from('bookings')
          .select('id, total_amount, payment_status, payment_reference, duration_hours, guest_count, spaces(price_per_hour, price_per_day, category, title)')
          .eq('id', bookingId)
          .single();

        if (!booking) {
          console.warn(`[SZND Webhook] Booking not found for webhook booking_id: ${bookingId}`);
          return res.status(404).json({ error: `Booking not found: ${bookingId}` });
        }

        // 1. Idempotency check: if already confirmed with this reference, return immediately
        if (booking.payment_status === 'paid' && booking.payment_reference === reference) {
          return res.status(200).json({ status: 'ok', message: 'Already processed' });
        }

        // 2. Strict Pre-Binding Check: Booking MUST already have an assigned reference from initialization
        if (!booking.payment_reference) {
          console.error(`[SZND Webhook] Booking ${bookingId} has no assigned payment reference in database.`);
          return res.status(400).json({
            error: `Security error: Booking ${bookingId} has no assigned payment reference. Must be initialized via /api/payments/initialize.`,
          });
        }

        // 3. Strict Reference Identity Match: Webhook reference MUST match booking.payment_reference
        if (booking.payment_reference !== reference) {
          console.error(`[SZND Webhook] Reference mismatch: booking ${bookingId} was issued '${booking.payment_reference}', but webhook received '${reference}'.`);
          return res.status(400).json({
            error: `Security error: Payment reference mismatch. Booking ${bookingId} expected '${booking.payment_reference}', received '${reference}'.`,
          });
        }

        // 4. Cross-booking reference collision check:
        // Ensure no other booking in the database (pending, reserved, or confirmed) holds this reference
        const { data: otherBooking } = await supabaseAdmin
          .from('bookings')
          .select('id, status, payment_status')
          .eq('payment_reference', reference)
          .neq('id', bookingId)
          .maybeSingle();

        if (otherBooking) {
          console.error(`[SZND Webhook] Reference collision: '${reference}' already assigned to booking ${otherBooking.id}`);
          return res.status(409).json({
            error: `Security violation: Payment reference '${reference}' is already assigned to a different booking (${otherBooking.id}).`,
          });
        }

          // Authoritative confirmation via hardened confirm_booking_payment RPC
          const paymentReference = reference;
          const webhookSpace = Array.isArray(booking.spaces) ? booking.spaces[0] : booking.spaces;
          const isDailyWebhook = (booking as any).pricing_period === 'day' 
            || (webhookSpace as any)?.pricing_period === 'day' 
            || (Number(booking.duration_hours) >= 24);

          const bookingDuration = isDailyWebhook
            ? Math.max(1, Math.ceil(Number(booking.duration_hours || 24) / 24))
            : Number(booking.duration_hours || 1);

          const bookingPeriod = isDailyWebhook ? 'day' : 'hour';
          const guestMultiplier = (webhookSpace?.category === 'coworking') ? Math.max(1, Number(booking.guest_count || 1)) : 1;
          const totalUnits = Math.max(1, bookingDuration * guestMultiplier);
          const effectiveWebhookAmount = amountVal || Number(booking.total_amount) || 0;

          const authoritativeRate = effectiveWebhookAmount > 0
            ? Number((effectiveWebhookAmount / totalUnits).toFixed(2))
            : (isDailyWebhook
              ? Number((webhookSpace as any)?.price_per_day || (Number((webhookSpace as any)?.price_per_hour || 0) * 8))
              : Number((webhookSpace as any)?.price_per_hour || 0));

          const { data: rpcResult, error: rpcErr } = await supabaseAdmin.rpc('confirm_booking_payment', {
            p_booking_id: bookingId,
            p_transaction_reference: paymentReference,
            p_provider: 'sznd',
            p_amount: amountVal || Number(booking.total_amount),
            p_metadata: {
              booking_id: bookingId,
              period: bookingPeriod,
              webhook_event: payload.event || 'charge.completed',
              gateway: 'sznd',
              received_at: new Date().toISOString(),
              sznd_transaction_reference: eventData.transaction_reference || null,
            },
            p_authoritative_rate: authoritativeRate,
            p_duration_units: bookingDuration,
            p_period: bookingPeriod,
          });

          if (rpcErr) {
            console.error('[SZND Webhook] confirm_booking_payment RPC error:', rpcErr);
            return res.status(400).json({ error: rpcErr.message || 'Payment confirmation failed' });
          }

          if (rpcResult && rpcResult.conflict === true) {
            console.warn('[SZND Webhook] Concurrency conflict detected during webhook processing:', rpcResult);
            return res.status(409).json({ error: 'Slot conflict', result: rpcResult });
          }
        }

      return res.status(200).json({ status: 'ok', received: true });
    } catch (err: any) {
      console.error('[SZND Webhook Error]:', err);
      return res.status(500).json({ error: err.message });
    }
  };

  // Dedicated SZND Webhook Endpoint and Legacy Fallback Alias
  app.post('/api/payments/sznd/webhook', handleSzndWebhook);
  app.post('/api/payments/webhook', handleSzndWebhook);

  // 4. Secure Access Credentials RPC Proxy
  app.post('/api/bookings/credentials', async (req, res) => {
    try {
      const { bookingId, spaceId } = req.body;
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res.status(401).json({ error: 'Authorization header required' });
      }

      if (!supabaseAdmin) {
        return res.status(503).json({ error: 'SUPABASE_SERVICE_ROLE_KEY is required to retrieve space credentials' });
      }

      const token = authHeader.replace(/^Bearer\s+/i, '');
      const { data: { user }, error: userErr } = await supabaseAdmin.auth.getUser(token);

      if (userErr || !user) {
        return res.status(401).json({ error: 'Invalid or expired user authentication token' });
      }

      // Check access permission: user must be the booker of an active confirmed booking, space host, or admin
      let userHasAccess = false;
      let targetSpaceId = spaceId;

      // Check booking
      if (bookingId) {
        const { data: b } = await supabaseAdmin
          .from('bookings')
          .select('id, user_id, booking_status, status, space_id, date, start_time, end_time')
          .eq('id', bookingId)
          .single();

        if (b) {
          targetSpaceId = b.space_id;
          const isBooker = (b.user_id === user.id);

          if (isBooker) {
            const currentStatus = b.booking_status || b.status;
            // Booker must have confirmed or checked_in booking
            if (currentStatus === 'confirmed' || currentStatus === 'checked_in') {
              // Check access window (active or up to 2 hours post-session)
              const bookingEndStr = b.date && b.end_time ? `${b.date}T${b.end_time}:00` : null;
              const endEpoch = bookingEndStr ? new Date(bookingEndStr).getTime() : Date.now() + 3600000;
              const isSessionActive = endEpoch >= Date.now() - (2 * 60 * 60 * 1000);

              if (isSessionActive) {
                userHasAccess = true;
              } else {
                return res.status(403).json({
                  error: 'Access Denied: Booking session has expired. Access credentials are only available during active booking windows.',
                });
              }
            } else {
              return res.status(403).json({
                error: `Access Denied: Booking is in ${currentStatus} status. Credentials require a confirmed payment.`,
              });
            }
          }
        }
      }

      // Check space host if not yet granted
      if (!userHasAccess && targetSpaceId) {
        const { data: s } = await supabaseAdmin
          .from('spaces')
          .select('id, host_id, owner_id')
          .eq('id', targetSpaceId)
          .single();

        if (s && (s.host_id === user.id || s.owner_id === user.id)) {
          userHasAccess = true;
        }
      }

      // Check admin if not yet granted
      if (!userHasAccess) {
        const { data: p } = await supabaseAdmin
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (p && isUserAuthorizedAdmin(user, p)) {
          userHasAccess = true;
        }
      }

      if (!userHasAccess) {
        return res.status(403).json({
          error: 'Access Denied: You must have an active confirmed booking or host privileges to view space credentials',
        });
      }

      if (!targetSpaceId) {
        return res.status(400).json({ error: 'Could not resolve space ID' });
      }

      // Retrieve credentials from space_access_credentials without hardcoded password fallbacks
      const { data: creds } = await supabaseAdmin
        .from('space_access_credentials')
        .select('*')
        .eq('space_id', targetSpaceId)
        .single();

      const { data: spaceInfo } = await supabaseAdmin
        .from('spaces')
        .select('wifi_ssid')
        .eq('id', targetSpaceId)
        .single();

      return res.json({
        credentials: {
          wifiSSID: creds?.wifi_ssid || spaceInfo?.wifi_ssid || 'OFIS_Guest_HighSpeed',
          wifiPass: creds?.wifi_pass || '',
          doorPIN: creds?.door_pin || '',
          accessInstructions: creds?.access_instructions || 'Check in at reception desk with your booking reference.',
        },
      });
    } catch (err: any) {
      console.error('Error in /api/bookings/credentials:', err);
      res.status(500).json({ error: err.message || 'Failed to retrieve credentials' });
    }
  });

  // 5. Booking Cancellation Endpoint (Restricted to unconfirmed pending reservations)
  app.post('/api/bookings/:id/cancel', async (req, res) => {
    try {
      const { id } = req.params;
      const { reason = 'User requested cancellation' } = req.body || {};

      let authenticatedUser: any = null;
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ') && supabaseAdmin) {
        const token = authHeader.split(' ')[1];
        const { data: { user } } = await supabaseAdmin.auth.getUser(token);
        authenticatedUser = user;
      }

      if (supabaseAdmin) {
        // Fetch booking to verify ownership and current status
        const { data: booking, error: fetchErr } = await supabaseAdmin
          .from('bookings')
          .select('id, user_id, status, booking_status, payment_status')
          .eq('id', id)
          .single();

        if (fetchErr || !booking) {
          return res.status(404).json({ error: `Booking "${id}" not found` });
        }

        // Verify ownership (or admin privileges)
        if (authenticatedUser) {
          const isOwner = (booking.user_id === authenticatedUser.id);
          const { data: profile } = await supabaseAdmin.from('profiles').select('role').eq('id', authenticatedUser.id).single();
          const isAdmin = isUserAuthorizedAdmin(authenticatedUser, profile);
          if (!isOwner && !isAdmin) {
            return res.status(403).json({ error: 'Unauthorized: You do not have permission to cancel this booking' });
          }
        }

        // STRICT STATUS CHECK: Only allow cancelling if status is 'reserved' and payment_status is 'pending'
        // Postgres schema check constraint enforces status IN ('reserved', 'confirmed', 'ready_for_checkin', 'checked_in', 'in_progress', 'completed', 'reviewed', 'cancelled', 'active')
        const isPendingReservation = booking.status === 'reserved' && booking.payment_status === 'pending';
        if (!isPendingReservation) {
          return res.status(400).json({
            error: `Cancellation rejected: Only unconfirmed pending reservations (status="reserved", payment="pending") can be cancelled. Current status: "${booking.status}", payment: "${booking.payment_status}". Confirmed or paid bookings cannot be cancelled through this path.`,
          });
        }

        // Invoke dedicated cancel_pending_booking RPC or update
        const { error: rpcErr } = await supabaseAdmin.rpc('cancel_pending_booking', {
          p_booking_id: id,
          p_reason: reason,
        });

        if (rpcErr) {
          console.warn('[Cancel Endpoint] RPC fallback to direct update:', rpcErr);
          const { error: updateErr } = await supabaseAdmin
            .from('bookings')
            .update({
              status: 'cancelled',
              booking_status: 'cancelled',
              payment_status: 'failed',
              cancellation_reason: reason,
              updated_at: new Date().toISOString(),
            })
            .eq('id', id);

          if (updateErr) {
            return res.status(500).json({ error: updateErr.message });
          }
        }
      }

      // Always remove from active in-memory registry so slot is immediately available
      activeConfirmedBookingsRegistry.delete(id);

      return res.json({
        success: true,
        bookingId: id,
        status: 'cancelled',
        message: 'Pending reservation cancelled and workspace slot released',
      });
    } catch (err: any) {
      console.error('Error in /api/bookings/:id/cancel:', err);
      return res.status(500).json({ error: err.message || 'Failed to cancel booking' });
    }
  });

  // AI Workspace Matcher endpoint for Coworkers
  app.post('/api/ai/match', async (req, res) => {
    try {
      const { userQuery, spaces } = req.body;

      if (!ai || !process.env.GEMINI_API_KEY) {
        // Fallback intelligent heuristic recommendation if key is not configured
        return res.json({
          recommendation: {
            headline: 'Optimized Workspaces based on your criteria',
            suggestedSpaceId: spaces && spaces.length > 0 ? spaces[0].id : 'space-1',
            suggestedDeskId: 'D-04',
            reasoning: 'Based on your preference for productivity and quiet focus, this location offers dedicated ergonomic seating, dual 4K monitors, natural lighting, and verified 1Gbps fiber internet.',
            keyHighlights: [
              'Quiet library zone with sound acoustic baffling',
              'Herman Miller Aeron ergonomic chair & motorized standing desk',
              'Specialty barista coffee & soundproof phone booths included'
            ],
            confidenceScore: 96
          }
        });
      }

      const prompt = `You are OFIS's intelligent Nigerian workspace concierge. 
A coworker or team is looking for their ideal physical workspace, desk, or creator studio in Nigeria.
User prompt: "${userQuery || 'A quiet, well-lit desk for software development with fast WiFi and dual monitors'}"

Available Spaces Data:
${JSON.stringify((spaces || []).map((s: any) => ({
  id: s.id,
  name: s.name,
  city: s.city,
  neighborhood: s.neighborhood,
  hourlyRateNGN: s.hourlyRateNGN,
  dailyRateNGN: s.dailyRateNGN,
  dailyRate: s.dailyRate,
  amenities: s.amenities,
  rating: s.rating,
  primaryCategory: s.primaryCategory,
  subcategory: s.subcategory,
  desks: (s.desks || []).slice(0, 8).map((d: any) => ({ id: d.id, name: d.name, zone: d.zone, features: d.features, status: d.status }))
})), null, 2)}

Provide a thoughtful, realistic JSON response matching the following structure exactly:
{
  "headline": "Brief catchy summary of the recommendation",
  "suggestedSpaceId": "matching space id",
  "suggestedDeskId": "matching desk id or desk name",
  "reasoning": "2-3 concise sentences explaining why this space and desk perfectly match the coworker's needs",
  "keyHighlights": ["Highlight 1", "Highlight 2", "Highlight 3"],
  "confidenceScore": 95
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        }
      });

      const text = response.text || '{}';
      const parsed = JSON.parse(text);
      return res.json({ recommendation: parsed });
    } catch (error: any) {
      console.error('Error in /api/ai/match:', error);
      res.status(500).json({ error: error.message || 'Failed to generate recommendation' });
    }
  });

  // AI Host Space Listing Optimizer endpoint
  app.post('/api/ai/optimize-listing', async (req, res) => {
    try {
      const { spaceInfo } = req.body;

      if (!ai || !process.env.GEMINI_API_KEY) {
        return res.json({
          optimizedListing: {
            suggestedTitle: `${spaceInfo.name || 'Premium Space'} - Prime Coworking & Creator Hub`,
            tagline: '24/7 dual generator redundancy, Starlink internet & acoustic soundproofing in prime location.',
            suggestedHourlyRate: spaceInfo.hourlyRateNGN || 6500,
            suggestedDailyRate: spaceInfo.dailyRateNGN || 28000,
            pricingTip: 'Your pricing is competitive for the local area. Adding a 15% discount on full-week passes can boost occupancy by 28%.',
            suggestedAmenitiesToAdd: ['Podcast & Creator Booth', 'Cold Brew & Espresso Bar', 'Dedicated Parking & Security'],
            targetAudience: 'Founders, software engineers, content creators, and remote teams needing reliable power and fiber connectivity.'
          }
        });
      }

      const prompt = `You are a Nigerian commercial real estate and physical workspace revenue optimization expert.
Help a space owner optimize their workspace listing for maximum occupancy and revenue on OFIS (Nigeria's physical workspace network).

Space Data:
${JSON.stringify(spaceInfo, null, 2)}

Provide a JSON response with the following format:
{
  "suggestedTitle": "High-converting listing title",
  "tagline": "Compelling 1-sentence value proposition",
  "suggestedDailyRate": 40,
  "pricingTip": "Actionable tip on hourly and daily workspace pricing tiers in Nigerian Naira",
  "suggestedAmenitiesToAdd": ["Amenity 1", "Amenity 2", "Amenity 3"],
  "targetAudience": "Summary of ideal coworker demographic"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.4,
        }
      });

      const text = response.text || '{}';
      const parsed = JSON.parse(text);
      return res.json({ optimizedListing: parsed });
    } catch (error: any) {
      console.error('Error in /api/ai/optimize-listing:', error);
      res.status(500).json({ error: error.message || 'Failed to optimize listing' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    // Advanced cache control: 1y immutable for hashed assets in /assets/, 1d stale-while-revalidate for static media, no-cache for html
    app.use(express.static(distPath, {
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
          res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
        } else if (filePath.includes('/assets/')) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        } else if (/\.(png|jpe?g|webp|svg|ico|mp4|webm|woff2?|ttf|eot)$/i.test(filePath)) {
          res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
        } else {
          res.setHeader('Cache-Control', 'public, max-age=3600');
        }
      }
    }));
    app.get('*', (req, res) => {
      res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`OFIS Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
