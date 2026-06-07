# Integração Zaper Chat

Integração bidirecional entre **Nexa** e **Zaper Chat** (CRM master via WhatsApp).

> Status: **esqueleto** — cliente HTTP, tipos e estrutura prontos. Endpoints e schemas serão preenchidos a partir da documentação oficial extraída do painel Zaper (Integrações / API / Webhooks).

## Arquitetura

- **Zaper** = fonte da verdade de contatos, conversas e relacionamento.
- **Prospec-B2B / Nexa** = prospecção, scoring e enriquecimento; empurra leads pro Zaper.
- Fluxo:
  - `Nexa → Zaper`: criar/atualizar contato, disparar mensagem, mover deal de pipeline.
  - `Zaper → Nexa`: webhooks de mensagens recebidas, mudança de status, novo contato.

## Configuração

Crie um arquivo `.env` (NÃO commitar — já está no `.gitignore`):

```bash
ZAPER_API_KEY=cole_aqui_sua_chave           # pega no painel Zaper → Integrações → API
ZAPER_API_BASE_URL=https://api.app.zaperchat.com
ZAPER_WEBHOOK_SECRET=                       # se Zaper assinar webhooks com HMAC
PORT=3000                                   # porta do webhook handler
```

A chave nunca deve ir pro repositório. Se vazar, rotacione no painel Zaper imediatamente.

## Uso

```bash
npm install
npm run build
npm run dev          # webhook server em modo watch
npm test
```

```ts
import { ZaperClient } from "./src";

const zaper = new ZaperClient({
  apiKey: process.env.ZAPER_API_KEY!,
  baseUrl: process.env.ZAPER_API_BASE_URL!,
});

// endpoints preenchidos após mapeamento da doc oficial
```

## Estrutura

```
CRM/Integracoes/zaper/
├── src/
│   ├── client.ts      # HTTP client genérico com auth + retry
│   ├── types.ts       # tipos do domínio (Contact, Message, Webhook payloads)
│   ├── webhooks.ts    # handler HTTP + verificação de assinatura
│   └── index.ts       # exports
├── package.json
├── tsconfig.json
└── README.md

APIs/Endpoints/zaper/  # specs OpenAPI + Postman (em outro diretório)
```

## Próximos passos

1. Você puxa do painel Zaper:
   - Lista de endpoints (auth, contacts, messages, webhooks, pipelines).
   - Schema de cada payload (request + response).
   - Eventos de webhook disponíveis e formato.
2. Cola aqui no chat ou em `APIs/Endpoints/zaper/README.md`.
3. Implemento os métodos do cliente (`contacts.ts`, `messages.ts` etc.) e tipagem forte.
4. Webhook handler valida assinatura e roteia eventos pro Nexa.
