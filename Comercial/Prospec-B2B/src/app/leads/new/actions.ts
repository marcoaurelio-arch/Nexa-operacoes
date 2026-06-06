'use server'

import { cnpjToLeadDraft, type LeadDraft } from '@/lib/cnpj-to-lead'
import { CnpjLookupError, fetchCnpj } from '@/lib/cnpj'

export type LookupState =
  | { status: 'idle' }
  | { status: 'ok'; draft: LeadDraft }
  | { status: 'error'; message: string }

export async function lookupCnpjAction(
  _prev: LookupState,
  formData: FormData,
): Promise<LookupState> {
  const cnpj = String(formData.get('cnpj') ?? '')

  try {
    const payload = await fetchCnpj(cnpj)
    return { status: 'ok', draft: cnpjToLeadDraft(payload) }
  } catch (err) {
    if (err instanceof CnpjLookupError) {
      return { status: 'error', message: err.message }
    }
    return { status: 'error', message: 'Erro inesperado ao consultar CNPJ.' }
  }
}
