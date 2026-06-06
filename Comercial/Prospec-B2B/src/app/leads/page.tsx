import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { signOut } from '../login/actions'

export const metadata = {
  title: 'Leads · Prospec B2B',
}

const brl = (cents: number | null) => {
  if (cents == null) return '—'
  return (cents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  })
}

export default async function LeadsPage() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login?next=/leads')

  const { data: leads, error } = await supabase
    .from('leads')
    .select(
      'id, cnpj, trade_name, legal_name, cnae_primary, hq_city, hq_state, capital_social_cents, created_at',
    )
    .order('created_at', { ascending: false })
    .limit(100)

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              Prospec B2B
            </p>
            <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Leads
            </h1>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link
              href="/pipeline"
              className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50"
            >
              Pipeline
            </Link>
            <Link
              href="/shoppings"
              className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50"
            >
              Shoppings
            </Link>
            <Link
              href="/leads/new"
              className="rounded-md bg-zinc-900 px-3 py-1.5 font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              + Novo lead
            </Link>
            <span className="text-zinc-500">{user.email}</span>
            <form action={signOut}>
              <button
                type="submit"
                className="text-zinc-500 underline-offset-2 hover:underline"
              >
                Sair
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        {error && (
          <div className="mb-6 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
            Falha ao carregar leads: {error.message}
          </div>
        )}

        {leads && leads.length === 0 && (
          <div className="rounded-lg border border-dashed border-zinc-300 bg-white px-6 py-12 text-center dark:border-zinc-700 dark:bg-zinc-900">
            <p className="text-zinc-600 dark:text-zinc-400">
              Nenhum lead cadastrado ainda.
            </p>
            <Link
              href="/leads/new"
              className="mt-3 inline-block text-sm font-medium text-zinc-900 underline underline-offset-4 dark:text-zinc-50"
            >
              Cadastrar primeiro lead via CNPJ →
            </Link>
          </div>
        )}

        {leads && leads.length > 0 && (
          <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            <table className="w-full text-sm">
              <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950">
                <tr>
                  <th className="px-4 py-3 text-left">Marca</th>
                  <th className="px-4 py-3 text-left">CNPJ</th>
                  <th className="px-4 py-3 text-left">CNAE</th>
                  <th className="px-4 py-3 text-left">Cidade / UF</th>
                  <th className="px-4 py-3 text-right">Capital</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-t border-zinc-100 dark:border-zinc-800"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/leads/${lead.id}`}
                        className="font-medium text-zinc-900 hover:underline dark:text-zinc-50"
                      >
                        {lead.trade_name}
                      </Link>
                      {lead.legal_name &&
                        lead.legal_name !== lead.trade_name && (
                          <div className="text-xs text-zinc-500">
                            {lead.legal_name}
                          </div>
                        )}
                    </td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                      {lead.cnpj ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                      {lead.cnae_primary ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                      {[lead.hq_city, lead.hq_state]
                        .filter(Boolean)
                        .join(' / ') || '—'}
                    </td>
                    <td className="px-4 py-3 text-right text-zinc-600 dark:text-zinc-400">
                      {brl(lead.capital_social_cents)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
