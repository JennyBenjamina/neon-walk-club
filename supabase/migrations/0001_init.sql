-- Neon Walk Club: database schema
-- Run this once in Supabase: Dashboard -> SQL Editor -> New query -> paste -> Run.

create extension if not exists pgcrypto;

-- ─── Organizers (who can use /admin) ────────────────────────────────────────
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- ─── Site settings (Sirkle links, contact email, stats) ─────────────────────
create table if not exists public.site_settings (
  key text primary key,
  value text,
  updated_at timestamptz not null default now()
);

-- ─── Routes ─────────────────────────────────────────────────────────────────
create table if not exists public.routes (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  area text,
  description text,
  highlights text[] not null default '{}',
  color text not null default '#ff3d9a',
  path jsonb not null,             -- [[lat, lng], [lat, lng], ...]
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

-- ─── Gallery photos (files live in the "gallery" storage bucket) ────────────
create table if not exists public.gallery_photos (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null,
  caption text,
  taken_on date,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ─── Member spotlights ──────────────────────────────────────────────────────
create table if not exists public.spotlights (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  walk_count int,
  quote text,
  photo_path text,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

-- ─── Partner perks ──────────────────────────────────────────────────────────
create table if not exists public.partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  perk text not null,
  address text,
  url text,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ─── Newsletter subscribers ─────────────────────────────────────────────────
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and length(email) <= 254),
  source text check (length(source) <= 40),
  created_at timestamptz not null default now()
);

-- ─── Messages from site forms (contact, partner, spotlight, merch) ──────────
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('contact', 'partner', 'spotlight', 'merch')),
  name text check (length(name) <= 120),
  email text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and length(email) <= 254),
  body text check (length(body) <= 4000),
  meta jsonb check (pg_column_size(meta) <= 4000),
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ─── Row Level Security ─────────────────────────────────────────────────────
alter table public.admins enable row level security;
alter table public.site_settings enable row level security;
alter table public.routes enable row level security;
alter table public.gallery_photos enable row level security;
alter table public.spotlights enable row level security;
alter table public.partners enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.messages enable row level security;

-- admins: organizers can see the list; changes are made in the SQL editor
create policy "admins read admins" on public.admins for select to authenticated using (public.is_admin());

-- public content: everyone can read what's published; organizers manage it
create policy "public read settings" on public.site_settings for select using (true);
create policy "admins manage settings" on public.site_settings for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "public read routes" on public.routes for select using (is_published or public.is_admin());
create policy "admins manage routes" on public.routes for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "public read gallery" on public.gallery_photos for select using (true);
create policy "admins manage gallery" on public.gallery_photos for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "public read spotlights" on public.spotlights for select using (is_published or public.is_admin());
create policy "admins manage spotlights" on public.spotlights for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "public read partners" on public.partners for select using (is_active or public.is_admin());
create policy "admins manage partners" on public.partners for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- private submissions: anyone can submit; only organizers can read or manage
create policy "anyone can subscribe" on public.newsletter_subscribers for insert with check (true);
create policy "admins manage subscribers" on public.newsletter_subscribers for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "anyone can send a message" on public.messages for insert with check (is_read = false);
create policy "admins manage messages" on public.messages for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ─── Grants (RLS above still decides which rows) ────────────────────────────
grant usage on schema public to anon, authenticated;
grant select on public.site_settings, public.routes, public.gallery_photos, public.spotlights, public.partners to anon, authenticated;
grant insert on public.newsletter_subscribers, public.messages to anon, authenticated;
grant select, insert, update, delete on
  public.site_settings, public.routes, public.gallery_photos, public.spotlights, public.partners,
  public.newsletter_subscribers, public.messages to authenticated;
grant select on public.admins to authenticated;
grant execute on function public.is_admin() to anon, authenticated;

-- ─── Storage bucket for photos ──────────────────────────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('gallery', 'gallery', true, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic'])
on conflict (id) do nothing;

create policy "admins upload photos" on storage.objects for insert to authenticated
  with check (bucket_id = 'gallery' and public.is_admin());
create policy "admins update photos" on storage.objects for update to authenticated
  using (bucket_id = 'gallery' and public.is_admin());
create policy "admins delete photos" on storage.objects for delete to authenticated
  using (bucket_id = 'gallery' and public.is_admin());
