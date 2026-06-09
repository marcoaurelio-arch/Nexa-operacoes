import {
  CreateContactInput,
  MessageStatus,
  PageQuery,
  Paginated,
  SendMediaInput,
  SendMessageInput,
  SendTemplateInput,
  SendTextInput,
  UpdateContactInput,
  WebhookEventDescriptor,
  WebhookSubscription,
  ZaperChannel,
  ZaperClientConfig,
  ZaperContact,
  ZaperError,
  ZaperMessage,
  ZaperPanel,
  ZaperPanelCard,
  ZaperPanelStep,
  ZaperPortfolio,
  ZaperRequestOptions,
  ZaperSession,
  ZaperSessionMessage,
  ZaperSessionNote,
  ZaperTag,
  ZaperTemplate,
} from "./types.js";

const DEFAULT_BASE_URL = "https://api.wts.chat";

export class ZaperClient {
  private apiKey: string;
  private baseUrl: string;
  private timeoutMs: number;
  private maxRetries: number;

  constructor(config: ZaperClientConfig) {
    if (!config.apiKey) throw new Error("ZaperClient: apiKey is required");
    this.apiKey = config.apiKey;
    this.baseUrl = (config.baseUrl ?? DEFAULT_BASE_URL).replace(/\/$/, "");
    this.timeoutMs = config.timeoutMs ?? 15_000;
    this.maxRetries = config.maxRetries ?? 2;
  }

  // --- Contatos ---------------------------------------------------------

  createContact(input: CreateContactInput): Promise<ZaperContact> {
    return this.request<ZaperContact>({
      method: "POST",
      path: "/core/v1/contact",
      body: input,
    });
  }

  getContactByPhone(phone: string): Promise<ZaperContact> {
    return this.request<ZaperContact>({
      path: `/core/v1/contact/phonenumber/${encodeURIComponent(phone)}`,
    });
  }

  getContactById(id: string): Promise<ZaperContact> {
    return this.request<ZaperContact>({
      path: `/core/v2/contact/${encodeURIComponent(id)}`,
    });
  }

  updateContactByPhone(
    phone: string,
    patch: UpdateContactInput,
  ): Promise<ZaperContact> {
    return this.request<ZaperContact>({
      method: "PUT",
      path: `/core/v1/contact/phonenumber/${encodeURIComponent(phone)}`,
      body: patch,
    });
  }

  updateContactById(
    id: string,
    patch: UpdateContactInput,
  ): Promise<ZaperContact> {
    return this.request<ZaperContact>({
      method: "PUT",
      path: `/core/v2/contact/${encodeURIComponent(id)}`,
      body: patch,
    });
  }

  // --- Mensagens (envio direto) -----------------------------------------

  sendText(input: SendTextInput): Promise<unknown> {
    return this.request({
      method: "POST",
      path: "/chat/v1/send/text",
      body: input,
    });
  }

  sendImage(input: SendMediaInput): Promise<unknown> {
    return this.request({
      method: "POST",
      path: "/chat/v1/send/image",
      body: input,
    });
  }

  sendAudio(input: SendMediaInput): Promise<unknown> {
    return this.request({
      method: "POST",
      path: "/chat/v1/send/audio",
      body: input,
    });
  }

  sendVideo(input: SendMediaInput): Promise<unknown> {
    return this.request({
      method: "POST",
      path: "/chat/v1/send/video",
      body: input,
    });
  }

  sendDocument(input: SendMediaInput): Promise<unknown> {
    return this.request({
      method: "POST",
      path: "/chat/v1/send/document",
      body: input,
    });
  }

  sendTemplate(input: SendTemplateInput): Promise<unknown> {
    return this.request({
      method: "POST",
      path: "/chat/v1/send/template",
      body: input,
    });
  }

  /** Envia mensagem seguindo regras do canal (auto-cria contato se necessário). */
  sendMessage(input: SendMessageInput): Promise<unknown> {
    return this.request({
      method: "POST",
      path: "/chat/v1/message/send",
      body: input,
    });
  }

  getMessageStatus(id: string): Promise<MessageStatus> {
    return this.request<MessageStatus>({
      path: `/chat/v1/message/${encodeURIComponent(id)}/status`,
    });
  }

  // --- Webhooks ---------------------------------------------------------

  listWebhookEvents(): Promise<WebhookEventDescriptor[]> {
    return this.request<WebhookEventDescriptor[]>({
      path: "/core/v1/webhook/event",
    });
  }

  listWebhookSubscriptions(): Promise<WebhookSubscription[]> {
    return this.request<WebhookSubscription[]>({
      path: "/core/v1/webhook/subscription",
    });
  }

  createWebhookSubscription(
    input: WebhookSubscription,
  ): Promise<WebhookSubscription> {
    return this.request<WebhookSubscription>({
      method: "POST",
      path: "/core/v1/webhook/subscription",
      body: input,
    });
  }

  // --- Painel / CRM (kanban) -------------------------------------------

  listPanels(query: PageQuery = {}): Promise<Paginated<ZaperPanel>> {
    return this.request<Paginated<ZaperPanel>>({
      path: "/crm/v1/panel",
      query: query as Record<string, string | number | boolean | undefined>,
    });
  }

