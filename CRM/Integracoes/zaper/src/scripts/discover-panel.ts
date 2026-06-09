#!/usr/bin/env node
/**
 * Descoberta profunda dos módulos Painel e Sessão.
 *
 * Pega 1 painel e 1 sessão reais e tenta paths aninhados pra mapear:
 *  - cards, steps, notes dentro do painel
 *  - mensagens dentro da sessão
 *
 * Uso:
 *   ZAPER_API_KEY=pn_... npx tsx src/scripts/discover-panel.ts
 */

import { ZaperClient } from "../client.js";

const BASE = "https://api.wts.chat";
const TOKEN = process.env.ZAPER_API_KEY;

if (!TOKEN) {
  console.error("ZAPER_API_KEY obrigatório");
  process.exit(1);
}

async function probe(
  method: "GET",
  path: string,
): Promise<{ status: number; preview: string; ms: number }> {
  const t0 = Date.now();
  try {
    const res = await fetch(`${BASE}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(8000),
    });
    const text = await res.text();
    return {
      status: res.status,
      preview: text.slice(0, 250),
      ms: Date.now() - t0,
    };
  } catch (err) {
    return { status: 0, preview: (err as Error).message, ms: Date.now() - t0 };
  }
}

function tag(status: number): string {
  if (status === 200) return "✅ 200";
  if (status === 401 || status === 403) return "🔒 auth";
  if (status === 404) return "❌ 404";
  if (status === 405) return "⚠️ 405";
  if (status === 400) return "⚠️ 400";
  return `?? ${status}`;
}

async function main() {
  const zaper = new ZaperClient({ apiKey: TOKEN! });

  // --- Painel ---
  console.log("=== Descoberta: Painel ===\n");
  const panels = await zaper.listPanels({ pageSize: 1 });
  const panelId = panels.items[0]?.id;
  if (!panelId) {
    console.log("Nenhum painel encontrado — pulando descoberta de cards.");
  } else {
    console.log(`Painel base: ${panelId}\n`);

    const panelPaths = [
      `/crm/v1/panel/${panelId}`,
      `/crm/v1/panel/${panelId}/card`,
      `/crm/v1/panel/${panelId}/cards`,
      `/crm/v1/panel/${panelId}/step`,
      `/crm/v1/panel/${panelId}/steps`,
      `/crm/v1/panel/${panelId}/stage`,
      `/crm/v1/panel/${panelId}/column`,
      `/crm/v1/panel/${panelId}/note`,
      `/crm/v1/panel/${panelId}/notes`,
      `/crm/v1/card?panelId=${panelId}`,
      `/crm/v1/step?panelId=${panelId}`,
    ];
    for (const path of panelPaths) {
      const r = await probe("GET", path);
      console.log(`  ${tag(r.status).padEnd(10)} ${path.padEnd(60)} ${r.ms}ms`);
      if (r.status === 200) console.log(`     ${r.preview.slice(0, 200)}`);
    }
  }

  // --- Sessão ---
  console.log("\n=== Descoberta: Sessão / Atendimento ===\n");
  const sessions = await zaper.listSessions({ pageSize: 1 });
  const sessionId = sessions.items[0]?.id;
  if (!sessionId) {
    console.log("Nenhuma sessão encontrada — pulando descoberta.");
  } else {
    console.log(`Sessão base: ${sessionId}\n`);

    const sessionPaths = [
      `/chat/v1/session/${sessionId}`,
      `/chat/v1/session/${sessionId}/message`,
      `/chat/v1/session/${sessionId}/messages`,
      `/chat/v1/message?sessionId=${sessionId}`,
      `/chat/v1/session/${sessionId}/complete`,
      `/chat/v1/session/${sessionId}/note`,
      `/chat/v1/session/${sessionId}/transfer`,
    ];
    for (const path of sessionPaths) {
      const r = await probe("GET", path);
      console.log(`  ${tag(r.status).padEnd(10)} ${path.padEnd(60)} ${r.ms}ms`);
      if (r.status === 200) console.log(`     ${r.preview.slice(0, 200)}`);
    }
  }

  // --- Whoami / Company ---
  console.log("\n=== Identidade ===\n");
  for (const path of [
    "/core/v1/me",
    "/core/v1/user/me",
    "/core/v1/company",
    "/core/v1/company/me",
  ]) {
    const r = await probe("GET", path);
    console.log(`  ${tag(r.status).padEnd(10)} ${path.padEnd(60)} ${r.ms}ms`);
    if (r.status === 200) console.log(`     ${r.preview.slice(0, 200)}`);
  }

  // --- CRM/v1 estrutura ---
  console.log("\n=== CRM v1 (drill) ===\n");
  for (const path of [
    "/crm/v1/contact?pageSize=1",
    "/crm/v1/deal?pageSize=1",
    "/crm/v1/opportunity?pageSize=1",
  ]) {
    const r = await probe("GET", path);
    console.log(`  ${tag(r.status).padEnd(10)} ${path.padEnd(60)} ${r.ms}ms`);
    if (r.status === 200) console.log(`     ${r.preview.slice(0, 200)}`);
  }
}

main().catch((err) => {
  console.error("Falhou:", err);
  process.exit(1);
});
