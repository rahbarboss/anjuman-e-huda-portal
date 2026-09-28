-- ==============================================================================
-- RUN THIS IN SUPABASE SQL EDITOR TO ADD IMAGE URL SUPPORT TO NOTICES / UPDATES
-- ==============================================================================
-- 1. Add image_url column to public.notices table if not already added
ALTER TABLE public.notices 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- 2. If any previous circulars had their image stored in file_url, copy it to image_url
UPDATE public.notices 
SET image_url = file_url 
WHERE image_url IS NULL AND file_url IS NOT NULL AND file_url <> '';

-- 3. Confirm column is present
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'notices';
