-- ADHDapt community chat schema.
-- Apply in Supabase → SQL Editor (or via the Supabase MCP once connected).
--
-- NOTE ON AUTH: this app authenticates with Clerk, not Supabase Auth, so
-- Postgres RLS can't see a Supabase JWT (auth.uid() is null). The policies
-- below are intentionally permissive (public read/insert) — appropriate for
-- the public general feed and group rooms. Direct messages are filtered by
-- participant id in the client; for hardened per-user DM security, wire up the
-- Clerk↔Supabase JWT integration and tighten these policies to check the id.

-- Discoverable user directory (id = Clerk user id) -----------------------------
create table if not exists public.profiles (
  id         text primary key,
  name       text not null,
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
drop policy if exists "profiles read" on public.profiles;
drop policy if exists "profiles upsert" on public.profiles;
drop policy if exists "profiles update" on public.profiles;
create policy "profiles read"   on public.profiles for select using (true);
create policy "profiles upsert" on public.profiles for insert with check (true);
create policy "profiles update" on public.profiles for update using (true) with check (true);

-- Messages for every channel ---------------------------------------------------
-- channel is a string namespace:
--   'general'                        → the public general chat
--   'room:<slug>'                    → a public group room
--   'dm:<idA>__<idB>' (ids sorted)   → a private 1:1 conversation
create table if not exists public.messages (
  id          uuid primary key default gen_random_uuid(),
  channel     text not null,
  author_id   text not null,
  author_name text not null,
  body        text not null,
  created_at  timestamptz not null default now()
);

create index if not exists messages_channel_created_idx
  on public.messages (channel, created_at);

alter table public.messages enable row level security;
drop policy if exists "messages read" on public.messages;
drop policy if exists "messages insert" on public.messages;
create policy "messages read"   on public.messages for select using (true);
create policy "messages insert" on public.messages
  for insert with check (char_length(body) between 1 and 2000);

-- Enable Realtime (websocket change streams) for both tables -------------------
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.profiles;
