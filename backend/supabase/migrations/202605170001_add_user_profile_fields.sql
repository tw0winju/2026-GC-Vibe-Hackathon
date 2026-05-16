alter table public.users
  add column if not exists school text,
  add column if not exists grade text,
  add column if not exists email text;
