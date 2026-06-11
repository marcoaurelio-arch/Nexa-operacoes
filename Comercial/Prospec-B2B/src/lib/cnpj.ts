import { z } from 'zod'

const BRASIL_API_BASE = 'https://brasilapi.com.br/api/cnpj/v1'

const qsaSchema = z.object({
  identificador_de_socio: z.number().nullable().optional(),
  nome_socio: z.string().nullable().optional(),
  cnpj_cpf_do_socio: z.string().nullable().optional(),
  codigo_qualificacao_socio: z.number().nullable().optional(),
})

const cnaeSecundarioSchema = z.object({
  codigo: z.number(),
  descricao: z.string(),
})

export const cnpjResponseSchema = z.object({
  cnpj: z.string(),
  razao_social: z.string().nullable(),
  nome_fantasia: z.string().nullable(),
  cnae_fiscal: z.number().nullable(),
  cnae_fiscal_descricao: z.string().nullable(),
  cnaes_secundarios: z.array(cnaeSecundarioSchema).optional().default([]),
  capital_social: z.number().nullable(),
  data_inicio_atividade: z.string().nullable(),
  descricao_situacao_cadastral: z.string().nullable(),
  natureza_juridica: z.string().nullable(),
  porte: z.string().nullable(),
  logradouro: z.string().nullable(),
  numero: z.string().nullable(),
  complemento: z.string().nullable(),
  bairro: z.string().nullable(),
  municipio: z.string().nullable(),
  uf: z.string().nullable(),
  cep: z.string().nullable(),
  ddd_telefone_1: z.string().nullable(),
  qsa: z.array(qsaSchema).optional().default([]),
})

export type CnpjResponse = z.infer<typeof cnpjResponseSchema>

export function normalizeCnpj(input: string): string {
  return input.replace(/\D/g, '')
}

export function isValidCnpjFormat(cnpj: string): boolean {
  return /^\d{14}$/.test(normalizeCnpj(cnpj))
}

export class CnpjLookupError extends Error {
  constructor(
    message: string,
    public readonly cause?: { status?: number; body?: unknown },
  ) {
    super(message)
    this.name = 'CnpjLookupError'
  }
}

export async function fetchCnpj(cnpj: string): Promise<CnpjResponse> {
  const clean = normalizeCnpj(cnpj)
  if (!isValidCnpjFormat(clean)) {
    throw new CnpjLookupError('CNPJ deve ter 14 dígitos.')
  }

  const res = await fetch(`${BRASIL_API_BASE}/${clean}`, {
    headers: { Accept: 'application/json' },
    next: { revalidate: 60 * 60 * 24 },
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    if (res.status === 404) {
      throw new CnpjLookupError('CNPJ não encontrado na Receita.', {
        status: 404,
        body,
      })
    }
    throw new CnpjLookupError(
      `Falha ao consultar BrasilAPI (HTTP ${res.status}).`,
      { status: res.status, body },
    )
  }

  const json = await res.json()
  const parsed = cnpjResponseSchema.safeParse(json)
  if (!parsed.success) {
    throw new CnpjLookupError('Resposta inesperada da BrasilAPI.', {
      body: parsed.error.format(),
    })
  }
  return parsed.data
}
