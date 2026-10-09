-- ============================================================================
-- OFIS 2.0 HARDENED PRODUCTION DATABASE SCHEMA (SUPABASE POSTGRESQL)
-- ============================================================================

-- Enable required cryptographic & UUID extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. PROFILES TABLE (wallet_balance_ngn removed; isolated in public.wallets)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    avatar TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'host', 'admin')),
    company TEXT,
    bio TEXT,
    saved_space_ids TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. WALLETS TABLE (Separated & Protected: Writable ONLY by service_role)
CREATE TABLE IF NOT EXISTS public.wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    balance_ngn NUMERIC(12, 2) NOT NULL DEFAULT 25000.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. SPACES TABLE
CREATE TABLE IF NOT EXISTS public.spaces (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    tagline TEXT,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('coworking', 'private_office', 'meeting', 'podcast', 'photography', 'event')),
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    neighborhood TEXT NOT NULL,
    address TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    price_per_hour NUMERIC(10, 2) NOT NULL,
    price_per_day NUMERIC(10, 2) NOT NULL,
    capacity INT NOT NULL DEFAULT 1,
    has_backup_power BOOLEAN NOT NULL DEFAULT TRUE,
    power_type TEXT NOT NULL DEFAULT 'Solar + Inverter',
    power_uptime_guarantee_percent INT NOT NULL DEFAULT 99,
    internet_speed_mbps INT NOT NULL DEFAULT 200,
    internet_isp TEXT NOT NULL DEFAULT 'Starlink + Fiber',
    noise_level TEXT NOT NULL DEFAULT 'Moderate / Focus Buzz',
    images TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    featured_image TEXT NOT NULL,
    amenities TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    rating NUMERIC(3, 2) NOT NULL DEFAULT 4.80,
    reviews_count INT NOT NULL DEFAULT 0,
    host_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    host_name TEXT NOT NULL,
    host_company TEXT,
    host_avatar TEXT,
    host_is_verified BOOLEAN DEFAULT TRUE,
    host_phone TEXT,
    host_email TEXT,
    host_rating NUMERIC(3, 2) DEFAULT 4.90,
    open_time TEXT NOT NULL DEFAULT '07:00',
    close_time TEXT NOT NULL DEFAULT '21:00',
    days TEXT NOT NULL DEFAULT 'Mon - Sat',
    rules TEXT[] DEFAULT ARRAY[]::TEXT[],
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    instant_booking BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT TRUE,
    is_superhost BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    wifi_ssid TEXT DEFAULT 'OFIS_Guest_HighSpeed',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. DESKS / SEATS TABLE
CREATE TABLE IF NOT EXISTS public.desks (
    id TEXT PRIMARY KEY,
    space_id TEXT NOT NULL REFERENCES public.spaces(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'hot_desk',
    status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'occupied', 'maintenance')),
    price_per_hour NUMERIC(10, 2) NOT NULL,
    x INT NOT NULL DEFAULT 50,
    y INT NOT NULL DEFAULT 50,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. BOOKINGS TABLE (Includes explicit pricing_period column)
