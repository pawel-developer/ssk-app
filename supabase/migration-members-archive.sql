-- Member archive/resignation lifecycle
-- Keeps former members in the database and exposes active/past views.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_archived boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS archived_at timestamptz,
  ADD COLUMN IF NOT EXISTS archive_reason text,
  ADD COLUMN IF NOT EXISTS archived_by uuid REFERENCES public.profiles(id);

CREATE OR REPLACE VIEW public.active_members_view AS
SELECT *
FROM public.profiles
WHERE is_archived = false;

CREATE OR REPLACE VIEW public.past_members_view AS
SELECT *
FROM public.profiles
WHERE is_archived = true;
