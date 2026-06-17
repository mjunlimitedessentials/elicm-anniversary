-- Everything AI newsletter — schema
-- Tables: subscribers (double opt-in), issues (stored newsletters), sends (delivery log).
-- RLS is enabled with NO public policies: all access goes through Edge Functions
-- using the service-role key, which bypasses RLS. The anon/auth roles get nothing.

create extension if not exists "citext";

-- ---------------------------------------------------------------------------
-- Subscribers
-- ---------------------------------------------------------------------------
create table if not exists public.newsletter_subscribers (
  id                uuid primary key default gen_random_uuid(),
  email             citext not null unique,
  status            text not null default 'pending'
                      check (status in ('pending', 'confirmed', 'unsubscribed')),
  confirm_token     uuid not null default gen_random_uuid(),
  unsubscribe_token uuid not null default gen_random_uuid(),
  source            text,
  created_at        timestamptz not null default now(),
  confirmed_at      timestamptz,
  unsubscribed_at   timestamptz
);

create index if not exists newsletter_subscribers_status_idx
  on public.newsletter_subscribers (status);

-- ---------------------------------------------------------------------------
-- Issues (the newsletters themselves)
-- ---------------------------------------------------------------------------
create table if not exists public.newsletter_issues (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  subject     text not null,
  preheader   text,
  html        text not null,
  status      text not null default 'draft'
                check (status in ('draft', 'sending', 'sent')),
  created_at  timestamptz not null default now(),
  sent_at     timestamptz
);

-- ---------------------------------------------------------------------------
-- Sends (one row per subscriber per issue — delivery log + idempotency)
-- ---------------------------------------------------------------------------
create table if not exists public.newsletter_sends (
  id             uuid primary key default gen_random_uuid(),
  issue_id       uuid not null references public.newsletter_issues (id) on delete cascade,
  subscriber_id  uuid not null references public.newsletter_subscribers (id) on delete cascade,
  email          citext not null,
  status         text not null default 'sent' check (status in ('sent', 'failed')),
  error          text,
  created_at     timestamptz not null default now(),
  unique (issue_id, subscriber_id)
);

create index if not exists newsletter_sends_issue_idx
  on public.newsletter_sends (issue_id);

-- ---------------------------------------------------------------------------
-- Row Level Security — lock everything; Edge Functions use the service role.
-- ---------------------------------------------------------------------------
alter table public.newsletter_subscribers enable row level security;
alter table public.newsletter_issues      enable row level security;
alter table public.newsletter_sends       enable row level security;