CREATE TABLE IF NOT EXISTS public.bookings (
    id TEXT PRIMARY KEY,
    space_id TEXT NOT NULL REFERENCES public.spaces(id) ON DELETE CASCADE,
    space_title TEXT NOT NULL,
    space_image TEXT,
    space_address TEXT,
    space_city TEXT,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    user_name TEXT NOT NULL,
    user_email TEXT NOT NULL,
    user_phone TEXT,
    date TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT,
    duration_hours INT NOT NULL DEFAULT 2,
    pricing_period TEXT NOT NULL DEFAULT 'hour' CHECK (pricing_period IN ('hour', 'day', 'month', 'session')),
    selected_seat_id TEXT,
    selected_seat_label TEXT,
    guest_count INT NOT NULL DEFAULT 1,
    total_amount NUMERIC(12, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'NGN',
    status TEXT NOT NULL DEFAULT 'reserved' CHECK (status IN ('reserved', 'confirmed', 'ready_for_checkin', 'checked_in', 'in_progress', 'completed', 'reviewed', 'cancelled', 'active')),
    booking_status TEXT NOT NULL DEFAULT 'reserved',
    checked_in BOOLEAN DEFAULT FALSE,
    checked_in_at TIMESTAMPTZ,
    checked_out BOOLEAN DEFAULT FALSE,
    checked_out_at TIMESTAMPTZ,
    qr_code_value TEXT NOT NULL,
    digital_pass_code TEXT NOT NULL,
    payment_method TEXT NOT NULL DEFAULT 'sznd',
    payment_reference TEXT,
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    has_reminder BOOLEAN DEFAULT TRUE,
    wifi_ssid TEXT,
    wifi_password TEXT,
    access_door_code TEXT,
    is_reviewed BOOLEAN DEFAULT FALSE,
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
    id TEXT PRIMARY KEY,
    space_id TEXT NOT NULL REFERENCES public.spaces(id) ON DELETE CASCADE,
    booking_id TEXT REFERENCES public.bookings(id) ON DELETE SET NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    user_name TEXT NOT NULL,
    user_avatar TEXT,
    user_role TEXT,
    rating NUMERIC(2, 1) NOT NULL,
    host_rating NUMERIC(2, 1),
    power_rating NUMERIC(2, 1) NOT NULL DEFAULT 5.0,
    internet_rating NUMERIC(2, 1) NOT NULL DEFAULT 5.0,
    noise_rating NUMERIC(2, 1) NOT NULL DEFAULT 5.0,
    cleanliness_rating NUMERIC(2, 1),
    value_rating NUMERIC(2, 1),
    comment TEXT NOT NULL,
    visit_date TEXT,
    helpful_count INT NOT NULL DEFAULT 0,
    verified_amenities TEXT[] DEFAULT ARRAY[]::TEXT[],
    photos TEXT[] DEFAULT ARRAY[]::TEXT[],
    verified_booking BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_user_space_review UNIQUE (user_id, space_id)
);

-- 7. FAVORITES TABLE
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    space_id TEXT NOT NULL REFERENCES public.spaces(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, space_id)
);

