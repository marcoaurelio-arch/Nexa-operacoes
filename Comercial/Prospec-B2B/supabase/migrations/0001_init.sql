-- Nexa Malls — Prospecção B2B
-- Initial schema: shoppings, leads (marcas), enriquecimentos, scoring, pipeline.

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ============================================================
-- Profiles (usuários do time comercial Nexa)
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  email text unique not null,
  role text not null default 'sales' check (role in ('admin', 'manager', 'sales')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- Shoppings (empreendimentos da Nexa Malls)
-- ============================================================
create table public.shoppings (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  city text not null,
  state text not null,
  cep text,
  address text,
  latitude numeric(10, 7),
  longitude numeric(10, 7),
  gla_sqm numeric(12, 2), -- Área bruta locável (m²)
  vacancy_sqm numeric(12, 2),
  vacancy_rate numeric(5, 2), -- %
  monthly_footfall integer, -- Fluxo mensal estimado
  avg_ticket_cents integer, -- Ticket médio em centavos
  audience_class text[], -- ['A', 'B', 'C']
  audience_profile jsonb, -- Detalhes demográficos
  current_mix jsonb, -- Mix de lojas atual por categoria
  status text not null default 'active' check (status in ('active', 'planning', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- Leads (marcas/varejistas alvos de prospecção)
-- ============================================================
create table public.leads (
  id uuid primary key default uuid_generate_v4(),
  cnpj text unique,
  legal_name text,
  trade_name text not null,
  cnae_primary text,
  cnae_secondary text[],
  category text, -- ex: 'moda', 'alimentação', 'serviços'
  subcategory text,
  website text,
  instagram_handle text,
  linkedin_url text,
  hq_city text,
  hq_state text,
  stores_count integer, -- nº de lojas físicas conhecidas
  revenue_range text, -- faixa de faturamento
  capital_social_cents bigint,
  founded_at date,
  data_sources text[] default '{}', -- ['receita', 'apollo', 'econodata', 'google_places']
  raw_enrichment jsonb default '{}'::jsonb, -- payloads brutos das APIs
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index leads_category_idx on public.leads (category);
create index leads_hq_state_idx on public.leads (hq_state);
create index leads_cnpj_idx on public.leads (cnpj);

-- ============================================================
-- Contatos (decisores das marcas)
-- ============================================================
create table public.lead_contacts (
  id uuid primary key default uuid_generate_v4(),
  lead_id uuid not null references public.leads (id) on delete cascade,
  full_name text not null,
  role text,
  email text,
  phone text,
  linkedin_url text,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

create index lead_contacts_lead_id_idx on public.lead_contacts (lead_id);

-- ============================================================
-- Lojas físicas conhecidas (de cada marca)
-- ============================================================
create table public.lead_locations (
  id uuid primary key default uuid_generate_v4(),
  lead_id uuid not null references public.leads (id) on delete cascade,
  place_name text,
  city text,
  state text,
  address text,
  latitude numeric(10, 7),
  longitude numeric(10, 7),
  google_place_id text,
  rating numeric(3, 2),
  reviews_count integer,
  created_at timestamptz not null default now()
);

create index lead_locations_lead_id_idx on public.lead_locations (lead_id);

-- ============================================================
-- Lead Score por shopping (fit marca x shopping calculado por IA)
-- ============================================================
create table public.lead_scores (
  id uuid primary key default uuid_generate_v4(),
  lead_id uuid not null references public.leads (id) on delete cascade,
  shopping_id uuid not null references public.shoppings (id) on delete cascade,
  score integer not null check (score between 0 and 100),
  rationale text, -- justificativa gerada pelo modelo
  model text, -- ex: 'claude-sonnet-4-6'
  factors jsonb, -- breakdown de fatores
  created_at timestamptz not null default now(),
  unique (lead_id, shopping_id)
);

create index lead_scores_shopping_idx on public.lead_scores (shopping_id, score desc);

-- ============================================================
-- Pipeline de prospecção (instância de marca no funil de um shopping)
-- ============================================================
create table public.opportunities (
  id uuid primary key default uuid_generate_v4(),
  lead_id uuid not null references public.leads (id) on delete cascade,
  shopping_id uuid not null references public.shoppings (id) on delete cascade,
  owner_id uuid references public.profiles (id) on delete set null,
  stage text not null default 'new' check (stage in (
    'new', 'qualified', 'contacted', 'meeting', 'proposal', 'negotiation', 'won', 'lost'
  )),
  expected_close_at date,
  expected_rent_cents bigint,
  loss_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (lead_id, shopping_id)
);

create index opportunities_stage_idx on public.opportunities (stage);
create index opportunities_owner_idx on public.opportunities (owner_id);

-- ============================================================
-- Atividades (timeline da prospecção)
-- ============================================================
create table public.activities (
  id uuid primary key default uuid_generate_v4(),
  opportunity_id uuid not null references public.opportunities (id) on delete cascade,
  author_id uuid references public.profiles (id) on delete set null,
  kind text not null check (kind in ('note', 'email', 'call', 'whatsapp', 'meeting', 'stage_change')),
  content text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index activities_opportunity_idx on public.activities (opportunity_id, created_at desc);

-- ============================================================
-- Triggers de updated_at
-- ============================================================
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at before update on public.profiles
  for each row execute function set_updated_at();
create trigger shoppings_updated_at before update on public.shoppings
  for each row execute function set_updated_at();
create trigger leads_updated_at before update on public.leads
  for each row execute function set_updated_at();
create trigger opportunities_updated_at before update on public.opportunities
  for each row execute function set_updated_at();

-- ============================================================
-- RLS (Row Level Security)
-- ============================================================
alter table public.profiles enable row level security;
alter table public.shoppings enable row level security;
alter table public.leads enable row level security;
alter table public.lead_contacts enable row level security;
alter table public.lead_locations enable row level security;
alter table public.lead_scores enable row level security;
alter table public.opportunities enable row level security;
alter table public.activities enable row level security;

-- Política inicial: todos os usuários autenticados leem tudo; escrita controlada por role.
-- Refinar quando definirmos territórios e atribuição por vendedor.
create policy "auth read profiles" on public.profiles for select using (auth.uid() is not null);
create policy "auth read shoppings" on public.shoppings for select using (auth.uid() is not null);
create policy "auth read leads" on public.leads for select using (auth.uid() is not null);
create policy "auth read lead_contacts" on public.lead_contacts for select using (auth.uid() is not null);
create policy "auth read lead_locations" on public.lead_locations for select using (auth.uid() is not null);
create policy "auth read lead_scores" on public.lead_scores for select using (auth.uid() is not null);
create policy "auth read opportunities" on public.opportunities for select using (auth.uid() is not null);
create policy "auth read activities" on public.activities for select using (auth.uid() is not null);

-- Self-update de profile
create policy "user updates own profile" on public.profiles
  for update using (auth.uid() = id);
