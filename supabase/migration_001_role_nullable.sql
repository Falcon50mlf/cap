-- Migration 001 — role nullable
-- Contexte : on switche en email+password (plus de magic link), donc le rôle
-- est choisi APRÈS l'auth, pas pendant. Il faut donc qu'il soit nullable.

-- À jouer une fois dans Supabase Dashboard > SQL Editor.

alter table public.profiles
  alter column role drop not null,
  alter column role drop default;

-- Trigger mis à jour : on n'auto-set plus 'lyceen' au signup.
-- Si raw_user_meta_data->>'role' est défini (rare, pour compat), on l'utilise.
-- Sinon NULL → frontend redirige vers /onboarding pour faire choisir.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role)
  values (new.id, new.raw_user_meta_data ->> 'role');
  return new;
end;
$$;

-- (Optionnel) Si tu veux remettre à zéro tes profils de test précédents
-- pour qu'ils repassent par /onboarding :
--   update public.profiles set role = null where created_at > now() - interval '1 day';
