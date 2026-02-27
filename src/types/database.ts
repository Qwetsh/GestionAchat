export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          pin_hash: string
          created_at: string
        }
        Insert: {
          id?: string
          pin_hash: string
          created_at?: string
        }
        Update: {
          id?: string
          pin_hash?: string
          created_at?: string
        }
        Relationships: []
      }
      temptations: {
        Row: {
          id: string
          user_id: string
          photo_url: string | null
          amount: number
          category: 'cosmetics' | 'books' | 'stationery' | 'other'
          status: 'active' | 'resisted' | 'cracked'
          created_at: string
          resolved_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          photo_url?: string | null
          amount: number
          category: 'cosmetics' | 'books' | 'stationery' | 'other'
          status?: 'active' | 'resisted' | 'cracked'
          created_at?: string
          resolved_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          photo_url?: string | null
          amount?: number
          category?: 'cosmetics' | 'books' | 'stationery' | 'other'
          status?: 'active' | 'resisted' | 'cracked'
          created_at?: string
          resolved_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'temptations_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      gamification: {
        Row: {
          user_id: string
          xp: number
          level: number
          current_streak: number
          best_streak: number
          updated_at: string
        }
        Insert: {
          user_id: string
          xp?: number
          level?: number
          current_streak?: number
          best_streak?: number
          updated_at?: string
        }
        Update: {
          user_id?: string
          xp?: number
          level?: number
          current_streak?: number
          best_streak?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'gamification_user_id_fkey'
            columns: ['user_id']
            isOneToOne: true
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Convenience type aliases
export type User = Database['public']['Tables']['users']['Row']
export type Temptation = Database['public']['Tables']['temptations']['Row']
export type Gamification = Database['public']['Tables']['gamification']['Row']

export type UserInsert = Database['public']['Tables']['users']['Insert']
export type TemptationInsert = Database['public']['Tables']['temptations']['Insert']
export type GamificationInsert = Database['public']['Tables']['gamification']['Insert']

export type UserUpdate = Database['public']['Tables']['users']['Update']
export type TemptationUpdate = Database['public']['Tables']['temptations']['Update']
export type GamificationUpdate = Database['public']['Tables']['gamification']['Update']
