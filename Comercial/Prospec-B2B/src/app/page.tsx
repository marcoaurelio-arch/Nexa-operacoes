import Link from 'next/link'
import { Building2, Database, Sparkles, Target } from 'lucide-react'

const features = [
  {
    icon: Database,
    title: 'Base unificada de marcas',
    description:
      'CNPJ, Receita, Google Places, Apollo e Econodata em um único cadastro de lead.',
  },
  {
    icon: Sparkles,
    title: 'Lead scoring com IA',
    description:
      'Claude avalia o fit de cada marca com o perfil de cada shopping da Nexa.',
  },
  {
    icon: Target,
    title: 'Pipeline de prospecção',
    description:
      'Kanban por shopping, atribuição por vendedor, timeline de atividades.',
  },
  {
    icon: Building2,
    title: 'Visão por empreendimento',
    description:
      'Mix atual, vacância, ABL e marcas-alvo prioritárias para cada shopping.',
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-zinc-900 dark:text-zinc-50" />
            <span className="font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              Nexa Operações
            </span>
          </div>
          <nav className="flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
            <Link href="/prospec" className="hover:text-zinc-900 dark:hover:text-zinc-50">
              Prospecção
            </Link>
            <Link href="/login" className="hover:text-zinc-900 dark:hover:text-zinc-50">
              Entrar
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-20">
        <div className="max-w-2xl">
          <p className="mb-3 text-sm font-medium uppercase tracking-wide text-zinc-500">
            Prospecção B2B · Nexa Malls
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
            Encontre as marcas certas para cada shopping.
          </h1>
          <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-400">
            Plataforma interna da Nexa Malls para identificar, qualificar e
            converter marcas em lojistas — com dados públicos, enriquecimento
            via APIs e IA para priorizar.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <feature.icon className="h-6 w-6 text-zinc-900 dark:text-zinc-50" />
              <h2 className="mt-4 font-semibold text-zinc-900 dark:text-zinc-50">
                {feature.title}
              </h2>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-lg border border-dashed border-zinc-300 bg-white p-6 text-sm text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
          <p className="font-medium text-zinc-900 dark:text-zinc-50">
            Status: scaffold inicial
          </p>
          <p className="mt-1">
            Configure as variáveis em <code>.env.local</code> e rode as migrations
            em <code>supabase/migrations/</code>. Próximos módulos: cadastro de
            shoppings, importação de leads, enriquecimento e scoring.
          </p>
        </div>
      </main>
    </div>
  )
}
