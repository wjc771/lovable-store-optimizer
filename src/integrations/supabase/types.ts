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
      chat_messages: {
        Row: {
          created_at: string
          document_id: string | null
          id: string
          message: string
          metadata: Json | null
          response: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          document_id?: string | null
          id?: string
          message: string
          metadata?: Json | null
          response?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          document_id?: string | null
          id?: string
          message?: string
          metadata?: Json | null
          response?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          created_at: string
          email: string | null
          id: string
          last_purchase_date: string | null
          name: string
          phone: string | null
          status: string | null
          store_id: string | null
          total_purchases: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          last_purchase_date?: string | null
          name: string
          phone?: string | null
          status?: string | null
          store_id?: string | null
          total_purchases?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          last_purchase_date?: string | null
          name?: string
          phone?: string | null
          status?: string | null
          store_id?: string | null
          total_purchases?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customers_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      department_templates: {
        Row: {
          id: string
          metadata: Json | null
          name: string
          type: string | null
        }
        Insert: {
          id?: string
          metadata?: Json | null
          name: string
          type?: string | null
        }
        Update: {
          id?: string
          metadata?: Json | null
          name?: string
          type?: string | null
        }
        Relationships: []
      }
      departments: {
        Row: {
          id: string
          name: string | null
          store_id: string | null
          type: string | null
        }
        Insert: {
          id: string
          name?: string | null
          store_id?: string | null
          type?: string | null
        }
        Update: {
          id?: string
          name?: string | null
          store_id?: string | null
          type?: string | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          content: Json | null
          created_at: string | null
          id: string
          processed: boolean | null
          store_id: string | null
          type: string | null
        }
        Insert: {
          content?: Json | null
          created_at?: string | null
          id: string
          processed?: boolean | null
          store_id?: string | null
          type?: string | null
        }
        Update: {
          content?: Json | null
          created_at?: string | null
          id?: string
          processed?: boolean | null
          store_id?: string | null
          type?: string | null
        }
        Relationships: []
      }
      file_uploads: {
        Row: {
          content_type: string | null
          created_at: string
          file_path: string
          filename: string
          id: string
          n8n_webhook_url: string | null
          processing_result: Json | null
          size: number | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content_type?: string | null
          created_at?: string
          file_path: string
          filename: string
          id?: string
          n8n_webhook_url?: string | null
          processing_result?: Json | null
          size?: number | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content_type?: string | null
          created_at?: string
          file_path?: string
          filename?: string
          id?: string
          n8n_webhook_url?: string | null
          processing_result?: Json | null
          size?: number | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          created_at: string
          customer_id: string | null
          id: string
          status: string | null
          store_id: string | null
          total_amount: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          id?: string
          status?: string | null
          store_id?: string | null
          total_amount: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          id?: string
          status?: string | null
          store_id?: string | null
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      positions: {
        Row: {
          id: string
          is_managerial: boolean | null
          name: string | null
          permissions: Json | null
          store_department_id: string | null
        }
        Insert: {
          id?: string
          is_managerial?: boolean | null
          name?: string | null
          permissions?: Json | null
          store_department_id?: string | null
        }
        Update: {
          id?: string
          is_managerial?: boolean | null
          name?: string | null
          permissions?: Json | null
          store_department_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "positions_store_department_id_fkey"
            columns: ["store_department_id"]
            isOneToOne: false
            referencedRelation: "store_departments"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          id: string
          metadata: Json | null
          name: string | null
          stock: number | null
          store_id: string | null
        }
        Insert: {
          id: string
          metadata?: Json | null
          name?: string | null
          stock?: number | null
          store_id?: string | null
        }
        Update: {
          id?: string
          metadata?: Json | null
          name?: string | null
          stock?: number | null
          store_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      sales: {
        Row: {
          amount: number
          created_at: string
          id: string
          product_id: string | null
          quantity: number
          status: string | null
          store_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          product_id?: string | null
          quantity: number
          status?: string | null
          store_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          product_id?: string | null
          quantity?: number
          status?: string | null
          store_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      smart_actions: {
        Row: {
          action_data: Json | null
          action_priority: string | null
          action_type: string | null
          created_at: string
          description: string | null
          dismissed_at: string | null
          expires_at: string | null
          id: string
          metadata: Json | null
          priority: string | null
          status: string | null
          store_id: string | null
          title: string
          type: string
        }
        Insert: {
          action_data?: Json | null
          action_priority?: string | null
          action_type?: string | null
          created_at?: string
          description?: string | null
          dismissed_at?: string | null
          expires_at?: string | null
          id?: string
          metadata?: Json | null
          priority?: string | null
          status?: string | null
          store_id?: string | null
          title: string
          type: string
        }
        Update: {
          action_data?: Json | null
          action_priority?: string | null
          action_type?: string | null
          created_at?: string
          description?: string | null
          dismissed_at?: string | null
          expires_at?: string | null
          id?: string
          metadata?: Json | null
          priority?: string | null
          status?: string | null
          store_id?: string | null
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "smart_actions_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      staff: {
        Row: {
          id: string
          metadata: Json | null
          name: string | null
          status: string | null
          store_id: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          metadata?: Json | null
          name?: string | null
          status?: string | null
          store_id?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          metadata?: Json | null
          name?: string | null
          status?: string | null
          store_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_positions: {
        Row: {
          end_date: string | null
          position_id: string
          staff_id: string
          start_date: string | null
        }
        Insert: {
          end_date?: string | null
          position_id: string
          staff_id: string
          start_date?: string | null
        }
        Update: {
          end_date?: string | null
          position_id?: string
          staff_id?: string
          start_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_positions_position_id_fkey"
            columns: ["position_id"]
            isOneToOne: false
            referencedRelation: "positions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staff_positions_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      store_departments: {
        Row: {
          id: string
          name: string | null
          settings: Json | null
          store_id: string | null
          template_id: string | null
        }
        Insert: {
          id?: string
          name?: string | null
          settings?: Json | null
          store_id?: string | null
          template_id?: string | null
        }
        Update: {
          id?: string
          name?: string | null
          settings?: Json | null
          store_id?: string | null
          template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "store_departments_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "store_departments_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "department_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      store_settings: {
        Row: {
          chat_webhook_url: string | null
          created_at: string
          id: string
          notification_preferences: Json | null
          store_id: string | null
          updated_at: string
          upload_webhook_url: string | null
          user_id: string
        }
        Insert: {
          chat_webhook_url?: string | null
          created_at?: string
          id?: string
          notification_preferences?: Json | null
          store_id?: string | null
          updated_at?: string
          upload_webhook_url?: string | null
          user_id: string
        }
        Update: {
          chat_webhook_url?: string | null
          created_at?: string
          id?: string
          notification_preferences?: Json | null
          store_id?: string | null
          updated_at?: string
          upload_webhook_url?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "store_settings_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: true
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      stores: {
        Row: {
          id: string
          name: string
          settings: Json | null
        }
        Insert: {
          id?: string
          name: string
          settings?: Json | null
        }
        Update: {
          id?: string
          name?: string
          settings?: Json | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          priority: string | null
          staff_id: string | null
          status: string | null
          store_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          staff_id?: string | null
          status?: string | null
          store_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          staff_id?: string | null
          status?: string | null
          store_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          email: string | null
          id: string
          metadata: Json | null
        }
        Insert: {
          email?: string | null
          id?: string
          metadata?: Json | null
        }
        Update: {
          email?: string | null
          id?: string
          metadata?: Json | null
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
