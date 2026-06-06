import { LeadLookupForm } from './lead-lookup-form'

export const metadata = {
  title: 'Novo lead · Prospec B2B',
}

export default function NewLeadPage() {
  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-12 dark:bg-zinc-950">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Novo lead
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Cole o CNPJ da marca. Buscamos os dados da Receita via BrasilAPI,
          montamos o esboço, e você confirma pra gravar em <code>leads</code>.
        </p>

        <div className="mt-8">
          <LeadLookupForm />
        </div>
      </div>
    </div>
  )
}
