-- ============================================================
-- NABA GOLD KARIGAR — Complete Supabase Schema
-- Last updated: 2026-04-22
-- ============================================================
-- HOW TO USE:
--   Supabase Dashboard → SQL Editor → New Query → paste → Run
-- ============================================================

-- ============================================================
-- SECTION 0: PREREQUISITES — READ BEFORE RUNNING
-- ============================================================
-- This script is IDEMPOTENT (safe to run multiple times).
-- It uses IF NOT EXISTS / DROP … IF EXISTS guards everywhere.
--
-- ORDER OF OPERATIONS:
--   1. Run this entire script once in the SQL Editor.
--   2. Create the Storage bucket manually (see Section 5).
--   3. Apply Storage RLS policies (Section 6).
--
-- IMAGE UPLOAD ERROR FIX:
--   Common error: "Bucket not found" or "new row violates row-level
--   security policy" when uploading from the Admin Panel.
--
--   Root causes & fixes:
--
--   A) Bucket does not exist
--      → Go to: Storage → New Bucket
--        Name: assets
--        Public: YES (toggle ON)
--        Click "Create Bucket"
--
--   B) Storage INSERT policy missing (authenticated users can't upload)
--      → Run Section 6 of this script to create storage policies.
--
--   C) Storage SELECT policy missing (public can't view images)
--      → The "assets_public_select" policy in Section 6 fixes this.
--
--   D) CORS error when displaying images in the browser
--      → Go to: Project Settings → API → CORS Allowed Origins
--        Add: http://localhost:3000  (dev)
--             http://localhost:3001  (dev fallback)
--             https://your-production-domain.com
--
--   E) RLS on storage.objects is blocking your admin
--      → Make sure you are logged in as an authenticated user in the
--        admin panel before uploading. The policies use auth.role().
--
--   F) File size too large (Supabase free plan limit: 50 MB per file)
--      → Compress images before upload or resize in the browser.
--
-- ============================================================


-- ============================================================
-- SECTION 1: PRODUCTS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS products (
  id              uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  title           text        NOT NULL,
  description     text        NOT NULL,
  "weightInGrams" numeric     NOT NULL,
  "makingCharge"  numeric     NOT NULL,
  "chargeType"    text        NOT NULL
                  CHECK ("chargeType" IN ('flat', 'percentage')),
  images          text[]      DEFAULT '{}',
  "popularityScore" integer   DEFAULT 0,
  category        text        NOT NULL,
  "isHidden"      boolean     DEFAULT false,
  "isOutofStock"  boolean     DEFAULT false,
  "stockQuantity" integer     DEFAULT 0,
  "createdAt"     bigint      NOT NULL,
  "updatedAt"     bigint      NOT NULL
);

-- Safe column additions (run even if table already existed)
ALTER TABLE products ADD COLUMN IF NOT EXISTS "stockQuantity" integer DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS "popularityScore" integer DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS "isHidden" boolean DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS "isOutofStock" boolean DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS images text[] DEFAULT '{}';

-- Fix any NULLs that snuck in
UPDATE products SET "stockQuantity" = 0 WHERE "stockQuantity" IS NULL;
UPDATE products SET "popularityScore" = 0 WHERE "popularityScore" IS NULL;
UPDATE products SET "isHidden" = false WHERE "isHidden" IS NULL;
UPDATE products SET "isOutofStock" = false WHERE "isOutofStock" IS NULL;
UPDATE products SET images = '{}' WHERE images IS NULL;


-- ============================================================
-- SECTION 2: REVIEWS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS reviews (
  id             uuid     DEFAULT gen_random_uuid() PRIMARY KEY,
  "customerName" text     NOT NULL,
  rating         integer  NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment        text     NOT NULL,
  "isApproved"   boolean  DEFAULT false,
  "createdAt"    bigint   NOT NULL,
  "updatedAt"    bigint
);

ALTER TABLE reviews ADD COLUMN IF NOT EXISTS "isApproved" boolean DEFAULT false;


-- ============================================================
-- SECTION 3: SETTINGS TABLE
-- (Stores gold rates, logo URL, and homepage image config)
-- ============================================================

CREATE TABLE IF NOT EXISTS settings (
  id           text    PRIMARY KEY,
  rate22k      numeric NOT NULL DEFAULT 0,
  rate24k      numeric NOT NULL DEFAULT 0,
  "logoUrl"    text             DEFAULT '',
  "homeConfig" jsonb            DEFAULT '{}'::jsonb,
  "lastUpdated" bigint NOT NULL DEFAULT 0
);

