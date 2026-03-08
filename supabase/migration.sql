-- SSK Supabase Schema Migration
-- Run this in Supabase Dashboard → SQL Editor → New Query → Paste → Run

-- ═══════════════════════════════════════════════════════════
-- 1. PROFILES TABLE
-- ═══════════════════════════════════════════════════════════

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  first_name text not null default '',
  last_name text not null default '',
  phone text default '',
  university text default '',
  field_of_study text default '',
  year_of_study text default '',
  status text default 'student' check (status in ('student', 'absolwent', 'rezydent', 'stażysta', 'inny')),
  join_date date default current_date,
  fee_active boolean default false,
  fee_valid_until date,
  last_payment_date date,
  is_admin boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

-- Members can read their own profile
create policy "Members can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Members can update their own profile (limited fields)
create policy "Members can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Admins can read all profiles
create policy "Admins can view all profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

-- Admins can update all profiles
create policy "Admins can update all profiles"
  on public.profiles for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

-- Admins can insert profiles
create policy "Admins can insert profiles"
  on public.profiles for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

-- Admins can delete profiles
create policy "Admins can delete profiles"
  on public.profiles for delete
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

-- ═══════════════════════════════════════════════════════════
-- 2. PAYMENT CONFIRMATIONS TABLE
-- ═══════════════════════════════════════════════════════════

create table if not exists public.payment_confirmations (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.profiles(id) on delete cascade,
  file_url text not null,
  file_name text default '',
  uploaded_at timestamptz default now(),
  status text default 'pending' check (status in ('pending', 'confirmed', 'rejected')),
  confirmed_by uuid references public.profiles(id),
  confirmed_at timestamptz,
  rejection_reason text,
  notes text
);

alter table public.payment_confirmations enable row level security;

-- Members can view their own confirmations
create policy "Members can view own confirmations"
  on public.payment_confirmations for select
  using (member_id = auth.uid());

-- Members can insert their own confirmations
create policy "Members can insert own confirmations"
  on public.payment_confirmations for insert
  with check (member_id = auth.uid());

-- Admins can view all confirmations
create policy "Admins can view all confirmations"
  on public.payment_confirmations for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

-- Admins can update all confirmations (confirm/reject)
create policy "Admins can update all confirmations"
  on public.payment_confirmations for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

-- ═══════════════════════════════════════════════════════════
-- 3. AUTO-UPDATE updated_at ON PROFILES
-- ═══════════════════════════════════════════════════════════

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_profile_updated
  before update on public.profiles
  for each row execute function public.handle_updated_at();

-- ═══════════════════════════════════════════════════════════
-- 4. AUTO-CREATE PROFILE ON SIGNUP
-- ═══════════════════════════════════════════════════════════

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ═══════════════════════════════════════════════════════════
-- 5. STORAGE BUCKET FOR PAYMENT PROOFS
-- ═══════════════════════════════════════════════════════════

insert into storage.buckets (id, name, public)
values ('payment-proofs', 'payment-proofs', false)
on conflict (id) do nothing;

-- Members can upload to their own folder
create policy "Members can upload own proofs"
  on storage.objects for insert
  with check (
    bucket_id = 'payment-proofs'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Members can read their own files
create policy "Members can read own proofs"
  on storage.objects for select
  using (
    bucket_id = 'payment-proofs'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Admins can read all files
create policy "Admins can read all proofs"
  on storage.objects for select
  using (
    bucket_id = 'payment-proofs'
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );

-- ═══════════════════════════════════════════════════════════
-- DONE! Now create the admin user:
-- 1. Go to Authentication → Users → Add User
-- 2. Email: pawelsiuciak1@gmail.com, set a password
-- 3. Then run the SQL below to make them admin:
-- ═══════════════════════════════════════════════════════════

-- After creating the user in Auth, uncomment and run:
-- update public.profiles set is_admin = true where email = 'pawelsiuciak1@gmail.com';
