create extension if not exists pgcrypto;

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  status text not null default 'Active',
  description text default '',
  created_at timestamptz not null default now()
);

create unique index if not exists companies_name_unique on public.companies (lower(name));

create table if not exists public.portal_users (
  id uuid primary key default gen_random_uuid(),
  login_id text not null unique,
  email text,
  full_name text,
  role text not null default 'client' check (role in ('admin', 'client')),
  password_hash text not null,
  company_id uuid references public.companies(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists portal_users_company_id_idx on public.portal_users (company_id);

alter table public.companies enable row level security;
alter table public.portal_users enable row level security;

-- The app writes through SUPABASE_SERVICE_ROLE_KEY from server-side API routes.
-- Do not expose the service role key in browser/client code.
