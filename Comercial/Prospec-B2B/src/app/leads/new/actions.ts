'use server'

import { revalidatePath } from 'next/cache'
import { cnpjToLeadDraft, type LeadDraft } from '@/lib/cnpj-to-lead'
import { CnpjLookupError, fetchCnpj } from '@/lib/cnpj'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

export type LookupState =
  | { status: 'idle' }
  | { status: 'preview'; draft: LeadDraft }
  | { status: 'saved'; draft: LeadDraft; leadId: string }
  | { status: 'error'; message: string }

export async function lookupCnpjAction(
  _prev: LookupState,
  formData: FormData,
): Promise<LookupState> {
  const cnpj = String(formData.get('cnpj') ?? '')
  const persist = formData.get('persist') === '1'

  try {
    const payload = await fetchCnpj(cnpj)
    const draft = cnpjToLeadDraft(payload)

    if (!persist) {
      return { status: 'preview', draft }
    }

    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('leads')
      .upsert(draft, { onConflict: 'cnpj' })
      .select('id')
      .single()

    if (error) {
      return {
        status: 'error',
        message: `Falha ao gravar lead: ${error.message}`,
      }
    }

    revalidatePath('/leads')
    return { status: 'saved', draft, leadId: (data as { id: string }).id }
  } catch (err) {
    if (err instanceof CnpjLookupError) {
      return { status: 'error', message: err.message }
    }
    const message = err instanceof Error ? err.message : 'Erro inesperado.'
    return { status: 'error', message }
  }
}
