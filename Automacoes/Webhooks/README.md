# Webhooks — Catálogo Institucional

## Visão Geral

Webhooks são os pontos de entrada de eventos externos no ecossistema Nexa. Todos seguem padrão único de path, autenticação e logging.

## Catálogo

| Path | Origem | Destino | Auth | Workflow consumidor |
|------|--------|---------|------|---------------------|
| `/webhooks/comercial/novo-lead` | Site institucional | n8n | HMAC | comercial-recebe-lead-site |
| `/webhooks/whatsapp/inbound` | WhatsApp Business API | n8n | Signature | comercial-qualifica-lead-whatsapp |
| `/webhooks/whatsapp/status` | WhatsApp Business API | n8n | Signature | dados-log-whatsapp |
| `/webhooks/crm/oportunidade-criada` | CRM | n8n | Bearer | comercial-aciona-cadencia |
| `/webhooks/assinatura/contrato-assinado` | DocuSign/Clicksign | n8n | HMAC | comercial-pos-assinatura |
| `/webhooks/marketing/lead-form` | LinkedIn / Meta Ads | n8n | Bearer | marketing-recebe-lead-mkt |

## Padrão de Path

`/webhooks/[area]/[evento]`

- `area`: `comercial | marketing | financeiro | operacional | crm | whatsapp | assinatura`
- `evento`: kebab-case descritivo

## Autenticação

| Mecanismo | Quando usar |
|-----------|-------------|
| HMAC (SHA-256) | Provedores que enviam assinatura no header |
| Signature | WhatsApp Business API (padrão Meta) |
| Bearer Token | APIs que aceitam header `Authorization` |
| IP allowlist | Provedores com IPs fixos |

## Padrão de Resposta

| Status | Significado |
|--------|-------------|
| 200 | Recebido e enfileirado |
| 202 | Aceito (processamento assíncrono) |
| 400 | Payload inválido |
| 401 | Autenticação inválida |
| 429 | Rate limit excedido |
| 500 | Erro interno (registrar e alertar) |

## Logging Obrigatório

Toda chamada de webhook registra:
- Timestamp
- Path
- Headers (sem segredos)
- Body (mascarado se sensível)
- Status retornado
- Tempo de processamento

## Plano de Disaster Recovery

- **Fila persistente** entre webhook e processamento.
- **Reprocessamento** manual via painel n8n.
- **Alerta** em Slack se taxa de erro > 1% em 5 minutos.
