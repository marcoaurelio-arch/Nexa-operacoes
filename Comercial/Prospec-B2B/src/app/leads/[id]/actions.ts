'use server'

import { revalidatePath } from 'next/cache'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { scoreLeadVsShopping } from '@/lib/scoring/score-lead'

export type ScoreState =
  | { status: 'idle' }
  | { status: 'ok'; score: number; recommendation: string }
  | { status: 'error'; message: string }

export async function scoreLeadAction(
  _prev: ScoreState,
  formData: FormData,
): Promise<ScoreState> {
  const leadId = String(formData.get('lead_id') ?? '')
  const shoppingId = String(formData.get('shopping_id') ?? '')

  if (!leadId || !shoppingId) {
    return { status: 'error', message: 'lead_id e shopping_id são obrigatórios.' }
  }

  const supabase = getSupabaseAdmin()

  const [leadRes, shoppingRes] = await Promise.all([
    supabase.from('leads').select('*').eq('id', leadId).single(),
    supabase.from('shoppings').select('*').eq('id', shoppingId).single(),
  ])

  if (leadRes.error || !leadRes.data) {
    return { status: 'error', message: `Lead não encontrado: ${leadRes.error?.message ?? ''}` }
  }
  if (shoppingRes.error || !shoppingRes.data) {
    return { status: 'error', message: `Shopping não encontrado: ${shoppingRes.error?.message ?? ''}` }
  }

  try {
    const { result, model } = await scoreLeadVsShopping(
      leadRes.data,
      shoppingRes.data,
    )

    const { error: insertError } = await supabase.from('lead_scores').upsert(
      {
        lead_id: leadId,
        shopping_id: shoppingId,
        score: result.score,
        rationale: result.rationale,
        model,
        factors: {
          recommendation: result.recommendation,
          items: result.factors,
        },
      },
      { onConflict: 'lead_id,shopping_id' },
    )

    if (insertError) {
      return {
        status: 'error',
        message: `Score gerado mas falhou ao gravar: ${insertError.message}`,
      }
    }

    revalidatePath(`/leads/${leadId}`)
    return {
      status: 'ok',
      score: result.score,
      recommendation: result.recommendation,
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao chamar Claude.'
    return { status: 'error', message }
  }
}
