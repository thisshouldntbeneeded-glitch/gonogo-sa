-- ============================================================
-- GoNoGo SA — Supabase Security Fix
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- 1. DROP the overly-permissive admin_users policy
-- This policy allows ANYONE with the anon key to read/write/delete
-- all admin_users rows including password_hash.
DROP POLICY IF EXISTS "Anon access admin_users" ON admin_users;

-- 2. Create a secure RPC function for admin login
-- This performs password verification server-side and only
-- returns non-sensitive fields (never password_hash).
CREATE OR REPLACE FUNCTION admin_login(p_email text, p_hash text)
RETURNS TABLE(id uuid, email text, display_name text, role text)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
    SELECT au.id, au.email, au.display_name, au.role
    FROM admin_users au
    WHERE au.email = lower(trim(p_email))
      AND au.password_hash = p_hash
    LIMIT 1;
END;
$$;

-- 3. Create a restrictive SELECT policy on admin_users
-- Only allow reading non-sensitive columns. Since Supabase RLS
-- operates at the row level (not column level), we restrict
-- SELECT to only return rows for authenticated service_role calls.
-- The anon key can no longer SELECT from admin_users at all.
-- Admin login goes through the admin_login() RPC function instead.
CREATE POLICY "Restrict admin_users read"
  ON admin_users
  FOR SELECT
  USING (auth.role() = 'service_role');

-- 4. Restrict INSERT on admin_users to service_role only
CREATE POLICY "Restrict admin_users insert"
  ON admin_users
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- 5. Restrict UPDATE on admin_users to service_role only
CREATE POLICY "Restrict admin_users update"
  ON admin_users
  FOR UPDATE
  USING (auth.role() = 'service_role');

-- 6. Restrict DELETE on admin_users to service_role only
CREATE POLICY "Restrict admin_users delete"
  ON admin_users
  FOR DELETE
  USING (auth.role() = 'service_role');

-- 7. Create a security_log table to track admin actions
CREATE TABLE IF NOT EXISTS security_log (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type text NOT NULL,
  actor_email text,
  details jsonb DEFAULT '{}',
  ip_address text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on security_log
ALTER TABLE security_log ENABLE ROW LEVEL SECURITY;

-- Allow anon INSERT to security_log (for logging from the client)
CREATE POLICY "Allow insert security_log"
  ON security_log
  FOR INSERT
  WITH CHECK (true);

-- Only service_role can read security_log
CREATE POLICY "Restrict read security_log"
  ON security_log
  FOR SELECT
  USING (auth.role() = 'service_role');

-- ============================================================
-- VERIFICATION: After running this script, test the following:
--
-- 1. Login should work via the admin_login RPC:
--    POST /rest/v1/rpc/admin_login
--    Body: { "p_email": "admin@gonogo.co.za", "p_hash": "<sha256>" }
--
-- 2. Direct read of admin_users should FAIL for anon:
--    GET /rest/v1/admin_users?select=email,password_hash
--    Should return empty array or 403
--
-- 3. Public brands/categories should still work normally
-- ============================================================
