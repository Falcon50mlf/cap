// Types reflétant supabase/schema.sql.
// À régénérer plus tard via `supabase gen types typescript` quand on aura la CLI.

export type Family =
  | "strategy"
  | "finance"
  | "marketing"
  | "tech"
  | "startup"
  | "retail";

export type Role = "lyceen" | "diplome";

export type Profile = {
  id: string;
  role: Role;
  first_name: string | null;
  last_name: string | null;
  niveau: string | null;
  created_at: string;
  updated_at: string;
};

export type DiscoveryRun = {
  id: string;
  user_id: string | null;
  family: Family;
  game_key: string;
  score: number | null;
  duration_ms: number | null;
  payload: unknown | null;
  completed_at: string;
};

export type ProgramLead = {
  id: string;
  user_id: string | null;
  school: string;
  module: string;
  first_name: string;
  last_name: string;
  email: string;
  niveau: string | null;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Pick<Profile, "id"> & Partial<Omit<Profile, "id">>;
        Update: Partial<Profile>;
      };
      discovery_runs: {
        Row: DiscoveryRun;
        Insert: Omit<DiscoveryRun, "id" | "completed_at"> &
          Partial<Pick<DiscoveryRun, "id" | "completed_at">>;
        Update: Partial<DiscoveryRun>;
      };
      program_leads: {
        Row: ProgramLead;
        Insert: Omit<ProgramLead, "id" | "created_at"> &
          Partial<Pick<ProgramLead, "id" | "created_at">>;
        Update: Partial<ProgramLead>;
      };
    };
  };
};
