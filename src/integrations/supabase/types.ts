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
      category_thresholds: {
        Row: {
          category_id: string | null
          created_at: string
          critical_threshold: number | null
          id: string
          low_threshold: number | null
          store_id: string | null
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          critical_threshold?: number | null
          id?: string
          low_threshold?: number | null
          store_id?: string | null
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          critical_threshold?: number | null
          id?: string
          low_threshold?: number | null
          store_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "category_thresholds_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "category_thresholds_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
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
          checksum: string | null
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
          version: number | null
        }
        Insert: {
          checksum?: string | null
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
          version?: number | null
        }
        Update: {
          checksum?: string | null
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
          version?: number | null
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
          media_type: string | null
          n8n_webhook_url: string | null
          processing_result: Json | null
          processing_status: string | null
          size: number | null
          status: string
          transcription: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content_type?: string | null
          created_at?: string
          file_path: string
          filename: string
          id?: string
          media_type?: string | null
          n8n_webhook_url?: string | null
          processing_result?: Json | null
          processing_status?: string | null
          size?: number | null
          status?: string
          transcription?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content_type?: string | null
          created_at?: string
          file_path?: string
          filename?: string
          id?: string
          media_type?: string | null
          n8n_webhook_url?: string | null
          processing_result?: Json | null
          processing_status?: string | null
          size?: number | null
          status?: string
          transcription?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          checksum: string | null
          created_at: string
          customer_id: string | null
          id: string
          status: string | null
          store_id: string | null
          total_amount: number
          updated_at: string
          version: number | null
        }
        Insert: {
          checksum?: string | null
          created_at?: string
          customer_id?: string | null
          id?: string
          status?: string | null
          store_id?: string | null
          total_amount: number
          updated_at?: string
          version?: number | null
        }
        Update: {
          checksum?: string | null
          created_at?: string
          customer_id?: string | null
          id?: string
          status?: string | null
          store_id?: string | null
          total_amount?: number
          updated_at?: string
          version?: number | null
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
      product_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          metadata: Json | null
          name: string
          store_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          name: string
          store_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          store_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_categories_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      product_thresholds: {
        Row: {
          created_at: string
          critical_threshold: number
          id: string
          low_threshold: number
          product_id: string | null
          store_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          critical_threshold?: number
          id?: string
          low_threshold?: number
          product_id?: string | null
          store_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          critical_threshold?: number
          id?: string
          low_threshold?: number
          product_id?: string | null
          store_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_thresholds_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_thresholds_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category_id: string | null
          checksum: string | null
          custom_critical_threshold: number | null
          custom_low_threshold: number | null
          id: string
          metadata: Json | null
          name: string | null
          stock: number | null
          store_id: string | null
          version: number | null
        }
        Insert: {
          category_id?: string | null
          checksum?: string | null
          custom_critical_threshold?: number | null
          custom_low_threshold?: number | null
          id: string
          metadata?: Json | null
          name?: string | null
          stock?: number | null
          store_id?: string | null
          version?: number | null
        }
        Update: {
          category_id?: string | null
          checksum?: string | null
          custom_critical_threshold?: number | null
          custom_low_threshold?: number | null
          id?: string
          metadata?: Json | null
          name?: string | null
          stock?: number | null
          store_id?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
        ]
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
      reconciliation_history: {
        Row: {
          action: string
          checksum: string | null
          id: string
          item_id: string
          new_value: Json | null
          performed_at: string
          performed_by: string | null
          previous_value: Json | null
          store_id: string | null
          version: number | null
        }
        Insert: {
          action: string
          checksum?: string | null
          id?: string
          item_id: string
          new_value?: Json | null
          performed_at?: string
          performed_by?: string | null
          previous_value?: Json | null
          store_id?: string | null
          version?: number | null
        }
        Update: {
          action?: string
          checksum?: string | null
          id?: string
          item_id?: string
          new_value?: Json | null
          performed_at?: string
          performed_by?: string | null
          previous_value?: Json | null
          store_id?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "reconciliation_history_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "reconciliation_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reconciliation_history_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      reconciliation_items: {
        Row: {
          checksum: string | null
          id: string
          job_id: string
          notes: string | null
          record_id: string | null
          resolution: string | null
          resolved_at: string | null
          resolved_by: string | null
          status: string
          system_value: Json
          table_name: string
          uploaded_value: Json
          version: number | null
        }
        Insert: {
          checksum?: string | null
          id?: string
          job_id: string
          notes?: string | null
          record_id?: string | null
          resolution?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          system_value: Json
          table_name: string
          uploaded_value: Json
          version?: number | null
        }
        Update: {
          checksum?: string | null
          id?: string
          job_id?: string
          notes?: string | null
          record_id?: string | null
          resolution?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string
          system_value?: Json
          table_name?: string
          uploaded_value?: Json
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "reconciliation_items_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "reconciliation_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      reconciliation_jobs: {
        Row: {
          checksum: string | null
          completed_at: string | null
          created_at: string
          created_by: string | null
          file_upload_id: string | null
          id: string
          metadata: Json | null
          status: string
          store_id: string | null
          type: string
          version: number | null
        }
        Insert: {
          checksum?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          file_upload_id?: string | null
          id?: string
          metadata?: Json | null
          status?: string
          store_id?: string | null
          type: string
          version?: number | null
        }
        Update: {
          checksum?: string | null
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          file_upload_id?: string | null
          id?: string
          metadata?: Json | null
          status?: string
          store_id?: string | null
          type?: string
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "reconciliation_jobs_file_upload_id_fkey"
            columns: ["file_upload_id"]
            isOneToOne: false
            referencedRelation: "file_uploads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reconciliation_jobs_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      sales: {
        Row: {
          amount: number
          checksum: string | null
          created_at: string
          id: string
          product_id: string | null
          quantity: number
          status: string | null
          store_id: string | null
          updated_at: string
          version: number | null
        }
        Insert: {
          amount: number
          checksum?: string | null
          created_at?: string
          id?: string
          product_id?: string | null
          quantity: number
          status?: string | null
          store_id?: string | null
          updated_at?: string
          version?: number | null
        }
        Update: {
          amount?: number
          checksum?: string | null
          created_at?: string
          id?: string
          product_id?: string | null
          quantity?: number
          status?: string | null
          store_id?: string | null
          updated_at?: string
          version?: number | null
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
      smart_action_thresholds: {
        Row: {
          created_at: string
          id: string
          inventory_critical_threshold: number | null
          inventory_low_threshold: number | null
          payment_reminder_days: number | null
          revenue_alert_percentage: number | null
          revenue_alert_threshold: number | null
          store_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          inventory_critical_threshold?: number | null
          inventory_low_threshold?: number | null
          payment_reminder_days?: number | null
          revenue_alert_percentage?: number | null
          revenue_alert_threshold?: number | null
          store_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          inventory_critical_threshold?: number | null
          inventory_low_threshold?: number | null
          payment_reminder_days?: number | null
          revenue_alert_percentage?: number | null
          revenue_alert_threshold?: number | null
          store_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "smart_action_thresholds_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: true
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
          business_preferences: Json | null
          chat_webhook_url: string | null
          created_at: string
          general_preferences: Json | null
          id: string
          notification_preferences: Json | null
          reconciliation_settings: Json | null
          store_id: string
          updated_at: string
          upload_webhook_url: string | null
          user_id: string
        }
        Insert: {
          business_preferences?: Json | null
          chat_webhook_url?: string | null
          created_at?: string
          general_preferences?: Json | null
          id?: string
          notification_preferences?: Json | null
          reconciliation_settings?: Json | null
          store_id: string
          updated_at?: string
          upload_webhook_url?: string | null
          user_id: string
        }
        Update: {
          business_preferences?: Json | null
          chat_webhook_url?: string | null
          created_at?: string
          general_preferences?: Json | null
          id?: string
          notification_preferences?: Json | null
          reconciliation_settings?: Json | null
          store_id?: string
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
          business_name: string
          id: string
          name: string
          settings: Json | null
        }
        Insert: {
          business_name?: string
          id?: string
          name?: string
          settings?: Json | null
        }
        Update: {
          business_name?: string
          id?: string
          name?: string
          settings?: Json | null
        }
        Relationships: []
      }
      sync_logs: {
        Row: {
          created_at: string | null
          details: Json | null
          id: string
          status: string
          store_id: string | null
          sync_type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          id?: string
          status: string
          store_id?: string | null
          sync_type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          id?: string
          status?: string
          store_id?: string | null
          sync_type?: string
          user_id?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          checksum: string | null
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
          version: number | null
        }
        Insert: {
          checksum?: string | null
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
          version?: number | null
        }
        Update: {
          checksum?: string | null
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
          version?: number | null
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
      generate_smart_actions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_product_thresholds: {
        Args: {
          product_id: string
        }
        Returns: {
          low_threshold: number
          critical_threshold: number
        }[]
      }
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
