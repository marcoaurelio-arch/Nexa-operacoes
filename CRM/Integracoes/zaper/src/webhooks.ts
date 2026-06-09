import Fastify from "fastify";
import { ZaperWebhookEnvelope } from "./types.js";

const PORT = Number(process.env.PORT ?? 3000);

const app = Fastify({ logger: true });

/**
 * Webhook receiver pra Zaper / WTS Chat.
 *
 * Sem assinatura HMAC documentada — proteger via path secreto, allowlist
 * de IP ou mTLS.
 */
app.post("/webhooks/zaper", async (req, reply) => {
  const event = req.body as ZaperWebhookEnvelope;

  req.log.info(
    { eventType: event.eventType, date: event.date },
    "zaper event received",
  );

  switch (event.eventType) {
    // Contatos
    case "CONTACT_NEW":
    case "CONTACT_UPDATE":
    case "CONTACT_TAG_UPDATE":
      // TODO: sincronizar contato/tags no Nexa (Prospec-B2B)
      break;

    // Atendimentos / Sessões
    case "SESSION_NEW":
      // TODO: registrar novo atendimento; criar atividade na timeline do lead
      break;
    case "SESSION_UPDATE":
      break;
    case "SESSION_COMPLETE":
      // TODO: marcar atendimento como concluído; possível mudança de status no funil
      break;

    // Mensagens
    case "MESSAGE_RECEIVED":
      // TODO: criar atividade "mensagem recebida" na timeline + acionar IA/handoff
      break;
    case "MESSAGE_SENT":
    case "MESSAGE_UPDATED":
      // TODO: registrar status de envio
      break;

    // Pagamentos
    case "PAYMENT_NEW":
    case "PAYMENT_UPDATE":
      // TODO: refletir no módulo Comercial; criar atividade financeira
      break;

    // Painel (pipeline kanban) — bidirecional com Prospec-B2B.opportunities
    case "PANEL_CARD_NEW":
    case "PANEL_CARD_UPDATE":
      // TODO: upsert opportunity no Nexa
      break;
    case "PANEL_CARD_STEP_CHANGE":
      // TODO: mover opportunity de etapa no pipeline do Nexa
      break;
    case "PANEL_CARD_NOTE_NEW":
    case "PANEL_CARD_NOTE_UPDATE":
      // TODO: adicionar/atualizar nota na timeline da opportunity
      break;

    default:
      req.log.warn({ eventType: event.eventType }, "unknown event type");
  }

  return reply.code(200).send({ ok: true });
});

app.get("/health", async () => ({ ok: true }));

app.listen({ port: PORT, host: "0.0.0.0" }).catch((err) => {
  app.log.error(err);
  process.exit(1);
});
