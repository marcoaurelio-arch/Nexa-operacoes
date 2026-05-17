# Credenciais n8n — Catálogo Institucional

> **Atenção:** este diretório documenta a **existência** e o **uso** das credenciais. Nenhum segredo é armazenado no Git.

---

## Catálogo de Credenciais

| Nome no n8n | Tipo | Sistema | Owner | Rotação | Workflows que consomem |
|-------------|------|---------|-------|---------|------------------------|
| `wpp-business-api` | API Key | WhatsApp Business | Planejarcomm | Anual | comercial-qualifica-lead-whatsapp |
| `openai-prod` | API Key | OpenAI | Planejarcomm | Trimestral | múltiplos |
| `anthropic-prod` | API Key | Anthropic | Planejarcomm | Trimestral | múltiplos |
| `hubspot-prod` | OAuth2 | HubSpot CRM | Planejarcomm | Sob demanda | comercial-* |
| `google-workspace` | OAuth2 | Google APIs | Planejarcomm | Sob demanda | dados-* |
| `notion-prod` | Internal Token | Notion | Planejarcomm | Semestral | ops-* |
| `slack-bot` | Bot Token | Slack | Planejarcomm | Anual | notificacoes-* |

## Padrão de Nomenclatura

`[sistema]-[ambiente]` ou `[sistema]-[finalidade]`

Exemplos:
- `openai-prod` (produção)
- `openai-dev` (desenvolvimento)
- `wpp-marketing` (uso específico de marketing)

## Política de Rotação

1. Credenciais críticas (LLMs, WhatsApp, CRM) → rotação trimestral.
2. Credenciais sensíveis (financeiro, contratos) → rotação semestral.
3. Em caso de exposição → rotação imediata e auditoria.

## Procedimento de Rotação

1. Gerar nova credencial no sistema de origem.
2. Cadastrar com sufixo `-novo` no n8n.
3. Atualizar workflows um a um, validando.
4. Após 7 dias sem erros, excluir credencial antiga.
5. Registrar em changelog interno.

## Princípio de Menor Privilégio

Cada credencial deve ter **somente** os escopos necessários para o(s) workflow(s) que consome(m).