ALTER TABLE settings ADD COLUMN IF NOT EXISTS "logoUrl"     text  DEFAULT '';
ALTER TABLE settings ADD COLUMN IF NOT EXISTS "homeConfig"  jsonb DEFAULT '{}'::jsonb;

-- Seed default row if it doesn't exist yet
INSERT INTO settings (id, rate22k, rate24k, "logoUrl", "homeConfig", "lastUpdated")
VALUES (
  'goldRate',
  6800,
  7400,
  '',
  '{
    "heroImage": "",
    "featuredImage1": "",
    "featuredImage2": "",
    "featuredImage3": ""
  }'::jsonb,
  extract(epoch from now()) * 1000
)
ON CONFLICT (id) DO NOTHING;


-- ============================================================
-- SECTION 4: AUDIT LOGS TABLE
-- (Tracks every admin action for accountability)
-- ============================================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id          uuid   DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_email text   NOT NULL,
  action      text   NOT NULL,
  details     text   NOT NULL,
  created_at  bigint NOT NULL
);


-- ============================================================
-- SECTION 5: STORAGE BUCKET — MANUAL STEP
-- ============================================================
-- SQL cannot create Storage buckets directly.
-- You MUST do this manually in the Supabase Dashboard:
--
--   1. Go to: Storage (left sidebar) → New Bucket
--   2. Bucket name: assets
--   3. Public bucket: YES (toggle ON — allows public image URLs)
--   4. Click "Create Bucket"
--
-- After creating the bucket, run Section 6 below.
-- ============================================================


-- ============================================================
-- SECTION 6: STORAGE RLS POLICIES
-- (Run AFTER creating the 'assets' bucket in the dashboard)
-- ============================================================

-- Allow anyone (public) to view/read files in the 'assets' bucket
-- This is what makes product images visible to all visitors.
DROP POLICY IF EXISTS "assets_public_select" ON storage.objects;
CREATE POLICY "assets_public_select"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'assets');

-- Allow authenticated admin users to upload files
DROP POLICY IF EXISTS "assets_auth_insert" ON storage.objects;
CREATE POLICY "assets_auth_insert"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'assets'
    AND (select auth.role()) = 'authenticated'
  );

-- Allow authenticated admin users to update/replace files
DROP POLICY IF EXISTS "assets_auth_update" ON storage.objects;
CREATE POLICY "assets_auth_update"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'assets'
    AND (select auth.role()) = 'authenticated'
  );

-- Allow authenticated admin users to delete files
DROP POLICY IF EXISTS "assets_auth_delete" ON storage.objects;
CREATE POLICY "assets_auth_delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'assets'
    AND (select auth.role()) = 'authenticated'
  );


-- ============================================================
-- SECTION 7: ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- ============================================================

ALTER TABLE products   ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews    ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings   ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- SECTION 8: RLS POLICIES — PRODUCTS
-- ============================================================

-- Drop any stale/old policies first
DROP POLICY IF EXISTS "Enable read access for all users"         ON products;
DROP POLICY IF EXISTS "Enable write access for authenticated users" ON products;
DROP POLICY IF EXISTS "products_select_public"                   ON products;
DROP POLICY IF EXISTS "products_insert_auth"                     ON products;
DROP POLICY IF EXISTS "products_update_auth"                     ON products;
DROP POLICY IF EXISTS "products_delete_auth"                     ON products;

-- Public: anyone can browse the catalog
CREATE POLICY "products_select_public"
  ON products FOR SELECT
  USING (true);

-- Admin only: add new products
CREATE POLICY "products_insert_auth"
  ON products FOR INSERT
  WITH CHECK ((select auth.role()) = 'authenticated');

-- Admin only: edit existing products
CREATE POLICY "products_update_auth"
  ON products FOR UPDATE
  USING  ((select auth.role()) = 'authenticated')
  WITH CHECK ((select auth.role()) = 'authenticated');

-- Admin only: delete products
CREATE POLICY "products_delete_auth"
  ON products FOR DELETE
  USING ((select auth.role()) = 'authenticated');


-- ============================================================
-- SECTION 9: RLS POLICIES — REVIEWS
-- ============================================================

