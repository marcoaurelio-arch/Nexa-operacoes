#!/usr/bin/env node
/**
 * Lista todas as assinaturas de webhook e oferece deletar as criadas
 * por nosso script de discovery (prefixo "Nexa Discovery").
 *
 * Uso:
 *   ZAPER_API_KEY=pn_... npx tsx src/scripts/cleanup-webhooks.ts            # dry-run
 *   ZAPER_API_KEY=pn_... npx tsx src/scripts/cleanup-webhooks.ts --execute  # deleta
 *   ZAPER_API_KEY=pn_... npx tsx src/scripts/cleanup-webhooks.ts --all      # deleta TODAS
 */

import { ZaperClient } from "../client.js";

const ZAPER_API_KEY = process.env.ZAPER_API_KEY;
if (!ZAPER_API_KEY) {
  console.error("ZAPER_API_KEY obrigatório");
  process.exit(1);
}

const argv = process.argv.slice(2);
const execute = argv.includes("--execute") || argv.includes("--all");
const all = argv.includes("--all");

async function main() {
  const zaper = new ZaperClient({ apiKey: ZAPER_API_KEY! });
  const subs = await zaper.listWebhookSubscriptions();

  const list = Array.isArray(subs)
    ? subs
    : (subs as { items: typeof subs }).items ?? [];

  console.log(`Encontradas ${list.length} assinaturas:\n`);
  for (const s of list) {
    const isOurs = s.name?.startsWith("Nexa Discovery");
    const marker = isOurs ? "🎯" : "  ";
    console.log(
      `  ${marker} ${(s as { id?: string }).id ?? "?"} | ${s.name} | ${s.url}`,
    );
  }

  const toDelete = all ? list : list.filter((s) => s.name?.startsWith("Nexa Discovery"));

  if (toDelete.length === 0) {
    console.log("\nNada para deletar.");
    return;
  }

  console.log(`\n${execute ? "🗑  Deletando" : "Seriam deletadas (--execute pra valer)"} ${toDelete.length}:`);
  for (const s of toDelete) {
    const id = (s as { id?: string }).id;
    if (!id) continue;
    if (execute) {
      try {
        await zaper.deleteWebhookSubscription(id);
        console.log(`   ✓ ${id} (${s.name})`);
      } catch (err) {
        console.log(`   ✗ ${id} — ${(err as Error).message}`);
      }
    } else {
      console.log(`   • ${id} (${s.name})`);
    }
  }
}

main().catch((err) => {
  console.error("Falhou:", err.message ?? err);
  process.exit(1);
});
