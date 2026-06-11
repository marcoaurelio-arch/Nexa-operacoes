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

// --- Paginação ----------------------------------------------------------

/** Envelope paginado padrão da WTS (vale pra quase todos os list endpoints). */
export interface Paginated<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  hasMorePages: boolean;
  pageNumber: number;
  pageSize: number;
  orderBy: string | null;
  orderDirection: "asc" | "desc" | null;
}

export interface PageQuery {
  pageNumber?: number;
  pageSize?: number;
  orderBy?: string;
  orderDirection?: "asc" | "desc";
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

// --- Recursos descobertos via /webhook/event + endpoint discovery -------

export interface ZaperTag {
  id: string;
  createdAt: string;
  updatedAt: string;
  name?: string;
  color?: string;
  [k: string]: unknown;
}

export interface ZaperPortfolio {
  id: string;
  createdAt: string;
  updatedAt: string;
  name?: string;
  [k: string]: unknown;
}

export interface ZaperTemplate {
  id: string;
  createdAt: string;
  updatedAt: string;
  name?: string;
  body?: string;
  language?: string;
  status?: string;
  [k: string]: unknown;
}

export interface ZaperSession {
  id: string;
  createdAt: string;
  updatedAt: string;
  startAt?: string;
  endAt?: string | null;
  contactId?: string;
  status?: string;
  [k: string]: unknown;
}

export interface ZaperSessionMessage {
  id: string;
  createdAt: string;
  updatedAt: string;
  timestamp: string;
  type: "TEXT" | "IMAGE" | "AUDIO" | "VIDEO" | "DOCUMENT" | "TEMPLATE" | string;
  senderId: string | null;
  status?: string;
  [k: string]: unknown;
}

export interface ZaperSessionNote {
  id: string;
  createdAt: string;
  updatedAt: string;
  text?: string;
  authorId?: string;
  [k: string]: unknown;
}

export interface ZaperMessage {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  from?: string;
  to?: string;
  text?: string;
  type?: string;
  status?: string;
  [k: string]: unknown;
}

export interface ZaperPanel {
  id: string;
  createdAt: string;
  updatedAt: string;
  companyId?: string;
  archived?: boolean;
  name?: string;
  [k: string]: unknown;
}

/** Card de painel — só legível com token de escopo admin/CRM. */
export interface ZaperPanelCard {
  id: string;
  panelId: string;
  stepId?: string;
  contactId?: string;
  title?: string;
  createdAt: string;
  updatedAt: string;
  [k: string]: unknown;
}

export interface ZaperPanelStep {
  id: string;
  panelId: string;
  name?: string;
  order?: number;
  createdAt: string;
  updatedAt: string;
  [k: string]: unknown;
}

export interface ZaperChannel {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  number?: string;
  name?: string;
  [k: string]: unknown;
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
