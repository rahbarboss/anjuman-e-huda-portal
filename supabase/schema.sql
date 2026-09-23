-- ==============================================================================
-- ANJUMAN-E-HUDA CENTRAL DATABASE SCHEMA FOR SUPABASE
-- Run this in: Supabase Dashboard -> SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. Enable UUID generation extension if not already present
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Admin Profiles Table (links to Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Site Settings (Website name, hero, about, contacts)
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'central',
  union_name TEXT NOT NULL DEFAULT 'ANJUMAN-E-HUDA',
  tagline TEXT DEFAULT 'STUDENTS'' UNION • ESTD. 1994',
  logo_url TEXT DEFAULT '/anjuman-logo.png',
  hero_title TEXT DEFAULT 'Unified Intellect. Virtuous Leadership.',
  hero_subtitle TEXT DEFAULT 'The official apex central student organization steering intellectual vigor, cultural distinction, and student welfare across campus.',
  hero_badge TEXT DEFAULT 'OFFICIAL APEX STUDENT BODY',
  hero_bg_url TEXT DEFAULT 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1920&q=80',
  about_text TEXT DEFAULT 'Founded in 1994, ANJUMAN-E-HUDA is the premier central student union orchestrating moral excellence, scholarly dialogues, community aid, and multidisciplinary competitions.',
  vision TEXT DEFAULT 'To nurture morally grounded, intellectually versatile leaders who enrich civil society and advance scholarly excellence.',
  mission TEXT DEFAULT 'Upholding student welfare through collaborative leadership, ethical representation, and progressive educational engagement.',
  campus_address TEXT DEFAULT 'Central Secretariat Quadrangle, Gate 4, Main Campus, Chemmad, Kerala 676306',
  official_email TEXT DEFAULT 'central.union@anjumanehuda.org',
  helpline_phone TEXT DEFAULT '+91 98765 43210',
  secondary_phone TEXT DEFAULT '+91 98765 43211',
  office_hours TEXT DEFAULT 'Mon - Sat: 08:30 AM - 05:30 PM (IST)',
  emergency_desk TEXT DEFAULT 'Student Affairs Room 102 (24/7 Helpline available)',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Events / Programs Table
CREATE TABLE IF NOT EXISTS public.events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  banner TEXT,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  venue TEXT NOT NULL,
  description TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'Upcoming',
  registration_link TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Notices / Announcements Table
CREATE TABLE IF NOT EXISTS public.notices (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  date TEXT NOT NULL,
  summary TEXT NOT NULL,
  file_url TEXT,
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  urgency TEXT NOT NULL DEFAULT 'normal',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. Activities / Highlights Table
CREATE TABLE IF NOT EXISTS public.activities (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  date TEXT NOT NULL,
  description TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. Members Table (Union Leadership / Office Bearers)
CREATE TABLE IF NOT EXISTS public.members (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  tenure TEXT NOT NULL,
  photo TEXT NOT NULL,
  department TEXT NOT NULL,
  quote TEXT,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. NIICS In-Charge Directorate Table
CREATE TABLE IF NOT EXISTS public.niics_directors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  designation TEXT NOT NULL,
  tenure TEXT NOT NULL,
  photo TEXT NOT NULL,
  department TEXT NOT NULL,
  jurisdiction TEXT,
  campuses JSONB DEFAULT '[]'::jsonb,
  quote TEXT,
  email TEXT,
  phone TEXT,
  office_location TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. Specialized Student Wings Table
CREATE TABLE IF NOT EXISTS public.wings (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  description TEXT,
  icon_name TEXT NOT NULL DEFAULT 'BookOpen',
  status TEXT NOT NULL DEFAULT 'Active',
  current_tenure TEXT NOT NULL DEFAULT '2026-27',
  chairman JSONB NOT NULL DEFAULT '{"name":"","contact":""}'::jsonb,
  convener JSONB NOT NULL DEFAULT '{"name":"","contact":""}'::jsonb,
  history JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. Gallery Table
CREATE TABLE IF NOT EXISTS public.gallery (
  id TEXT PRIMARY KEY DEFAULT ('gal_' || extract(epoch from now())::bigint || '_' || substr(md5(random()::text), 1, 6)),
  title TEXT NOT NULL,
  caption TEXT,
  category TEXT DEFAULT 'General',
  image_url TEXT NOT NULL,
  event_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 11. Documents Table (PDFs, Circulars, CAU Resolutions)
CREATE TABLE IF NOT EXISTS public.documents (
  id TEXT PRIMARY KEY DEFAULT ('doc_' || extract(epoch from now())::bigint || '_' || substr(md5(random()::text), 1, 6)),
  title TEXT NOT NULL,
  category TEXT DEFAULT 'Circular',
  file_url TEXT NOT NULL,
  file_number TEXT,
  date TEXT,
  status TEXT DEFAULT 'Gazetted',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 12. Student Inquiries Table
CREATE TABLE IF NOT EXISTS public.student_inquiries (
  id TEXT PRIMARY KEY DEFAULT ('inq_' || extract(epoch from now())::bigint || '_' || substr(md5(random()::text), 1, 6)),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  category TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.niics_directors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_inquiries ENABLE ROW LEVEL SECURITY;

-- Helper function: Check if authenticated user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (auth.role() = 'authenticated');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Public READ policies (anyone can read public website content)
CREATE POLICY "Public Read Site Settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public Read Events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Public Read Notices" ON public.notices FOR SELECT USING (true);
CREATE POLICY "Public Read Activities" ON public.activities FOR SELECT USING (true);
CREATE POLICY "Public Read Members" ON public.members FOR SELECT USING (true);
CREATE POLICY "Public Read NIICS Directors" ON public.niics_directors FOR SELECT USING (true);
CREATE POLICY "Public Read Wings" ON public.wings FOR SELECT USING (true);
CREATE POLICY "Public Read Gallery" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Public Read Documents" ON public.documents FOR SELECT USING (true);

-- Anyone can submit inquiries
CREATE POLICY "Public Insert Inquiries" ON public.student_inquiries FOR INSERT WITH CHECK (true);

-- Authenticated Admin Policies (Write, Update, Delete)
CREATE POLICY "Admin Full Access Admin Profiles" ON public.admin_profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Site Settings" ON public.site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Events" ON public.events FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Notices" ON public.notices FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Activities" ON public.activities FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Members" ON public.members FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access NIICS Directors" ON public.niics_directors FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Wings" ON public.wings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Gallery" ON public.gallery FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Documents" ON public.documents FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Inquiries" ON public.student_inquiries FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Seed initial site_settings if row does not exist
INSERT INTO public.site_settings (id, union_name)
VALUES ('central', 'ANJUMAN-E-HUDA')
ON CONFLICT (id) DO NOTHING;
