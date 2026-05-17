# WhatsApp Business API — Integração Nexa

## Visão Geral

A Nexa Malls usa a **WhatsApp Business API** (provedor oficial) para:
- Captura de leads inbound (comercial)
- Envio de comunicados a lojistas (gestão de ativos)
- Cobranças amigáveis (financeiro)
- Notificações operacionais

## Provedor e Modelo

- **Provedor:** _(definir: Meta Cloud API, 360dialog, Twilio, etc.)_
- **Conta certificada:** sim
- **Templates aprovados:** ver `templates-aprovados.md`

## Templates Operacionais

| Nome do Template | Idioma | Categoria | Aprovado | Workflow consumidor |
|------------------|--------|-----------|----------|---------------------|
| `boas_vindas_lead` | pt_BR | UTILITY | ⏳ | comercial-qualifica-lead-whatsapp |
| `qualificacao_lojista` | pt_BR | MARKETING | ⏳ | comercial-qualifica-lead-whatsapp |
| `qualificacao_investidor` | pt_BR | MARKETING | ⏳ | comercial-qualifica-lead-whatsapp |
| `comunicado_lojista` | pt_BR | UTILITY | ⏳ | gestao-comunica-lojista |
| `cobranca_amigavel` | pt_BR | UTILITY | ⏳ | financeiro-cobranca |

## Webhooks

| Path | Origem | Destino n8n |
|------|--------|-------------|
| `/webhooks/whatsapp/inbound` | Mensagens recebidas | comercial-qualifica-lead-whatsapp |
| `/webhooks/whatsapp/status` | Status de envio | dados-log-whatsapp |

## Compliance

- Opt-in explícito antes de qualquer comunicação marketing.
- Opt-out respeitado em até 24h.
- Logs preservados por 5 anos (LGPD).
- Templates aprovados pela Meta antes de uso.

## Limites e Custos

- **Janela de 24h:** mensagens livres apenas dentro de 24h da última mensagem do cliente.
- **Templates:** obrigatórios fora da janela de 24h.
- **Custo:** variável por conversação iniciada (consultar provedor).

## Plano de Contingência

Em caso de falha do provedor:
1. Acionar provedor secundário (se contratado).
2. Comunicar time comercial via Slack.
3. SDRs assumem WhatsApp manual.
