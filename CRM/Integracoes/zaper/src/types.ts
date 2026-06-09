/**
 * Tipos do domínio Zaper Chat / WTS Chat (api.wts.chat).
 * Doc oficial: https://flwchat.readme.io/ (login obrigatório)
 */

export interface ZaperClientConfig {
  apiKey: string;
  baseUrl?: string;
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

// --- Contatos -----------------------------------------------------------

export interface ZaperContact {
  id: string;
  createdAt: string;
  updatedAt: string;
  companyId?: string;
  name: string;
  phonenumber: string;
  phonenumberFormatted?: string;
  email?: string | null;
  instagram?: string | null;
  annotation?: string;
  tagsId?: string[];
  tags?: Array<{ id: string; name: string }>;
  status?: "ACTIVE" | "INACTIVE" | string;
  origin?: string;
  utm?: unknown;
  customFieldValues?: Record<string, unknown>;
  metadata?: Record<string, unknown> | null;
}

export interface CreateContactInput {
  name: string;
  phoneNumber: string;
  email?: string;
  instagram?: string;
  annotation?: string;
  tagIds?: string[];
  tagNames?: string[];
  portfolioIds?: string[];
  portfolioNames?: string[];
  sequenceIds?: string[];
  customFields?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

/** Patch via `fields`-mask: liste em `fields` as chaves que devem ser atualizadas. */
export interface UpdateContactInput {
  fields: string[];
  name?: string;
  phoneNumber?: string;
  email?: string;
  annotation?: string;
  tagIds?: string[];
  tagNames?: string[];
  portfolioIds?: string[];
  portfolioNames?: string[];
  customFields?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

// --- Mensagens ----------------------------------------------------------

export interface SendTextInput {
  to: string;
  from: string;
  text: string;
  sessionId?: string;
  delayTyping?: number; // até 25s
  callbackUrl?: string;
  senderId?: string;
}

export interface SendMediaInput {
  to: string;
  from: string;
  fileIdOrUrl: string;
  sessionId?: string;
  callbackUrl?: string;
  senderId?: string;
}

export interface SendTemplateInput {
  to: string;
  from: string;
  templateId: string;
  parameters?: Record<string, string | number>;
  fileIdOrUrl?: string;
  callbackUrl?: string;
  sessionId?: string;
  senderId?: string;
  sessionMetadata?: Record<string, unknown>;
}

/** Endpoint /chat/v1/message/send — segue regras do canal (auto-cria contato). */
export interface SendMessageInput {
  from: string;
  to: string;
  body: { text?: string; mediaUrl?: string; mediaType?: string };
  options?: {
    senderId?: string;
    callbackUrl?: string;
    sessionId?: string;
    sessionMetadata?: Record<string, unknown>;
  };
}

export interface MessageStatus {
  id: string;
  status: string;
  to?: string;
  from?: string;
  sentAt?: string;
  deliveredAt?: string;
  readAt?: string;
  failedAt?: string;
  errorReason?: string;
}

// --- Webhooks -----------------------------------------------------------

export interface WebhookEventDescriptor {
  event: string;
  description: string;
}

export interface WebhookSubscription {
  id?: string;
  name: string;
  url: string;
  enabled: boolean;
  events: KnownEventType[] | string[];
}

/** Envelope padrão de todos os webhooks. */
export interface ZaperWebhookEnvelope<T = unknown> {
  eventType: KnownEventType | string;
  date: string;
  content: T;
}

export interface ContactUpdateWebhook
  extends ZaperWebhookEnvelope<ZaperContact> {
  eventType: "CONTACT_UPDATE" | "CONTACT_NEW" | "CONTACT_TAG_UPDATE";
}

/**
 * Eventos oficiais retornados por `GET /core/v1/webhook/event` (16 no total).
 * Agrupados por módulo.
 */
export type KnownEventType =
  // Atendimentos / Sessões
  | "SESSION_NEW"
  | "SESSION_UPDATE"
  | "SESSION_COMPLETE"
  // Mensagens
  | "MESSAGE_RECEIVED"
  | "MESSAGE_SENT"
  | "MESSAGE_UPDATED"
  // Contatos
  | "CONTACT_NEW"
  | "CONTACT_UPDATE"
  | "CONTACT_TAG_UPDATE"
  // Pagamentos
  | "PAYMENT_NEW"
  | "PAYMENT_UPDATE"
  // Painel (pipeline kanban)
  | "PANEL_CARD_NEW"
  | "PANEL_CARD_UPDATE"
  | "PANEL_CARD_STEP_CHANGE"
  | "PANEL_CARD_NOTE_NEW"
  | "PANEL_CARD_NOTE_UPDATE";
