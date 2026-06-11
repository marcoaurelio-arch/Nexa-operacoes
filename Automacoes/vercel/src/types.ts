export interface VercelClientConfig {
  token: string;
  teamId?: string;
  teamSlug?: string;
  baseUrl?: string;
  timeoutMs?: number;
  maxRetries?: number;
}

export class VercelError extends Error {
  constructor(
    message: string,
    public status: number,
    public body: unknown,
  ) {
    super(message);
    this.name = "VercelError";
  }
}

export type EnvTarget = "production" | "preview" | "development";
export type EnvType = "plain" | "encrypted" | "sensitive" | "system" | "secret";

export interface VercelProject {
  id: string;
  name: string;
  accountId: string;
  framework?: string | null;
  createdAt: number;
  updatedAt: number;
  link?: { type: string; repo?: string; repoId?: number } | null;
}

export interface VercelEnvVar {
  id: string;
  key: string;
  value?: string;
  type: EnvType;
  target: EnvTarget[];
  gitBranch?: string;
  createdAt?: number;
  updatedAt?: number;
}

export interface UpsertEnvVarInput {
  key: string;
  value: string;
  type: EnvType;
  target: EnvTarget[];
  gitBranch?: string;
  comment?: string;
}

export interface VercelDeployment {
  uid: string;
  name: string;
  url: string;
  state:
    | "BUILDING"
    | "ERROR"
    | "INITIALIZING"
    | "QUEUED"
    | "READY"
    | "CANCELED";
  createdAt: number;
  source?: string;
  target?: string | null;
  meta?: Record<string, string>;
  inspectorUrl?: string;
}

export interface ListDeploymentsQuery {
  projectId?: string;
  app?: string;
  state?: string;
  target?: "production" | "preview";
  limit?: number;
  from?: number;
  to?: number;
}

export interface VercelDomain {
  name: string;
  apexName: string;
  projectId?: string;
  redirect?: string | null;
  createdAt: number;
  verified: boolean;
}

export interface DnsRecord {
  id?: string;
  type: "A" | "AAAA" | "ALIAS" | "CAA" | "CNAME" | "MX" | "NS" | "SRV" | "TXT";
  name: string;
  value: string;
  ttl?: number;
  mxPriority?: number;
  srv?: { priority: number; weight: number; port: number; target: string };
}

export interface BuildLogEvent {
  type: string;
  created: number;
  payload?: { text?: string; deploymentId?: string; info?: unknown };
}

export interface RuntimeLogEntry {
  timestamp: number;
  level: string;
  message: string;
  source?: string;
  requestId?: string;
}
