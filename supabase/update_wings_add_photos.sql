-- ==============================================================================
-- RUN THIS IN SUPABASE SQL EDITOR TO ADD CHAIRMAN & CONVENER PHOTO COLUMNS
-- ==============================================================================

-- 1. Add chairman_photo and convener_photo columns to wings table
ALTER TABLE public.wings ADD COLUMN IF NOT EXISTS chairman_photo TEXT;
ALTER TABLE public.wings ADD COLUMN IF NOT EXISTS convener_photo TEXT;

-- 2. Ensure RLS policies continue to allow public read and admin write
-- (Existing policies automatically cover all columns in the wings table)
