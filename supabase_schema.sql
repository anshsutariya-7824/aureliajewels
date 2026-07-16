-- SQL Schema for AURELIA Jewelry Website Database (Supabase)
-- Paste this script into your Supabase Dashboard SQL Editor and click Run.

-- 1. Create Products Table
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT,
    image TEXT,
    gallery JSONB DEFAULT '[]'::jsonb,
    moq TEXT,
    alloys TEXT,
    gemstones TEXT,
    lead_time TEXT,
    packaging TEXT,
    fob_price TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Diamonds Table
CREATE TABLE IF NOT EXISTS diamonds (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    carat NUMERIC,
    shape TEXT,
    cut TEXT,
    clarity TEXT,
    color TEXT,
    image TEXT,
    is_new BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    is_rare BOOLEAN DEFAULT false,
    is_investment BOOLEAN DEFAULT false,
    measurements TEXT,
    "table" TEXT,
    depth TEXT,
    polish TEXT,
    symmetry TEXT,
    fluorescence TEXT,
    certificate TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Content Table
CREATE TABLE IF NOT EXISTS content (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable Row Level Security (RLS) for public read access
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access" ON products;
CREATE POLICY "Allow public read access" ON products FOR SELECT USING (true);

ALTER TABLE diamonds ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access" ON diamonds;
CREATE POLICY "Allow public read access" ON diamonds FOR SELECT USING (true);

ALTER TABLE content ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access" ON content;
CREATE POLICY "Allow public read access" ON content FOR SELECT USING (true);

-- 5. Enable insert/delete/update for Authenticated Users / Service Role (bypassed by Service Role automatically, but safe to set)
CREATE POLICY "Allow service role write access" ON products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow service role write access" ON diamonds FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow service role write access" ON content FOR ALL USING (true) WITH CHECK (true);

-- 6. Create Inquiries Table
CREATE TABLE IF NOT EXISTS inquiries (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    company TEXT,
    email TEXT NOT NULL,
    phone TEXT,
    volume TEXT,
    interest TEXT,
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow service role write access" ON inquiries;
CREATE POLICY "Allow service role write access" ON inquiries FOR ALL USING (true) WITH CHECK (true);