DROP POLICY IF EXISTS "Enable read access for all users"             ON reviews;
DROP POLICY IF EXISTS "Enable insert for all users"                  ON reviews;
DROP POLICY IF EXISTS "Enable update/delete access for authenticated users" ON reviews;
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON reviews;
DROP POLICY IF EXISTS "reviews_select_public"                        ON reviews;
DROP POLICY IF EXISTS "reviews_insert_public"                        ON reviews;
DROP POLICY IF EXISTS "reviews_update_auth"                          ON reviews;
DROP POLICY IF EXISTS "reviews_delete_auth"                          ON reviews;

-- Anyone can read approved (and all) reviews
CREATE POLICY "reviews_select_public"
  ON reviews FOR SELECT
  USING (true);

-- Anyone (public) can submit a review
CREATE POLICY "reviews_insert_public"
  ON reviews FOR INSERT
  WITH CHECK (true);

-- Only admin can approve / edit reviews
CREATE POLICY "reviews_update_auth"
  ON reviews FOR UPDATE
  USING  ((select auth.role()) = 'authenticated')
  WITH CHECK ((select auth.role()) = 'authenticated');

-- Only admin can delete reviews
CREATE POLICY "reviews_delete_auth"
  ON reviews FOR DELETE
  USING ((select auth.role()) = 'authenticated');


-- ============================================================
-- SECTION 10: RLS POLICIES — SETTINGS
-- ============================================================

DROP POLICY IF EXISTS "Enable read access for all users"             ON settings;
DROP POLICY IF EXISTS "Enable write access for authenticated users"  ON settings;
DROP POLICY IF EXISTS "settings_select_public"                       ON settings;
DROP POLICY IF EXISTS "settings_insert_auth"                         ON settings;
DROP POLICY IF EXISTS "settings_update_auth"                         ON settings;

-- Everyone can read rates and config (needed for the live rate ticker)
CREATE POLICY "settings_select_public"
  ON settings FOR SELECT
  USING (true);

-- Only admin can insert (used for upsert on first run)
CREATE POLICY "settings_insert_auth"
  ON settings FOR INSERT
  WITH CHECK ((select auth.role()) = 'authenticated');

-- Only admin can update rates / logo / homepage config
CREATE POLICY "settings_update_auth"
  ON settings FOR UPDATE
  USING  ((select auth.role()) = 'authenticated')
  WITH CHECK ((select auth.role()) = 'authenticated');


-- ============================================================
-- SECTION 11: RLS POLICIES — AUDIT LOGS
-- ============================================================

DROP POLICY IF EXISTS "Enable read access for authenticated users"   ON audit_logs;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON audit_logs;
DROP POLICY IF EXISTS "audit_select_auth"                            ON audit_logs;
DROP POLICY IF EXISTS "audit_insert_auth"                            ON audit_logs;

-- Only admin can view audit trail
CREATE POLICY "audit_select_auth"
  ON audit_logs FOR SELECT
  USING ((select auth.role()) = 'authenticated');

-- Only admin actions can write to audit log
CREATE POLICY "audit_insert_auth"
  ON audit_logs FOR INSERT
  WITH CHECK ((select auth.role()) = 'authenticated');


-- ============================================================
-- SECTION 12: USEFUL INDEXES FOR PERFORMANCE
-- ============================================================

-- Speed up public catalog browsing (excludes hidden/OOS items)
CREATE INDEX IF NOT EXISTS idx_products_category
  ON products (category);

CREATE INDEX IF NOT EXISTS idx_products_hidden
  ON products ("isHidden");

CREATE INDEX IF NOT EXISTS idx_products_oos
  ON products ("isOutofStock");

CREATE INDEX IF NOT EXISTS idx_products_created
  ON products ("createdAt" DESC);

-- Speed up admin reviews page
CREATE INDEX IF NOT EXISTS idx_reviews_approved
  ON reviews ("isApproved");

CREATE INDEX IF NOT EXISTS idx_reviews_created
  ON reviews ("createdAt" DESC);

-- Speed up audit log queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_created
  ON audit_logs (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_logs_admin
  ON audit_logs (admin_email);


-- ============================================================
-- SECTION 13: RELOAD SCHEMA CACHE
-- ============================================================

NOTIFY pgrst, 'reload schema';

-- ============================================================
-- DONE!
-- After running this script:
--   ✓ All tables exist with correct columns
--   ✓ RLS is enabled on every table
--   ✓ Public read, admin write policies are active
--   ✓ Storage policies are ready (once 'assets' bucket is created)
--   ✓ Performance indexes are in place
--
-- Next step: Create the 'assets' bucket in Storage (see Section 5)
-- ============================================================
