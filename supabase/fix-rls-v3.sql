-- STEP 1: Drop ALL known policies by name (from migration + fix-rls)

-- From fix-rls.sql
drop policy if exists "Users can view own profile or admin sees all" on public.profiles;
drop policy if exists "Users can update own profile or admin updates all" on public.profiles;

-- From migration.sql
drop policy if exists "Members can view own profile" on public.profiles;
drop policy if exists "Members can update own profile" on public.profiles;
drop policy if exists "Admins can view all profiles" on public.profiles;
drop policy if exists "Admins can update all profiles" on public.profiles;
drop policy if exists "Admins can insert profiles" on public.profiles;
drop policy if exists "Admins can delete profiles" on public.profiles;

-- From fix-rls-v2 (in case partial run)
drop policy if exists "profiles_select" on public.profiles;
drop policy if exists "profiles_update" on public.profiles;
drop policy if exists "profiles_insert" on public.profiles;
drop policy if exists "profiles_delete" on public.profiles;

-- Payment confirmations
drop policy if exists "Members can view own confirmations" on public.payment_confirmations;
drop policy if exists "Members can insert own confirmations" on public.payment_confirmations;
drop policy if exists "Admins can view all confirmations" on public.payment_confirmations;
drop policy if exists "Admins can update all confirmations" on public.payment_confirmations;
drop policy if exists "Users can view own or admin sees all confirmations" on public.payment_confirmations;
drop policy if exists "confirmations_select" on public.payment_confirmations;
drop policy if exists "confirmations_insert" on public.payment_confirmations;
drop policy if exists "confirmations_update" on public.payment_confirmations;

-- Storage
drop policy if exists "Members can upload own proofs" on storage.objects;
drop policy if exists "Members can read own proofs" on storage.objects;
drop policy if exists "Admins can read all proofs" on storage.objects;
drop policy if exists "storage_upload_own" on storage.objects;
drop policy if exists "storage_read_own" on storage.objects;
drop policy if exists "storage_admin_read" on storage.objects;

-- STEP 2: Now drop the function
drop function if exists public.is_admin();

-- STEP 3: Create the helper function
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

-- STEP 4: Profiles policies
create policy "profiles_select"
  on public.profiles for select
  to authenticated
  using (true);

create policy "profiles_update"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id or public.is_admin());

create policy "profiles_insert"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id or public.is_admin());

create policy "profiles_delete"
  on public.profiles for delete
  to authenticated
  using (public.is_admin());

-- STEP 5: Payment confirmations policies
create policy "confirmations_select"
  on public.payment_confirmations for select
  to authenticated
  using (true);

create policy "confirmations_insert"
  on public.payment_confirmations for insert
  to authenticated
  with check (member_id = auth.uid());

create policy "confirmations_update"
  on public.payment_confirmations for update
  to authenticated
  using (public.is_admin());

-- STEP 6: Storage policies
create policy "storage_upload_own"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'payment-proofs'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "storage_read_own"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'payment-proofs'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "storage_admin_read"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'payment-proofs'
    and public.is_admin()
  );
