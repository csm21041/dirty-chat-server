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
      _prisma_migrations: {
        Row: {
          applied_steps_count: number
          checksum: string
          finished_at: string | null
          id: string
          logs: string | null
          migration_name: string
          rolled_back_at: string | null
          started_at: string
        }
        Insert: {
          applied_steps_count?: number
          checksum: string
          finished_at?: string | null
          id: string
          logs?: string | null
          migration_name: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Update: {
          applied_steps_count?: number
          checksum?: string
          finished_at?: string | null
          id?: string
          logs?: string | null
          migration_name?: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Relationships: []
      }
      Admin: {
        Row: {
          email: string
          id: number
          password: string
          username: string
        }
        Insert: {
          email: string
          id?: number
          password: string
          username: string
        }
        Update: {
          email?: string
          id?: number
          password?: string
          username?: string
        }
        Relationships: []
      }
      Image: {
        Row: {
          authorId: number
          id: number
          url: string
        }
        Insert: {
          authorId: number
          id?: number
          url: string
        }
        Update: {
          authorId?: number
          id?: number
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "Image_authorId_fkey"
            columns: ["authorId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      Image_Tags: {
        Row: {
          id: number
          image_id: number
          tag: string
        }
        Insert: {
          id?: number
          image_id: number
          tag: string
        }
        Update: {
          id?: number
          image_id?: number
          tag?: string
        }
        Relationships: [
          {
            foreignKeyName: "Image_Tags_image_id_fkey"
            columns: ["image_id"]
            isOneToOne: false
            referencedRelation: "Image"
            referencedColumns: ["id"]
          },
        ]
      }
      Messages: {
        Row: {
          id: number
          message_text: Json
          modelId: number | null
          status: Database["public"]["Enums"]["mstatus"]
          timestamp: string
          userId: number | null
        }
        Insert: {
          id?: number
          message_text: Json
          modelId?: number | null
          status: Database["public"]["Enums"]["mstatus"]
          timestamp?: string
          userId?: number | null
        }
        Update: {
          id?: number
          message_text?: Json
          modelId?: number | null
          status?: Database["public"]["Enums"]["mstatus"]
          timestamp?: string
          userId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "Messages_modelId_fkey"
            columns: ["modelId"]
            isOneToOne: false
            referencedRelation: "Model"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Messages_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      Model: {
        Row: {
          attributes: Json
          id: number
          name: string
          profile_images: Json
          system_prompts: Json
        }
        Insert: {
          attributes: Json
          id?: number
          name: string
          profile_images: Json
          system_prompts: Json
        }
        Update: {
          attributes?: Json
          id?: number
          name?: string
          profile_images?: Json
          system_prompts?: Json
        }
        Relationships: []
      }
      Token_Request: {
        Row: {
          id: number
          requested_tokens: number
          status: Database["public"]["Enums"]["tstatus"]
          userId: number
        }
        Insert: {
          id?: number
          requested_tokens: number
          status: Database["public"]["Enums"]["tstatus"]
          userId: number
        }
        Update: {
          id?: number
          requested_tokens?: number
          status?: Database["public"]["Enums"]["tstatus"]
          userId?: number
        }
        Relationships: [
          {
            foreignKeyName: "Token_Request_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      User: {
        Row: {
          email: string
          id: number
          password: string
          tokenbalance: number
          username: string
        }
        Insert: {
          email: string
          id?: number
          password: string
          tokenbalance: number
          username: string
        }
        Update: {
          email?: string
          id?: number
          password?: string
          tokenbalance?: number
          username?: string
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
      mstatus: "read" | "delievered" | "sent"
      tstatus: "pending" | "approved" | "rejected"
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
