# Zaper / WTS Chat — Specs da API

Doc oficial: https://flwchat.readme.io/ (login obrigatório)
Base URL: **`https://api.wts.chat`** (não é `api.app.zaperchat.com`)

> Zaper Chat = WTS Chat = FLW Chat (mesma API).

## Autenticação

```http
Authorization: Bearer <ZAPER_API_KEY>
Content-Type: application/json
```

Token permanente — gerar em **Ajustes → Integrações → API**.

## Estrutura modular

Não há `/v1` global. Cada módulo tem seu prefixo e versionamento:

- `/core/v1/...` — contatos, webhooks, configurações
- `/core/v2/...` — endpoints novos (atualizar contato por id)
- `/chat/v1/...` — envio e gestão de mensagens
- `/crm/...` — (a explorar)

## Contatos

| Método | Path | Descrição |
|--------|------|-----------|
| POST   | `/core/v1/contact` | Criar contato |
| GET    | `/core/v1/contact/phonenumber/{phone}` | Buscar por telefone (E.164 com `+`) |
| GET    | `/core/v2/contact/{id}` | Buscar por ID |
| PUT    | `/core/v1/contact/phonenumber/{phone}` | Atualizar por telefone (com `fields`-mask) |
| PUT    | `/core/v2/contact/{id}` | Atualizar por ID |

**Body POST `/core/v1/contact`:**
```json
{
  "name": "João da Silva",
  "phoneNumber": "+5534999999999",
  "email": "joao@email.com",
  "instagram": "joaosilva",
  "annotation": "Lead vindo do CRM",
  "tagNames": ["Lead", "CRM"],
  "portfolioNames": ["Comercial"],
  "customFields": { "origem": "crm", "interesse": "agente_ia" },
  "metadata": { "crmId": "12345", "origemIntegracao": "meu-crm" }
}
```

**Body PUT (fields-mask):**
```json
{
  "fields": ["name", "email", "metadata", "tagNames"],
  "name": "João Atualizado",
  "email": "joao.novo@email.com",
  "tagNames": ["Lead Qualificado"],
  "metadata": { "crmId": "12345", "statusCRM": "qualificado" }
}
```

- `tagIds` tem precedência sobre `tagNames`.
- Aceita também `portfolioIds`/`portfolioNames`, `sequenceIds`, `customFields`, `metadata`.

## Mensagens — envio direto

Todos retornam HTTP 200 em sucesso. Status detalhado em `GET /chat/v1/message/{id}/status`.

| Método | Path | Tipo |
|--------|------|------|
| POST   | `/chat/v1/send/text` | Texto |
| POST   | `/chat/v1/send/image` | Imagem |
| POST   | `/chat/v1/send/audio` | Áudio |
| POST   | `/chat/v1/send/video` | Vídeo |
| POST   | `/chat/v1/send/document` | Documento |
| POST   | `/chat/v1/send/template` | Template (HSM) |
| POST   | `/chat/v1/message/send` | Genérico (segue regras do canal, auto-cria contato) |
| GET    | `/chat/v1/message/{id}/status` | Consultar status |

**Body texto:**
```json
{
  "to": "+5534999999999",
  "from": "+5534888888888",
  "text": "Olá!",
  "sessionId": "uuid-opcional",
  "delayTyping": 3,
  "callbackUrl": "https://...",
  "senderId": "msg-12345"
}
```

**Body mídia (image/audio/video/document):**
```json
{
  "to": "+5534999999999",
  "from": "+5534888888888",
  "fileIdOrUrl": "https://.../arquivo.pdf",
  "sessionId": "uuid-opcional",
  "callbackUrl": "https://...",
  "senderId": "doc-12345"
}
```

`fileIdOrUrl`: URL pública OU ID de arquivo previamente uploadado.

**Body template:**
```json
{
  "to": "+5534999999999",
  "from": "+5534888888888",
  "templateId": "tpl_abc",
  "parameters": { "nome": "João", "data": "10/06/2026" },
  "fileIdOrUrl": "https://.../imagem.pdf",
  "callbackUrl": "https://...",
  "sessionId": "uuid-opcional",
  "senderId": "template-12345",
  "sessionMetadata": { "crmId": "12345", "origem": "crm" }
}
```

**Body `/chat/v1/message/send` (genérico):**
```json
{
  "from": "+5534888888888",
  "to": "+5534999999999",
  "body": { "text": "Olá!" },
  "options": { "senderId": "msg-12345" }
}
```

## Webhooks

### Gerenciamento

| Método | Path | Descrição |
|--------|------|-----------|
| GET    | `/core/v1/webhook/event` | **Lista oficial de eventos** disponíveis |
| GET    | `/core/v1/webhook/subscription` | Listar assinaturas |
| POST   | `/core/v1/webhook/subscription` | Criar assinatura |

**Body criar assinatura:**
```json
{
  "name": "Integração CRM",
  "url": "https://seudominio.com/webhooks/flw",
  "enabled": true,
  "events": ["CONTACT_UPDATE", "MESSAGE_RECEIVED"]
}
```

### Envelope padrão de TODO webhook

```json
{
  "eventType": "NOME_DO_EVENTO",
  "date": "2026-06-07T18:42:35.4359934Z",
  "content": { /* específico do evento */ }
}
```

**Exemplo — `CONTACT_UPDATE`:**
```json
{
  "eventType": "CONTACT_UPDATE",
  "date": "2026-06-07T16:42:35.4359934Z",
  "content": {
    "id": "ed2b52f8-cf13-449b-b3d5-ae27051f4663",
    "createdAt": "...",
    "updatedAt": "...",
    "companyId": "...",
    "name": "John Raymond Legrasse",
    "phonenumber": "+55|00000000000",
    "phonenumberFormatted": "(00) 00000-0000",
    "email": "email@example.com",
    "instagram": null,
    "annotation": "",
    "tagsId": [],
    "tags": [],
    "status": "ACTIVE",
    "origin": "CREATED_FROM_HUB",
    "utm": null,
    "customFieldValues": {},
    "metadata": null
  }
}
```

