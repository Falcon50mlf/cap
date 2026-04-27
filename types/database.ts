// Types reflétant le schema SQL v1 (profiles + game_results + leads).
// Structure complète exigée par @supabase/supabase-js pour que `.select()`
// et `.from()` infèrent correctement les types de retour.

export type Family = 'strategy' | 'finance' | 'marketing' | 'tech' | 'startup' | 'retail';

export type Role = 'lyceen' | 'diplome';

export type Profile = {
  id: string;
  role: Role | null;
  first_name: string | null;
  last_name: string | null;
  niveau: string | null;
  created_at: string;
  updated_at: string;
};

export type GameResult = {
  id: string;
  user_id: string | null;
  game_id: string;
  family_id: string;
  skills: Record<string, number>;
  enjoyment: number | null;
  score: number | null;
  duration_ms: number | null;
  payload: unknown | null;
  completed_at: string;
};

export type Lead = {
  id: string;
  school_name: string;
  contact_first_name: string;
  contact_last_name: string;
  contact_email: string;
  contact_role: string | null;
  message: string | null;
  source: string | null;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Pick<Profile, 'id'> & Partial<Omit<Profile, 'id'>>;
        Update: Partial<Profile>;
        Relationships: [];
      };
      game_results: {
        Row: GameResult;
        Insert: Omit<GameResult, 'id' | 'completed_at'> &
          Partial<Pick<GameResult, 'id' | 'completed_at'>>;
        Update: Partial<GameResult>;
        Relationships: [];
      };
      leads: {
        Row: Lead;
        Insert: Omit<Lead, 'id' | 'created_at'> & Partial<Pick<Lead, 'id' | 'created_at'>>;
        Update: Partial<Lead>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
