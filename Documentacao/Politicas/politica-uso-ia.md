---
titulo: Política de Uso Institucional de IA
versao: 1.0.0
data: 2026-05-16
autor: Owner Nexa-Growth
proxima-revisao: 2026-11-16
tipo: politica
---

# Política de Uso Institucional de IA — Nexa Malls

## 1. Objetivo
Estabelecer princípios e regras institucionais para uso responsável, seguro e eficaz de Inteligência Artificial generativa na operação da Nexa Malls e Planejarcomm.

## 2. Escopo
Aplica-se a todo colaborador, parceiro ou prestador de serviço que utilize IA generativa (LLMs como Claude, GPT, Gemini, e ferramentas correlatas) em nome da Nexa Malls.

## 3. Princípios

1. **A IA assiste, não substitui o julgamento humano.**
2. **Toda saída institucional passa por revisão humana antes do uso público.**
3. **Dados sensíveis (financeiros, contratos, dados pessoais) só vão para APIs com contrato adequado de confidencialidade.**
4. **Transparência:** uso de IA é declarado quando relevante.
5. **Auditabilidade:** prompts críticos são versionados em `/IA/Prompts/`.

## 4. Regras Operacionais

### 4.1 Pode-se usar IA para
- Pesquisa institucional
- Síntese de informação pública
- Redação assistida (conteúdo, propostas, emails)
- Análise crítica de documentos próprios
- Tradução
- Brainstorm

### 4.2 NÃO se pode usar IA para
- Tomar decisões contratuais sem revisão humana
- Substituir parecer técnico de profissional regulamentado
- Gerar conteúdo enganoso ou difamatório
- Manipular dados financeiros oficiais
- Fabricar dados (números, citações, fontes)

### 4.3 Dados sensíveis
| Tipo de dado | Pode ir para LLM público? |
|--------------|----------------------------|
| Conteúdo público de mercado | ✅ Sim |
| Premissas anônimas de viabilidade | ✅ Sim |
| Dados pessoais de prospects | ❌ Não — apenas com contrato adequado |
| Contratos assinados | ❌ Não |
| Indicadores financeiros confidenciais | ❌ Não |

## 5. Provedores Aprovados
- **Anthropic (Claude)** — uso amplo
- **OpenAI (GPT)** — uso amplo
- **Google (Gemini)** — uso pontual
- **Outros** — apenas com aprovação do Owner

## 6. Versionamento de Prompts
Todo prompt usado em fluxos produtivos vive em `/IA/Prompts/` com:
- Header institucional (ver `/IA/README.md`)
- Versionamento SemVer
- Owner identificado
- Data de última revisão

## 7. Auditoria
- **Revisão trimestral** de prompts críticos.
- **Spot-check mensal** de outputs de agentes produtivos.
- **Log centralizado** de chamadas LLM (custo + tokens).

## 8. Sanções
Violações desta política podem resultar em:
- Advertência formal
- Suspensão de acesso às ferramentas
- Desligamento, em casos graves

## 9. Treinamento
Todo novo colaborador passa por sessão de **15 minutos** sobre esta política durante onboarding.

## 10. Histórico
| Versão | Data | Mudança |
|--------|------|---------|
| 1.0.0 | 2026-05-16 | Versão inicial |