### Assinatura criptográfica

**Não documentada.** A doc atual descreve apenas:
- POST + `application/json`
- Envelope `eventType` / `date` / `content`

**Estratégias de segurança recomendadas** até a Zaper publicar HMAC:
- URL com segredo aleatório no path (`/webhooks/zaper/<random32>`)
- Allowlist de IPs (pedir range pro suporte Zaper)
- mTLS no balancer

### Eventos oficiais (16 no total — confirmados via `GET /core/v1/webhook/event`)

Schema do descriptor: `{ event: string, description: string }`

| Módulo | Evento | Descrição |
|--------|--------|-----------|
| Atendimentos | `SESSION_NEW` | Atendimento criado |
| Atendimentos | `SESSION_UPDATE` | Atendimento alterado |
| Atendimentos | `SESSION_COMPLETE` | Atendimento concluído |
| Mensagens | `MESSAGE_RECEIVED` | Mensagem recebida |
| Mensagens | `MESSAGE_SENT` | Mensagem enviada |
| Mensagens | `MESSAGE_UPDATED` | Mensagem atualizada |
| Contatos | `CONTACT_NEW` | Contato criado |
| Contatos | `CONTACT_UPDATE` | Contato alterado |
| Contatos | `CONTACT_TAG_UPDATE` | Etiqueta do contato alterada |
| Pagamentos | `PAYMENT_NEW` | Pagamento criado |
| Pagamentos | `PAYMENT_UPDATE` | Pagamento alterado |
| Painel | `PANEL_CARD_NEW` | Card criado |
| Painel | `PANEL_CARD_UPDATE` | Card alterado |
| Painel | `PANEL_CARD_STEP_CHANGE` | Card movido de etapa |
| Painel | `PANEL_CARD_NOTE_NEW` | Anotação criada |
| Painel | `PANEL_CARD_NOTE_UPDATE` | Anotação alterada |

> **Para o Nexa, os mais relevantes** são: `CONTACT_*`, `MESSAGE_*`, `PANEL_CARD_*` (sincronizam com `lead`, `lead_contacts`, `activities` e `opportunities` do Prospec-B2B).

## Endpoints adicionais descobertos (via probe)

### Confirmados (200 OK)

| Método | Path | Descrição |
|--------|------|-----------|
| GET    | `/crm/v1/panel` | Listar painéis (kanban) |
| GET    | `/chat/v1/session` | Listar atendimentos |
| GET    | `/chat/v1/template` | Listar templates HSM |
| GET    | `/chat/v1/message` | Listar mensagens (com filtros) |
| GET    | `/core/v1/tag` | Listar tags (**array direto, sem paginação**) |
| GET    | `/core/v1/portfolio` | Listar portfolios |

### Existem mas exigem outro escopo de token (401/403)

| Path | Provável uso |
|------|--------------|
| `/crm/v1/contact` | CRM dedicado (separado de `/core/v1/contact`?) |
| `/crm/v1/deal` | Deals/oportunidades |
| `/crm/v1/opportunity` | Idem |
| `/core/v1/channel` | Canais cadastrados (números WhatsApp) |
| `/core/v1/customfield` | Campos customizados |
| `/core/v1/template` | Templates (core, diferente do `/chat/v1/template`) |
| `/core/v1/user`, `/core/v1/me`, `/core/v1/company` | Identidade |
| `/chat/v1/conversation`, `/chat/v1/chat` | Conversa (sinônimo de sessão?) |
| `/chat/v1/file` | Upload/listagem de arquivos |
| `/core/v1/panel`, `/core/v2/panel`, `/core/v1/board`, `/core/v1/kanban`, `/core/v1/pipeline`, `/core/v1/card` | Aliases do Painel (CRM é o caminho oficial) |

### Paginação padrão

```json
{
  "items": [...],
  "totalItems": 0,
  "totalPages": 0,
  "hasMorePages": false,
  "pageNumber": 1,
  "pageSize": 15,
  "orderBy": "createdat",
  "orderDirection": "desc"
}
```

Query params suportados: `pageNumber`, `pageSize`, `orderBy`, `orderDirection`.

**Exceção:** `/core/v1/tag` retorna array direto, sem envelope.

## Pontos em aberto (a validar com chamada real)

- Schema exato dos responses de criar/atualizar contato (HTTP 200, body não documentado fora do "Try It").
- Schema dos responses de envio de mensagem (id retornado? envelope?).
- ~~Lista completa de eventos via `/core/v1/webhook/event`~~ ✅ confirmada (16 eventos, ver tabela acima).
- Schema do `content` dos webhooks de **Sessões**, **Pagamentos** e **Painel** (só `CONTACT_UPDATE` tem exemplo na doc).
- Endpoints `/crm/...` — não cobertos na doc consultada.
- Módulo **Pagamentos** — não documentado nos endpoints REST; investigar.
- Módulo **Painel (kanban)** — endpoints REST pra criar/mover cards via API: a explorar.

## Formato de erro

Em falha, a API retorna envelope:

```json
{
  "id": { "value": "uuid", "shortValue": "uuid8" },
  "httpStatusCode": 401,
  "version": null,
  "environment": null,
  "error": true,
  "date": "2026-06-09T01:29:43.858661Z",
  "key": "ERROR_UNAUTHORIZED",
  "text": "Acesso negado",
  "isUnsolvableError": false
}
```

`key` é estável (string-enum-like); `text` é mensagem traduzida. Recomenda-se rotear erros pelo `key`.
