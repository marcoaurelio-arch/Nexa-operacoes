import {
  ZaperClientConfig,
  ZaperError,
  ZaperRequestOptions,
} from "./types.js";

export class ZaperClient {
  private apiKey: string;
  private baseUrl: string;
  private timeoutMs: number;
  private maxRetries: number;

  constructor(config: ZaperClientConfig) {
    if (!config.apiKey) throw new Error("ZaperClient: apiKey is required");
    if (!config.baseUrl) throw new Error("ZaperClient: baseUrl is required");
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl.replace(/\/$/, "");
    this.timeoutMs = config.timeoutMs ?? 15_000;
    this.maxRetries = config.maxRetries ?? 2;
  }

  async request<T>(opts: ZaperRequestOptions): Promise<T> {
    const url = this.buildUrl(opts.path, opts.query);
    const init: RequestInit = {
      method: opts.method ?? "GET",
      headers: {
        // TODO: confirmar header de auth real da Zaper (Bearer? X-API-Key?)
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        ...opts.headers,
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
          if (res.status >= 500 && attempt < this.maxRetries) {
            await backoff(attempt);
            continue;
          }
          throw new ZaperError(
            `Zaper API ${res.status}: ${res.statusText}`,
            res.status,
            body,
          );
        }
        return body as T;
      } catch (err) {
        clearTimeout(timer);
        lastErr = err;
        if (err instanceof ZaperError) throw err;
        if (attempt < this.maxRetries) {
          await backoff(attempt);
          continue;
        }
      }
    }
    throw lastErr;
  }

  private buildUrl(
    path: string,
    query?: Record<string, string | number | boolean | undefined>,
  ): string {
    const url = new URL(
      path.startsWith("/") ? path.slice(1) : path,
      `${this.baseUrl}/`,
    );
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
  const ms = 250 * 2 ** attempt + Math.random() * 100;
  return new Promise((r) => setTimeout(r, ms));
}
