import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod'
import { getAnthropic, SCORING_MODEL } from '@/lib/anthropic'
import type { Database } from '@/lib/supabase/types'
import { scoringResultSchema, type ScoringResult } from './types'

type Lead = Pick<
  Database['public']['Tables']['leads']['Row'],
  | 'trade_name'
  | 'legal_name'
  | 'cnpj'
  | 'cnae_primary'
  | 'cnae_secondary'
  | 'category'
  | 'hq_city'
  | 'hq_state'
  | 'stores_count'
  | 'capital_social_cents'
  | 'founded_at'
>

type Shopping = Pick<
  Database['public']['Tables']['shoppings']['Row'],
  | 'name'
  | 'city'
  | 'state'
  | 'gla_sqm'
  | 'vacancy_sqm'
  | 'vacancy_rate'
  | 'monthly_footfall'
  | 'avg_ticket_cents'
  | 'audience_class'
  | 'current_mix'
  | 'status'
>

const SYSTEM_PROMPT = `Você é um analista sênior de prospecção comercial da Nexa Malls, uma rede brasileira de shoppings (strip malls e empreendimentos comerciais). Sua tarefa é avaliar o fit estratégico entre uma marca/varejista candidata (lead) e um shopping específico, gerando um score de 0 a 100 com justificativa.

Critérios que pesam:
- Aderência categoria/mix: a marca preenche um gap ou complementa o mix atual? Ou é redundante?
- Compatibilidade de público: o perfil socioeconômico do shopping casa com o ticket médio típico da marca?
- Geografia: a marca já opera na região? Tem distribuição/logística para atender?
- Maturidade: marca consolidada (várias lojas, capital social robusto, fundação antiga) vs. emergente.
- Vacância e oportunidade: shoppings com vacância alta priorizam ocupação rápida; com vacância baixa, são seletivos.
- Sinais de risco: marca em situação cadastral irregular, capital muito baixo para a operação proposta, ou sem presença física conhecida.

Sua resposta deve ser objetiva, baseada nos dados fornecidos. Se faltar informação crítica, reflita isso no score (sem inventar dados) e mencione os gaps nos fatores. Use português brasileiro.`

function buildUserPrompt(lead: Lead, shopping: Shopping): string {
  const fmtBRL = (cents: number | null | undefined) =>
    cents != null
      ? (cents / 100).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
          maximumFractionDigits: 0,
        })
      : 'desconhecido'

  return `## Marca candidata (lead)
- Nome fantasia: ${lead.trade_name}
- Razão social: ${lead.legal_name ?? '—'}
- CNPJ: ${lead.cnpj ?? '—'}
- CNAE principal: ${lead.cnae_primary ?? '—'}
- CNAEs secundários: ${lead.cnae_secondary?.length ? lead.cnae_secondary.join(', ') : '—'}
- Categoria: ${lead.category ?? '—'}
- HQ: ${[lead.hq_city, lead.hq_state].filter(Boolean).join(' / ') || '—'}
- Nº de lojas conhecidas: ${lead.stores_count ?? 'desconhecido'}
- Capital social: ${fmtBRL(lead.capital_social_cents)}
- Fundada em: ${lead.founded_at ?? '—'}

## Shopping
- Nome: ${shopping.name}
- Cidade / UF: ${shopping.city} / ${shopping.state}
- Status do empreendimento: ${shopping.status}
- ABL (m²): ${shopping.gla_sqm ?? '—'}
- Vacância (m²): ${shopping.vacancy_sqm ?? '—'}
- Taxa de vacância (%): ${shopping.vacancy_rate ?? '—'}
- Fluxo mensal estimado: ${shopping.monthly_footfall ?? '—'}
- Ticket médio: ${fmtBRL(shopping.avg_ticket_cents)}
- Classes de público: ${shopping.audience_class?.length ? shopping.audience_class.join(', ') : '—'}
- Mix atual (JSON): ${shopping.current_mix ? JSON.stringify(shopping.current_mix) : '—'}

## Tarefa
Avalie o fit desta marca para este shopping. Gere:
- score (0–100, inteiro)
- rationale (2–3 frases explicando o score)
- factors (3–6 fatores que mais pesaram, com impact positive/negative/neutral, weight 0–100 indicando importância relativa, e explanation curta)
- recommendation: prioritize (top alvo), consider (vale tentar), monitor (acompanhar), skip (não cabe)`
}

export async function scoreLeadVsShopping(
  lead: Lead,
  shopping: Shopping,
): Promise<{ result: ScoringResult; model: string }> {
  const client = getAnthropic()

  const response = await client.messages.parse({
    model: SCORING_MODEL,
    max_tokens: 4000,
    thinking: { type: 'adaptive' },
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: buildUserPrompt(lead, shopping) }],
    output_config: {
      format: zodOutputFormat(scoringResultSchema),
    },
  })

  if (!response.parsed_output) {
    throw new Error('Modelo não retornou resposta estruturada válida.')
  }

  return { result: response.parsed_output, model: response.model }
}
