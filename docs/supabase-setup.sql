-- =============================================
-- Brightleap Supabase Setup
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query)
-- =============================================

-- 1. Profiles table — stores child display name and PIN
--    Linked to Supabase Auth (parent's email/password)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  child_name text not null,
  child_pin text not null,          -- 4-digit PIN for child login
  consent_given boolean not null default false,
  consent_timestamp timestamptz,
  created_at timestamptz default now()
);

-- 2. Progress table — stores learning progress as JSON
--    Same shape as localStorage progress, synced when logged in
create table if not exists public.progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null unique,
  data jsonb not null default '{}',
  updated_at timestamptz default now()
);

-- 3. Row Level Security — users can only access their own data
alter table public.profiles enable row level security;
alter table public.progress enable row level security;

-- Profiles: users can read and update their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Progress: users can read, insert, and update their own progress
create policy "Users can view own progress"
  on public.progress for select
  using (auth.uid() = user_id);

create policy "Users can insert own progress"
  on public.progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update own progress"
  on public.progress for update
  using (auth.uid() = user_id);

-- 4. Function to update the updated_at timestamp automatically
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
