'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { addToPipeline, type AddToPipelineState } from '../../pipeline/actions'
import { scoreLeadAction, type ScoreState } from './actions'

const initialState: ScoreState = { status: 'idle' }
const initialPipeline: AddToPipelineState = { status: 'idle' }

const RECOMMENDATION_LABEL: Record<string, string> = {
  prioritize: 'Priorizar',
  consider: 'Considerar',
  monitor: 'Monitorar',
  skip: 'Pular',
}

const RECOMMENDATION_TONE: Record<string, string> = {
  prioritize:
    'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200',
  consider: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200',
  monitor: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200',
  skip: 'bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
}

type Factor = {
  name: string
  impact: 'positive' | 'negative' | 'neutral'
  weight: number
  explanation: string
}

type StoredFactors = {
  recommendation?: string
  items?: Factor[]
}

type Props = {
  leadId: string
  shopping: {
    id: string
    name: string
    city: string
    state: string
    vacancy_rate: number | null
    status: string
  }
  existingScore: {
    score: number
    rationale: string | null
    model: string | null
    factors: Record<string, unknown> | null
    created_at: string
  } | null
}

function scoreColor(score: number) {
  if (score >= 75) return 'text-emerald-700 dark:text-emerald-300'
  if (score >= 50) return 'text-amber-700 dark:text-amber-300'
  return 'text-zinc-500'
}

export function ScoreShoppingRow({ leadId, shopping, existingScore }: Props) {
  const [state, formAction, pending] = useActionState(
    scoreLeadAction,
    initialState,
  )
  const [pipelineState, pipelineAction, pipelinePending] = useActionState(
    addToPipeline,
    initialPipeline,
  )

  const score = state.status === 'ok' ? state.score : existingScore?.score
  const factors = (existingScore?.factors as StoredFactors | null) ?? null
  const recommendation =
    state.status === 'ok'
      ? state.recommendation
      : (factors?.recommendation ?? null)
  const items = factors?.items ?? []

  return (
    <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-start justify-between gap-4 px-5 py-4">
        <div>
          <h3 className="font-medium text-zinc-900 dark:text-zinc-50">
            {shopping.name}
          </h3>
          <p className="text-xs text-zinc-500">
            {shopping.city} / {shopping.state}
            {shopping.vacancy_rate != null &&
              ` · vacância ${shopping.vacancy_rate.toFixed(1)}%`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {score != null && (
            <div className="text-right">
              <div className={`text-2xl font-semibold ${scoreColor(score)}`}>
                {score}
              </div>
              {recommendation && (
                <span
                  className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${
                    RECOMMENDATION_TONE[recommendation] ??
                    RECOMMENDATION_TONE.monitor
                  }`}
                >
                  {RECOMMENDATION_LABEL[recommendation] ?? recommendation}
                </span>
              )}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <form action={formAction}>
              <input type="hidden" name="lead_id" value={leadId} />
              <input type="hidden" name="shopping_id" value={shopping.id} />
              <button
                type="submit"
                disabled={pending}
                className="w-full rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-900 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-800"
              >
                {pending
                  ? 'Calculando…'
                  : existingScore || state.status === 'ok'
                    ? 'Recalcular'
                    : 'Calcular score'}
              </button>
            </form>

            {pipelineState.status === 'ok' ? (
              <Link
                href={`/pipeline/${pipelineState.opportunityId}`}
                className="rounded-md bg-emerald-600 px-3 py-1.5 text-center text-xs font-medium text-white transition hover:bg-emerald-700"
              >
                Abrir no pipeline →
              </Link>
            ) : (
              <form action={pipelineAction}>
                <input type="hidden" name="lead_id" value={leadId} />
                <input type="hidden" name="shopping_id" value={shopping.id} />
                <button
                  type="submit"
                  disabled={pipelinePending}
                  className="w-full rounded-md bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  {pipelinePending ? 'Adicionando…' : '+ Pipeline'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {state.status === 'error' && (
        <p className="border-t border-red-200 bg-red-50 px-5 py-3 text-xs text-red-800 dark:border-red-900/50 dark:bg-red-950 dark:text-red-200">
          {state.message}
        </p>
      )}

      {existingScore?.rationale && (
        <div className="border-t border-zinc-100 px-5 py-4 dark:border-zinc-800">
          <p className="text-sm text-zinc-700 dark:text-zinc-300">
            {existingScore.rationale}
          </p>

          {items.length > 0 && (
            <ul className="mt-3 space-y-1.5 text-xs">
              {items.map((f, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-zinc-600 dark:text-zinc-400"
                >
                  <span
                    className={`mt-0.5 inline-block h-2 w-2 shrink-0 rounded-full ${
                      f.impact === 'positive'
                        ? 'bg-emerald-500'
                        : f.impact === 'negative'
                          ? 'bg-red-500'
                          : 'bg-zinc-400'
                    }`}
                  />
                  <span>
                    <span className="font-medium text-zinc-800 dark:text-zinc-200">
                      {f.name}
                    </span>{' '}
                    — {f.explanation}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {existingScore.model && (
            <p className="mt-3 text-[10px] uppercase tracking-wide text-zinc-400">
              Modelo: {existingScore.model} ·{' '}
              {new Date(existingScore.created_at).toLocaleString('pt-BR')}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
