CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_desc TEXT,
  description TEXT,
  category TEXT NOT NULL,
  tags TEXT[],
  year TEXT,
  tech_specs JSONB,
  cover_image TEXT,
  images TEXT[],
  pdf_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS about (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bio TEXT,
  photo_url TEXT,
  cv_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution TEXT NOT NULL,
  program TEXT NOT NULL,
  start_year TEXT,
  end_year TEXT,
  gpa TEXT,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  level INTEGER CHECK (level BETWEEN 1 AND 5),
  icon_slug TEXT,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS projects_updated_at ON projects;
CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS about_updated_at ON about;
CREATE TRIGGER about_updated_at
  BEFORE UPDATE ON about
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE FUNCTION increment_view_count(project_slug TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE projects SET view_count = view_count + 1 WHERE slug = project_slug;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE about ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public reads published" ON projects;
CREATE POLICY "Public reads published" ON projects
  FOR SELECT USING (is_published = TRUE);

DROP POLICY IF EXISTS "Admin full access" ON projects;
CREATE POLICY "Admin full access" ON projects
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Public read about" ON about;
CREATE POLICY "Public read about" ON about FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Admin write about" ON about;
CREATE POLICY "Admin write about" ON about
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Public read education" ON education;
CREATE POLICY "Public read education" ON education FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Admin write education" ON education;
CREATE POLICY "Admin write education" ON education
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Public read skills" ON skills;
CREATE POLICY "Public read skills" ON skills FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Admin write skills" ON skills;
CREATE POLICY "Admin write skills" ON skills
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Public insert" ON contact_messages;
CREATE POLICY "Public insert" ON contact_messages
  FOR INSERT WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Admin reads" ON contact_messages;
CREATE POLICY "Admin reads" ON contact_messages
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin update messages" ON contact_messages;
CREATE POLICY "Admin update messages" ON contact_messages
  FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin delete" ON contact_messages;
CREATE POLICY "Admin delete" ON contact_messages
  FOR DELETE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Public read settings" ON site_settings;
CREATE POLICY "Public read settings" ON site_settings FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Admin write settings" ON site_settings;
CREATE POLICY "Admin write settings" ON site_settings
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

INSERT INTO site_settings (key, value) VALUES
  ('student_name', 'Your Name'),
  ('tagline', 'Architectural Drafting & Design'),
  ('email', 'you@email.com'),
  ('linkedin_url', ''),
  ('behance_url', ''),
  ('github_url', ''),
  ('hero_image_url', ''),
  ('seo_title', 'Portfolio | Architectural Design'),
  ('seo_description', 'Showcasing architectural drafting and design work.'),
  ('seo_og_image', ''),
  ('cv_url', ''),
  ('quote_1_text', ''),
  ('quote_1_author', '')
ON CONFLICT (key) DO NOTHING;

INSERT INTO about (bio)
SELECT 'My bio goes here.'
WHERE NOT EXISTS (SELECT 1 FROM about);

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('project-images', 'project-images', TRUE, 20971520, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('project-pdfs', 'project-pdfs', TRUE, 52428800, ARRAY['application/pdf']),
  ('profile', 'profile', TRUE, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']),
  ('site-assets', 'site-assets', TRUE, 20971520, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Public read portfolio storage" ON storage.objects;
CREATE POLICY "Public read portfolio storage" ON storage.objects
  FOR SELECT USING (bucket_id IN ('project-images', 'project-pdfs', 'profile', 'site-assets'));

DROP POLICY IF EXISTS "Admin write portfolio storage" ON storage.objects;
CREATE POLICY "Admin write portfolio storage" ON storage.objects
  FOR ALL USING (
    auth.role() = 'authenticated'
    AND bucket_id IN ('project-images', 'project-pdfs', 'profile', 'site-assets')
  )
  WITH CHECK (
    auth.role() = 'authenticated'
    AND bucket_id IN ('project-images', 'project-pdfs', 'profile', 'site-assets')
  );
