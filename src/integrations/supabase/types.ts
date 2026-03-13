export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      applications: {
        Row: {
          created_at: string
          id: string
          message: string | null
          property_id: string
          status: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          property_id: string
          status?: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          property_id?: string
          status?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          auto_delete_date: string
          created_at: string
          document_type: string
          encrypted: boolean | null
          file_url: string
          id: string
          user_id: string
        }
        Insert: {
          auto_delete_date?: string
          created_at?: string
          document_type: string
          encrypted?: boolean | null
          file_url: string
          id?: string
          user_id: string
        }
        Update: {
          auto_delete_date?: string
          created_at?: string
          document_type?: string
          encrypted?: boolean | null
          file_url?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      landlords: {
        Row: {
          address: string | null
          created_at: string
          id: string
          pan_number: string | null
          pan_verified: boolean | null
          pincode: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          id?: string
          pan_number?: string | null
          pan_verified?: boolean | null
          pincode?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          created_at?: string
          id?: string
          pan_number?: string | null
          pan_verified?: boolean | null
          pincode?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          address: string
          bathrooms: number | null
          booking_hold_amount: number | null
          bedrooms: number | null
          created_at: string
          description: string | null
          eb_bill_number: string | null
          facing: string | null
          floor_no: number | null
          furnishing: string | null
          house_type: string
          id: string
          is_active: boolean | null
          is_verified: boolean | null
          landlord_id: string
          listed_by: string | null
          maintenance_amount: number | null
          parking: boolean | null
          parking_slots: number | null
          pincode: string | null
          project_name: string | null
          property_type: string | null
          rent: number
          security_deposit_amount: number | null
          separate_meter: boolean | null
          super_builtup_area: number | null
          title: string
          total_floors: number | null
          updated_at: string
          video_url: string | null
          water_supply: boolean | null
        }
        Insert: {
          address: string
          bathrooms?: number | null
          booking_hold_amount?: number | null
          bedrooms?: number | null
          created_at?: string
          description?: string | null
          eb_bill_number?: string | null
          facing?: string | null
          floor_no?: number | null
          furnishing?: string | null
          house_type: string
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          landlord_id: string
          listed_by?: string | null
          maintenance_amount?: number | null
          parking?: boolean | null
          parking_slots?: number | null
          pincode?: string | null
          project_name?: string | null
          property_type?: string | null
          rent: number
          security_deposit_amount?: number | null
          separate_meter?: boolean | null
          super_builtup_area?: number | null
          title: string
          total_floors?: number | null
          updated_at?: string
          video_url?: string | null
          water_supply?: boolean | null
        }
        Update: {
          address?: string
          bathrooms?: number | null
          booking_hold_amount?: number | null
          bedrooms?: number | null
          created_at?: string
          description?: string | null
          eb_bill_number?: string | null
          facing?: string | null
          floor_no?: number | null
          furnishing?: string | null
          house_type?: string
          id?: string
          is_active?: boolean | null
          is_verified?: boolean | null
          landlord_id?: string
          listed_by?: string | null
          maintenance_amount?: number | null
          parking?: boolean | null
          parking_slots?: number | null
          pincode?: string | null
          project_name?: string | null
          property_type?: string | null
          rent?: number
          security_deposit_amount?: number | null
          separate_meter?: boolean | null
          super_builtup_area?: number | null
          title?: string
          total_floors?: number | null
          updated_at?: string
          video_url?: string | null
          water_supply?: boolean | null
        }
        Relationships: []
      }
      property_images: {
        Row: {
          created_at: string
          display_order: number | null
          id: string
          image_url: string
          property_id: string
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          id?: string
          image_url: string
          property_id: string
        }
        Update: {
          created_at?: string
          display_order?: number | null
          id?: string
          image_url?: string
          property_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_images_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_properties: {
        Row: {
          created_at: string
          id: string
          property_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          property_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          property_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_properties_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          aadhaar_last4: string | null
          aadhaar_name: string | null
          aadhaar_verified: boolean | null
          company: string | null
          created_at: string
          expected_rent: number | null
          family_members: number | null
          id: string
          kyc_verified_at: string | null
          occupation: string | null
          pan_name: string | null
          pan_number: string | null
          pan_verified: boolean | null
          preferred_house_type: string | null
          preferred_location: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          aadhaar_last4?: string | null
          aadhaar_name?: string | null
          aadhaar_verified?: boolean | null
          company?: string | null
          created_at?: string
          expected_rent?: number | null
          family_members?: number | null
          id?: string
          kyc_verified_at?: string | null
          occupation?: string | null
          pan_name?: string | null
          pan_number?: string | null
          pan_verified?: boolean | null
          preferred_house_type?: string | null
          preferred_location?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          aadhaar_last4?: string | null
          aadhaar_name?: string | null
          aadhaar_verified?: boolean | null
          company?: string | null
          created_at?: string
          expected_rent?: number | null
          family_members?: number | null
          id?: string
          kyc_verified_at?: string | null
          occupation?: string | null
          pan_name?: string | null
          pan_number?: string | null
          pan_verified?: boolean | null
          preferred_house_type?: string | null
          preferred_location?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "landlord" | "tenant"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["landlord", "tenant"],
    },
  },
} as const
