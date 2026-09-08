-- Korea Concierge production data model (pre-launch)
-- Apply only to a dedicated Korea Concierge Supabase project after review.
-- This file is intentionally not auto-applied to the existing Cali-supa project.

create extension if not exists pgcrypto;

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  preferred_locale text not null default 'en' check (preferred_locale in ('en','zh-CN','ja','zh-TW','vi','th')),
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete restrict,
  product_key text not null check (product_key in ('my_korea_look_v1')),
  status text not null default 'created' check (status in ('created','checkout_pending','paid','fulfilling','fulfilled','failed','cancelled','refunded')),
  amount_minor integer not null check (amount_minor >= 0),
  currency text not null default 'usd' check (currency = lower(currency) and char_length(currency) = 3),
  provider text not null default 'stripe' check (provider in ('stripe')),
  provider_checkout_id text unique,
  provider_payment_id text unique,
  idempotency_key text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  paid_at timestamptz,
  fulfilled_at timestamptz
);

create index if not exists orders_user_created_idx on public.orders(user_id, created_at desc);
create index if not exists orders_status_created_idx on public.orders(status, created_at);

create table if not exists public.deliverables (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete restrict,
  kind text not null check (kind in ('my_korea_look_html','my_korea_look_pdf','my_korea_look_json')),
  state text not null default 'pending' check (state in ('pending','ready','failed','revoked')),
  storage_path text,
  checksum_sha256 text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  ready_at timestamptz,
  unique(order_id, kind)
);

create index if not exists deliverables_user_created_idx on public.deliverables(user_id, created_at desc);

create table if not exists public.saved_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  feature_key text not null check (feature_key in ('personal_color','hanbok_match','saju','korean_naming','gyeongbokgung_plan','food_finder')),
  payload jsonb not null,
  source_version text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  expires_at timestamptz
);

create index if not exists saved_results_user_feature_idx on public.saved_results(user_id, feature_key, created_at desc);

create table if not exists private.payment_events (
  provider text not null check (provider in ('stripe')),
  provider_event_id text not null,
  event_type text not null,
  payload jsonb not null,
  status text not null default 'received' check (status in ('received','processed','ignored','failed')),
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  last_error text,
  primary key(provider, provider_event_id)
);

create table if not exists private.fulfillment_jobs (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references public.orders(id) on delete cascade,
  status text not null default 'queued' check (status in ('queued','running','succeeded','failed','cancelled')),
  attempt_count integer not null default 0 check (attempt_count >= 0),
  locked_at timestamptz,
  available_at timestamptz not null default now(),
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.orders enable row level security;
alter table public.deliverables enable row level security;
alter table public.saved_results enable row level security;

-- 2026 Supabase projects may not auto-expose new public tables to the Data API.
-- Grant only the operations the browser actually needs; RLS remains the row-level gate.
grant select, insert, update on public.profiles to authenticated;
grant select on public.orders to authenticated;
grant select on public.deliverables to authenticated;
grant select, insert, update, delete on public.saved_results to authenticated;
revoke all on public.profiles, public.orders, public.deliverables, public.saved_results from anon;

create policy profiles_select_own on public.profiles
for select to authenticated
using ((select auth.uid()) = user_id);

create policy profiles_insert_own on public.profiles
for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy profiles_update_own on public.profiles
for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy orders_select_own on public.orders
for select to authenticated
using ((select auth.uid()) = user_id);

create policy deliverables_select_own on public.deliverables
for select to authenticated
using ((select auth.uid()) = user_id);

create policy saved_results_select_own on public.saved_results
for select to authenticated
using ((select auth.uid()) = user_id);

create policy saved_results_insert_own on public.saved_results
for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy saved_results_update_own on public.saved_results
for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy saved_results_delete_own on public.saved_results
for delete to authenticated
using ((select auth.uid()) = user_id);

-- Private payment/webhook tables must never be reachable by browser roles.
revoke all on all tables in schema private from public, anon, authenticated;
revoke all on all sequences in schema private from public, anon, authenticated;

comment on table public.orders is 'Server-created purchase ownership records. Browser users can only read their own rows.';
comment on table public.deliverables is 'Paid result ownership and immutable delivery references. Browser users can only read their own rows.';
comment on table private.payment_events is 'Webhook idempotency ledger. Service-side only.';
