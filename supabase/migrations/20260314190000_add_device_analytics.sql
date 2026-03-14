create table if not exists public.analytics_pageviews (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  path text not null,
  device_type text not null check (device_type in ('desktop', 'mobile', 'tablet')),
  session_id text not null,
  referrer text,
  user_id uuid
);

create index if not exists analytics_pageviews_created_at_idx
  on public.analytics_pageviews (created_at desc);

create index if not exists analytics_pageviews_device_type_idx
  on public.analytics_pageviews (device_type);

create index if not exists analytics_pageviews_path_idx
  on public.analytics_pageviews (path);

alter table public.analytics_pageviews disable row level security;
