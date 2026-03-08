-- FIX: Infinite recursion in RLS policies
-- Run this in Supabase SQL Editor

-- 1. Create a helper function that bypasses RLS to check admin status
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and is_admin = true
  );
$$ language sql security definer stable;

-- 2. Drop old broken policies on profiles
drop policy if exists "Members can view own profile" on public.profiles;
drop policy if exists "Members can update own profile" on public.profiles;
drop policy if exists "Admins can view all profiles" on public.profiles;
drop policy if exists "Admins can update all profiles" on public.profiles;
drop policy if exists "Admins can insert profiles" on public.profiles;
drop policy if exists "Admins can delete profiles" on public.profiles;

-- 3. Create fixed policies using the helper function
create policy "Users can view own profile or admin sees all"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

create policy "Users can update own profile or admin updates all"
  on public.profiles for update
  using (auth.uid() = id or public.is_admin());

create policy "Admins can insert profiles"
  on public.profiles for insert
  with check (public.is_admin());

create policy "Admins can delete profiles"
  on public.profiles for delete
  using (public.is_admin());

-- 4. Drop and fix payment_confirmations policies too
drop policy if exists "Members can view own confirmations" on public.payment_confirmations;
drop policy if exists "Members can insert own confirmations" on public.payment_confirmations;
drop policy if exists "Admins can view all confirmations" on public.payment_confirmations;
drop policy if exists "Admins can update all confirmations" on public.payment_confirmations;

create policy "Users can view own or admin sees all confirmations"
  on public.payment_confirmations for select
  using (member_id = auth.uid() or public.is_admin());

create policy "Members can insert own confirmations"
  on public.payment_confirmations for insert
  with check (member_id = auth.uid());

create policy "Admins can update all confirmations"
  on public.payment_confirmations for update
  using (public.is_admin());

-- 5. Fix storage policies
drop policy if exists "Admins can read all proofs" on storage.objects;

create policy "Admins can read all proofs"
  on storage.objects for select
  using (
    bucket_id = 'payment-proofs'
    and public.is_admin()
  );
