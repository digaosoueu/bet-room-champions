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
      apostas: {
        Row: {
          creditos_apostados: number
          data_aposta: string
          id: string
          jogo_id: string
          placar_time1: number
          placar_time2: number
          sala_id: string
          usuario_id: string
        }
        Insert: {
          creditos_apostados: number
          data_aposta?: string
          id?: string
          jogo_id: string
          placar_time1: number
          placar_time2: number
          sala_id: string
          usuario_id: string
        }
        Update: {
          creditos_apostados?: number
          data_aposta?: string
          id?: string
          jogo_id?: string
          placar_time1?: number
          placar_time2?: number
          sala_id?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "apostas_jogo_id_fkey"
            columns: ["jogo_id"]
            isOneToOne: false
            referencedRelation: "jogos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "apostas_sala_id_fkey"
            columns: ["sala_id"]
            isOneToOne: false
            referencedRelation: "salas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "apostas_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      campeonatos: {
        Row: {
          ativo: boolean
          created_at: string
          id: string
          nome: string
          temporada: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          id?: string
          nome: string
          temporada: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          id?: string
          nome?: string
          temporada?: string
          updated_at?: string
        }
        Relationships: []
      }
      configuracoes: {
        Row: {
          chave: string
          created_at: string
          id: string
          updated_at: string
          valor: string
        }
        Insert: {
          chave: string
          created_at?: string
          id?: string
          updated_at?: string
          valor: string
        }
        Update: {
          chave?: string
          created_at?: string
          id?: string
          updated_at?: string
          valor?: string
        }
        Relationships: []
      }
      jogos: {
        Row: {
          created_at: string
          data_jogo: string
          id: string
          placar_oficial1: number | null
          placar_oficial2: number | null
          rodada_id: string
          time1: string
          time2: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_jogo: string
          id?: string
          placar_oficial1?: number | null
          placar_oficial2?: number | null
          rodada_id: string
          time1: string
          time2: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_jogo?: string
          id?: string
          placar_oficial1?: number | null
          placar_oficial2?: number | null
          rodada_id?: string
          time1?: string
          time2?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "jogos_rodada_id_fkey"
            columns: ["rodada_id"]
            isOneToOne: false
            referencedRelation: "rodadas"
            referencedColumns: ["id"]
          },
        ]
      }
      participantes: {
        Row: {
          data_entrada: string
          id: string
          sala_id: string
          usuario_id: string
        }
        Insert: {
          data_entrada?: string
          id?: string
          sala_id: string
          usuario_id: string
        }
        Update: {
          data_entrada?: string
          id?: string
          sala_id?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "participantes_sala_id_fkey"
            columns: ["sala_id"]
            isOneToOne: false
            referencedRelation: "salas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "participantes_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      ranking: {
        Row: {
          created_at: string
          creditos_ganhos: number
          id: string
          pontos: number
          sala_id: string
          updated_at: string
          usuario_id: string
        }
        Insert: {
          created_at?: string
          creditos_ganhos?: number
          id?: string
          pontos?: number
          sala_id: string
          updated_at?: string
          usuario_id: string
        }
        Update: {
          created_at?: string
          creditos_ganhos?: number
          id?: string
          pontos?: number
          sala_id?: string
          updated_at?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ranking_sala_id_fkey"
            columns: ["sala_id"]
            isOneToOne: false
            referencedRelation: "salas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ranking_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      rodadas: {
        Row: {
          campeonato_id: string
          created_at: string
          data_fim: string
          data_inicio: string
          id: string
          numero: number
          updated_at: string
        }
        Insert: {
          campeonato_id: string
          created_at?: string
          data_fim: string
          data_inicio: string
          id?: string
          numero: number
          updated_at?: string
        }
        Update: {
          campeonato_id?: string
          created_at?: string
          data_fim?: string
          data_inicio?: string
          id?: string
          numero?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rodadas_campeonato_id_fkey"
            columns: ["campeonato_id"]
            isOneToOne: false
            referencedRelation: "campeonatos"
            referencedColumns: ["id"]
          },
        ]
      }
      salas: {
        Row: {
          campeonato_id: string
          codigo_acesso: string | null
          created_at: string
          dono_id: string
          id: string
          nome: string
          tipo: Database["public"]["Enums"]["tipo_sala"]
          updated_at: string
          valor_aposta: number
        }
        Insert: {
          campeonato_id: string
          codigo_acesso?: string | null
          created_at?: string
          dono_id: string
          id?: string
          nome: string
          tipo?: Database["public"]["Enums"]["tipo_sala"]
          updated_at?: string
          valor_aposta: number
        }
        Update: {
          campeonato_id?: string
          codigo_acesso?: string | null
          created_at?: string
          dono_id?: string
          id?: string
          nome?: string
          tipo?: Database["public"]["Enums"]["tipo_sala"]
          updated_at?: string
          valor_aposta?: number
        }
        Relationships: [
          {
            foreignKeyName: "salas_campeonato_id_fkey"
            columns: ["campeonato_id"]
            isOneToOne: false
            referencedRelation: "campeonatos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "salas_dono_id_fkey"
            columns: ["dono_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios: {
        Row: {
          auth_user_id: string
          created_at: string
          creditos: number
          email: string
          id: string
          nome: string
          updated_at: string
        }
        Insert: {
          auth_user_id: string
          created_at?: string
          creditos?: number
          email: string
          id?: string
          nome: string
          updated_at?: string
        }
        Update: {
          auth_user_id?: string
          created_at?: string
          creditos?: number
          email?: string
          id?: string
          nome?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_room_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      tipo_sala: "geral" | "publica" | "privada"
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
    Enums: {
      tipo_sala: ["geral", "publica", "privada"],
    },
  },
} as const