-- 8. SPACE ACCESS CREDENTIALS TABLE (Authoritative Space Security Data)
CREATE TABLE IF NOT EXISTS public.space_access_credentials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    space_id TEXT UNIQUE NOT NULL REFERENCES public.spaces(id) ON DELETE CASCADE,
    wifi_ssid TEXT NOT NULL,
    wifi_pass TEXT NOT NULL,
    door_pin TEXT NOT NULL,
    access_instructions TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'system',
    read BOOLEAN NOT NULL DEFAULT FALSE,
    booking_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id TEXT REFERENCES public.bookings(id) ON DELETE SET NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    amount NUMERIC(12, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'NGN',
    provider TEXT NOT NULL DEFAULT 'sznd',
    reference TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'success',
    metadata JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. LEADS TABLE (Pre-launch & Growth Lead Capture)
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT,
    country TEXT,
    interest TEXT NOT NULL,
    message TEXT NOT NULL,
    source TEXT NOT NULL DEFAULT 'prelaunch',
    referrer TEXT,
    landing_path TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR INTEGRITY, CONCURRENCY & LOOKUPS
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_bookings_availability ON public.bookings (space_id, date, status, payment_status);
CREATE INDEX IF NOT EXISTS idx_bookings_seat_time ON public.bookings (space_id, selected_seat_id, date, start_time);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_reference ON public.bookings (payment_reference);
CREATE INDEX IF NOT EXISTS idx_payments_reference ON public.payments (reference);
CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON public.payments (booking_id);
CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON public.wallets (user_id);

-- ============================================================================
-- HELPER FUNCTIONS & TRIGGERS (SECURITY HARDENING)
-- ============================================================================

-- Function to handle new user registration: creates profile AND separate wallet row
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- 1. Insert profile (without wallet balance)
    INSERT INTO public.profiles (id, name, email, phone, avatar, role, company)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
        new.email,
        COALESCE(new.raw_user_meta_data->>'phone', '+234 800 000 0000'),
        COALESCE(new.raw_user_meta_data->>'avatar', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'),
        'user',
        COALESCE(new.raw_user_meta_data->>'company', 'Independent Professional')
    )
    ON CONFLICT (id) DO UPDATE
    SET
        name = EXCLUDED.name,
        avatar = EXCLUDED.avatar,
        phone = EXCLUDED.phone;

    -- 2. Insert isolated wallet row writable ONLY by service_role
    INSERT INTO public.wallets (user_id, balance_ngn)
    VALUES (new.id, 25000.00)
    ON CONFLICT (user_id) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Helper function: Verify authenticated user is a verified administrator
-- Strictly requires:
-- 1. role = 'admin' on public.profiles
-- 2. email_confirmed_at IS NOT NULL on auth.users
-- 3. email strictly matches verified owner: jonesnathalie820@gmail.com
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
DECLARE
    v_role TEXT;
    v_email TEXT;
    v_confirmed TIMESTAMPTZ;
BEGIN
    SELECT p.role, u.email, u.email_confirmed_at
    INTO v_role, v_email, v_confirmed
    FROM public.profiles p
    JOIN auth.users u ON u.id = p.id
    WHERE p.id = auth.uid();

    -- Check 1: User profile must explicitly have role = 'admin'
    IF v_role <> 'admin' THEN
        RETURN FALSE;
    END IF;

    -- Check 2: Email must be verified
    IF v_confirmed IS NULL THEN
        RETURN FALSE;
    END IF;

    -- Check 3: Email must strictly match the single authorized owner account
    IF LOWER(v_email) = 'jonesnathalie820@gmail.com' THEN
        RETURN TRUE;
    END IF;

    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

-- Trigger function: Strictly prevent clients from changing their own profile role
CREATE OR REPLACE FUNCTION public.protect_profile_role()
RETURNS TRIGGER AS $$
BEGIN
    IF auth.jwt() ->> 'role' = 'service_role' THEN
        RETURN NEW;
    END IF;

    IF NEW.role IS DISTINCT FROM OLD.role THEN
        RAISE EXCEPTION 'Security violation: Users are not permitted to change their own role. Attempted change from % to %.', OLD.role, NEW.role;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trg_protect_profile_role ON public.profiles;
CREATE TRIGGER trg_protect_profile_role
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE PROCEDURE public.protect_profile_role();

-- Trigger function: Strictly protect booking critical columns from direct client tampering
CREATE OR REPLACE FUNCTION public.protect_booking_critical_columns()
RETURNS TRIGGER AS $$
BEGIN
    IF auth.jwt() ->> 'role' = 'service_role' THEN
        RETURN NEW;
    END IF;

    -- Strict Exception: Allow booking owner to cancel an unconfirmed reservation
    -- Permitted ONLY when transitioning from status='reserved' & payment_status='pending' to status='cancelled'
    -- while keeping all core reservation parameters unchanged
    IF OLD.status = 'reserved' 
       AND OLD.payment_status = 'pending' 
       AND NEW.status = 'cancelled' 
       AND NEW.booking_status = 'cancelled'
       AND NEW.payment_status IN ('pending', 'failed')
       AND NEW.total_amount = OLD.total_amount
       AND NEW.user_id = OLD.user_id
       AND NEW.space_id = OLD.space_id
       AND NEW.date = OLD.date
       AND NEW.start_time = OLD.start_time
       AND NEW.duration_hours = OLD.duration_hours THEN
        RETURN NEW;
    END IF;

    -- 1. Lifecycle and Payment Statuses
    IF NEW.status IS DISTINCT FROM OLD.status THEN
        RAISE EXCEPTION 'Clients are not permitted to directly modify booking status. Payment confirmation must execute via confirm_booking_payment RPC.';
    END IF;

    IF NEW.booking_status IS DISTINCT FROM OLD.booking_status THEN
        RAISE EXCEPTION 'Clients are not permitted to directly modify booking_status. Payment confirmation must execute via confirm_booking_payment RPC.';
    END IF;

    IF NEW.payment_status IS DISTINCT FROM OLD.payment_status THEN
        RAISE EXCEPTION 'Clients are not permitted to directly modify payment_status. Payment confirmation must execute via confirm_booking_payment RPC.';
    END IF;

    IF NEW.payment_reference IS DISTINCT FROM OLD.payment_reference THEN
        RAISE EXCEPTION 'Clients are not permitted to directly modify payment_reference. It is assigned authoritatively by the server.';
    END IF;

    -- 2. Financial & Ownership Integrity
    IF NEW.total_amount IS DISTINCT FROM OLD.total_amount THEN
        RAISE EXCEPTION 'Clients are not permitted to directly modify booking total_amount.';
    END IF;

    IF NEW.user_id IS DISTINCT FROM OLD.user_id THEN
        RAISE EXCEPTION 'Clients are not permitted to transfer booking ownership.';
    END IF;

    -- 3. Workspace, Schedule & Reservation Parameters (Settable ONLY at insert time)
    IF NEW.space_id IS DISTINCT FROM OLD.space_id THEN
        RAISE EXCEPTION 'Clients are not permitted to modify booking space_id.';
    END IF;

    IF NEW.date IS DISTINCT FROM OLD.date THEN
        RAISE EXCEPTION 'Clients are not permitted to modify booking date.';
    END IF;

    IF NEW.start_time IS DISTINCT FROM OLD.start_time THEN
        RAISE EXCEPTION 'Clients are not permitted to modify booking start_time.';
    END IF;

    IF NEW.end_time IS DISTINCT FROM OLD.end_time THEN
        RAISE EXCEPTION 'Clients are not permitted to modify booking end_time.';
    END IF;

    IF NEW.duration_hours IS DISTINCT FROM OLD.duration_hours THEN
        RAISE EXCEPTION 'Clients are not permitted to modify booking duration_hours.';
    END IF;

    IF NEW.guest_count IS DISTINCT FROM OLD.guest_count THEN
        RAISE EXCEPTION 'Clients are not permitted to modify booking guest_count.';
    END IF;

    IF NEW.selected_seat_id IS DISTINCT FROM OLD.selected_seat_id THEN
        RAISE EXCEPTION 'Clients are not permitted to modify booking selected_seat_id.';
    END IF;

    IF NEW.pricing_period IS DISTINCT FROM OLD.pricing_period THEN
        RAISE EXCEPTION 'Clients are not permitted to modify booking pricing_period.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_protect_booking_critical_columns ON public.bookings;
CREATE TRIGGER trg_protect_booking_critical_columns
    BEFORE UPDATE ON public.bookings
    FOR EACH ROW EXECUTE PROCEDURE public.protect_booking_critical_columns();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.desks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.space_access_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- 1. Profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id OR auth.jwt() ->> 'role' = 'service_role')
    WITH CHECK (auth.uid() = id OR auth.jwt() ->> 'role' = 'service_role');

