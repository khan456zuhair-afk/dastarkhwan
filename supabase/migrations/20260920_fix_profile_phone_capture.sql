-- ==========================================================
-- DASTARKHWAN MIGRATION: CAPTURE PHONE IN USER PROFILE TRIGGER
-- Migration: 20260920_fix_profile_phone_capture.sql
-- Date: 2026-09-20
-- Purpose:
--   Update handle_new_user() trigger function to extract both
--   full_name and phone from NEW.raw_user_meta_data upon auth.users
--   insertion, ensuring phone numbers are reliably persisted to
--   public.profiles regardless of emnpm run devail confirmation settings.
-- ==========================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'phone',
    'customer' -- Default is ALWAYS customer
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-affirm trigger binding on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

