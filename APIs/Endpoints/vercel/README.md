# Vercel REST API — Specs usadas pela integração Nexa

Doc oficial: https://vercel.com/docs/rest-api

## Autenticação

- Base URL: `https://api.vercel.com`
- Header: `Authorization: Bearer <VERCEL_TOKEN>`
- Token: criar em https://vercel.com/account/tokens

## Escopo de Team

Todas as chamadas escopadas pra team aceitam:
- `?teamId=team_xxx` — recomendado (estável)
- `?slug=marcoaurelio-archs-projects` — alternativa

## Endpoints implementados em `Automacoes/vercel/`

### Projects

| Método | Path | Notas |
|--------|------|-------|
| GET    | `/v9/projects` | lista; query: `limit`, `search` |
| GET    | `/v9/projects/{idOrName}` | detalhes |

### Environment Variables

| Método | Path | Notas |
|--------|------|-------|
| GET    | `/v9/projects/{idOrName}/env?decrypt=true` | lista (com valores) |
| POST   | `/v10/projects/{idOrName}/env?upsert=true` | criar/upsert |
| PATCH  | `/v9/projects/{idOrName}/env/{envId}` | atualizar |
| DELETE | `/v9/projects/{idOrName}/env/{envId}` | remover |

Body POST/PATCH:
```json
{
  "key": "ZAPER_API_KEY",
  "value": "...",
  "type": "sensitive",
  "target": ["production", "preview"],
  "gitBranch": null
}
```

`type`: `plain` | `encrypted` | `sensitive` | `system` | `secret`
`target`: array de `production` | `preview` | `development`

### Deployments

| Método | Path | Notas |
|--------|------|-------|
| GET    | `/v6/deployments` | lista; query: `projectId`, `state`, `target`, `limit`, `from`, `to` |
| GET    | `/v13/deployments/{idOrUrl}` | detalhes |
| GET    | `/v2/deployments/{id}/events` | build logs (eventos) |
| GET    | `/v3/deployments/{id}/runtime-logs` | logs runtime |

### Deploy Hooks

- POST `{deployHookUrl}` — URL completa configurada no painel do projeto. **Não usa Bearer** (token está embutido na URL).

### Domains

| Método | Path | Notas |
|--------|------|-------|
| GET    | `/v5/domains` | lista |
| POST   | `/v5/domains` | adicionar |
| DELETE | `/v6/domains/{domain}` | remover |

### DNS Records

| Método | Path | Notas |
|--------|------|-------|
| GET    | `/v4/domains/{domain}/records` | lista |
| POST   | `/v2/domains/{domain}/records` | adicionar |
| DELETE | `/v2/domains/{domain}/records/{recordId}` | remover |

Body POST DNS:
```json
{
  "type": "CNAME",
  "name": "app",
  "value": "cname.vercel-dns.com",
  "ttl": 60
}
```

## Códigos de erro retriáveis

O cliente faz retry com backoff exponencial (300ms × 2^n) em:
- `429 Too Many Requests`
- `5xx Server Error`

## Referências por endpoint

- Projects: https://vercel.com/docs/rest-api/reference/endpoints/projects
- Env vars (create): https://vercel.com/docs/rest-api/reference/endpoints/projects/create-one-or-more-environment-variables
- Deployments: https://vercel.com/docs/rest-api/reference/endpoints/deployments
- Domains: https://vercel.com/docs/rest-api/reference/endpoints/domains
