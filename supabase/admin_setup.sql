-- ============================================================================
-- OFIS 2.0 ADMIN DASHBOARD MIGRATION & SECURITY HARDENING
-- ============================================================================
-- Run this script in the Supabase SQL Editor as a database administrator.
-- It establishes the required role column, audit log table, strict RLS,
-- and ensures NO write access is granted to the anon role.
-- ============================================================================

-- 1. Ensure role and updated_at columns on public.profiles
DO $$
BEGIN
  -- Add role column if not already present
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN role TEXT NOT NULL DEFAULT 'user';
  END IF;

  -- Add updated_at column if not already present
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
  END IF;
END $$;

-- Enforce check constraint strictly
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('user', 'host', 'admin'));

-- Ensure index exists on role for fast lookups
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- 2. Prevent client from updating critical profile columns: role, id, email, created_at
-- Only database administrators (or service_role) can change the role column!
-- Regular users can only update their own display name, phone, avatar, bio, company, and saved spaces.
CREATE OR REPLACE FUNCTION public.protect_profile_critical_columns()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if executed by anon or authenticated user (non-service_role)
  IF auth.role() IN ('authenticated', 'anon') THEN
    -- A. Role Protection: Only DB admin can change role
    IF NEW.role IS DISTINCT FROM OLD.role THEN
      RAISE EXCEPTION 'Access Denied: Only a database administrator can modify the profile role column.';
    END IF;

    -- B. ID Protection: Immutable user UUID
    IF NEW.id IS DISTINCT FROM OLD.id THEN
      RAISE EXCEPTION 'Access Denied: User profile ID is immutable.';
    END IF;

    -- C. Email Protection: Must go through official Auth email change procedures
    IF NEW.email IS DISTINCT FROM OLD.email THEN
      RAISE EXCEPTION 'Access Denied: Profile email address cannot be directly changed via client update.';
    END IF;

    -- D. Created_at Protection: Immutable creation timestamp
    IF NEW.created_at IS DISTINCT FROM OLD.created_at THEN
      RAISE EXCEPTION 'Access Denied: Profile creation timestamp is immutable.';
    END IF;
  END IF;

  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trg_prevent_client_role_update ON public.profiles;
DROP TRIGGER IF EXISTS trg_protect_profile_critical_columns ON public.profiles;
CREATE TRIGGER trg_protect_profile_critical_columns
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_profile_critical_columns();

-- Revoke column-level update on role, id, created_at from client roles
REVOKE UPDATE (role, id, created_at) ON public.profiles FROM anon, authenticated, PUBLIC;

-- 3. Create admin_audit_log table
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    admin_email TEXT NOT NULL,
    action TEXT NOT NULL,           -- e.g. 'APPROVE_SPACE', 'DEACTIVATE_SPACE', 'CANCEL_BOOKING', 'UPDATE_ROLE', 'REFUND_PAYMENT'
    table_name TEXT NOT NULL,       -- target table: 'spaces', 'bookings', 'payments', 'profiles'
    record_id TEXT NOT NULL,        -- target row identifier
    old_values JSONB DEFAULT '{}'::jsonb,
    new_values JSONB DEFAULT '{}'::jsonb,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index audit log for responsive pagination and chronological queries
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_created_at ON public.admin_audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_admin_id ON public.admin_audit_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_table_name ON public.admin_audit_log(table_name);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_action ON public.admin_audit_log(action);

-- 4. Enable Row Level Security (RLS) on admin_audit_log
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- 5. Revoke ALL permissions from anon role (Zero write and zero read for anon)
REVOKE ALL ON public.admin_audit_log FROM anon, PUBLIC;

-- 6. Authenticated Admins can read audit logs (if role = 'admin')
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.admin_audit_log;
CREATE POLICY "Admins can view audit logs"
  ON public.admin_audit_log
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Only service_role can insert / manage audit logs directly
GRANT ALL ON public.admin_audit_log TO service_role;

-- 7. Hardened table write permissions: NEVER grant write access to anon role
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON public.profiles FROM anon, PUBLIC;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON public.spaces FROM anon, PUBLIC;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON public.bookings FROM anon, PUBLIC;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON public.payments FROM anon, PUBLIC;

-- Ensure RLS is enabled on public.spaces
ALTER TABLE public.spaces ENABLE ROW LEVEL SECURITY;

-- Public read policy: Only active and verified spaces are accessible to public / anon queries
DROP POLICY IF EXISTS "Public can view active verified spaces" ON public.spaces;
DROP POLICY IF EXISTS "Spaces are viewable by everyone" ON public.spaces;
CREATE POLICY "Public can view active verified spaces" ON public.spaces
  FOR SELECT
  TO anon, authenticated
  USING (
    (is_active = true AND is_verified = true)
    OR (auth.role() = 'authenticated' AND host_id = auth.uid())
    OR public.is_admin()
  );

GRANT SELECT ON public.spaces TO anon, authenticated;

-- Ensure service_role has full management privileges
GRANT ALL ON public.profiles TO service_role;
GRANT ALL ON public.spaces TO service_role;
GRANT ALL ON public.bookings TO service_role;
GRANT ALL ON public.payments TO service_role;
GRANT ALL ON public.admin_audit_log TO service_role;

-- 8. Helper function to check if caller is an authoritative admin (SECURITY DEFINER with public search_path)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 9. (Optional Initial Seed) Assign the owner email as admin if present
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'jonesnathalie820@gmail.com';
