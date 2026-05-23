-- Education Module: Categories, Subcategories, Materials, Videos
-- Run in Supabase Dashboard → SQL Editor → New Query → Paste → Run

-- ═══════════════════════════════════════════════════════════
-- 1. EDUCATION CATEGORIES (e.g. EKG, ECHO, Farmakologia)
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.education_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  cover_image_url text,
  is_published boolean DEFAULT false,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.education_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "edu_categories_select"
  ON public.education_categories FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "edu_categories_insert"
  ON public.education_categories FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "edu_categories_update"
  ON public.education_categories FOR UPDATE
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "edu_categories_delete"
  ON public.education_categories FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ═══════════════════════════════════════════════════════════
-- 2. EDUCATION SUBCATEGORIES
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.education_subcategories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES public.education_categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL,
  description text,
  is_published boolean DEFAULT false,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(category_id, slug)
);

ALTER TABLE public.education_subcategories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "edu_subcategories_select"
  ON public.education_subcategories FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "edu_subcategories_insert"
  ON public.education_subcategories FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "edu_subcategories_update"
  ON public.education_subcategories FOR UPDATE
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "edu_subcategories_delete"
  ON public.education_subcategories FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ═══════════════════════════════════════════════════════════
-- 3. EDUCATION MATERIALS (universal: simple video or rich case)
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.education_materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subcategory_id uuid NOT NULL REFERENCES public.education_subcategories(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  notes text,
  author text,
  tags text[] DEFAULT '{}',
  thumbnail_url text,
  is_published boolean DEFAULT false,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.education_materials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "edu_materials_select"
  ON public.education_materials FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "edu_materials_insert"
  ON public.education_materials FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "edu_materials_update"
  ON public.education_materials FOR UPDATE
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "edu_materials_delete"
  ON public.education_materials FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ═══════════════════════════════════════════════════════════
-- 4. EDUCATION VIDEOS (clips belonging to a material)
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.education_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id uuid NOT NULL REFERENCES public.education_materials(id) ON DELETE CASCADE,
  title text NOT NULL,
  youtube_url text NOT NULL,
  youtube_id text NOT NULL,
  duration text,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.education_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "edu_videos_select"
  ON public.education_videos FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "edu_videos_insert"
  ON public.education_videos FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "edu_videos_update"
  ON public.education_videos FOR UPDATE
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "edu_videos_delete"
  ON public.education_videos FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ═══════════════════════════════════════════════════════════
-- 5. INDEXES FOR PERFORMANCE
-- ═══════════════════════════════════════════════════════════

CREATE INDEX IF NOT EXISTS idx_edu_subcategories_category ON public.education_subcategories(category_id);
CREATE INDEX IF NOT EXISTS idx_edu_materials_subcategory ON public.education_materials(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_edu_materials_published ON public.education_materials(is_published);
CREATE INDEX IF NOT EXISTS idx_edu_videos_material ON public.education_videos(material_id);
