import {
  BuildLogEvent,
  DnsRecord,
  ListDeploymentsQuery,
  RuntimeLogEntry,
  UpsertEnvVarInput,
  VercelClientConfig,
  VercelDeployment,
  VercelDomain,
  VercelEnvVar,
  VercelError,
  VercelProject,
} from "./types.js";

type Query = Record<string, string | number | boolean | undefined>;

export class VercelClient {
  private token: string;
  private teamId?: string;
  private teamSlug?: string;
  private baseUrl: string;
  private timeoutMs: number;
  private maxRetries: number;

  constructor(config: VercelClientConfig) {
    if (!config.token) throw new Error("VercelClient: token is required");
    this.token = config.token;
    this.teamId = config.teamId;
    this.teamSlug = config.teamSlug;
    this.baseUrl = (config.baseUrl ?? "https://api.vercel.com").replace(
      /\/$/,
      "",
    );
    this.timeoutMs = config.timeoutMs ?? 15_000;
    this.maxRetries = config.maxRetries ?? 2;
  }

  // --- Projects -----------------------------------------------------------

  async listProjects(query: { limit?: number; search?: string } = {}): Promise<
    VercelProject[]
  > {
    const res = await this.request<{ projects: VercelProject[] }>({
      path: "/v9/projects",
      query,
    });
    return res.projects;
  }

  getProject(idOrName: string): Promise<VercelProject> {
    return this.request<VercelProject>({
      path: `/v9/projects/${encodeURIComponent(idOrName)}`,
    });
  }

  // --- Env Vars -----------------------------------------------------------

  async listEnvVars(projectIdOrName: string): Promise<VercelEnvVar[]> {
    const res = await this.request<{ envs: VercelEnvVar[] }>({
      path: `/v9/projects/${encodeURIComponent(projectIdOrName)}/env`,
      query: { decrypt: "true" },
    });
    return res.envs;
  }

  createEnvVar(
    projectIdOrName: string,
    input: UpsertEnvVarInput,
  ): Promise<VercelEnvVar | { created: VercelEnvVar[] }> {
    return this.request({
      method: "POST",
      path: `/v10/projects/${encodeURIComponent(projectIdOrName)}/env`,
      query: { upsert: "true" },
      body: input,
    });
  }

  updateEnvVar(
    projectIdOrName: string,
    envId: string,
    patch: Partial<UpsertEnvVarInput>,
  ): Promise<VercelEnvVar> {
    return this.request<VercelEnvVar>({
      method: "PATCH",
      path: `/v9/projects/${encodeURIComponent(projectIdOrName)}/env/${envId}`,
      body: patch,
    });
  }

  deleteEnvVar(projectIdOrName: string, envId: string): Promise<void> {
    return this.request<void>({
      method: "DELETE",
      path: `/v9/projects/${encodeURIComponent(projectIdOrName)}/env/${envId}`,
    });
  }

  /** Cria ou atualiza (upsert) — se já existir uma var com mesmo key+target, atualiza. */
  async upsertEnvVar(
    projectIdOrName: string,
    input: UpsertEnvVarInput,
  ): Promise<VercelEnvVar | { created: VercelEnvVar[] }> {
    return this.createEnvVar(projectIdOrName, input);
  }

  // --- Deployments --------------------------------------------------------

  async listDeployments(
    query: ListDeploymentsQuery = {},
  ): Promise<VercelDeployment[]> {
    const res = await this.request<{ deployments: VercelDeployment[] }>({
      path: "/v6/deployments",
      query: query as Query,
    });
    return res.deployments;
  }

  getDeployment(idOrUrl: string): Promise<VercelDeployment> {
    return this.request<VercelDeployment>({
      path: `/v13/deployments/${encodeURIComponent(idOrUrl)}`,
    });
  }

  /** Build logs (eventos do build) — Vercel retorna como SSE/JSON array. */
  async getBuildLogs(deploymentId: string): Promise<BuildLogEvent[]> {
    return this.request<BuildLogEvent[]>({
      path: `/v2/deployments/${encodeURIComponent(deploymentId)}/events`,
    });
  }

