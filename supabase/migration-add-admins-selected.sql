-- Migration: set selected members as admins by name/surname
-- Run in Supabase Dashboard -> SQL Editor

BEGIN;

-- 1) Promote matched users to admin.
UPDATE public.profiles
SET is_admin = true,
    updated_at = now()
WHERE
  (
    first_name ILIKE 'dominik%' AND
    last_name ILIKE 'tomkiel%'
  ) OR (
    first_name ILIKE 'natan%' AND
    (last_name ILIKE 'adamow%' OR last_name ILIKE 'adamów%')
  ) OR (
    first_name ILIKE 'sebastian%' AND
    (last_name ILIKE 'wiśniewsk%' OR last_name ILIKE 'wisniewsk%')
  ) OR (
    first_name ILIKE 'mari%' AND
    (last_name ILIKE 'łuszczyn%' OR last_name ILIKE 'luszczyn%')
  ) OR (
    first_name ILIKE 'antonin%' AND
    (last_name ILIKE 'gajd%')
  ) OR (
    first_name ILIKE 'emil%' AND
    (last_name ILIKE 'broćk%' OR last_name ILIKE 'brock%')
  );

-- 2) Verify who is now admin (matching target patterns).
SELECT
  first_name,
  last_name,
  email,
  is_admin
FROM public.profiles
WHERE
  (
    first_name ILIKE 'dominik%' AND
    last_name ILIKE 'tomkiel%'
  ) OR (
    first_name ILIKE 'natan%' AND
    (last_name ILIKE 'adamow%' OR last_name ILIKE 'adamów%')
  ) OR (
    first_name ILIKE 'sebastian%' AND
    (last_name ILIKE 'wiśniewsk%' OR last_name ILIKE 'wisniewsk%')
  ) OR (
    first_name ILIKE 'mari%' AND
    (last_name ILIKE 'łuszczyn%' OR last_name ILIKE 'luszczyn%')
  ) OR (
    first_name ILIKE 'antonin%' AND
    (last_name ILIKE 'gajd%')
  ) OR (
    first_name ILIKE 'emil%' AND
    (last_name ILIKE 'broćk%' OR last_name ILIKE 'brock%')
  )
ORDER BY last_name, first_name;

COMMIT;
