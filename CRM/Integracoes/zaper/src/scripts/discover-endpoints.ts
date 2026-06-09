#!/usr/bin/env node
/**
 * Descoberta de endpoints REST da Zaper / WTS Chat.
 *
 * Bate em paths candidatos e reporta status code. Útil pra mapear o módulo
 * Painel (kanban) e outros endpoints não documentados publicamente.
 *
 * Uso:
 *   ZAPER_API_KEY=pn_... npx tsx src/scripts/discover-endpoints.ts
 */

const BASE = "https://api.wts.chat";
const TOKEN = process.env.ZAPER_API_KEY;

if (!TOKEN) {
  console.error("ZAPER_API_KEY obrigatório");
  process.exit(1);
}

interface Probe {
  method: "GET" | "POST";
  path: string;
  group: string;
}

const probes: Probe[] = [
  // Painel / Kanban — variações de prefixo
  { method: "GET", path: "/core/v1/panel", group: "Painel" },
  { method: "GET", path: "/core/v1/panels", group: "Painel" },
  { method: "GET", path: "/core/v1/panel/card", group: "Painel" },
  { method: "GET", path: "/core/v2/panel", group: "Painel" },
  { method: "GET", path: "/crm/v1/panel", group: "Painel" },
  { method: "GET", path: "/crm/panel", group: "Painel" },
  { method: "GET", path: "/panel/v1/card", group: "Painel" },
  { method: "GET", path: "/core/v1/board", group: "Painel" },
  { method: "GET", path: "/core/v1/kanban", group: "Painel" },
  { method: "GET", path: "/core/v1/pipeline", group: "Painel" },
  { method: "GET", path: "/core/v1/card", group: "Painel" },

  // Sessões / Atendimentos
  { method: "GET", path: "/core/v1/session", group: "Sessões" },
  { method: "GET", path: "/chat/v1/session", group: "Sessões" },
  { method: "GET", path: "/core/v1/attendance", group: "Sessões" },
  { method: "GET", path: "/core/v1/service", group: "Sessões" },

  // Pagamentos
  { method: "GET", path: "/core/v1/payment", group: "Pagamentos" },
  { method: "GET", path: "/crm/v1/payment", group: "Pagamentos" },
  { method: "GET", path: "/payment/v1", group: "Pagamentos" },

  // CRM genérico (mencionado na doc como /crm/...)
  { method: "GET", path: "/crm", group: "CRM" },
  { method: "GET", path: "/crm/v1", group: "CRM" },
  { method: "GET", path: "/crm/v1/contact", group: "CRM" },
  { method: "GET", path: "/crm/v1/deal", group: "CRM" },
  { method: "GET", path: "/crm/v1/opportunity", group: "CRM" },

  // Configuração / metadados (úteis pra integração)
  { method: "GET", path: "/core/v1/channel", group: "Config" },
  { method: "GET", path: "/core/v1/channels", group: "Config" },
  { method: "GET", path: "/core/v1/tag", group: "Config" },
  { method: "GET", path: "/core/v1/tags", group: "Config" },
  { method: "GET", path: "/core/v1/portfolio", group: "Config" },
  { method: "GET", path: "/core/v1/portfolios", group: "Config" },
  { method: "GET", path: "/core/v1/customfield", group: "Config" },
  { method: "GET", path: "/core/v1/template", group: "Config" },
  { method: "GET", path: "/core/v1/templates", group: "Config" },
  { method: "GET", path: "/chat/v1/template", group: "Config" },
  { method: "GET", path: "/core/v1/user", group: "Config" },
  { method: "GET", path: "/core/v1/me", group: "Config" },
  { method: "GET", path: "/core/v1/company", group: "Config" },

  // Mensagens — listar, não só enviar
  { method: "GET", path: "/chat/v1/message", group: "Mensagens" },
  { method: "GET", path: "/chat/v1/conversation", group: "Mensagens" },
  { method: "GET", path: "/chat/v1/chat", group: "Mensagens" },

  // Arquivos / mídia
  { method: "GET", path: "/core/v1/file", group: "Arquivos" },
  { method: "GET", path: "/chat/v1/file", group: "Arquivos" },
];

interface Result {
  probe: Probe;
  status: number;
  body: string;
  ms: number;
}

async function probe(p: Probe): Promise<Result> {
  const t0 = Date.now();
  try {
    const res = await fetch(`${BASE}${p.path}`, {
      method: p.method,
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(8000),
    });
    const text = await res.text();
    return {
      probe: p,
      status: res.status,
      body: text.slice(0, 200),
      ms: Date.now() - t0,
    };
  } catch (err) {
    return {
      probe: p,
      status: 0,
      body: (err as Error).message,
      ms: Date.now() - t0,
    };
  }
}

async function main() {
  console.log(`Probing ${probes.length} endpoints em ${BASE}...\n`);

  const results = await Promise.all(probes.map(probe));

  const byGroup: Record<string, Result[]> = {};
  for (const r of results) {
    (byGroup[r.probe.group] ??= []).push(r);
  }

  for (const [group, items] of Object.entries(byGroup)) {
    console.log(`\n## ${group}`);
    for (const r of items) {
      const tag =
        r.status === 200
          ? "✅ EXISTE"
          : r.status === 401 || r.status === 403
            ? "🔒 EXISTE (auth)"
            : r.status === 404
              ? "❌ 404"
              : r.status === 405
                ? "⚠️ EXISTE (método errado)"
                : `?? ${r.status}`;
      console.log(
        `  ${tag.padEnd(20)} ${r.probe.method} ${r.probe.path.padEnd(40)} ${r.ms}ms`,
      );
      if (r.status === 200 && r.body) {
        console.log(`     preview: ${r.body.slice(0, 120)}`);
      }
    }
  }

  console.log("\n--- Resumo ---");
  const hits = results.filter((r) => r.status === 200);
  console.log(`${hits.length} endpoints retornaram 200 (existem e responderam OK):`);
  for (const h of hits) console.log(`  • ${h.probe.method} ${h.probe.path}`);
}

main().catch((err) => {
  console.error("Falhou:", err);
  process.exit(1);
});
