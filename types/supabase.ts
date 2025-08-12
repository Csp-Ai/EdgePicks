export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      live_games: {
        Row: {
          id: string
          homeTeam: string
          awayTeam: string
          league: string
          time: string
          confidence: number
          edgePick: Json[]
          winner: string
          edgeDelta: number
          odds: Json | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          homeTeam: string
          awayTeam: string
          league: string
          time: string
          confidence: number
          edgePick: Json[]
          winner: string
          edgeDelta: number
          odds?: Json | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          homeTeam?: string
          awayTeam?: string
          league?: string
          time?: string
          confidence?: number
          edgePick?: Json[]
          winner?: string
          edgeDelta?: number
          odds?: Json | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      agent_reflections: {
        Row: {
          id: string
          agent: string
          message: string
          metadata: Json | null
          environment: string
          timestamp: string
        }
        Insert: {
          id?: string
          agent: string
          message: string
          metadata?: Json | null
          environment?: string
          timestamp?: string
        }
        Update: {
          id?: string
          agent?: string
          message?: string
          metadata?: Json | null
          environment?: string
          timestamp?: string
        }
      }
      agent_runs: {
        Row: {
          id: string
          agent_id: string
          input: Json
          output: Json | null
          status: string
          error: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          agent_id: string
          input: Json
          output?: Json | null
          status?: string
          error?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          agent_id?: string
          input?: Json
          output?: Json | null
          status?: string
          error?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