-- 2. Wallets (Readable by owner, admin, or service_role; writable ONLY by service_role)
DROP POLICY IF EXISTS "Users and admin can view own wallet" ON public.wallets;
CREATE POLICY "Users and admin can view own wallet" ON public.wallets
    FOR SELECT USING (
        auth.uid() = user_id 
        OR auth.jwt() ->> 'role' = 'service_role' 
        OR public.is_admin()
    );

DROP POLICY IF EXISTS "Only service role can modify wallets" ON public.wallets;
CREATE POLICY "Only service role can modify wallets" ON public.wallets
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role')
    WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- 3. Spaces
DROP POLICY IF EXISTS "Spaces are viewable by everyone" ON public.spaces;
DROP POLICY IF EXISTS "Public can view active verified spaces" ON public.spaces;
CREATE POLICY "Public can view active verified spaces" ON public.spaces
    FOR SELECT USING (
        (is_active = true AND is_verified = true)
        OR (auth.role() = 'authenticated' AND host_id = auth.uid())
        OR public.is_admin()
        OR auth.jwt() ->> 'role' = 'service_role'
    );

DROP POLICY IF EXISTS "Hosts can insert spaces" ON public.spaces;
CREATE POLICY "Hosts can insert spaces" ON public.spaces
    FOR INSERT WITH CHECK (
        (auth.role() = 'authenticated' AND host_id = auth.uid())
        OR auth.jwt() ->> 'role' = 'service_role'
        OR public.is_admin()
    );

DROP POLICY IF EXISTS "Hosts can update own spaces" ON public.spaces;
CREATE POLICY "Hosts can update own spaces" ON public.spaces
    FOR UPDATE USING (
        auth.uid() = host_id 
        OR auth.jwt() ->> 'role' = 'service_role' 
        OR public.is_admin()
    );

-- 4. Desks (Public read; Insert/Update/Delete restricted to host owning parent space)
DROP POLICY IF EXISTS "Desks are viewable by everyone" ON public.desks;
CREATE POLICY "Desks are viewable by everyone" ON public.desks
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Hosts can insert desks for own spaces" ON public.desks;
CREATE POLICY "Hosts can insert desks for own spaces" ON public.desks
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.spaces s
            WHERE s.id = space_id
              AND (
                  (auth.role() = 'authenticated' AND s.host_id = auth.uid())
                  OR auth.jwt() ->> 'role' = 'service_role'
                  OR public.is_admin()
              )
        )
    );

