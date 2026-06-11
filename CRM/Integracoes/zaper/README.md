# Integração Zaper Chat (WTS Chat)

Integração bidirecional entre **Nexa** e **Zaper / WTS Chat** (CRM master via WhatsApp).

> **Identidade da plataforma:** Zaper Chat = WTS Chat = FLW Chat (mesma API, rebrandings).
> **API base oficial:** `https://api.wts.chat`
> **Doc oficial:** https://flwchat.readme.io/ (login obrigatório)

## Arquitetura

- **Zaper** = fonte da verdade de contatos, conversas e relacionamento.
- **Prospec-B2B / Nexa** = prospecção, scoring e enriquecimento; empurra leads pro Zaper.
- Fluxo:
  - `Nexa → Zaper`: criar/atualizar contato, disparar mensagem (texto/mídia/template).
  - `Zaper → Nexa`: webhooks (`CONTACT_UPDATE`, `MESSAGE_RECEIVED`, `MESSAGE_STATUS`, etc).

## Configuração

```bash
# .env (NÃO commitar — já está no .gitignore)
ZAPER_API_KEY=pn_...                     # token permanente; gerar em Ajustes → API
ZAPER_API_BASE_URL=https://api.wts.chat  # default; pode omitir
PORT=3000                                # porta do webhook handler
```

A chave nunca deve ir pro repositório. Se vazar, rotacione no painel imediatamente.

## Uso

```bash
npm install
npm run build
npm run dev          # webhook server em modo watch
npm test
```

```ts
import { ZaperClient } from "./src";

const zaper = new ZaperClient({ apiKey: process.env.ZAPER_API_KEY! });

// Contatos
const contact = await zaper.createContact({
  name: "João da Silva",
  phoneNumber: "+5534999999999",
  tagNames: ["Lead", "Nexa"],
  customFields: { origem: "prospec-b2b" },
});

await zaper.updateContactByPhone("+5534999999999", {
  fields: ["tagNames", "metadata"],
  tagNames: ["Lead Qualificado"],
  metadata: { score: 87 },
});

// Mensagens
await zaper.sendText({
  to: "+5534999999999",
  from: "+5534888888888",   // canal cadastrado
  text: "Olá! Vim do Nexa.",
  delayTyping: 3,
});

// Template (HSM/WhatsApp)
await zaper.sendTemplate({
  to: "+5534999999999",
  from: "+5534888888888",
  templateId: "tpl_abc",
  parameters: { nome: "João" },
});

// Webhooks
const events = await zaper.listWebhookEvents();
await zaper.createWebhookSubscription({
  name: "Nexa CRM",
  url: "https://nexa.com.br/webhooks/zaper",
  enabled: true,
  events: ["CONTACT_UPDATE", "MESSAGE_RECEIVED"],
});
```

## Endpoints implementados

Veja `APIs/Endpoints/zaper/README.md` pro mapeamento completo.

### Resumo
- `/core/v1/contact` — criar, ler, atualizar (por telefone e por id na v2)
- `/chat/v1/send/text|image|audio|video|document|template` — envio direto
- `/chat/v1/message/send` — envio com regras de canal (auto-cria contato)
- `/chat/v1/message/{id}/status` — consulta status
- `/core/v1/webhook/event` — listar eventos disponíveis
- `/core/v1/webhook/subscription` — gerenciar assinaturas

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

1. **Descobrir os nomes exatos dos eventos** via `GET /core/v1/webhook/event` (a doc lista o envelope mas não enumera todos os eventos publicamente).
2. **Capturar payloads reais** de `MESSAGE_RECEIVED` e `MESSAGE_SENT` apontando um webhook de homologação.
3. **Sincronizar com Prospec-B2B** — quando criar/atualizar lead no Nexa, fazer `upsert` via `updateContactByPhone` ou `createContact`.
4. **Definir o `from`** — número do canal cadastrado na Zaper que será usado em todos os envios.
