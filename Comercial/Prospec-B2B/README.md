# Nexa Operações

Plataforma interna da **Nexa Malls** para prospecção B2B de marcas/varejistas
para os shoppings do grupo.

## Stack

- **Next.js 16** (App Router, Server Components, Proxy)
- **TypeScript** + **Tailwind v4**
- **Supabase** (Postgres, Auth, RLS)
- **Claude API** (Anthropic) para lead scoring e geração de copy
- Integrações: BrasilAPI/Receita, Google Places, Apollo.io, Econodata

## Pré-requisitos

- Node 22+
- Conta Supabase (free tier serve para começar)
- API keys das fontes que vão ser usadas (ver `.env.local.example`)

## Setup

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis
cp .env.local.example .env.local
# preencher NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY

# 3. Aplicar schema no Supabase
# cole o conteúdo de supabase/migrations/0001_init.sql no SQL Editor
# (ou use a CLI: supabase db push)

# 4. Rodar dev server
npm run dev
```

Abra http://localhost:3000.

## Estrutura

```
src/
  app/                  # Rotas (App Router)
    page.tsx            # Landing
  lib/
    supabase/
      client.ts         # Browser client
      server.ts         # Server client (cookies async)
      proxy.ts          # Refresh de sessão no proxy
proxy.ts                # Proxy raiz (Next 16 — antigo middleware.ts)
supabase/
  migrations/
    0001_init.sql       # Schema inicial
```

## Modelo de dados (resumo)

- `shoppings` — empreendimentos da Nexa (ABL, vacância, mix, público)
- `leads` — marcas-alvo (CNPJ, CNAE, categoria, lojas, redes)
- `lead_contacts` — decisores da marca
- `lead_locations` — lojas físicas conhecidas (via Google Places)
- `lead_scores` — fit marca × shopping (0-100 com justificativa do modelo)
- `opportunities` — instância no pipeline (lead × shopping + estágio + dono)
- `activities` — timeline (notas, e-mails, ligações, reuniões)

## Roadmap

- [x] Scaffold Next.js + Supabase + schema inicial
- [ ] Auth (Google SSO via Supabase)
- [ ] CRUD de shoppings (UI)
- [ ] Importação de leads via CNPJ (BrasilAPI)
- [ ] Enriquecimento via Google Places, Econodata, Apollo
- [ ] Lead scoring com Claude (Sonnet 4.6)
- [ ] Pipeline kanban
- [ ] Templates de outreach gerados por IA
- [ ] Dashboards de funil
