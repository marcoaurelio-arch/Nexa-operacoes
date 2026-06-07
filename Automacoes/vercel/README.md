# Integração Vercel API

Cliente Node+TS pra Vercel REST API. Cobre Projects, Env Vars, Deployments, Deploy Hooks, Logs e Domains/DNS.

> **Doc oficial:** https://vercel.com/docs/rest-api

## Configuração

```bash
# .env (não commitar — já está no .gitignore)
VERCEL_TOKEN=             # https://vercel.com/account/tokens
VERCEL_TEAM_ID=           # opcional — encontrado em /teams/[slug]/settings
VERCEL_TEAM_SLUG=         # alternativa ao teamId
```

Se `VERCEL_TEAM_ID` (ou `_SLUG`) for setado, todas as chamadas serão escopadas pro time automaticamente.

## Uso

```ts
import { VercelClient } from "./src";

const vercel = new VercelClient({
  token: process.env.VERCEL_TOKEN!,
  teamId: process.env.VERCEL_TEAM_ID,
});

// Projects
const projects = await vercel.listProjects();
const project = await vercel.getProject("prj_Pshs6btl2Kie46ua9l4wngN8mlJV");

// Env vars
await vercel.upsertEnvVar(project.id, {
  key: "ZAPER_API_KEY",
  value: process.env.ZAPER_API_KEY!,
  type: "sensitive",
  target: ["production", "preview"],
});

// Deployments
const deps = await vercel.listDeployments({ projectId: project.id, limit: 10 });
const dep = await vercel.getDeployment(deps[0].uid);
const buildLogs = await vercel.getBuildLogs(dep.uid);

// Deploy hook (sem token — URL contém o segredo)
await vercel.triggerDeployHook(process.env.VERCEL_DEPLOY_HOOK_URL!);

// Domains / DNS
const domains = await vercel.listDomains();
await vercel.addDnsRecord("nexa.com.br", {
  type: "CNAME",
  name: "app",
  value: "cname.vercel-dns.com",
});
```

## Caso de uso imediato

Setar env vars do Zaper no projeto `nexa-operacoes` (prj_Pshs6btl2Kie46ua9l4wngN8mlJV):

```ts
await vercel.upsertEnvVar("prj_Pshs6btl2Kie46ua9l4wngN8mlJV", {
  key: "ZAPER_API_KEY",
  value: process.env.ZAPER_API_KEY!,
  type: "sensitive",  // criptografado, não exibido no painel
  target: ["production", "preview"],
});
```

## Especificações de endpoints

Veja `APIs/Endpoints/vercel/README.md`.
