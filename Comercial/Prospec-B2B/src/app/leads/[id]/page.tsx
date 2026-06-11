import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { ScoreShoppingRow } from './score-shopping-row'

type Props = {
  params: Promise<{ id: string }>
}

export const metadata = {
  title: 'Lead · Prospec B2B',
}

const brl = (cents: number | null | undefined) =>
  cents != null
    ? (cents / 100).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        maximumFractionDigits: 0,
      })
    : '—'

export default async function LeadDetailPage({ params }: Props) {
  const { id } = await params

  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect(`/login?next=/leads/${id}`)

  const { data: lead, error: leadError } = await supabase
    .from('leads')
    .select('*')
    .eq('id', id)
    .single()

  if (leadError || !lead) notFound()

  const { data: shoppings } = await supabase
    .from('shoppings')
    .select('id, name, city, state, vacancy_rate, status')
    .order('name')

  const { data: scores } = await supabase
    .from('lead_scores')
    .select('shopping_id, score, rationale, model, factors, created_at')
    .eq('lead_id', id)

  const scoreByShopping = new Map(
    (scores ?? []).map((s) => [s.shopping_id, s]),
  )

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-5xl px-6 py-4">
          <Link
            href="/leads"
            className="text-sm text-zinc-500 underline-offset-2 hover:underline"
          >
            ← Leads
          </Link>
          <h1 className="mt-1 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            {lead.trade_name}
          </h1>
          {lead.legal_name && lead.legal_name !== lead.trade_name && (
            <p className="text-sm text-zinc-500">{lead.legal_name}</p>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-8 px-6 py-10">
        <section className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Identificação
          </h2>
          <dl className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
            <Field label="CNPJ" value={lead.cnpj} />
            <Field label="CNAE principal" value={lead.cnae_primary} />
            <Field
              label="Cidade / UF"
              value={
                [lead.hq_city, lead.hq_state].filter(Boolean).join(' / ') || null
              }
            />
            <Field label="Capital social" value={brl(lead.capital_social_cents)} />
            <Field label="Fundada em" value={lead.founded_at} />
            <Field
              label="Lojas conhecidas"
              value={lead.stores_count?.toString() ?? null}
            />
          </dl>
        </section>

        <section>
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              Fit por shopping
            </h2>
            <p className="text-xs text-zinc-500">
              Score 0-100 gerado por Claude
            </p>
          </div>

          {!shoppings || shoppings.length === 0 ? (
            <div className="rounded-lg border border-dashed border-zinc-300 bg-white px-6 py-12 text-center dark:border-zinc-700 dark:bg-zinc-900">
              <p className="text-zinc-600 dark:text-zinc-400">
                Nenhum shopping cadastrado.
              </p>
              <Link
                href="/shoppings/new"
                className="mt-3 inline-block text-sm font-medium text-zinc-900 underline underline-offset-4 dark:text-zinc-50"
              >
                Cadastrar shopping →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {shoppings.map((s) => (
                <ScoreShoppingRow
                  key={s.id}
                  leadId={lead.id}
                  shopping={s}
                  existingScore={scoreByShopping.get(s.id) ?? null}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

function Field({
  label,
  value,
}: {
  label: string
  value: string | null | undefined
}) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-zinc-500">{label}</dt>
      <dd className="mt-0.5 text-zinc-900 dark:text-zinc-50">{value ?? '—'}</dd>
    </div>
  )
}
