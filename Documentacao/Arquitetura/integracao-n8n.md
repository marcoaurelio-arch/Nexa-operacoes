---
titulo: Arquitetura n8n
versao: 1.0.0
data: 2026-05-16
tipo: arquitetura
---

# Arquitetura n8n — Hub de Orquestração

## 1. Estratégia de Deploy

- **Modalidade:** self-hosted em VPS dedicada (ex.: Hetzner, DigitalOcean, AWS)
- **Banco de dados:** PostgreSQL gerenciado
- **Cache:** Redis (para filas e webhooks)
- **HTTPS:** Let's Encrypt + Nginx reverse proxy
- **Backup:** snapshot diário + export semanal dos workflows

## 2. Ambientes

| Ambiente | URL | Função |
|----------|-----|--------|
| Produção | `n8n.nexamalls.com.br` | Workflows críticos |
| Homologação | `n8n-hml.nexamalls.com.br` | Testes pré-produção |
| Local | `localhost:5678` | Desenvolvimento |

## 3. Governança

- **Acesso ao painel:** SSO Google Workspace.
- **Acesso a credenciais:** apenas Owner Técnico.
- **Mudanças em produção:** via export → revisão → import (pipeline GitOps).
- **Auditoria de execuções:** retenção de 90 dias.

## 4. Convenções

### Nomenclatura de Workflow
`[area]-[verbo]-[objeto]-[modificador?]`

Exemplos:
- `comercial-qualifica-lead-whatsapp`
- `marketing-publica-post-linkedin`
- `dados-sincroniza-crm-sheets`

### Tags Padrão
- `comercial` | `marketing` | `operacional` | `ia` | `dados` | `experimentos`

### Status
- `🟢 producao`
- `🟡 homologacao`
- `🔵 desenvolvimento`
- `⚫ arquivado`

## 5. Padrão de Estrutura de Workflow

```
[Trigger]
   ↓
[Set / Validate input]
   ↓
[Main logic — pode ramificar]
   ↓
[Persist / Notify]
   ↓
[Log to Sheets/Notion]
   ↓
[Error handler ramo paralelo]
```

## 6. Observabilidade

- **Logs centralizados** em Google Sheets (`Logs-Automacoes`).
- **Alertas:** Slack `#alertas-n8n`.
- **Dashboard:** taxa de sucesso, latência, custo de LLM por workflow.

## 7. Backup e Disaster Recovery

- Export diário automático dos workflows para `/Automacoes/n8n/workflows/`.
- Snapshot VPS diário (retenção 30 dias).
- Procedimento de restauração documentado em `/Documentacao/Manuais/`.

## 8. Catálogo de Workflows

Ver `/Automacoes/n8n/workflows/`.
