CREATE TABLE IF NOT EXISTS categories (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'fa-tag',
  scoring_categories JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS brands (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category_slug TEXT NOT NULL REFERENCES categories(slug),
  gonogo_score INTEGER NOT NULL DEFAULT 0,
  verdict TEXT NOT NULL DEFAULT 'NOGO',
  logo_url TEXT DEFAULT '',
  website_url TEXT DEFAULT '',
  framework_breakdown JSONB NOT NULL DEFAULT '[]'::jsonb,
  key_features JSONB NOT NULL DEFAULT '[]'::jsonb,
  pricing JSONB NOT NULL DEFAULT '[]'::jsonb,
  app_ratings JSONB NOT NULL DEFAULT '{}'::jsonb,
  key_strengths JSONB NOT NULL DEFAULT '[]'::jsonb,
  key_concerns JSONB NOT NULL DEFAULT '[]'::jsonb,
  social_sentiment JSONB NOT NULL DEFAULT '{}'::jsonb,
  overview TEXT DEFAULT '',
  rating_summary TEXT DEFAULT '',
  last_updated DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  display_name TEXT DEFAULT '',
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read brands" ON brands FOR SELECT USING (true);
CREATE POLICY "Anon write categories" ON categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon write brands" ON brands FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Anon access admin_users" ON admin_users FOR ALL USING (true) WITH CHECK (true);

INSERT INTO admin_users (email, password_hash, display_name, role)
VALUES ('admin@gonogo.co.za', '7e716a4d519a3b21539308c8a969e50567c747b1e04492a4bfcf67f92981c6d1', 'Admin', 'admin')
ON CONFLICT (email) DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_brands_category ON brands(category_slug);
CREATE INDEX IF NOT EXISTS idx_brands_score ON brands(gonogo_score DESC);
CREATE INDEX IF NOT EXISTS idx_brands_verdict ON brands(verdict);
