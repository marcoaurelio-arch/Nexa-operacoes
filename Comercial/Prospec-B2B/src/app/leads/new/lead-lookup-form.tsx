'use client'

import { useActionState } from 'react'
import { lookupCnpjAction, type LookupState } from './actions'

const initialState: LookupState = { status: 'idle' }

const brl = (cents: number | null) => {
  if (cents == null) return '—'
  return (cents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

export function LeadLookupForm() {
  const [state, formAction, pending] = useActionState(
    lookupCnpjAction,
    initialState,
  )

  const draft =
    state.status === 'preview' || state.status === 'saved' ? state.draft : null

  return (
    <div className="space-y-6">
      <form action={formAction} className="flex gap-2">
        <input
          name="cnpj"
          required
          inputMode="numeric"
          placeholder="00.000.000/0000-00"
          defaultValue={draft?.cnpj ?? ''}
          className="flex-1 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {pending ? 'Buscando…' : 'Consultar'}
        </button>
      </form>

      {state.status === 'error' && (
        <div className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
          {state.message}
        </div>
      )}

      {draft && (
        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">
                {draft.trade_name}
              </h2>
              {draft.legal_name && draft.legal_name !== draft.trade_name && (
                <p className="text-sm text-zinc-500">{draft.legal_name}</p>
              )}
            </div>
            {state.status === 'saved' && (
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
                Salvo · {state.leadId.slice(0, 8)}
              </span>
            )}
          </div>

          <dl className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            <Field label="CNPJ" value={draft.cnpj} />
            <Field label="CNAE principal" value={draft.cnae_primary} />
            <Field
              label="Cidade / UF"
              value={
                [draft.hq_city, draft.hq_state].filter(Boolean).join(' / ') ||
                null
              }
            />
            <Field
              label="Capital social"
              value={brl(draft.capital_social_cents)}
            />
            <Field label="Fundada em" value={draft.founded_at} />
            <Field
              label="CNAEs secundários"
              value={
                draft.cnae_secondary.length > 0
                  ? `${draft.cnae_secondary.length} código(s)`
                  : '—'
              }
            />
          </dl>

          {state.status === 'preview' && (
            <form action={formAction} className="mt-6">
              <input type="hidden" name="cnpj" value={draft.cnpj} />
              <input type="hidden" name="persist" value="1" />
              <button
                type="submit"
                disabled={pending}
                className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {pending ? 'Gravando…' : 'Salvar como lead'}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  )
}

function Field({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-zinc-500">{label}</dt>
      <dd className="mt-0.5 text-zinc-900 dark:text-zinc-50">{value ?? '—'}</dd>
    </div>
  )
}
