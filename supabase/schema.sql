-- Cap' — schema v0
-- À jouer une seule fois dans Supabase Dashboard > SQL Editor.
-- Idempotent (drop + create).

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. PROFILES — extends auth.users
-- ─────────────────────────────────────────────────────────────────────────────

drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();
drop table if exists public.profiles cascade;

create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  role        text check (role in ('lyceen', 'diplome')) not null default 'lyceen',
  first_name  text,
  last_name   text,
  niveau      text, -- 'Terminale' | 'L1' .. 'M2' | 'Diplomé 2024' | etc.
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles select own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles insert own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles update own"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create a profile row on signup. role is read from raw_user_meta_data
-- (set client-side at signInWithOtp time).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'role', 'lyceen')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. DISCOVERY_RUNS — résultats des mini-jeux Découverte
-- ─────────────────────────────────────────────────────────────────────────────

drop table if exists public.discovery_runs cascade;

create table public.discovery_runs (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users (id) on delete set null,
  family        text not null check (family in ('strategy','finance','marketing','tech','startup','retail')),
  game_key      text not null,            -- ex. 'client-brief'
  score         int  check (score between 0 and 100),
  duration_ms   int,
  payload       jsonb,                    -- réponses détaillées si on veut
  completed_at  timestamptz not null default now()
);

create index discovery_runs_user_idx   on public.discovery_runs (user_id, completed_at desc);
create index discovery_runs_family_idx on public.discovery_runs (family, completed_at desc);

alter table public.discovery_runs enable row level security;

create policy "discovery_runs select own"
  on public.discovery_runs for select
  using (auth.uid() = user_id);

-- Permet à un user authentifié de logger sa propre run, OU au mode invité
-- (user_id null) — utile pour /jeux-libres avant signup.
create policy "discovery_runs insert own or anon"
  on public.discovery_runs for insert
  with check (user_id is null or auth.uid() = user_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. PROGRAM_LEADS — formulaire de contact école (coeur business B2B)
-- ─────────────────────────────────────────────────────────────────────────────

drop table if exists public.program_leads cascade;

create table public.program_leads (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users (id) on delete set null,
  school      text not null,            -- 'escp' | 'hec' | ...
  module      text not null,            -- 'business-plan' | ...
  first_name  text not null,
  last_name   text not null,
  email       text not null,
  niveau      text,
  created_at  timestamptz not null default now()
);

create index program_leads_school_idx on public.program_leads (school, created_at desc);

alter table public.program_leads enable row level security;

-- Anyone (anon ou auth) peut soumettre un lead — on collecte les coordonnées
-- même sans compte (clé du modèle B2B).
create policy "program_leads insert anyone"
  on public.program_leads for insert
  with check (true);

-- Mais on ne lit que les siens.
create policy "program_leads select own"
  on public.program_leads for select
  using (auth.uid() = user_id);
