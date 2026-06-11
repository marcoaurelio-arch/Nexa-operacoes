#!/usr/bin/env node
/**
 * Lê eventos capturados pelo webhook.site direto via API REST, sem precisar
 * abrir o dashboard. Polla a cada 3s e imprime payloads novos.
 *
 * Uso:
 *   npx tsx src/scripts/watch-webhook.ts <uuid>
 *   npx tsx src/scripts/watch-webhook.ts <uuid> --once    # uma leitura só
 */

const uuid = process.argv[2];
const once = process.argv.includes("--once");

if (!uuid || uuid.startsWith("--")) {
  console.error("Uso: npx tsx src/scripts/watch-webhook.ts <uuid> [--once]");
  console.error("");
  console.error("Pega o UUID na URL do webhook.site:");
  console.error("  https://webhook.site/<uuid>");
  process.exit(1);
}

const API = `https://webhook.site/token/${uuid}/requests?sorting=newest`;
const seen = new Set<string>();

interface WebhookRequest {
  uuid: string;
  created_at: string;
  method: string;
  url: string;
  content: string;
  headers: Record<string, string[]>;
}

interface ApiResponse {
  data: WebhookRequest[];
  total: number;
}

async function fetchEvents(): Promise<WebhookRequest[]> {
  const res = await fetch(API);
  if (!res.ok) {
    throw new Error(`webhook.site ${res.status}: ${await res.text()}`);
  }
  const body = (await res.json()) as ApiResponse;
  return body.data;
}

function printEvent(r: WebhookRequest, index: number) {
  console.log(`\n${"=".repeat(72)}`);
  console.log(`[${index}] ${r.method} ${r.created_at}`);
  console.log("=".repeat(72));
  try {
    const body = JSON.parse(r.content);
    console.log(JSON.stringify(body, null, 2));
  } catch {
    console.log(r.content);
  }
}

async function main() {
  console.log(`Lendo eventos de https://webhook.site/${uuid}\n`);

  if (once) {
    const events = await fetchEvents();
    if (events.length === 0) {
      console.log("(nenhum evento ainda)");
      return;
    }
    events.reverse().forEach((e, i) => printEvent(e, i + 1));
    console.log(`\n${"=".repeat(72)}`);
    console.log(`Total: ${events.length} evento(s)`);
    return;
  }

  // Modo watch (polling)
  let counter = 0;
  console.log("Modo watch — Ctrl+C pra sair. Dispare eventos no WhatsApp/Zaper.\n");
  while (true) {
    try {
      const events = await fetchEvents();
      for (const e of events.reverse()) {
        if (seen.has(e.uuid)) continue;
        seen.add(e.uuid);
        counter++;
        printEvent(e, counter);
      }
    } catch (err) {
      console.error("Erro no polling:", (err as Error).message);
    }
    await new Promise((r) => setTimeout(r, 3000));
  }
}

main().catch((err) => {
  console.error("Falhou:", err.message ?? err);
  process.exit(1);
});
