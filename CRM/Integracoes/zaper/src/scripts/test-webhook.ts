#!/usr/bin/env node
/**
 * Cria uma assinatura de webhook na Zaper apontando pra uma URL
 * descartável do webhook.site, pra capturar payloads reais de TODOS
 * os 16 eventos.
 *
 * Fluxo:
 *  1. Cria token no webhook.site (URL única descartável)
 *  2. Lista eventos disponíveis na Zaper
 *  3. Cria subscription apontando pra essa URL
 *  4. Imprime URL pra você abrir no navegador e ver os eventos chegando
 *
 * Cleanup com `npm run webhooks:cleanup` quando terminar.
 *
 * Uso:
 *   ZAPER_API_KEY=pn_... npx tsx src/scripts/test-webhook.ts
 *   ZAPER_API_KEY=pn_... npx tsx src/scripts/test-webhook.ts --events MESSAGE_RECEIVED,CONTACT_NEW
 */

import { ZaperClient } from "../client.js";

const ZAPER_API_KEY = process.env.ZAPER_API_KEY;
if (!ZAPER_API_KEY) {
  console.error("ZAPER_API_KEY obrigatório");
  process.exit(1);
}

const argv = process.argv.slice(2);
const evtIdx = argv.indexOf("--events");
const filterEvents =
  evtIdx >= 0 ? argv[evtIdx + 1]?.split(",").map((s) => s.trim()) : null;

async function createWebhookSiteUrl(): Promise<{
  uuid: string;
  url: string;
  viewer: string;
}> {
  const res = await fetch("https://webhook.site/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      default_status: 200,
      default_content: '{"ok":true}',
      default_content_type: "application/json",
      cors: true,
    }),
  });
  if (!res.ok) {
    throw new Error(
      `webhook.site falhou: ${res.status} ${res.statusText} — ${await res.text()}`,
    );
  }
  const data = (await res.json()) as { uuid: string };
  return {
    uuid: data.uuid,
    url: `https://webhook.site/${data.uuid}`,
    viewer: `https://webhook.site/#!/view/${data.uuid}`,
  };
}

async function main() {
  console.log("⚙️  Criando URL descartável no webhook.site...");
  const wh = await createWebhookSiteUrl();
  console.log(`   URL:        ${wh.url}`);
  console.log(`   Dashboard:  ${wh.viewer}\n`);

  const zaper = new ZaperClient({ apiKey: ZAPER_API_KEY! });

  console.log("⚙️  Listando eventos disponíveis na Zaper...");
  const events = await zaper.listWebhookEvents();
  let eventNames = events.map((e) => e.event);
  if (filterEvents) {
    eventNames = eventNames.filter((e) => filterEvents.includes(e));
    if (eventNames.length === 0) {
      console.error(
        `Nenhum evento bate com --events. Disponíveis: ${events.map((e) => e.event).join(", ")}`,
      );
      process.exit(1);
    }
  }
  console.log(`   ${eventNames.length} eventos selecionados.\n`);

  const subName = `Nexa Discovery ${new Date().toISOString().slice(0, 19)}`;
  console.log(`⚙️  Criando assinatura "${subName}"...`);
  const sub = await zaper.createWebhookSubscription({
    name: subName,
    url: wh.url,
    enabled: true,
    events: eventNames,
  });
  console.log(`   ID: ${(sub as { id?: string }).id ?? "(sem id no response)"}\n`);

  console.log("✅ Pronto. Próximos passos:");
  console.log(`   1. Abra ${wh.viewer} no navegador`);
  console.log(`   2. No WhatsApp conectado à Zaper:`);
  console.log(`      - envie uma mensagem PRA o número (gera MESSAGE_RECEIVED)`);
  console.log(`      - responda no painel (gera MESSAGE_SENT, SESSION_*)`);
  console.log(`      - crie/edite um contato (CONTACT_*)`);
  console.log(`      - mova um card no painel (PANEL_CARD_STEP_CHANGE)`);
  console.log(`   3. Veja os payloads em tempo real no dashboard`);
  console.log(`   4. Cole o JSON aqui pra tipagem correta dos eventos`);
  console.log(`\n🧹 Pra limpar depois:`);
  console.log(`   ZAPER_API_KEY=$ZAPER_API_KEY npm run webhooks:cleanup`);
}

main().catch((err) => {
  console.error("Falhou:", err.message ?? err);
  if (err.body) console.error("Body:", err.body);
  process.exit(1);
});