  getPanel(id: string): Promise<ZaperPanel> {
    return this.request<ZaperPanel>({
      path: `/crm/v1/panel/${encodeURIComponent(id)}`,
    });
  }

  /** ⚠️ Requer token com escopo admin/CRM. */
  listPanelCards(
    panelId: string,
    query: PageQuery = {},
  ): Promise<Paginated<ZaperPanelCard>> {
    return this.request<Paginated<ZaperPanelCard>>({
      path: `/crm/v1/panel/${encodeURIComponent(panelId)}/card`,
      query: query as Record<string, string | number | boolean | undefined>,
    });
  }

  /** ⚠️ Requer token com escopo admin/CRM. */
  listPanelSteps(panelId: string): Promise<Paginated<ZaperPanelStep>> {
    return this.request<Paginated<ZaperPanelStep>>({
      path: `/crm/v1/panel/${encodeURIComponent(panelId)}/steps`,
    });
  }

  // --- Sessões / Atendimentos ------------------------------------------

  listSessions(
    query: PageQuery & { contactId?: string; status?: string } = {},
  ): Promise<Paginated<ZaperSession>> {
    return this.request<Paginated<ZaperSession>>({
      path: "/chat/v1/session",
      query: query as Record<string, string | number | boolean | undefined>,
    });
  }

  getSession(id: string): Promise<ZaperSession> {
    return this.request<ZaperSession>({
      path: `/chat/v1/session/${encodeURIComponent(id)}`,
    });
  }

  /** Mensagens de uma sessão — caminho preferido (vs `listMessages({sessionId})`). */
  listSessionMessages(
    sessionId: string,
    query: PageQuery = {},
  ): Promise<Paginated<ZaperSessionMessage>> {
    return this.request<Paginated<ZaperSessionMessage>>({
      path: `/chat/v1/session/${encodeURIComponent(sessionId)}/message`,
      query: query as Record<string, string | number | boolean | undefined>,
    });
  }

  listSessionNotes(
    sessionId: string,
    query: PageQuery = {},
  ): Promise<Paginated<ZaperSessionNote>> {
    return this.request<Paginated<ZaperSessionNote>>({
      path: `/chat/v1/session/${encodeURIComponent(sessionId)}/note`,
      query: query as Record<string, string | number | boolean | undefined>,
    });
  }

  /** ⚠️ Requer token com escopo admin/atendimento. */
  completeSession(sessionId: string): Promise<unknown> {
    return this.request({
      method: "POST",
      path: `/chat/v1/session/${encodeURIComponent(sessionId)}/complete`,
    });
  }

  /** ⚠️ Requer token com escopo admin/atendimento. */
  transferSession(
    sessionId: string,
    input: { toUserId?: string; toDepartmentId?: string; reason?: string },
  ): Promise<unknown> {
    return this.request({
      method: "POST",
      path: `/chat/v1/session/${encodeURIComponent(sessionId)}/transfer`,
      body: input,
    });
  }

  // --- Templates -------------------------------------------------------

  listTemplates(query: PageQuery = {}): Promise<Paginated<ZaperTemplate>> {
    return this.request<Paginated<ZaperTemplate>>({
      path: "/chat/v1/template",
      query: query as Record<string, string | number | boolean | undefined>,
    });
  }

  // --- Tags ------------------------------------------------------------

  /** Tags retornam ARRAY direto, sem envelope paginado. */
  listTags(): Promise<ZaperTag[]> {
    return this.request<ZaperTag[]>({ path: "/core/v1/tag" });
  }

  // --- Portfolios ------------------------------------------------------

  listPortfolios(query: PageQuery = {}): Promise<Paginated<ZaperPortfolio>> {
    return this.request<Paginated<ZaperPortfolio>>({
      path: "/core/v1/portfolio",
      query: query as Record<string, string | number | boolean | undefined>,
    });
  }

  // --- Mensagens (listar) ----------------------------------------------

  listMessages(
    query: PageQuery & {
      contactId?: string;
      sessionId?: string;
      from?: string;
      to?: string;
    } = {},
  ): Promise<Paginated<ZaperMessage>> {
    return this.request<Paginated<ZaperMessage>>({
      path: "/chat/v1/message",
      query: query as Record<string, string | number | boolean | undefined>,
    });
  }

  // --- Canais ----------------------------------------------------------

  listChannels(
    query: PageQuery = {},
  ): Promise<Paginated<ZaperChannel> | ZaperChannel[]> {
    return this.request<Paginated<ZaperChannel> | ZaperChannel[]>({
      path: "/core/v1/channel",
      query: query as Record<string, string | number | boolean | undefined>,
    });
  }

  // --- Core HTTP --------------------------------------------------------

  async request<T>(opts: ZaperRequestOptions): Promise<T> {
    const url = this.buildUrl(opts.path, opts.query);
    const init: RequestInit = {
      method: opts.method ?? "GET",
      headers: {
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
          const retriable = res.status >= 500 || res.status === 429;
          if (retriable && attempt < this.maxRetries) {
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
  const ms = 300 * 2 ** attempt + Math.random() * 100;
  return new Promise((r) => setTimeout(r, ms));
}
