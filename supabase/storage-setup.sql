-- ==============================================================================
-- SUPABASE STORAGE BUCKETS & POLICIES SETUP
-- Run this in: Supabase Dashboard -> SQL Editor
-- ==============================================================================

-- 1. Insert Storage Buckets into storage.buckets (All public for web delivery, documents can also be public or restricted)
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
ON CONFLICT (id) DO NOTHING;

-- 2. Storage Policies for storage.objects

-- Allow public read access to all assets in these buckets
CREATE POLICY "Public Read Website Assets"
ON storage.objects FOR SELECT
USING (bucket_id IN ('events', 'notices', 'activities', 'members', 'gallery', 'posters', 'documents', 'logos'));

-- Allow authenticated Admins to upload files
CREATE POLICY "Admin Upload Website Assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id IN ('events', 'notices', 'activities', 'members', 'gallery', 'posters', 'documents', 'logos'));

-- Allow authenticated Admins to update / overwrite files
CREATE POLICY "Admin Update Website Assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id IN ('events', 'notices', 'activities', 'members', 'gallery', 'posters', 'documents', 'logos'))
WITH CHECK (bucket_id IN ('events', 'notices', 'activities', 'members', 'gallery', 'posters', 'documents', 'logos'));

-- Allow authenticated Admins to delete files
CREATE POLICY "Admin Delete Website Assets"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id IN ('events', 'notices', 'activities', 'members', 'gallery', 'posters', 'documents', 'logos'));
