import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import {
  STAGE_LABEL,
  STAGE_ORDER,
  type ActivityKind,
  type OpportunityStage,
} from '@/lib/supabase/types'
import { addNote, deleteOpportunity, moveStage } from '../actions'

type Props = {
  params: Promise<{ id: string }>
}

export const metadata = {
  title: 'Oportunidade · Prospec B2B',
}

const KIND_LABEL: Record<ActivityKind, string> = {
  note: 'Nota',
  email: 'E-mail',
  call: 'Ligação',
  whatsapp: 'WhatsApp',
  meeting: 'Reunião',
  stage_change: 'Estágio',
}

const KIND_TONE: Record<ActivityKind, string> = {
  note: 'bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
  email: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200',
  call: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200',
  whatsapp: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200',
  meeting: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200',
  stage_change: 'bg-zinc-300 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-200',
}

export default async function OpportunityDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect(`/login?next=/pipeline/${id}`)

  type OppRow = {
    id: string
    stage: OpportunityStage
    expected_close_at: string | null
    expected_rent_cents: number | null
    loss_reason: string | null
    created_at: string
    updated_at: string
    leads: { id: string; trade_name: string; cnpj: string | null; hq_city: string | null; hq_state: string | null } | null
    shoppings: { id: string; name: string; city: string; state: string } | null
  }

  const { data: oppRaw, error } = await supabase
    .from('opportunities')
    .select(
      'id, stage, expected_close_at, expected_rent_cents, loss_reason, created_at, updated_at, leads(id, trade_name, cnpj, hq_city, hq_state), shoppings(id, name, city, state)',
    )
    .eq('id', id)
    .single()

  if (error || !oppRaw) notFound()

  const opp = oppRaw as unknown as OppRow
  const lead = opp.leads
  const shopping = opp.shoppings

  const { data: activities } = await supabase
    .from('activities')
    .select('id, kind, content, metadata, created_at')
    .eq('opportunity_id', id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-4xl px-6 py-4">
          <Link
            href="/pipeline"
            className="text-sm text-zinc-500 underline-offset-2 hover:underline"
          >
            ← Pipeline
          </Link>
          <h1 className="mt-1 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            {lead?.trade_name ?? '—'}{' '}
            <span className="font-normal text-zinc-500">×</span>{' '}
            {shopping?.name ?? '—'}
          </h1>
          <p className="text-sm text-zinc-500">
            {shopping?.city}/{shopping?.state} · estágio atual:{' '}
            <strong className="text-zinc-700 dark:text-zinc-300">
              {STAGE_LABEL[opp.stage]}
            </strong>
          </p>
        </div>
      </header>

      <main className="mx-auto grid max-w-4xl gap-6 px-6 py-8 md:grid-cols-3">
        <aside className="space-y-4 md:col-span-1">
          <section className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              Mover para
            </h2>
            <div className="mt-3 flex flex-col gap-1.5">
              {STAGE_ORDER.map((stage) => (
                <form key={stage} action={moveStage}>
                  <input type="hidden" name="opportunity_id" value={opp.id} />
                  <input type="hidden" name="stage" value={stage} />
                  <button
                    type="submit"
                    disabled={stage === opp.stage}
                    className={`w-full rounded-md px-3 py-1.5 text-left text-xs font-medium transition ${
                      stage === opp.stage
                        ? 'bg-zinc-900 text-white opacity-60 dark:bg-zinc-50 dark:text-zinc-900'
                        : 'border border-zinc-200 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800'
                    }`}
                  >
                    {STAGE_LABEL[stage]}
                  </button>
                </form>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              Lead
            </h2>
            <Link
              href={`/leads/${lead?.id}`}
              className="mt-2 block text-sm font-medium text-zinc-900 hover:underline dark:text-zinc-50"
            >
              {lead?.trade_name}
            </Link>
            <p className="text-xs text-zinc-500">{lead?.cnpj ?? '—'}</p>
            <p className="text-xs text-zinc-500">
              {[lead?.hq_city, lead?.hq_state].filter(Boolean).join(' / ') || '—'}
            </p>

            <h2 className="mt-4 text-xs font-medium uppercase tracking-wide text-zinc-500">
              Shopping
            </h2>
            <Link
              href={`/shoppings/${shopping?.id}`}
              className="mt-2 block text-sm font-medium text-zinc-900 hover:underline dark:text-zinc-50"
            >
              {shopping?.name}
            </Link>
            <p className="text-xs text-zinc-500">
              {shopping?.city} / {shopping?.state}
            </p>
          </section>

          <section className="rounded-lg border border-red-200 bg-white p-4 dark:border-red-900/50 dark:bg-zinc-900">
            <h2 className="text-xs font-medium uppercase tracking-wide text-red-700 dark:text-red-400">
              Zona perigosa
            </h2>
            <form action={deleteOpportunity} className="mt-3">
              <input type="hidden" name="opportunity_id" value={opp.id} />
              <button
                type="submit"
                className="w-full rounded-md border border-red-300 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950"
              >
                Excluir oportunidade
              </button>
            </form>
          </section>
        </aside>

        <section className="space-y-4 md:col-span-2">
          <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              Adicionar atividade
            </h2>
            <form action={addNote} className="mt-3 space-y-2">
              <input type="hidden" name="opportunity_id" value={opp.id} />
              <select
                name="kind"
                defaultValue="note"
                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
              >
                <option value="note">Nota</option>
                <option value="email">E-mail</option>
                <option value="call">Ligação</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="meeting">Reunião</option>
              </select>
              <textarea
                name="content"
                required
                rows={3}
                placeholder="O que aconteceu? (ex: liguei pra Maria do comercial, marcamos reunião sexta)"
                className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
              />
              <button
                type="submit"
                className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Registrar
              </button>
            </form>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            <div className="border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
              <h2 className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                Timeline
              </h2>
            </div>
            {activities && activities.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-zinc-500">
                Nenhuma atividade ainda.
              </p>
            ) : (
              <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {(activities ?? []).map((a) => (
                  <li key={a.id} className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${KIND_TONE[a.kind as ActivityKind]}`}
                      >
                        {KIND_LABEL[a.kind as ActivityKind]}
                      </span>
                      <time className="text-xs text-zinc-500">
                        {new Date(a.created_at).toLocaleString('pt-BR')}
                      </time>
                    </div>
                    {a.content && (
                      <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
                        {a.content}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
