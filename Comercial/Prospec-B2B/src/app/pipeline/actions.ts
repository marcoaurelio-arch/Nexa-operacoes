'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import {
  STAGE_LABEL,
  STAGE_ORDER,
  type ActivityKind,
  type OpportunityStage,
} from '@/lib/supabase/types'

export type AddToPipelineState =
  | { status: 'idle' }
  | { status: 'ok'; opportunityId: string }
  | { status: 'error'; message: string }

export async function addToPipeline(
  _prev: AddToPipelineState,
  formData: FormData,
): Promise<AddToPipelineState> {
  const leadId = String(formData.get('lead_id') ?? '')
  const shoppingId = String(formData.get('shopping_id') ?? '')
  if (!leadId || !shoppingId) {
    return { status: 'error', message: 'lead_id e shopping_id obrigatórios.' }
  }

  const supabase = getSupabaseAdmin()

  const { data: existing } = await supabase
    .from('opportunities')
    .select('id')
    .eq('lead_id', leadId)
    .eq('shopping_id', shoppingId)
    .maybeSingle()

  if (existing) {
    return { status: 'ok', opportunityId: (existing as { id: string }).id }
  }

  const { data, error } = await supabase
    .from('opportunities')
    .insert({ lead_id: leadId, shopping_id: shoppingId, stage: 'new' })
    .select('id')
    .single()

  if (error || !data) {
    return {
      status: 'error',
      message: `Falha ao criar oportunidade: ${error?.message ?? ''}`,
    }
  }

  const opportunityId = (data as { id: string }).id

  await supabase.from('activities').insert({
    opportunity_id: opportunityId,
    kind: 'stage_change' satisfies ActivityKind,
    content: `Oportunidade criada em ${STAGE_LABEL.new}`,
    metadata: { from: null, to: 'new' },
  })

  revalidatePath('/pipeline')
  revalidatePath(`/leads/${leadId}`)
  return { status: 'ok', opportunityId }
}

const VALID_STAGES = new Set<OpportunityStage>(STAGE_ORDER)

export async function moveStage(formData: FormData) {
  const opportunityId = String(formData.get('opportunity_id') ?? '')
  const nextStage = String(formData.get('stage') ?? '') as OpportunityStage
  if (!opportunityId || !VALID_STAGES.has(nextStage)) return

  const supabase = getSupabaseAdmin()

  const { data: current } = await supabase
    .from('opportunities')
    .select('stage')
    .eq('id', opportunityId)
    .single()

  const fromStage = (current as { stage: OpportunityStage } | null)?.stage ?? null

  if (fromStage === nextStage) return

  const { error } = await supabase
    .from('opportunities')
    .update({ stage: nextStage })
    .eq('id', opportunityId)
  if (error) return

  await supabase.from('activities').insert({
    opportunity_id: opportunityId,
    kind: 'stage_change' satisfies ActivityKind,
    content: `${fromStage ? STAGE_LABEL[fromStage] : '—'} → ${STAGE_LABEL[nextStage]}`,
    metadata: { from: fromStage, to: nextStage },
  })

  revalidatePath('/pipeline')
  revalidatePath(`/pipeline/${opportunityId}`)
}

export async function addNote(formData: FormData) {
  const opportunityId = String(formData.get('opportunity_id') ?? '')
  const content = String(formData.get('content') ?? '').trim()
  const kind = (String(formData.get('kind') ?? 'note') as ActivityKind) || 'note'
  if (!opportunityId || !content) return

  const supabase = getSupabaseAdmin()
  await supabase.from('activities').insert({
    opportunity_id: opportunityId,
    kind,
    content,
  })
  revalidatePath(`/pipeline/${opportunityId}`)
}

export async function deleteOpportunity(formData: FormData) {
  const opportunityId = String(formData.get('opportunity_id') ?? '')
  if (!opportunityId) return
  const supabase = getSupabaseAdmin()
  await supabase.from('opportunities').delete().eq('id', opportunityId)
  revalidatePath('/pipeline')
  redirect('/pipeline')
}