DROP POLICY IF EXISTS "Hosts can update desks for own spaces" ON public.desks;
CREATE POLICY "Hosts can update desks for own spaces" ON public.desks
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.spaces s
            WHERE s.id = space_id
              AND (
                  (auth.role() = 'authenticated' AND s.host_id = auth.uid())
                  OR auth.jwt() ->> 'role' = 'service_role'
                  OR public.is_admin()
              )
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.spaces s
            WHERE s.id = space_id
              AND (
                  (auth.role() = 'authenticated' AND s.host_id = auth.uid())
                  OR auth.jwt() ->> 'role' = 'service_role'
                  OR public.is_admin()
              )
        )
    );

DROP POLICY IF EXISTS "Hosts can delete desks for own spaces" ON public.desks;
CREATE POLICY "Hosts can delete desks for own spaces" ON public.desks
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.spaces s
            WHERE s.id = space_id
              AND (
                  (auth.role() = 'authenticated' AND s.host_id = auth.uid())
                  OR auth.jwt() ->> 'role' = 'service_role'
                  OR public.is_admin()
              )
        )
    );

-- 5. Bookings (auth.role() = 'anon' REMOVED from SELECT)
DROP POLICY IF EXISTS "Anyone can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can update own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can insert own pending booking" ON public.bookings;

CREATE POLICY "Users can view own bookings" ON public.bookings
    FOR SELECT USING (
        auth.uid() = user_id 
        OR auth.jwt() ->> 'role' = 'service_role' 
        OR public.is_admin()
    );

CREATE POLICY "Users can insert own pending booking" ON public.bookings
    FOR INSERT WITH CHECK (
        (auth.uid() = user_id OR auth.jwt() ->> 'role' = 'service_role')
        AND status = 'reserved'
        AND booking_status = 'reserved'
        AND payment_status = 'pending'
    );

CREATE POLICY "Users can update own bookings" ON public.bookings
    FOR UPDATE USING (
        auth.uid() = user_id OR auth.jwt() ->> 'role' = 'service_role'
    )
    WITH CHECK (
        auth.uid() = user_id OR auth.jwt() ->> 'role' = 'service_role'
    );

-- 6. Reviews (Public read; Insert restricted to users with completed booking, max 1 review per space)
DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON public.reviews;
CREATE POLICY "Reviews are viewable by everyone" ON public.reviews
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users with completed bookings can insert review" ON public.reviews;

CREATE POLICY "Users with completed bookings can insert review" ON public.reviews
    FOR INSERT WITH CHECK (
        (auth.uid() = user_id OR auth.jwt() ->> 'role' = 'service_role')
        AND EXISTS (
            SELECT 1 FROM public.bookings b
            WHERE b.space_id = space_id
              AND b.user_id = auth.uid()
              AND b.status = 'completed'
        )
        AND NOT EXISTS (
            SELECT 1 FROM public.reviews r
            WHERE r.space_id = space_id
              AND r.user_id = auth.uid()
        )
    );

-- 7. Favorites
DROP POLICY IF EXISTS "Users can manage own favorites" ON public.favorites;
CREATE POLICY "Users can manage own favorites" ON public.favorites
    FOR ALL USING (auth.uid() = user_id);

-- 8. Space Access Credentials
DROP POLICY IF EXISTS "Admin and service role can access credentials" ON public.space_access_credentials;
CREATE POLICY "Admin and service role can access credentials" ON public.space_access_credentials
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role' OR public.is_admin());

-- 9. Notifications
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
CREATE POLICY "Users can view own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Insert notifications" ON public.notifications;
CREATE POLICY "Insert notifications" ON public.notifications
    FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'service_role' OR public.is_admin());

-- 10. Payments
DROP POLICY IF EXISTS "Users and admins can view payments" ON public.payments;
CREATE POLICY "Users and admins can view payments" ON public.payments
    FOR SELECT USING (auth.uid() = user_id OR public.is_admin() OR auth.jwt() ->> 'role' = 'service_role');

DROP POLICY IF EXISTS "Service role can insert payments" ON public.payments;
CREATE POLICY "Service role can insert payments" ON public.payments
    FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- 11. Leads
