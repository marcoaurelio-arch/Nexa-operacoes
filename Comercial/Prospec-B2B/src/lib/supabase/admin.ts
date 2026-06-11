import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './types'

let cached: SupabaseClient<Database> | null = null

/**
 * Server-only Supabase client using the service_role key.
 * Bypasses RLS — never expose to the browser.
 */
export function getSupabaseAdmin(): SupabaseClient<Database> {
  if (cached) return cached
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY',
    )
  }
  cached = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  return cached
}
