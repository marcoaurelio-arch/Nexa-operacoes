'use client'

import { useActionState } from 'react'
import type { ShoppingFormState } from './actions'

const STATES = [
  'AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN',
  'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO',
]

type ShoppingDefaults = {
  name?: string
  city?: string
  state?: string
  status?: 'active' | 'planning' | 'inactive'
  gla_sqm?: number | null
  vacancy_sqm?: number | null
  vacancy_rate?: number | null
  monthly_footfall?: number | null
  avg_ticket_brl?: number | null
  address?: string | null
  cep?: string | null
}

type Props = {
  action: (state: ShoppingFormState, fd: FormData) => Promise<ShoppingFormState>
  defaults?: ShoppingDefaults
  submitLabel?: string
}

const initialState: ShoppingFormState = { status: 'idle' }

export function ShoppingForm({ action, defaults, submitLabel }: Props) {
  const [state, formAction, pending] = useActionState(action, initialState)
  const errs = state.status === 'error' ? state.fieldErrors ?? {} : {}

  return (
    <form action={formAction} className="space-y-6">
      <Section title="Identificação">
        <Field label="Nome" name="name" required defaultValue={defaults?.name} error={errs.name} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Cidade" name="city" required defaultValue={defaults?.city} error={errs.city} />
          <Select label="UF" name="state" required defaultValue={defaults?.state} error={errs.state} options={STATES} />
          <Select
            label="Status"
            name="status"
            defaultValue={defaults?.status ?? 'active'}
            options={[
              { value: 'active', label: 'Ativo' },
              { value: 'planning', label: 'Planejamento' },
              { value: 'inactive', label: 'Inativo' },
            ]}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Endereço" name="address" defaultValue={defaults?.address ?? ''} error={errs.address} />
          <Field label="CEP" name="cep" defaultValue={defaults?.cep ?? ''} error={errs.cep} />
        </div>
      </Section>

      <Section title="Métricas">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="ABL (m²)" name="gla_sqm" type="number" step="0.01" defaultValue={defaults?.gla_sqm ?? ''} error={errs.gla_sqm} />
          <Field label="Vacância (m²)" name="vacancy_sqm" type="number" step="0.01" defaultValue={defaults?.vacancy_sqm ?? ''} error={errs.vacancy_sqm} />
          <Field label="Taxa de vacância (%)" name="vacancy_rate" type="number" step="0.01" defaultValue={defaults?.vacancy_rate ?? ''} error={errs.vacancy_rate} />
          <Field label="Fluxo mensal estimado" name="monthly_footfall" type="number" defaultValue={defaults?.monthly_footfall ?? ''} error={errs.monthly_footfall} />
          <Field label="Ticket médio (R$)" name="avg_ticket_brl" type="number" step="0.01" defaultValue={defaults?.avg_ticket_brl ?? ''} error={errs.avg_ticket_brl} />
        </div>
      </Section>

      {state.status === 'error' && !Object.keys(errs).length && (
        <p className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {pending ? 'Salvando…' : (submitLabel ?? 'Salvar')}
      </button>
    </form>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-3">
      <h2 className="text-xs font-medium uppercase tracking-wide text-zinc-500">
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

function Field({
  label,
  name,
  type = 'text',
  step,
  required,
  defaultValue,
  error,
}: {
  label: string
  name: string
  type?: string
  step?: string
  required?: boolean
  defaultValue?: string | number | null
  error?: string
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-xs font-medium text-zinc-600 dark:text-zinc-400">
        {label}{required && <span className="text-red-500"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        step={step}
        required={required}
        defaultValue={defaultValue ?? ''}
        className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
      />
      {error && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  )
}

type SelectOption = string | { value: string; label: string }

function Select({
  label,
  name,
  required,
  defaultValue,
  options,
  error,
}: {
  label: string
  name: string
  required?: boolean
  defaultValue?: string
  options: SelectOption[]
  error?: string
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-xs font-medium text-zinc-600 dark:text-zinc-400">
        {label}{required && <span className="text-red-500"> *</span>}
      </label>
      <select
        id={name}
        name={name}
        required={required}
        defaultValue={defaultValue}
        className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-zinc-900 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
      >
        {!required && <option value="">—</option>}
        {options.map((opt) => {
          const { value, label: optLabel } =
            typeof opt === 'string' ? { value: opt, label: opt } : opt
          return (
            <option key={value} value={value}>
              {optLabel}
            </option>
          )
        })}
      </select>
      {error && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  )
}
