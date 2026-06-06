/**
 * Minimal Database type — extended as we add tables to the app surface.
 * For full generated types, run `supabase gen types typescript` after the
 * Supabase CLI is wired up.
 */
export type Database = {
  public: {
    Tables: {
      leads: {
        Row: {
          id: string
          cnpj: string | null
          legal_name: string | null
          trade_name: string
          cnae_primary: string | null
          cnae_secondary: string[]
          category: string | null
          subcategory: string | null
          website: string | null
          instagram_handle: string | null
          linkedin_url: string | null
          hq_city: string | null
          hq_state: string | null
          stores_count: number | null
          revenue_range: string | null
          capital_social_cents: number | null
          founded_at: string | null
          data_sources: string[]
          raw_enrichment: Record<string, unknown>
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          cnpj?: string | null
          legal_name?: string | null
          trade_name: string
          cnae_primary?: string | null
          cnae_secondary?: string[]
          category?: string | null
          subcategory?: string | null
          website?: string | null
          instagram_handle?: string | null
          linkedin_url?: string | null
          hq_city?: string | null
          hq_state?: string | null
          stores_count?: number | null
          revenue_range?: string | null
          capital_social_cents?: number | null
          founded_at?: string | null
          data_sources?: string[]
          raw_enrichment?: Record<string, unknown>
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['leads']['Insert']>
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          full_name: string | null
          email: string
          role: 'admin' | 'manager' | 'sales'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          email: string
          role?: 'admin' | 'manager' | 'sales'
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