  /** Runtime logs (logs do servidor após deploy). */
  async getRuntimeLogs(
    deploymentId: string,
    query: { limit?: number; since?: number; until?: number } = {},
  ): Promise<RuntimeLogEntry[]> {
    return this.request<RuntimeLogEntry[]>({
      path: `/v3/deployments/${encodeURIComponent(deploymentId)}/runtime-logs`,
      query,
    });
  }

  // --- Deploy Hooks -------------------------------------------------------

  /** Dispara um deploy hook. A URL completa do hook contém um token único,
   *  então NÃO usa Authorization header. */
  async triggerDeployHook(
    hookUrl: string,
  ): Promise<{ job: { id: string; state: string } }> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      const res = await fetch(hookUrl, {
        method: "POST",
        signal: controller.signal,
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new VercelError(
          `Deploy hook ${res.status}: ${res.statusText}`,
          res.status,
          body,
        );
      }
      return body;
    } finally {
      clearTimeout(timer);
    }
  }

  // --- Domains / DNS ------------------------------------------------------

  async listDomains(): Promise<VercelDomain[]> {
    const res = await this.request<{ domains: VercelDomain[] }>({
      path: "/v5/domains",
    });
    return res.domains;
  }

  addDomain(input: {
    name: string;
    projectId?: string;
    cdnEnabled?: boolean;
  }): Promise<VercelDomain> {
    return this.request<VercelDomain>({
      method: "POST",
      path: "/v5/domains",
      body: input,
    });
  }

  removeDomain(domain: string): Promise<void> {
    return this.request<void>({
      method: "DELETE",
      path: `/v6/domains/${encodeURIComponent(domain)}`,
    });
  }

  async listDnsRecords(domain: string): Promise<DnsRecord[]> {
    const res = await this.request<{ records: DnsRecord[] }>({
      path: `/v4/domains/${encodeURIComponent(domain)}/records`,
    });
    return res.records;
  }

  addDnsRecord(
    domain: string,
    record: Omit<DnsRecord, "id">,
  ): Promise<{ uid: string }> {
    return this.request<{ uid: string }>({
      method: "POST",
      path: `/v2/domains/${encodeURIComponent(domain)}/records`,
      body: record,
    });
  }

  removeDnsRecord(domain: string, recordId: string): Promise<void> {
    return this.request<void>({
      method: "DELETE",
      path: `/v2/domains/${encodeURIComponent(domain)}/records/${recordId}`,
    });
  }

  // --- Core HTTP ----------------------------------------------------------

  async request<T>(opts: {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    path: string;
    query?: Query;
    body?: unknown;
  }): Promise<T> {
    const url = this.buildUrl(opts.path, opts.query);
    const init: RequestInit = {
      method: opts.method ?? "GET",
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    };

    let lastErr: unknown;
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeoutMs);
      try {
        const res = await fetch(url, { ...init, signal: controller.signal });
        clearTimeout(timer);
        const text = await res.text();
        const body = text ? safeJson(text) : null;

        if (!res.ok) {
          const retriable =
            res.status >= 500 || res.status === 429;
          if (retriable && attempt < this.maxRetries) {
            await backoff(attempt);
            continue;
          }
          throw new VercelError(
            `Vercel API ${res.status}: ${res.statusText}`,
            res.status,
            body,
          );
        }
        return body as T;
      } catch (err) {
        clearTimeout(timer);
        lastErr = err;
        if (err instanceof VercelError) throw err;
        if (attempt < this.maxRetries) {
          await backoff(attempt);
          continue;
        }
      }
    }
    throw lastErr;
  }

  private buildUrl(path: string, query?: Query): string {
    const url = new URL(
      path.startsWith("/") ? path.slice(1) : path,
      `${this.baseUrl}/`,
    );
    if (this.teamId) url.searchParams.set("teamId", this.teamId);
    else if (this.teamSlug) url.searchParams.set("slug", this.teamSlug);
    if (query) {
      for (const [k, v] of Object.entries(query)) {
        if (v !== undefined) url.searchParams.set(k, String(v));
      }
    }
    return url.toString();
  }
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function backoff(attempt: number): Promise<void> {
  const ms = 300 * 2 ** attempt + Math.random() * 100;
  return new Promise((r) => setTimeout(r, ms));
}
