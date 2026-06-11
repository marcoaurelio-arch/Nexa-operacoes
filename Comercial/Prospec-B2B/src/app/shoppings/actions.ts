'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { slugify } from '@/lib/slug'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import type { Database } from '@/lib/supabase/types'

type ShoppingInsert = Database['public']['Tables']['shoppings']['Insert']

const STATES = [
  'AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN',
  'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO',
] as const

const shoppingSchema = z.object({
  name: z.string().trim().min(1, 'Nome é obrigatório.').max(120),
  city: z.string().trim().min(1, 'Cidade é obrigatória.').max(80),
  state: z.enum(STATES, 'UF inválida.'),
  status: z.enum(['active', 'planning', 'inactive']).default('active'),
  gla_sqm: z.coerce.number().nonnegative().nullable().optional(),
  vacancy_sqm: z.coerce.number().nonnegative().nullable().optional(),
  vacancy_rate: z.coerce
    .number()
    .min(0)
    .max(100)
    .nullable()
    .optional(),
  monthly_footfall: z.coerce.number().int().nonnegative().nullable().optional(),
  avg_ticket_brl: z.coerce.number().nonnegative().nullable().optional(),
  address: z.string().trim().max(200).nullable().optional(),
  cep: z.string().trim().max(20).nullable().optional(),
})

export type ShoppingFormState =
  | { status: 'idle' }
  | { status: 'error'; message: string; fieldErrors?: Record<string, string> }

function parseFormData(formData: FormData) {
  const raw = Object.fromEntries(formData.entries())
  // Normalize empty strings to null on optional fields.
  const normalized: Record<string, FormDataEntryValue | null> = {}
  for (const [k, v] of Object.entries(raw)) {
    normalized[k] = typeof v === 'string' && v.trim() === '' ? null : v
  }
  return shoppingSchema.safeParse(normalized)
}

function toInsert(
  parsed: z.infer<typeof shoppingSchema>,
  slug: string,
): ShoppingInsert {
  const avgTicketCents =
    parsed.avg_ticket_brl != null
      ? Math.round(parsed.avg_ticket_brl * 100)
      : null
  return {
    name: parsed.name,
    slug,
    city: parsed.city,
    state: parsed.state,
    status: parsed.status,
    gla_sqm: parsed.gla_sqm ?? null,
    vacancy_sqm: parsed.vacancy_sqm ?? null,
    vacancy_rate: parsed.vacancy_rate ?? null,
    monthly_footfall: parsed.monthly_footfall ?? null,
    avg_ticket_cents: avgTicketCents,
    address: parsed.address ?? null,
    cep: parsed.cep ?? null,
  }
}

export async function createShopping(
  _prev: ShoppingFormState,
  formData: FormData,
): Promise<ShoppingFormState> {
  const parsed = parseFormData(formData)
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? 'form')
      fieldErrors[key] = issue.message
    }
    return { status: 'error', message: 'Confira os campos.', fieldErrors }
  }

  const supabase = getSupabaseAdmin()
  const baseSlug = slugify(parsed.data.name) || 'shopping'

  // Try base slug, fall back to suffixed slugs on collision.
  for (let attempt = 0; attempt < 5; attempt++) {
    const slug = attempt === 0 ? baseSlug : `${baseSlug}-${attempt + 1}`
    const { data, error } = await supabase
      .from('shoppings')
      .insert(toInsert(parsed.data, slug))
      .select('id')
      .single()

    if (!error && data) {
      revalidatePath('/shoppings')
      redirect(`/shoppings/${(data as { id: string }).id}`)
    }

    if (error && error.code !== '23505') {
      return { status: 'error', message: `Falha ao gravar: ${error.message}` }
    }
  }
  return { status: 'error', message: 'Não foi possível gerar slug único.' }
}

export async function updateShopping(
  id: string,
  _prev: ShoppingFormState,
  formData: FormData,
): Promise<ShoppingFormState> {
  const parsed = parseFormData(formData)
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0] ?? 'form')] = issue.message
    }
    return { status: 'error', message: 'Confira os campos.', fieldErrors }
  }

  const supabase = getSupabaseAdmin()
  const { error } = await supabase
    .from('shoppings')
    .update(toInsert(parsed.data, slugify(parsed.data.name)))
    .eq('id', id)

  if (error) {
    return { status: 'error', message: `Falha ao atualizar: ${error.message}` }
  }

  revalidatePath('/shoppings')
  revalidatePath(`/shoppings/${id}`)
  redirect(`/shoppings/${id}`)
}

export async function deleteShopping(formData: FormData) {
  const id = String(formData.get('id') ?? '')
  if (!id) return
  const supabase = getSupabaseAdmin()
  await supabase.from('shoppings').delete().eq('id', id)
  revalidatePath('/shoppings')
  redirect('/shoppings')
}
