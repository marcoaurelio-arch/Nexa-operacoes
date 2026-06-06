import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { deleteShopping, updateShopping } from '../actions'
import { ShoppingForm } from '../shopping-form'

type Props = {
  params: Promise<{ id: string }>
}

export const metadata = {
  title: 'Shopping · Prospec B2B',
}

export default async function ShoppingDetailPage({ params }: Props) {
  const { id } = await params

  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect(`/login?next=/shoppings/${id}`)

  const { data: shopping, error } = await supabase
    .from('shoppings')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !shopping) notFound()

  const update = updateShopping.bind(null, id)

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-12 dark:bg-zinc-950">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/shoppings"
          className="text-sm text-zinc-500 underline-offset-2 hover:underline"
        >
          ← Shoppings
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {shopping.name}
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          {shopping.city} / {shopping.state}
        </p>

        <div className="mt-8 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <ShoppingForm
            action={update}
            submitLabel="Salvar alterações"
            defaults={{
              name: shopping.name,
              city: shopping.city,
              state: shopping.state,
              status: shopping.status,
              gla_sqm: shopping.gla_sqm,
              vacancy_sqm: shopping.vacancy_sqm,
              vacancy_rate: shopping.vacancy_rate,
              monthly_footfall: shopping.monthly_footfall,
              avg_ticket_brl:
                shopping.avg_ticket_cents != null
                  ? shopping.avg_ticket_cents / 100
                  : null,
              address: shopping.address,
              cep: shopping.cep,
            }}
          />
        </div>

        <div className="mt-6 rounded-lg border border-red-200 bg-white p-6 dark:border-red-900/50 dark:bg-zinc-900">
          <h2 className="text-sm font-semibold text-red-700 dark:text-red-400">
            Zona perigosa
          </h2>
          <p className="mt-1 text-xs text-zinc-500">
            Exclui o shopping permanentemente. Leads e oportunidades vinculadas
            serão removidos (CASCADE).
          </p>
          <form action={deleteShopping} className="mt-3">
            <input type="hidden" name="id" value={shopping.id} />
            <button
              type="submit"
              className="rounded-md border border-red-300 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950"
            >
              Excluir shopping
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
