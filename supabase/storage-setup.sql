-- ==============================================================================
-- SUPABASE STORAGE BUCKETS, POLICIES & ADMIN ACCOUNT SETUP
-- Run this in your Supabase Dashboard: SQL Editor -> New Query -> Paste & Run
-- ==============================================================================

-- 1. Create / Ensure Storage Buckets exist and are marked public
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('events', 'events', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('notices', 'notices', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']),
  ('activities', 'activities', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('members', 'members', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('gallery', 'gallery', true, 15728640, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('posters', 'posters', true, 15728640, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('documents', 'documents', true, 26214400, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
  ('logos', 'logos', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'])
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Drop existing policies to prevent conflicts
DROP POLICY IF EXISTS "Public Read Website Assets" ON storage.objects;
DROP POLICY IF EXISTS "Admin Upload Website Assets" ON storage.objects;
DROP POLICY IF EXISTS "Admin Update Website Assets" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete Website Assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow All Uploads Website Assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow All Updates Website Assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow All Deletes Website Assets" ON storage.objects;

-- 3. Storage Policies conforming to security requirements:
-- SELECT / Read: TO public
CREATE POLICY "Public Read Website Assets"
ON storage.objects FOR SELECT
TO public
USING (bucket_id IN ('events', 'notices', 'activities', 'members', 'gallery', 'posters', 'documents', 'logos'));

-- INSERT / Upload: TO authenticated AND must be verified admin
CREATE POLICY "Admin Upload Website Assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id IN ('events', 'notices', 'activities', 'members', 'gallery', 'posters', 'documents', 'logos')
  AND public.is_admin()
);

-- UPDATE / Overwrite: TO authenticated AND must be verified admin
CREATE POLICY "Admin Update Website Assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id IN ('events', 'notices', 'activities', 'members', 'gallery', 'posters', 'documents', 'logos')
  AND public.is_admin()
)
WITH CHECK (
  bucket_id IN ('events', 'notices', 'activities', 'members', 'gallery', 'posters', 'documents', 'logos')
  AND public.is_admin()
);

-- DELETE: TO authenticated AND must be verified admin
CREATE POLICY "Admin Delete Website Assets"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id IN ('events', 'notices', 'activities', 'members', 'gallery', 'posters', 'documents', 'logos')
  AND public.is_admin()
);

-- 4. Create / Ensure Administrator in auth.users and public.admin_profiles
-- Email: admin@anjumanehuda.org | Password: anjuman2026
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Check if user already exists
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'admin@anjumanehuda.org';

  IF v_user_id IS NULL THEN
    v_user_id := gen_random_uuid();
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      v_user_id,
      'authenticated',
      'authenticated',
      'admin@anjumanehuda.org',
      crypt('anjuman2026', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Central Union Administrator","role":"admin"}',
      now(),
      now()
    );
  END IF;

  -- Ensure profile exists in public.admin_profiles
  INSERT INTO public.admin_profiles (id, email, role, full_name)
  VALUES (v_user_id, 'admin@anjumanehuda.org', 'admin', 'Central Union Administrator')
  ON CONFLICT (id) DO UPDATE SET
    role = 'admin',
    full_name = 'Central Union Administrator';
END $$;

