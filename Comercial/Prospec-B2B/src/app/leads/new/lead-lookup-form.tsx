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

  return (
    <div className="space-y-6">
      <form action={formAction} className="flex gap-2">
        <input
          name="cnpj"
          required
          inputMode="numeric"
          placeholder="00.000.000/0000-00"
          className="flex-1 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {pending ? 'Buscando…' : 'Consultar CNPJ'}
        </button>
      </form>

      {state.status === 'error' && (
        <div className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
          {state.message}
        </div>
      )}

      {state.status === 'ok' && (
        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">
            {state.draft.trade_name}
          </h2>
          {state.draft.legal_name &&
            state.draft.legal_name !== state.draft.trade_name && (
              <p className="text-sm text-zinc-500">{state.draft.legal_name}</p>
            )}

          <dl className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            <Field label="CNPJ" value={state.draft.cnpj} />
            <Field label="CNAE principal" value={state.draft.cnae_primary} />
            <Field
              label="Cidade / UF"
              value={
                [state.draft.hq_city, state.draft.hq_state]
                  .filter(Boolean)
                  .join(' / ') || null
              }
            />
            <Field
              label="Capital social"
              value={brl(state.draft.capital_social_cents)}
            />
            <Field
              label="Fundada em"
              value={state.draft.founded_at}
            />
            <Field
              label="CNAEs secundários"
              value={
                state.draft.cnae_secondary.length > 0
                  ? `${state.draft.cnae_secondary.length} código(s)`
                  : '—'
              }
            />
          </dl>

          <p className="mt-6 text-xs text-zinc-500">
            Pré-visualização — quando o Supabase estiver conectado, este
            esboço vira um registro em <code>leads</code>.
          </p>
        </div>
      )}
    </div>
  )
}

function Field({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-zinc-500">
        {label}
      </dt>
      <dd className="mt-0.5 text-zinc-900 dark:text-zinc-50">
        {value ?? '—'}
      </dd>
    </div>
  )
}
