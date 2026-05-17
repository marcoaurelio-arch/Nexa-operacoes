# OpenAI / Anthropic API — Integrações Institucionais

## Visão Geral

LLMs são consumidos em todos os pontos onde julgamento, síntese, classificação ou geração de linguagem natural agregam valor.

## Provedores

| Provedor | Modelos em uso | Função |
|----------|----------------|--------|
| Anthropic | Claude Opus 4, Sonnet 4 | Tarefas complexas, conteúdo, análise |
| OpenAI | GPT-4o, GPT-4o-mini | Workflows operacionais, triagem |
| OpenAI | text-embedding-3-large | RAG corporativo |

## Padrão de Chamada via n8n

```yaml
node: HTTP Request OU integração nativa
provedor: Anthropic | OpenAI
modelo: definido por workflow
temperature: 0 a 1 (justificar quando > 0.3)
max_tokens: limite definido
system: prompt institucional de /IA/Prompts/
user: input dinâmico do workflow
```

## Governança de Uso

- **Toda chamada** registra: timestamp, modelo, tokens in/out, custo estimado.
- **Limite de gasto** por workflow definido em `Automacoes/n8n/credenciais/`.
- **Modelos** podem ser trocados via variável central (`NEXA_DEFAULT_LLM`).
- **Cache** de chamadas idempotentes ativado quando aplicável.

## Boas Práticas

1. **Sempre** usar prompts versionados da pasta `/IA/Prompts/`.
2. **Nunca** colocar dados sensíveis no prompt sem necessidade.
3. **Sempre** validar output com regra determinística antes de agir.
4. **Sempre** ter fallback humano em fluxos críticos.

## Estimativa de Custos (referência)

| Modelo | Input $/1M tokens | Output $/1M tokens |
|--------|-------------------|---------------------|
| Claude Opus 4 | Alto | Muito alto |
| Claude Sonnet 4 | Médio | Médio |
| GPT-4o | Médio | Médio |
| GPT-4o-mini | Baixo | Baixo |

_(Valores variam — consultar pricing oficial mensalmente.)_

## Plano de Contingência

- Se Anthropic indisponível → fallback para OpenAI (e vice-versa).
- Se ambos indisponíveis → workflow degrada para fluxo humano.
- Alerta automático em Slack + WhatsApp on-call.
