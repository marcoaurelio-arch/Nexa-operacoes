import Fastify from "fastify";
import { createHmac, timingSafeEqual } from "node:crypto";
import { ZaperWebhookEvent } from "./types.js";

const PORT = Number(process.env.PORT ?? 3000);
const WEBHOOK_SECRET = process.env.ZAPER_WEBHOOK_SECRET ?? "";

const app = Fastify({ logger: true });

app.post("/webhooks/zaper", async (req, reply) => {
  if (WEBHOOK_SECRET && !verifySignature(req.headers, req.rawBody as string)) {
    return reply.code(401).send({ error: "invalid signature" });
  }

  const event = req.body as ZaperWebhookEvent;
  // TODO: rotear para o domínio Nexa
  // - message.received → criar/atualizar conversa
  // - message.sent     → registrar envio
  // - contact.created  → sincronizar com Prospec-B2B
  req.log.info({ type: event.type }, "zaper event received");

  return reply.code(200).send({ ok: true });
});

app.get("/health", async () => ({ ok: true }));

function verifySignature(
  headers: Record<string, unknown>,
  rawBody: string,
): boolean {
  // TODO: confirmar nome do header e algoritmo após doc da Zaper
  const sig = String(headers["x-zaper-signature"] ?? "");
  if (!sig || !rawBody) return false;
  const expected = createHmac("sha256", WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

app.listen({ port: PORT, host: "0.0.0.0" }).catch((err) => {
  app.log.error(err);
  process.exit(1);
});
