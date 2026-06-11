import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { STAGE_LABEL, STAGE_ORDER } from '@/lib/supabase/types'
import type { OpportunityStage } from '@/lib/supabase/types'

export const metadata = {
  title: 'Pipeline · Prospec B2B',
}

const STAGE_TONE: Record<OpportunityStage, string> = {
  new: 'bg-zinc-100 dark:bg-zinc-800',
  qualified: 'bg-blue-50 dark:bg-blue-950/40',
  contacted: 'bg-blue-100 dark:bg-blue-950/60',
  meeting: 'bg-amber-50 dark:bg-amber-950/40',
  proposal: 'bg-amber-100 dark:bg-amber-950/60',
  negotiation: 'bg-orange-100 dark:bg-orange-950/60',
  won: 'bg-emerald-100 dark:bg-emerald-950/60',
  lost: 'bg-zinc-100 opacity-70 dark:bg-zinc-800',
}

type OpportunityRow = {
  id: string
  stage: OpportunityStage
  updated_at: string
  leads: { id: string; trade_name: string; hq_city: string | null; hq_state: string | null } | null
  shoppings: { id: string; name: string; city: string; state: string } | null
}

export default async function PipelinePage() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/pipeline')

  const { data: opps, error } = await supabase
    .from('opportunities')
    .select(
      'id, stage, updated_at, leads(id, trade_name, hq_city, hq_state), shoppings(id, name, city, state)',
    )
    .order('updated_at', { ascending: false })

  const byStage = new Map<OpportunityStage, OpportunityRow[]>()
  for (const stage of STAGE_ORDER) byStage.set(stage, [])
  for (const row of (opps ?? []) as unknown as OpportunityRow[]) {
    byStage.get(row.stage)?.push(row)
  }

  const total = opps?.length ?? 0
  const won = byStage.get('won')?.length ?? 0
  const lost = byStage.get('lost')?.length ?? 0
  const open = total - won - lost

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              Prospec B2B
            </p>
            <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Pipeline
            </h1>
          </div>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/leads" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50">Leads</Link>
            <Link href="/shoppings" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50">Shoppings</Link>
            <span className="text-zinc-500">{user.email}</span>
          </nav>
        </div>
        <div className="border-t border-zinc-100 bg-zinc-50 px-6 py-2 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto flex max-w-7xl gap-6 text-xs text-zinc-600 dark:text-zinc-400">
            <span><strong className="text-zinc-900 dark:text-zinc-50">{open}</strong> em aberto</span>
            <span><strong className="text-emerald-700 dark:text-emerald-300">{won}</strong> ganhos</span>
            <span><strong className="text-zinc-500">{lost}</strong> perdidos</span>
            <span className="text-zinc-400">total: {total}</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {error && (
          <div className="mb-4 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
            Falha ao carregar pipeline: {error.message}
          </div>
        )}

        {total === 0 && !error && (
          <div className="rounded-lg border border-dashed border-zinc-300 bg-white px-6 py-12 text-center dark:border-zinc-700 dark:bg-zinc-900">
            <p className="text-zinc-600 dark:text-zinc-400">
              Nenhuma oportunidade no pipeline ainda.
            </p>
            <p className="mt-2 text-sm text-zinc-500">
              Abra um lead, calcule o score contra um shopping, e clique em{' '}
              <strong>Adicionar ao pipeline</strong> na linha do shopping.
            </p>
            <Link
              href="/leads"
              className="mt-4 inline-block text-sm font-medium text-zinc-900 underline underline-offset-4 dark:text-zinc-50"
            >
              Ir para leads →
            </Link>
          </div>
        )}

        {total > 0 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
            {STAGE_ORDER.map((stage) => {
              const items = byStage.get(stage) ?? []
              return (
                <div
                  key={stage}
                  className={`rounded-lg ${STAGE_TONE[stage]} p-3`}
                >
                  <div className="mb-3 flex items-baseline justify-between px-1">
                    <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-700 dark:text-zinc-300">
                      {STAGE_LABEL[stage]}
                    </h2>
                    <span className="text-xs text-zinc-500">{items.length}</span>
                  </div>
                  <div className="space-y-2">
                    {items.map((o) => (
                      <Link
                        key={o.id}
                        href={`/pipeline/${o.id}`}
                        className="block rounded-md border border-zinc-200 bg-white p-3 transition hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-600"
                      >
                        <div className="font-medium text-sm text-zinc-900 dark:text-zinc-50">
                          {o.leads?.trade_name ?? '—'}
                        </div>
                        <div className="mt-0.5 text-xs text-zinc-500">
                          → {o.shoppings?.name ?? '—'}
                        </div>
                        <div className="mt-2 text-[10px] uppercase tracking-wide text-zinc-400">
                          {new Date(o.updated_at).toLocaleDateString('pt-BR')}
                        </div>
                      </Link>
                    ))}
                    {items.length === 0 && (
                      <p className="px-2 py-4 text-center text-xs text-zinc-400">
                        vazio
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
