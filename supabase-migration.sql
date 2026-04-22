-- ============================================================
-- MIGRATION: Fix RLS policies + add missing columns
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ── 1. Add missing columns (safe, skips if already exists) ──

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS "stockQuantity" integer DEFAULT 0;

ALTER TABLE settings
  ADD COLUMN IF NOT EXISTS "homeConfig" jsonb DEFAULT '{}'::jsonb;

ALTER TABLE settings
  ADD COLUMN IF NOT EXISTS "logoUrl" text DEFAULT '';

-- Fix any NULL stockQuantity values
UPDATE products SET "stockQuantity" = 0 WHERE "stockQuantity" IS NULL;


-- ── 2. Fix RLS policies for PRODUCTS ────────────────────────
-- Drop old broken policies first
DROP POLICY IF EXISTS "Enable read access for all users" ON products;
DROP POLICY IF EXISTS "Enable write access for authenticated users" ON products;

-- Public read
CREATE POLICY "products_select_public"
  ON products FOR SELECT
  USING (true);

-- Authenticated INSERT (admin can add)
CREATE POLICY "products_insert_auth"
  ON products FOR INSERT
  WITH CHECK ((select auth.role()) = 'authenticated');

-- Authenticated UPDATE (admin can edit)
CREATE POLICY "products_update_auth"
  ON products FOR UPDATE
  USING ((select auth.role()) = 'authenticated')
  WITH CHECK ((select auth.role()) = 'authenticated');

-- Authenticated DELETE (admin can delete)
CREATE POLICY "products_delete_auth"
  ON products FOR DELETE
  USING ((select auth.role()) = 'authenticated');


-- ── 3. Fix RLS policies for SETTINGS ────────────────────────
DROP POLICY IF EXISTS "Enable read access for all users" ON settings;
DROP POLICY IF EXISTS "Enable write access for authenticated users" ON settings;

CREATE POLICY "settings_select_public"
  ON settings FOR SELECT
  USING (true);

CREATE POLICY "settings_insert_auth"
  ON settings FOR INSERT
  WITH CHECK ((select auth.role()) = 'authenticated');

CREATE POLICY "settings_update_auth"
  ON settings FOR UPDATE
  USING ((select auth.role()) = 'authenticated')
  WITH CHECK ((select auth.role()) = 'authenticated');


-- ── 4. Fix RLS policies for REVIEWS ─────────────────────────
DROP POLICY IF EXISTS "Enable read access for all users" ON reviews;
DROP POLICY IF EXISTS "Enable insert for all users" ON reviews;
DROP POLICY IF EXISTS "Enable update/delete access for authenticated users" ON reviews;
DROP POLICY IF EXISTS "Enable delete access for authenticated users" ON reviews;

CREATE POLICY "reviews_select_public"
  ON reviews FOR SELECT
  USING (true);

-- Anyone can submit a review
CREATE POLICY "reviews_insert_public"
  ON reviews FOR INSERT
  WITH CHECK (true);

-- Only admin can approve/edit
CREATE POLICY "reviews_update_auth"
  ON reviews FOR UPDATE
  USING ((select auth.role()) = 'authenticated')
  WITH CHECK ((select auth.role()) = 'authenticated');

-- Only admin can delete
CREATE POLICY "reviews_delete_auth"
  ON reviews FOR DELETE
  USING ((select auth.role()) = 'authenticated');


-- ── 5. Fix RLS policies for AUDIT LOGS ──────────────────────
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON audit_logs;
DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON audit_logs;

CREATE POLICY "audit_select_auth"
  ON audit_logs FOR SELECT
  USING ((select auth.role()) = 'authenticated');

CREATE POLICY "audit_insert_auth"
  ON audit_logs FOR INSERT
  WITH CHECK ((select auth.role()) = 'authenticated');


-- ── 6. Reload PostgREST schema cache ────────────────────────
NOTIFY pgrst, 'reload schema';

-- ============================================================
-- Done! You should now be able to insert/update products.
-- ============================================================
