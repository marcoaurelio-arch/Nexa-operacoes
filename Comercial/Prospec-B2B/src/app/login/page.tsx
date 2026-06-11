import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { LoginForm } from './login-form'

export const metadata = {
  title: 'Entrar · Prospec B2B',
}

export default async function LoginPage() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/leads')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 dark:bg-zinc-950">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Entrar
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Use o seu e-mail corporativo da Nexa Malls.
        </p>

        <div className="mt-8">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
