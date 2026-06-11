import Link from 'next/link'
import { createShopping } from '../actions'
import { ShoppingForm } from '../shopping-form'

export const metadata = {
  title: 'Novo shopping · Prospec B2B',
}

export default function NewShoppingPage() {
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
          Novo shopping
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Cadastre o empreendimento da Nexa Malls. Métricas vão alimentar o lead
          scoring depois.
        </p>

        <div className="mt-8 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <ShoppingForm action={createShopping} submitLabel="Cadastrar" />
        </div>
      </div>
    </div>
  )
}
