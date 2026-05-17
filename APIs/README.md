# 🔌 APIs — Camada de Integração

> Documentação técnica institucional de todas as APIs consumidas e expostas pela Nexa Malls.

---

## 1. Objetivo

Padronizar e centralizar a documentação técnica de integrações via API, garantindo que qualquer integrador (interno ou externo) consiga consumir os endpoints com segurança e previsibilidade.

---

## 2. Estrutura

| Subpasta | Conteúdo |
|----------|----------|
| `Documentacao/` | Documentação técnica em Markdown por API |
| `Endpoints/` | Especificações OpenAPI/Swagger |
| `Autenticacao/` | Fluxos de auth (OAuth2, API Key, JWT) |
| `Schemas/` | Schemas de request/response em JSON Schema |
| `Postman-Collections/` | Coleções Postman para testes |

---

## 3. Responsáveis

| Função | Responsável |
|--------|-------------|
| Owner Integrações | Lead Técnico Planejarcomm |
| Documentação | Time Técnico |
| Aprovação de mudança | Owner + Lead |
| Suporte | Plantão técnico |

---

## 4. Ferramentas Utilizadas

- **Documentação:** Markdown + OpenAPI 3.x
- **Especificação:** Swagger / Redoc
- **Testes:** Postman, Insomnia, Hoppscotch
- **Versionamento:** GitHub
- **Monitoramento:** UptimeRobot / BetterStack

---

## 5. Integrações Catalogadas

### APIs Consumidas
- WhatsApp Business API
- OpenAI API
- Anthropic API
- Google Workspace APIs (Sheets, Calendar, Gmail)
- Notion API
- HubSpot / Pipedrive (CRM)
- Apollo / Common Room
- Meta Ads / Google Ads / LinkedIn Ads

### APIs Expostas (futuro)
- API de gestão de ativos Nexa
- API pública de portfólio
- Webhooks para parceiros

---

## 6. Padrão de Documentação de API

Todo arquivo em `Documentacao/` deve seguir:

```markdown
# [Nome da API]

## Visão Geral
[1 parágrafo]

## Autenticação
[tipo, fluxo, escopo]

## Base URL
`https://api.exemplo.com/v1`

## Rate Limits
[limites por endpoint]

## Endpoints
| Método | Path | Descrição |
|--------|------|-----------|

## Erros
| Código | Significado | Ação |
|--------|-------------|------|

## Exemplos
[cURL + resposta]

## Changelog
- vX.Y.Z — data — descrição
```

---

## 7. Status Operacional

| Componente | Status |
|------------|--------|
| Catálogo de APIs | 🔄 Em construção |
| Coleções Postman | ⏳ Backlog |
| OpenAPI specs | ⏳ Backlog |
| Monitoramento | ⏳ Backlog |
| API pública Nexa | ⏳ Roadmap |

---

## 8. Fluxos Relacionados

- `/Automacoes/n8n/workflows/` — consumidores principais.
- `/Documentacao/Arquitetura/` — diagramas de fluxo.
- `/Dashboards/Operacional/` — monitoramento.

---

## 9. Convenções

- **Versionamento de API:** SemVer + path versionado (`/v1/`, `/v2/`).
- **Autenticação:** preferir OAuth2 quando disponível.
- **Erros:** seguir padrão RFC 7807 (Problem Details).
- **Dados sensíveis:** nunca em logs, sempre criptografados em trânsito.

---

## 10. Segurança

- Tokens nunca commitados no Git.
- Rotação documentada para credenciais críticas.
- Auditoria de acessos trimestral.
- LGPD compliant em todos os fluxos com PII.
