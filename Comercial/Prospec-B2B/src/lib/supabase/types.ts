/**
 * Minimal Database type — extended as we add tables to the app surface.
 * For full generated types, run `supabase gen types typescript` after the
 * Supabase CLI is wired up.
 */
export type ShoppingStatus = 'active' | 'planning' | 'inactive'
export type ProfileRole = 'admin' | 'manager' | 'sales'

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
      shoppings: {
        Row: {
          id: string
          name: string
          slug: string
          city: string
          state: string
          cep: string | null
          address: string | null
          latitude: number | null
          longitude: number | null
          gla_sqm: number | null
          vacancy_sqm: number | null
          vacancy_rate: number | null
          monthly_footfall: number | null
          avg_ticket_cents: number | null
          audience_class: string[] | null
          audience_profile: Record<string, unknown> | null
          current_mix: Record<string, unknown> | null
          status: ShoppingStatus
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          city: string
          state: string
          cep?: string | null
          address?: string | null
          latitude?: number | null
          longitude?: number | null
          gla_sqm?: number | null
          vacancy_sqm?: number | null
          vacancy_rate?: number | null
          monthly_footfall?: number | null
          avg_ticket_cents?: number | null
          audience_class?: string[] | null
          audience_profile?: Record<string, unknown> | null
          current_mix?: Record<string, unknown> | null
          status?: ShoppingStatus
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['shoppings']['Insert']>
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          full_name: string | null
          email: string
          role: ProfileRole
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          email: string
          role?: ProfileRole
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
