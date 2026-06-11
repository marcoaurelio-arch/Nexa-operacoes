#!/usr/bin/env node
/**
 * Sincroniza segredos do Nexa nas env vars do projeto Vercel.
 *
 * Uso:
 *   VERCEL_TOKEN=vcp_... \
 *   ZAPER_API_KEY=pn_... \
 *   ZAPER_API_BASE_URL=https://api.app.zaperchat.com \
 *   npx tsx src/scripts/sync-zaper-env.ts [--project prj_xxx] [--dry-run]
 *
 * Se --project for omitido, usa VERCEL_PROJECT_ID (default abaixo).
 * Se VERCEL_TEAM_ID/SLUG não for setado, o script descobre via /v2/teams.
 */

import { VercelClient } from "../client.js";
import type { EnvTarget, EnvType } from "../types.js";

const DEFAULT_PROJECT_ID = "prj_Pshs6btl2Kie46ua9l4wngN8mlJV"; // nexa-operacoes

interface Secret {
  key: string;
  value: string | undefined;
  type: EnvType;
  target: EnvTarget[];
}

async function main() {
  const token = requireEnv("VERCEL_TOKEN");
  const argv = process.argv.slice(2);
  const dryRun = argv.includes("--dry-run");
  const projectIdx = argv.indexOf("--project");
  const projectId =
    projectIdx >= 0
      ? argv[projectIdx + 1]
      : (process.env.VERCEL_PROJECT_ID ?? DEFAULT_PROJECT_ID);

  let teamId = process.env.VERCEL_TEAM_ID;
  const teamSlug = process.env.VERCEL_TEAM_SLUG;

  if (!teamId && !teamSlug) {
    teamId = await discoverTeamId(token);
  }

  const vercel = new VercelClient({ token, teamId, teamSlug });

  const project = await vercel.getProject(projectId);
  console.log(`✓ Project: ${project.name} (${project.id})`);

  const secrets: Secret[] = [
    {
      key: "ZAPER_API_KEY",
      value: process.env.ZAPER_API_KEY,
      type: "sensitive",
      target: ["production", "preview"],
    },
    {
      key: "ZAPER_API_BASE_URL",
      value:
        process.env.ZAPER_API_BASE_URL ?? "https://api.wts.chat",
      type: "plain",
      target: ["production", "preview", "development"],
    },
    {
      key: "ZAPER_WEBHOOK_SECRET",
      value: process.env.ZAPER_WEBHOOK_SECRET,
      type: "sensitive",
      target: ["production", "preview"],
    },
  ].filter((s): s is Secret => Boolean(s.value));

  if (secrets.length === 0) {
    console.error("Nada para sincronizar. Defina ZAPER_API_KEY no ambiente.");
    process.exit(1);
  }

  console.log(`\nSincronizando ${secrets.length} env var(s):`);
  for (const s of secrets) {
    console.log(
      `  • ${s.key.padEnd(24)} [${s.type}] → ${s.target.join(", ")}`,
    );
  }

  if (dryRun) {
    console.log("\n--dry-run ativo. Nada foi escrito.");
    return;
  }

  for (const s of secrets) {
    await vercel.upsertEnvVar(project.id, {
      key: s.key,
      value: s.value as string,
      type: s.type,
      target: s.target,
    });
    console.log(`  ✓ upsert ${s.key}`);
  }

  console.log(
    "\n✅ Pronto. Dispare um novo deploy pra propagar as env vars novas:",
  );
  console.log(`   vercel --prod   # ou git push (Vercel rebuilda)\n`);
}

async function discoverTeamId(token: string): Promise<string | undefined> {
  const res = await fetch("https://api.vercel.com/v2/teams", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    console.warn(`Aviso: não consegui descobrir team (${res.status})`);
    return undefined;
  }
  const body = (await res.json()) as {
    teams: Array<{ id: string; slug: string; name: string }>;
  };
  const team = body.teams?.[0];
  if (team) {
    console.log(`✓ Team: ${team.name} (${team.id}, slug=${team.slug})`);
    return team.id;
  }
  return undefined;
}

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) {
    console.error(`Erro: variável ${name} obrigatória.`);
    process.exit(1);
  }
  return v;
}

main().catch((err) => {
  console.error("Falhou:", err);
  process.exit(1);
});
