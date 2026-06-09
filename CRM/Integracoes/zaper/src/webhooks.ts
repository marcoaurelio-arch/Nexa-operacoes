import Fastify from "fastify";
import { ZaperWebhookEnvelope } from "./types.js";

const PORT = Number(process.env.PORT ?? 3000);

const app = Fastify({ logger: true });

/**
 * Endpoint pra receber webhooks da Zaper (WTS Chat).
 *
 * Doc oficial NÃO descreve assinatura criptográfica (HMAC) — se a Zaper
 * adicionar isso depois, plugar verificação aqui. Por enquanto, recomenda-se
 * proteger o endpoint via:
 *  - URL com path secreto (ex: /webhooks/zaper/<random>)
 *  - allowlist de IP de origem da Zaper
 *  - mTLS no balancer
 */
app.post("/webhooks/zaper", async (req, reply) => {
  const event = req.body as ZaperWebhookEnvelope;

  req.log.info(
    { eventType: event.eventType, date: event.date },
    "zaper event received",
  );

  switch (event.eventType) {
    case "CONTACT_UPDATE":
    case "CONTACT_CREATE":
      // TODO: sincronizar contato no Nexa
      break;
    case "MESSAGE_RECEIVED":
      // TODO: criar/atualizar conversa, acionar bot/handoff
      break;
    case "MESSAGE_SENT":
    case "MESSAGE_STATUS":
      // TODO: registrar status de envio
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
