-- ==============================================================================
-- RUN THIS IN SUPABASE SQL EDITOR TO CREATE SOCIALMEDIA TABLE
-- ==============================================================================

-- 1. Create socialmedia table
CREATE TABLE IF NOT EXISTS public.socialmedia (
  id TEXT PRIMARY KEY,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'globe',
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Enable Row Level Security (RLS) & allow read for all, write for authenticated/anon
ALTER TABLE public.socialmedia ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on socialmedia" 
ON public.socialmedia FOR SELECT USING (true);

CREATE POLICY "Allow all modify access on socialmedia" 
ON public.socialmedia FOR ALL USING (true) WITH CHECK (true);

-- 3. Create alias view social_media for flexibility
CREATE OR REPLACE VIEW public.social_media AS 
SELECT * FROM public.socialmedia;

-- 4. Seed initial default social links (Instagram, YouTube, Facebook only)
INSERT INTO public.socialmedia (id, platform, url, icon, is_active, display_order)
VALUES 
  ('soc-1', 'Instagram', 'https://instagram.com', 'instagram', true, 1),
  ('soc-2', 'YouTube', 'https://youtube.com', 'youtube', true, 2),
  ('soc-3', 'Facebook', 'https://facebook.com', 'facebook', true, 3)
ON CONFLICT (id) DO NOTHING;
