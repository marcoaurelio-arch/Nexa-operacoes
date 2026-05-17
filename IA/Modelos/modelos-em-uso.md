# Modelos de IA em Uso — Nexa Malls

Última atualização: 2026-05-16

## Modelos em Produção

| Modelo | Provedor | Caso de Uso | Custo Estimado | Owner |
|--------|----------|-------------|----------------|-------|
| Claude Sonnet 4 | Anthropic | Conteúdo, SDR, comunicação | $$ | Planejarcomm |
| Claude Opus 4 | Anthropic | Análise crítica, viabilidade, propostas | $$$ | Planejarcomm |
| GPT-4o | OpenAI | Workflows operacionais em n8n | $$ | Planejarcomm |
| GPT-4o-mini | OpenAI | Triagem, classificação | $ | Planejarcomm |
| text-embedding-3-large | OpenAI | RAG corporativo | $ | Planejarcomm |

## Critério de Escolha de Modelo

| Tarefa | Modelo Recomendado | Justificativa |
|--------|--------------------|---------------| 
| Análise crítica / parecer técnico | Claude Opus 4 | Raciocínio profundo |
| Conteúdo institucional longo | Claude Sonnet 4 | Voz natural + custo |
| Triagem rápida / classificação | GPT-4o-mini | Custo-benefício |
| Função de embedding (RAG) | text-embedding-3-large | Padrão de mercado |
| Tarefas multimodais com imagem | Claude Opus 4 / GPT-4o | Capacidade visual |

## Governança

- **Rotação de chaves:** trimestral
- **Logs de uso:** centralizados via gateway
- **Limites de gasto:** por workflow/agente
- **Dados sensíveis:** somente em modelos com contrato de confidencialidade

## Avaliação

- **Cadência:** revisão trimestral de modelos vs. necessidade
- **Métricas:** custo/output, qualidade percebida, tempo de resposta
- **Benchmark:** comparar com novas releases a cada 6 meses
