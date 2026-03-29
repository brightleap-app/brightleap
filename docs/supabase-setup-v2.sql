-- =============================================
-- Brightleap Supabase Setup v2
-- Run this in Supabase SQL Editor
-- Fixes: profile creation now happens via trigger (avoids RLS issue)
-- =============================================

-- Drop old tables if they exist (clean slate)
drop trigger if exists on_progress_update on public.progress;
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();
drop function if exists public.handle_updated_at();
drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;
drop policy if exists "Users can view own progress" on public.progress;
drop policy if exists "Users can insert own progress" on public.progress;
drop policy if exists "Users can update own progress" on public.progress;
drop table if exists public.progress;
drop table if exists public.profiles;

-- 1. Profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  child_name text not null default '',
  consent_given boolean not null default true,
  consent_timestamp timestamptz default now(),
  created_at timestamptz default now()
);

-- 2. Progress table
create table public.progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null unique,
  data jsonb not null default '{}',
  updated_at timestamptz default now()
);

-- 3. Trigger: auto-create profile when a user signs up
--    Reads child_name from the signup metadata
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, child_name, consent_given, consent_timestamp)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'child_name', ''),
    true,
    now()
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 4. Row Level Security
alter table public.profiles enable row level security;
alter table public.progress enable row level security;

create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Users can view own progress"
  on public.progress for select using (auth.uid() = user_id);

create policy "Users can insert own progress"
  on public.progress for insert with check (auth.uid() = user_id);

create policy "Users can update own progress"
  on public.progress for update using (auth.uid() = user_id);

-- 5. Auto-update timestamp on progress changes
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_progress_update
  before update on public.progress
  for each row execute procedure public.handle_updated_at();
