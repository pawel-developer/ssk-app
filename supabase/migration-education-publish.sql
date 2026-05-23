-- Add is_published to categories and subcategories, default everything to unpublished
-- Run in Supabase Dashboard → SQL Editor → New Query → Paste → Run

ALTER TABLE public.education_categories
  ADD COLUMN IF NOT EXISTS is_published boolean DEFAULT false;

ALTER TABLE public.education_subcategories
  ADD COLUMN IF NOT EXISTS is_published boolean DEFAULT false;

-- Change materials default to false (new materials start hidden)
ALTER TABLE public.education_materials
  ALTER COLUMN is_published SET DEFAULT false;

-- Indexes for filtering by published status
CREATE INDEX IF NOT EXISTS idx_edu_categories_published ON public.education_categories(is_published);
CREATE INDEX IF NOT EXISTS idx_edu_subcategories_published ON public.education_subcategories(is_published);
