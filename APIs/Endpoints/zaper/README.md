# Zaper Chat — Specs da API

Espelho da documentação oficial do Zaper Chat (`api.app.zaperchat.com`), extraída do painel.

> **A preencher.** A doc da Zaper não é pública. Cole aqui as seções tiradas de **Painel Zaper → Integrações → API / Webhooks / Desenvolvedores**.

## Autenticação

- Base URL: `https://api.app.zaperchat.com`
- Header de auth: _(confirmar — Bearer? X-API-Key?)_
- Chave: variável `ZAPER_API_KEY` (não commitar)

## Endpoints

### Contatos

| Método | Path | Descrição |
|--------|------|-----------|
| GET    | _TODO_ | Listar contatos |
| POST   | _TODO_ | Criar contato |
| PATCH  | _TODO_ | Atualizar contato |

**Schema (request/response):** _colar aqui_

### Mensagens

| Método | Path | Descrição |
|--------|------|-----------|
| POST   | _TODO_ | Enviar mensagem WhatsApp |
| GET    | _TODO_ | Histórico por contato |

### Pipelines / Funil

_(se existir esse conceito no Zaper — confirmar)_

### Webhooks

Eventos disponíveis (a confirmar):

- `message.received`
- `message.sent`
- `contact.created`
- `contact.updated`

**Formato do payload:** _colar exemplo aqui_
**Assinatura:** _header e algoritmo (provavelmente `X-Zaper-Signature` + HMAC-SHA256)_

## Postman / OpenAPI

- `openapi.yaml` — _a gerar_
- `postman_collection.json` — _a gerar_