DROP POLICY IF EXISTS "Anyone can insert leads" ON public.leads;
CREATE POLICY "Anyone can insert leads" ON public.leads
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view leads" ON public.leads;
CREATE POLICY "Admins can view leads" ON public.leads
    FOR SELECT USING (
        public.is_admin() OR auth.jwt() ->> 'role' = 'service_role'
    );

-- ============================================================================
-- HARDENED TRANSACTIONAL CONFIRM_BOOKING_PAYMENT RPC
-- ============================================================================

CREATE OR REPLACE FUNCTION public.confirm_booking_payment(
    p_booking_id TEXT,
    p_transaction_reference TEXT,
    p_provider TEXT DEFAULT 'sznd',
    p_amount NUMERIC DEFAULT 0,
    p_metadata JSONB DEFAULT '{}'::JSONB,
    p_authoritative_rate NUMERIC DEFAULT NULL,
    p_duration_units NUMERIC DEFAULT NULL,
    p_period TEXT DEFAULT 'hour'
)
RETURNS JSONB AS $$
DECLARE
    v_booking RECORD;
    v_space RECORD;
    v_conflict_count INT := 0;
    v_conflicting_id TEXT := NULL;
    v_calc_end_time TEXT;
    v_existing_booking_id TEXT := NULL;
    v_rate NUMERIC;
    v_duration NUMERIC;
    v_guest_count INT;
    v_calculated_amount NUMERIC;
    v_is_daily BOOLEAN;
