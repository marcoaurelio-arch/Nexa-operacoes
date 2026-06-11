import type { CnpjResponse } from './cnpj'

export type LeadDraft = {
  cnpj: string
  legal_name: string | null
  trade_name: string
  cnae_primary: string | null
  cnae_secondary: string[]
  hq_city: string | null
  hq_state: string | null
  capital_social_cents: number | null
  founded_at: string | null
  raw_enrichment: { receita: CnpjResponse }
  data_sources: string[]
}

export function cnpjToLeadDraft(payload: CnpjResponse): LeadDraft {
  const tradeName =
    payload.nome_fantasia?.trim() ||
    payload.razao_social?.trim() ||
    `CNPJ ${payload.cnpj}`

  const cnaePrimary =
    payload.cnae_fiscal != null ? String(payload.cnae_fiscal) : null

  const cnaeSecondary = (payload.cnaes_secundarios ?? []).map((c) =>
    String(c.codigo),
  )

  const capitalCents =
    payload.capital_social != null
      ? Math.round(payload.capital_social * 100)
      : null

  return {
    cnpj: payload.cnpj,
    legal_name: payload.razao_social,
    trade_name: tradeName,
    cnae_primary: cnaePrimary,
    cnae_secondary: cnaeSecondary,
    hq_city: payload.municipio,
    hq_state: payload.uf,
    capital_social_cents: capitalCents,
    founded_at: payload.data_inicio_atividade,
    raw_enrichment: { receita: payload },
    data_sources: ['receita'],
  }
}
