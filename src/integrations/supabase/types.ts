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
      claims: {
        Row: {
          company_email: string
          company_id: string
          created_at: string
          full_name: string
          id: string
          job_title: string
          status: string
          user_id: string
        }
        Insert: {
          company_email: string
          company_id: string
          created_at?: string
          full_name: string
          id?: string
          job_title: string
          status?: string
          user_id: string
        }
        Update: {
          company_email?: string
          company_id?: string
          created_at?: string
          full_name?: string
          id?: string
          job_title?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "claims_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          created_at: string
          description: string
          grade: string | null
          id: string
          is_verified: boolean
          last_verified: string | null
          logo_url: string | null
          name: string
          type: string
          website: string
        }
        Insert: {
          created_at?: string
          description: string
          grade?: string | null
          id?: string
          is_verified?: boolean
          last_verified?: string | null
          logo_url?: string | null
          name: string
          type: string
          website: string
        }
        Update: {
          created_at?: string
          description?: string
          grade?: string | null
          id?: string
          is_verified?: boolean
          last_verified?: string | null
          logo_url?: string | null
          name?: string
          type?: string
          website?: string
        }
        Relationships: []
      }
      platform_settings: {
        Row: {
          category: string
          id: string
          key: string
          label: string | null
          type: string
          updated_at: string
          value: Json
        }
        Insert: {
          category: string
          id?: string
          key: string
          label?: string | null
          type: string
          updated_at?: string
          value: Json
        }
        Update: {
          category?: string
          id?: string
          key?: string
          label?: string | null
          type?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      review_answers: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          question_id: string
          rating: number
          review_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          question_id: string
          rating: number
          review_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          question_id?: string
          rating?: number
          review_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "review_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_answers_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      review_questions: {
        Row: {
          category: string
          company_type: string
          created_at: string
          id: string
          question: string
          weight: number
        }
        Insert: {
          category: string
          company_type: string
          created_at?: string
          id?: string
          question: string
          weight?: number
        }
        Update: {
          category?: string
          company_type?: string
          created_at?: string
          id?: string
          question?: string
          weight?: number
        }
        Relationships: []
      }
      reviews: {
        Row: {
          average_score: number | null
          company_id: string
          created_at: string
          id: string
          rating_communication: number
          rating_install_quality: number
          rating_payment_reliability: number
          rating_post_install_support: number
          rating_timeliness: number
          review_details: string | null
          review_title: string | null
          text_feedback: string
          user_id: string
          verification_status: string | null
        }
        Insert: {
          average_score?: number | null
          company_id: string
          created_at?: string
          id?: string
          rating_communication: number
          rating_install_quality: number
          rating_payment_reliability: number
          rating_post_install_support: number
          rating_timeliness: number
          review_details?: string | null
          review_title?: string | null
          text_feedback: string
          user_id: string
          verification_status?: string | null
        }
        Update: {
          average_score?: number | null
          company_id?: string
          created_at?: string
          id?: string
          rating_communication?: number
          rating_install_quality?: number
          rating_payment_reliability?: number
          rating_post_install_support?: number
          rating_timeliness?: number
          review_details?: string | null
          review_title?: string | null
          text_feedback?: string
          user_id?: string
          verification_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          role: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id: string
          role?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          role?: string
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