BEGIN
    -- 1. Metadata Binding Security Check: Require p_metadata->>'booking_id' == p_booking_id
    IF p_metadata IS NULL 
       OR p_metadata->>'booking_id' IS NULL 
       OR (p_metadata->>'booking_id') <> p_booking_id THEN
        RAISE EXCEPTION 'Security error: Payment metadata binding failure. Metadata booking_id "%" does not match target booking "%"',
            COALESCE(p_metadata->>'booking_id', 'MISSING'), p_booking_id;
    END IF;

    -- 2. Fetch authoritative booking record
    SELECT * INTO v_booking FROM public.bookings WHERE id = p_booking_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Booking "%" not found', p_booking_id;
    END IF;

    -- 3. Idempotency Check: If already confirmed with THIS EXACT reference, return success immediately
    IF (v_booking.status = 'confirmed' OR v_booking.booking_status = 'confirmed') 
       AND v_booking.payment_status = 'paid' 
       AND v_booking.payment_reference = p_transaction_reference THEN
        RETURN jsonb_build_object(
            'success', true,
            'conflict', false,
            'booking_id', p_booking_id,
            'reference', p_transaction_reference,
            'status', 'confirmed',
            'already_confirmed', true
        );
    END IF;

    -- 4. Payment Reference Pre-Binding & Reuse Protection
    -- Check A: The booking being confirmed MUST already have this exact reference assigned server-side at initialization
    IF v_booking.payment_reference IS NULL OR v_booking.payment_reference <> p_transaction_reference THEN
        RAISE EXCEPTION 'Security error: Payment reference "%" does not match the reference assigned to booking "%" ("%")',
            p_transaction_reference, p_booking_id, COALESCE(v_booking.payment_reference, 'NULL');
    END IF;

    -- Check B: Reject if this reference is assigned to ANY OTHER booking (pending, reserved, or confirmed)
    SELECT id INTO v_existing_booking_id
    FROM public.bookings
    WHERE payment_reference = p_transaction_reference
      AND id <> p_booking_id
    LIMIT 1;

    IF v_existing_booking_id IS NOT NULL THEN
        RAISE EXCEPTION 'Security error: Payment reference "%" is already assigned to a different booking ("%")',
            p_transaction_reference, v_existing_booking_id;
    END IF;

    -- Check C: Reject if this reference was already logged in payments table for a different booking
    SELECT booking_id INTO v_existing_booking_id
    FROM public.payments
    WHERE reference = p_transaction_reference
      AND booking_id IS NOT NULL
      AND booking_id <> p_booking_id
    LIMIT 1;

    IF v_existing_booking_id IS NOT NULL THEN
        RAISE EXCEPTION 'Security error: Payment reference "%" has already been used to confirm a different booking ("%")',
            p_transaction_reference, v_existing_booking_id;
    END IF;

    -- 5. Transaction-level advisory lock on resource/space/date
    PERFORM pg_advisory_xact_lock(hashtext(v_booking.space_id || '_' || v_booking.date));

    -- 6. Fetch authoritative space details
    SELECT * INTO v_space FROM public.spaces WHERE id = v_booking.space_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Associated space "%" not found', v_booking.space_id;
    END IF;

    -- 7. Distinguish Hourly vs. Daily Booking & Authoritative Rate Application
    -- Checks explicit parameter, metadata, booking pricing_period, or space configuration
    v_is_daily := (
        LOWER(COALESCE(p_period, p_metadata->>'period', p_metadata->>'pricing_period', v_booking.pricing_period, 'hour')) = 'day'
        OR (v_space.category = 'private_office' AND (v_space.price_per_hour IS NULL OR v_space.price_per_hour <= 0))
    );

    IF v_is_daily THEN
        v_rate := COALESCE(p_authoritative_rate, v_space.price_per_day, v_space.price_per_hour * 8);
        v_duration := COALESCE(p_duration_units, CEIL(v_booking.duration_hours / 24.0), 1);
        IF v_duration < 1 THEN v_duration := 1; END IF;
    ELSE
        v_rate := COALESCE(p_authoritative_rate, v_space.price_per_hour);
        v_duration := COALESCE(p_duration_units, v_booking.duration_hours, 1);
        IF v_duration < 1 THEN v_duration := 1; END IF;
    END IF;

    v_guest_count := GREATEST(COALESCE(v_booking.guest_count, 1), 1);

    -- Coworking desks multiply by guest count; private offices / rooms charge flat space rate
    IF v_space.category = 'coworking' THEN
        v_calculated_amount := ROUND((v_rate * v_duration * v_guest_count)::numeric, 2);
    ELSE
        v_calculated_amount := ROUND((v_rate * v_duration)::numeric, 2);
    END IF;

    -- Reject if the SZND-verified amount does not match the recalculated amount
    IF p_amount IS NOT NULL AND p_amount > 0 AND ABS(p_amount - v_calculated_amount) > 1 THEN
        RAISE EXCEPTION 'Security error: Amount verification mismatch. Verified amount (% NGN) does not match authoritative recalculated total (% NGN) for space "%" (period: %, rate: %, duration: %, guests: %)',
            p_amount, v_calculated_amount, v_space.title, (CASE WHEN v_is_daily THEN 'day' ELSE 'hour' END), v_rate, v_duration, v_guest_count;
    END IF;

    -- 8. Calculate effective end time for time-window overlap comparison
    v_calc_end_time := COALESCE(
        v_booking.end_time,
        to_char(to_timestamp(v_booking.start_time, 'HH24:MI') + (v_booking.duration_hours || ' hours')::interval, 'HH24:MI')
    );

    -- 9. Transaction-Safe Conflict / Overlap Detection
    IF v_booking.selected_seat_id IS NOT NULL AND v_booking.selected_seat_id <> '' THEN
        SELECT id INTO v_conflicting_id
        FROM public.bookings
        WHERE space_id = v_booking.space_id
          AND date = v_booking.date
          AND id <> p_booking_id
          AND selected_seat_id = v_booking.selected_seat_id
          AND status IN ('confirmed', 'ready_for_checkin', 'checked_in', 'in_progress', 'active')
          AND payment_status = 'paid'
          AND (
            v_booking.start_time < COALESCE(end_time, to_char(to_timestamp(start_time, 'HH24:MI') + (duration_hours || ' hours')::interval, 'HH24:MI'))
            AND
            start_time < v_calc_end_time
          )
        LIMIT 1;
    ELSE
        IF v_space.category IN ('private_office', 'meeting', 'podcast', 'photography', 'event') OR COALESCE(v_space.capacity, 1) = 1 THEN
            SELECT id INTO v_conflicting_id
            FROM public.bookings
            WHERE space_id = v_booking.space_id
              AND date = v_booking.date
              AND id <> p_booking_id
              AND status IN ('confirmed', 'ready_for_checkin', 'checked_in', 'in_progress', 'active')
              AND payment_status = 'paid'
              AND (
                v_booking.start_time < COALESCE(end_time, to_char(to_timestamp(start_time, 'HH24:MI') + (duration_hours || ' hours')::interval, 'HH24:MI'))
                AND
                start_time < v_calc_end_time
              )
            LIMIT 1;
        ELSE
            SELECT COALESCE(SUM(guest_count), 0) INTO v_conflict_count
            FROM public.bookings
            WHERE space_id = v_booking.space_id
              AND date = v_booking.date
              AND id <> p_booking_id
              AND status IN ('confirmed', 'ready_for_checkin', 'checked_in', 'in_progress', 'active')
              AND payment_status = 'paid'
              AND (
                v_booking.start_time < COALESCE(end_time, to_char(to_timestamp(start_time, 'HH24:MI') + (duration_hours || ' hours')::interval, 'HH24:MI'))
                AND
                start_time < v_calc_end_time
              );

            IF (v_conflict_count + v_booking.guest_count) > COALESCE(v_space.capacity, 50) THEN
                v_conflicting_id := 'CAPACITY_EXCEEDED';
            END IF;
        END IF;
    END IF;

    -- 10. If conflicting reservation exists, prevent confirmation and mark conflict
    IF v_conflicting_id IS NOT NULL THEN
        UPDATE public.bookings
        SET
            status = 'cancelled',
            booking_status = 'cancelled',
            payment_status = 'failed',
            cancellation_reason = 'Concurrency conflict: slot already confirmed by another booking',
            updated_at = NOW()
        WHERE id = p_booking_id;

        RETURN jsonb_build_object(
            'success', false,
            'conflict', true,
            'error', 'The selected workspace or seat was already confirmed by another member for this time slot.',
            'booking_id', p_booking_id,
            'conflicting_id', v_conflicting_id,
            'status', 'conflict'
        );
    END IF;

    -- 11. No conflict: Confirm booking and log payment
    UPDATE public.bookings
    SET
        status = 'confirmed',
        booking_status = 'confirmed',
        payment_status = 'paid',
        payment_reference = p_transaction_reference,
        payment_method = p_provider,
        total_amount = v_calculated_amount,
        updated_at = NOW()
    WHERE id = p_booking_id;

    INSERT INTO public.payments (booking_id, user_id, amount, provider, reference, status, metadata)
    VALUES (p_booking_id, v_booking.user_id, v_calculated_amount, p_provider, p_transaction_reference, 'success', p_metadata);

    RETURN jsonb_build_object(
        'success', true,
        'conflict', false,
        'booking_id', p_booking_id,
        'reference', p_transaction_reference,
        'amount', v_calculated_amount,
        'status', 'confirmed'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- DEDICATED RPC: CANCEL UNCONFIRMED PENDING RESERVATION
-- Allows a user to cancel their own booking ONLY while status = 'reserved'
-- and payment_status = 'pending'. Rejects cancellation of paid/confirmed bookings.
-- ============================================================================

CREATE OR REPLACE FUNCTION public.cancel_pending_booking(
    p_booking_id TEXT,
    p_reason TEXT DEFAULT 'Cancelled by user before payment'
)
RETURNS JSONB AS $$
DECLARE
    v_booking RECORD;
BEGIN
    SELECT * INTO v_booking FROM public.bookings WHERE id = p_booking_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Booking "%" not found', p_booking_id;
    END IF;

    -- Strict check: User must own the booking OR be service_role OR be verified admin
    IF v_booking.user_id <> auth.uid() 
       AND auth.jwt() ->> 'role' <> 'service_role' 
       AND NOT public.is_admin() THEN
        RAISE EXCEPTION 'Unauthorized: You do not have permission to cancel booking "%"', p_booking_id;
    END IF;

    -- Strict check: Status MUST be 'reserved' and payment_status MUST be 'pending'
    IF v_booking.status <> 'reserved' OR v_booking.payment_status <> 'pending' THEN
        RAISE EXCEPTION 'Cancellation rejected: You can only cancel unconfirmed pending reservations. Current status: "%", payment_status: "%". Confirmed or paid bookings cannot be cancelled via this path.',
            v_booking.status, v_booking.payment_status;
    END IF;

    UPDATE public.bookings
    SET
        status = 'cancelled',
        booking_status = 'cancelled',
        payment_status = 'failed',
        cancellation_reason = COALESCE(p_reason, 'Cancelled by user before payment'),
        updated_at = NOW()
    WHERE id = p_booking_id;

    RETURN jsonb_build_object(
        'success', true,
        'booking_id', p_booking_id,
        'status', 'cancelled'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- PRIVILEGES & PERMISSIONS (ENABLE POSTGREST ACCESS FOR RLS POLICIES)
-- ============================================================================

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;

