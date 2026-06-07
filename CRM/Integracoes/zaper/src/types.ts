/**
 * Tipos do domínio Zaper Chat.
 * Preencher a partir da doc oficial extraída do painel.
 */

export interface ZaperClientConfig {
  apiKey: string;
  baseUrl: string;
  timeoutMs?: number;
  maxRetries?: number;
}

export interface ZaperRequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  query?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  headers?: Record<string, string>;
}

export class ZaperError extends Error {
  constructor(
    message: string,
    public status: number,
    public body: unknown,
  ) {
    super(message);
    this.name = "ZaperError";
  }
}

// TODO: substituir por schemas reais após mapeamento da doc
export interface ZaperContact {
  id: string;
  phone: string;
  name?: string;
  // ...
}

export interface ZaperMessage {
  id: string;
  contactId: string;
  direction: "inbound" | "outbound";
  text?: string;
  // ...
}

export type ZaperWebhookEvent =
  | { type: "message.received"; payload: ZaperMessage }
  | { type: "message.sent"; payload: ZaperMessage }
  | { type: "contact.created"; payload: ZaperContact };
