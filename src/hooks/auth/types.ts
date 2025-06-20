
import type { User, Session } from '@supabase/supabase-js';

export interface UserProfile {
  id: number;
  auth_user_id: string;
  nome: string;
  email: string;
  creditos: number;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
}

export interface AuthResponse {
  data: any;
  error: any;
}
