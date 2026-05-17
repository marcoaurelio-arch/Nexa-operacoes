# ⚙️ Automacoes — Orquestração Operacional

> Camada de automação que conecta sistemas, dados e pessoas. Aqui vivem todos os workflows que removem trabalho manual repetitivo da operação Nexa Malls.

---

## 1. Objetivo

Reduzir trabalho manual em 80% nos processos repetitivos da Nexa Malls através de orquestração via n8n, integrações nativas e webhooks — liberando o time para atividades de alto valor: análise, decisão e relacionamento.

---

## 2. Estrutura

| Subpasta | Conteúdo |
|----------|----------|
| `n8n/workflows/` | Exports JSON de workflows produtivos |
| `n8n/credenciais/` | Documentação de credenciais (sem segredos) |
| `WhatsApp-API/` | Integrações com WhatsApp Business API |
| `Google-Sheets/` | Apps Script, integrações e templates |
| `Notion/` | Sincronizações com bases Notion |
| `OpenAI-API/` | Chamadas a modelos LLM em workflows |
| `Webhooks/` | Documentação de endpoints recebedores |
| `Make/` | Cenários Make.com (legados ou complementares) |
| `Zapier/` | Zaps complementares |

---

## 3. Responsáveis

| Função | Responsável |
|--------|-------------|
| Owner técnico | Planejarcomm |
| Operação dos workflows | RevOps |
| Aprovação de produção | Lead Técnico + Owner |
| Monitoramento | Plantão técnico |

---

## 4. Ferramentas Utilizadas

- **n8n** — orquestrador principal (self-hosted)
- **Make.com** — cenários complementares
- **Google Apps Script** — automações nativas Google
- **WhatsApp Business API** — via provedor oficial
- **OpenAI / Anthropic API** — inteligência embutida
- **Webhooks** — gatilhos externos

---

## 5. Integrações Ativas

| Origem | Destino | Função |
|--------|---------|--------|
| Formulário Site | n8n → CRM | Captura de leads |
| WhatsApp inbound | n8n → CRM + IA | Triagem e qualificação |
| CRM | Google Sheets | Espelho operacional |
| Notion | n8n → Sheets/Dashboard | Sincronização de projetos |
| Gmail | n8n → Notion | Arquivamento de propostas |
| Calendário | n8n → IA → Slack | Briefing pré-reunião |

---

## 6. Padrões de Workflow

Todo workflow novo deve seguir:

1. **Nome claro e descritivo** — verbo + objeto + escopo.
2. **README.md ao lado do export JSON** — descreve objetivo, gatilho, passos, fallback.
3. **Tags institucionais** — `comercial`, `marketing`, `operacional`, `ia`, `dados`.
4. **Notificação de erro** — todo workflow crítico envia alerta para Slack/WhatsApp.
5. **Idempotência** — workflows devem tolerar re-execução sem efeitos colaterais.
6. **Logs** — workflows críticos registram execução em Sheets/Notion.

---

## 7. Status Operacional

| Componente | Status |
|------------|--------|
| Ambiente n8n | 🔄 A provisionar |
| Catálogo de workflows | 🔄 Em construção |
| Documentação de credenciais | ✅ Padronizada |
| Monitoramento | ⏳ Backlog |
| Disaster Recovery | ⏳ Backlog |

---

## 8. Fluxos Relacionados

- `/CRM/Integracoes/` — destino final de muitas automações.
- `/IA/Prompts/` — prompts consumidos por workflows com nodes de LLM.
- `/APIs/Documentacao/` — endpoints expostos e consumidos.
- `/Documentacao/Arquitetura/` — diagramas de arquitetura.

---

## 9. Convenções de Nomenclatura

- **Workflow:** `[area]-[verbo]-[objeto]` → ex.: `comercial-qualifica-lead-whatsapp`
- **Webhook path:** `/webhooks/[area]/[evento]` → ex.: `/webhooks/comercial/novo-lead`
- **Variável de ambiente:** `NEXA_[AREA]_[CHAVE]` → ex.: `NEXA_CRM_API_KEY`

---

## 10. Segurança

- Nenhuma credencial vive no Git — apenas referências e documentação.
- Todo workflow crítico tem rotação de tokens documentada.
- Acessos seguem princípio de menor privilégio.
- Logs sensíveis são mascarados antes de gravação.
