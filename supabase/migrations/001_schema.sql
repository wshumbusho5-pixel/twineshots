-- ============================================================================
-- Twineshots CMS — Full Database Schema
-- ============================================================================
--
-- STORAGE BUCKETS (create manually in Supabase Dashboard → Storage):
--   • gallery  — for gallery images
--   • team     — for team avatars
--   • partners — for partner logos
--   • hero     — for hero slide images
--   • services — for service images
--   • general  — for misc uploads
--
-- ============================================================================

-- --------------------------------------------------------------------------
-- 1. hero_slides
-- --------------------------------------------------------------------------
CREATE TABLE hero_slides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- --------------------------------------------------------------------------
-- 2. services
-- --------------------------------------------------------------------------
CREATE TABLE services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  price TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- --------------------------------------------------------------------------
-- 3. team_members
-- --------------------------------------------------------------------------
CREATE TABLE team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  bio TEXT,
  avatar_url TEXT,
  instagram TEXT,
  twitter TEXT,
  linkedin TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- --------------------------------------------------------------------------
-- 4. gallery_items
-- --------------------------------------------------------------------------
CREATE TABLE gallery_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  category TEXT NOT NULL DEFAULT 'all',
  image_url TEXT NOT NULL,
  description TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- --------------------------------------------------------------------------
-- 5. reviews
-- --------------------------------------------------------------------------
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_name TEXT NOT NULL,
  author_role TEXT,
  event_type TEXT,
  content TEXT NOT NULL,
  rating INT DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  review_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- --------------------------------------------------------------------------
-- 6. partners
-- --------------------------------------------------------------------------
CREATE TABLE partners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- --------------------------------------------------------------------------
-- 7. values_cards (Why Choose Us)
-- --------------------------------------------------------------------------
CREATE TABLE values_cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT 'bulb-outline',
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- --------------------------------------------------------------------------
-- 8. contact_submissions
-- --------------------------------------------------------------------------
CREATE TABLE contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  service TEXT,
  venue TEXT,
  event_date DATE,
  city TEXT,
  message TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- --------------------------------------------------------------------------
-- 9. site_settings (key-value store)
-- --------------------------------------------------------------------------
CREATE TABLE site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT,
  setting_type TEXT DEFAULT 'text',
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- --------------------------------------------------------------------------
-- 10. job_listings
-- --------------------------------------------------------------------------
CREATE TABLE job_listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT DEFAULT 'Full-time',
  location TEXT DEFAULT 'Kampala',
  description TEXT,
  requirements TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- --------------------------------------------------------------------------
-- 11. job_applications
-- --------------------------------------------------------------------------
CREATE TABLE job_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  position TEXT,
  portfolio_url TEXT,
  cover_letter TEXT,
  cv_url TEXT,
  is_reviewed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- --------------------------------------------------------------------------
-- 12. stats (for info page)
-- --------------------------------------------------------------------------
CREATE TABLE stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- --------------------------------------------------------------------------
-- 13. instagram_posts
-- --------------------------------------------------------------------------
CREATE TABLE instagram_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT,
  post_url TEXT,
  embed_url TEXT,
  post_type TEXT DEFAULT 'image',
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- --------------------------------------------------------------------------
-- 14. discover_cards
-- --------------------------------------------------------------------------
CREATE TABLE discover_cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  link_url TEXT,
  image_url TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);


-- ============================================================================
-- updated_at trigger function
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables that have updated_at
CREATE TRIGGER set_updated_at BEFORE UPDATE ON hero_slides
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON team_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON gallery_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON values_cards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON job_listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON stats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ============================================================================
-- Row Level Security
-- ============================================================================

-- Enable RLS on ALL tables
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE values_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE instagram_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE discover_cards ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------------------------
-- Public-readable tables (anon SELECT where is_active = true)
-- --------------------------------------------------------------------------

-- hero_slides
CREATE POLICY "anon_read_hero_slides" ON hero_slides
  FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "auth_all_hero_slides" ON hero_slides
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- services
CREATE POLICY "anon_read_services" ON services
  FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "auth_all_services" ON services
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- team_members
CREATE POLICY "anon_read_team_members" ON team_members
  FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "auth_all_team_members" ON team_members
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- gallery_items
CREATE POLICY "anon_read_gallery_items" ON gallery_items
  FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "auth_all_gallery_items" ON gallery_items
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- reviews
CREATE POLICY "anon_read_reviews" ON reviews
  FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "auth_all_reviews" ON reviews
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- partners
CREATE POLICY "anon_read_partners" ON partners
  FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "auth_all_partners" ON partners
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- values_cards
CREATE POLICY "anon_read_values_cards" ON values_cards
  FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "auth_all_values_cards" ON values_cards
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- job_listings
CREATE POLICY "anon_read_job_listings" ON job_listings
  FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "auth_all_job_listings" ON job_listings
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- stats
CREATE POLICY "anon_read_stats" ON stats
  FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "auth_all_stats" ON stats
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- instagram_posts
CREATE POLICY "anon_read_instagram_posts" ON instagram_posts
  FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "auth_all_instagram_posts" ON instagram_posts
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- discover_cards
CREATE POLICY "anon_read_discover_cards" ON discover_cards
  FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "auth_all_discover_cards" ON discover_cards
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- --------------------------------------------------------------------------
-- contact_submissions: anon INSERT only, authenticated full access
-- --------------------------------------------------------------------------
CREATE POLICY "anon_insert_contact_submissions" ON contact_submissions
  FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "auth_all_contact_submissions" ON contact_submissions
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- --------------------------------------------------------------------------
-- job_applications: anon INSERT only, authenticated full access
-- --------------------------------------------------------------------------
CREATE POLICY "anon_insert_job_applications" ON job_applications
  FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "auth_all_job_applications" ON job_applications
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- --------------------------------------------------------------------------
-- site_settings: anon SELECT, authenticated full access
-- --------------------------------------------------------------------------
CREATE POLICY "anon_read_site_settings" ON site_settings
  FOR SELECT TO anon USING (true);
CREATE POLICY "auth_all_site_settings" ON site_settings
  FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- ============================================================================
-- Seed data: default site_settings
-- ============================================================================
INSERT INTO site_settings (setting_key, setting_value, setting_type, description) VALUES
  ('company_name',        'Twineshots',                                                          'text',  'Company display name'),
  ('company_email',       'ask@twineshots.com',                                                  'text',  'Primary contact email'),
  ('phone_primary',       '+256752969130',                                                       'text',  'Primary phone number'),
  ('phone_secondary',     '+256200906818',                                                       'text',  'Secondary phone number'),
  ('address',             'Elements courts, alongside Makerere Kasubi road, Room G001',          'text',  'Physical address'),
  ('city',                'Kampala, Uganda',                                                     'text',  'City and country'),
  ('instagram_url',       'https://www.instagram.com/twineshots/',                               'url',   'Instagram profile URL'),
  ('facebook_url',        'https://www.facebook.com/twineshots/',                                'url',   'Facebook page URL'),
  ('twitter_url',         'https://twitter.com/twineshots',                                      'url',   'Twitter profile URL'),
  ('youtube_url',         'https://www.youtube.com/@twineshots',                                 'url',   'YouTube channel URL'),
  ('tiktok_url',          'https://www.tiktok.com/@twineshots',                                  'url',   'TikTok profile URL'),
  ('company_description', 'Professional photography and videography services in Kampala, Uganda.','text', 'Short company description'),
  ('whatsapp_events',     '+256752969130',                                                       'text',  'WhatsApp number for events'),
  ('whatsapp_studio',     '+256200906818',                                                       'text',  'WhatsApp number for studio');
