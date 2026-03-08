-- ═══════════════════════════════════════════════════════════
-- COMPLETE FIX: Drop all policies and recreate without recursion
-- Run this in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════

-- 1. Drop the broken helper function
drop function if exists public.is_admin();

-- 2. Drop ALL existing policies on profiles
do $$
declare
  pol record;
begin
  for pol in
    select policyname from pg_policies where tablename = 'profiles' and schemaname = 'public'
  loop
    execute format('drop policy if exists %I on public.profiles', pol.policyname);
  end loop;
end $$;

-- 3. Drop ALL existing policies on payment_confirmations
do $$
declare
  pol record;
begin
  for pol in
    select policyname from pg_policies where tablename = 'payment_confirmations' and schemaname = 'public'
  loop
    execute format('drop policy if exists %I on public.payment_confirmations', pol.policyname);
  end loop;
end $$;

-- 4. Drop storage policies for payment-proofs
do $$
declare
  pol record;
begin
  for pol in
    select policyname from pg_policies where tablename = 'objects' and schemaname = 'storage'
  loop
    if pol.policyname like '%proofs%' then
      execute format('drop policy if exists %I on storage.objects', pol.policyname);
    end if;
  end loop;
end $$;

-- ═══════════════════════════════════════════════════════════
-- 5. Create helper function (plpgsql, security definer, explicit search_path)
-- ═══════════════════════════════════════════════════════════

create or replace function public.is_admin()
returns boolean
language plpgsql
security definer
set search_path = public
stable
as $$
declare
  _is_admin boolean;
begin
  select p.is_admin into _is_admin
  from profiles p
  where p.id = auth.uid();
  return coalesce(_is_admin, false);
end;
$$;

-- ═══════════════════════════════════════════════════════════
-- 6. PROFILES: Simple non-recursive policies
-- ═══════════════════════════════════════════════════════════

-- All authenticated users can SELECT profiles
-- (app controls what to show; admins need to see all for the admin panel)
create policy "profiles_select"
  on public.profiles for select
  to authenticated
  using (true);

-- Users can UPDATE their own row; admins can update any row
create policy "profiles_update"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id or public.is_admin());

-- INSERT: only via trigger (on auth signup) or admin
create policy "profiles_insert"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id or public.is_admin());

-- DELETE: admin only
create policy "profiles_delete"
  on public.profiles for delete
  to authenticated
  using (public.is_admin());

-- ═══════════════════════════════════════════════════════════
-- 7. PAYMENT CONFIRMATIONS: Simple policies
-- ═══════════════════════════════════════════════════════════

-- Authenticated users can see all confirmations
-- (members filtered in app; admins need to see all)
create policy "confirmations_select"
  on public.payment_confirmations for select
  to authenticated
  using (true);

-- Members insert their own
create policy "confirmations_insert"
  on public.payment_confirmations for insert
  to authenticated
  with check (member_id = auth.uid());

-- Admins update (confirm/reject)
create policy "confirmations_update"
  on public.payment_confirmations for update
  to authenticated
  using (public.is_admin());

-- ═══════════════════════════════════════════════════════════
-- 8. STORAGE: Payment proofs
-- ═══════════════════════════════════════════════════════════

-- Members upload to own folder
create policy "storage_upload_own"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'payment-proofs'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Members read own files
create policy "storage_read_own"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'payment-proofs'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Admins read all files (uses is_admin() which doesn't touch storage)
create policy "storage_admin_read"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'payment-proofs'
    and public.is_admin()
  );

-- ═══════════════════════════════════════════════════════════
-- DONE! Now refresh the page.
-- ═══════════════════════════════════════════════════════════
