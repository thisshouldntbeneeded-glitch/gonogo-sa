-- ============================================================
-- GoNoGo — Admin User Management RPCs + Brand User Management
-- Run in Supabase SQL Editor for project: fnpxaneextqidbessnej
-- ============================================================

-- 1. List admin users (hides password_hash)
CREATE OR REPLACE FUNCTION admin_list_users()
RETURNS TABLE(id uuid, email text, display_name text, role text, created_at timestamptz)
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY SELECT au.id, au.email, au.display_name, au.role, au.created_at
    FROM admin_users au ORDER BY au.created_at ASC;
END;
$$;

-- 2. Add admin user
CREATE OR REPLACE FUNCTION admin_add_user(p_email text, p_hash text, p_display_name text, p_role text)
RETURNS TABLE(id uuid, email text, display_name text, role text, created_at timestamptz)
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY INSERT INTO admin_users (email, password_hash, display_name, role)
    VALUES (lower(trim(p_email)), p_hash, COALESCE(p_display_name, ''), COALESCE(p_role, 'admin'))
    RETURNING admin_users.id, admin_users.email, admin_users.display_name, admin_users.role, admin_users.created_at;
END;
$$;

-- 3. Remove admin user
CREATE OR REPLACE FUNCTION admin_remove_user(p_user_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  DELETE FROM admin_users WHERE id = p_user_id;
END;
$$;

-- 4. Change admin password
CREATE OR REPLACE FUNCTION admin_change_password(p_user_id uuid, p_old_hash text, p_new_hash text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE found_id uuid;
BEGIN
  SELECT au.id INTO found_id FROM admin_users au WHERE au.id = p_user_id AND au.password_hash = p_old_hash;
  IF found_id IS NULL THEN RETURN false; END IF;
  UPDATE admin_users SET password_hash = p_new_hash WHERE id = p_user_id;
  RETURN true;
END;
$$;

-- 5. List brand users (for admin management)
CREATE OR REPLACE FUNCTION admin_list_brand_users()
RETURNS TABLE(id uuid, email text, display_name text, brand_slug text, region text, role text, created_at timestamptz)
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY SELECT bu.id, bu.email, bu.display_name, bu.brand_slug, bu.region, bu.role, bu.created_at
    FROM brand_users bu ORDER BY bu.created_at DESC;
END;
$$;

-- 6. Add brand user
CREATE OR REPLACE FUNCTION admin_add_brand_user(p_email text, p_hash text, p_display_name text, p_brand_slug text, p_region text)
RETURNS TABLE(id uuid, email text, display_name text, brand_slug text, region text, role text, created_at timestamptz)
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY INSERT INTO brand_users (email, password_hash, display_name, brand_slug, region, role)
    VALUES (lower(trim(p_email)), p_hash, COALESCE(p_display_name, ''), p_brand_slug, COALESCE(p_region, 'za'), 'brand_viewer')
    RETURNING brand_users.id, brand_users.email, brand_users.display_name, brand_users.brand_slug, brand_users.region, brand_users.role, brand_users.created_at;
END;
$$;

-- 7. Remove brand user
CREATE OR REPLACE FUNCTION admin_remove_brand_user(p_user_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  DELETE FROM brand_users WHERE id = p_user_id;
END;
$$;
