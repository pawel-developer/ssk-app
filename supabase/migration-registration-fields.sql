-- Migration: Add missing registration fields to profiles
-- Run in Supabase Dashboard → SQL Editor

-- New columns for registration form parity with Google Form
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS pesel text default '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS birth_date date;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS birth_place text default '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS address text default '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS citizenship text default 'polskie';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS studies_start_date date;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS studies_end_date date;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS statute_consent boolean default false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS rodo_consent boolean default false;

-- Allow custom status values (remove the old CHECK constraint if it exists)
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_status_check;
