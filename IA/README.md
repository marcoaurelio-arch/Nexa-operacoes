# 🧠 IA — Inteligência Artificial Corporativa

> Biblioteca institucional de prompts, agentes e modelos de IA aplicados à operação da Nexa Malls.

---

## 1. Objetivo

Tornar a Nexa Malls uma empresa **IA-native**: cada etapa da operação — prospecção, análise imobiliária, comunicação, gestão de ativos — é apoiada por prompts versionados, agentes especializados e bases de conhecimento curadas.

---

## 2. Estrutura

| Subpasta | Conteúdo |
|----------|----------|
| `Prompts/Prospeccao/` | Prompts para qualificação, enriquecimento e abordagem |
| `Prompts/Analise-Imobiliaria/` | Análise de terrenos, vocação, viabilidade preliminar |
| `Prompts/LinkedIn-Institucional/` | Geração de conteúdo institucional para LinkedIn |
| `Prompts/Viabilidade/` | Apoio a estudos econômico-financeiros |
| `Prompts/SDR/` | Scripts conversacionais e respostas a objeções |
| `Prompts/Comercial/` | Propostas, follow-ups, fechamento |
| `Prompts/Gestao-Ativos/` | Comunicação com lojistas, indicadores, governança |
| `Agentes/` | Agentes multi-step (Claude/OpenAI) com ferramentas |
| `Modelos/` | Documentação de modelos avaliados e em produção |
| `Bibliotecas/` | SDKs, wrappers e utilitários reutilizáveis |
| `RAG/Documentos/` | Base documental para Retrieval-Augmented Generation |
| `RAG/Bases-Conhecimento/` | Embeddings e índices vetoriais |

---

## 3. Responsáveis

| Função | Responsável |
|--------|-------------|
| Owner IA | Planejarcomm |
| Curadoria de prompts | Time de cada área |
| Aprovação institucional | Owner do repositório |
| Engenharia de agentes | Lead Técnico |

---

## 4. Ferramentas Utilizadas

- **LLMs:** OpenAI (GPT-4.x), Anthropic (Claude Opus/Sonnet/Haiku), Google (Gemini)
- **Orquestração:** n8n, LangChain, Anthropic Agent SDK
- **Vetorização:** OpenAI Embeddings, Voyage AI
- **Vector DB:** Pinecone / Qdrant / Supabase pgvector
- **Avaliação:** LangSmith / Helicone / próprio

---

## 5. Padrão Institucional de Prompt

Todo prompt deve conter este header em Markdown:

```markdown
---
nome: nome-descritivo-do-prompt
area: prospeccao | analise-imobiliaria | linkedin | viabilidade | sdr | comercial | gestao-ativos
modelo-recomendado: claude-sonnet-4 | gpt-4o | etc.
versao: 1.0.0
autor: nome do criador
data-criacao: YYYY-MM-DD
ultima-revisao: YYYY-MM-DD
objetivo: descrição em uma linha
inputs-esperados: lista de variáveis
outputs-esperados: formato de saída
metricas-de-qualidade: como avaliar o resultado
---

## Contexto

(definição do papel e escopo do agente)

## Instruções

(passo a passo claro e numerado)

## Restrições

(o que NÃO deve ser feito)

## Exemplos

(few-shot quando aplicável)
```

---

## 6. Categorias de Prompts

### 6.1 Prospecção
- Pesquisa de empresa-alvo
- Identificação de tomadores de decisão
- Personalização de abordagem
- Enriquecimento de dados

### 6.2 Análise Imobiliária
- Vocação de terreno
- Análise de microrregião
- Identificação de demanda
- Síntese de zoneamento

### 6.3 LinkedIn Institucional
- Posts autorais sobre strip malls
- Carrosséis técnicos
- Comentários institucionais
- Roteiros para vídeos curtos

### 6.4 Viabilidade
- Revisão de premissas
- Geração de cenários
- Crítica de sensibilidade
- Sumário executivo

### 6.5 SDR
- Roteiro de cold call
- Resposta a objeções
- Mensagens de cadência
- Qualificação BANT

### 6.6 Comercial
- Estrutura de proposta
- Argumentação técnica
- Negociação
- Follow-up personalizado

### 6.7 Gestão de Ativos
- Comunicação com lojistas
- Sumário de indicadores
- Briefing operacional
- Atas estruturadas

---

## 7. Status Operacional

| Componente | Status |
|------------|--------|
| Estrutura de pastas | ✅ Implantada |
| Header institucional | ✅ Definido |
| Biblioteca inicial | 🔄 Em construção |
| RAG corporativo | ⏳ Backlog |
| Agentes em produção | ⏳ Backlog |

---

## 8. Fluxos Relacionados

- `/Automacoes/n8n/workflows/` — workflows que consomem estes prompts.
- `/Comercial/Scripts/` — scripts que se beneficiam de assistência IA.
- `/Documentacao/Politicas/` — política de uso de IA institucional.

---

## 9. Governança e Ética

- Toda saída de IA institucional passa por revisão humana antes de uso público.
- Dados confidenciais (lojistas, investidores, financeiros) não vão para APIs sem contrato adequado.
- Auditoria trimestral de prompts críticos.
- Versionamento obrigatório de prompts em produção.
