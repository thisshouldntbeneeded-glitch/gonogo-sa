-- GoNoGo SA — Branches table + category_type column
-- Run this in the Supabase SQL editor

-- 1. Branches table
CREATE TABLE IF NOT EXISTS branches (
  branch_id TEXT PRIMARY KEY,
  department_type TEXT NOT NULL,
  category_slug TEXT NOT NULL,
  province TEXT NOT NULL,
  branch_name TEXT NOT NULL,
  total_score INTEGER NOT NULL DEFAULT 0,
  verdict TEXT NOT NULL DEFAULT 'NOGO',
  compliance INTEGER DEFAULT 0,
  customer_satisfaction INTEGER DEFAULT 0,
  service_offering INTEGER DEFAULT 0,
  innovation INTEGER DEFAULT 0,
  customer_support INTEGER DEFAULT 0,
  accessibility_security INTEGER DEFAULT 0,
  manager TEXT DEFAULT '',
  manager_email TEXT DEFAULT '',
  telephone TEXT DEFAULT '',
  address TEXT DEFAULT '',
  hours TEXT DEFAULT '',
  downtime TEXT DEFAULT '',
  last_corruption TEXT DEFAULT '',
  sentiment_summary TEXT DEFAULT '',
  sentiment_positive TEXT DEFAULT '',
  sentiment_negative TEXT DEFAULT '',
  region TEXT NOT NULL DEFAULT 'za',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read branches_table" ON branches FOR SELECT USING (true);
CREATE POLICY "Anon write branches_table" ON branches FOR ALL USING (true) WITH CHECK (true);

-- 2. Add category_type to categories table
ALTER TABLE categories ADD COLUMN IF NOT EXISTS category_type TEXT DEFAULT 'brand';
