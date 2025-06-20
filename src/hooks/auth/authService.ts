
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';
import type { UserProfile, AuthResponse } from './types';

export const authService = {
  async loadUserProfile(authUser: User): Promise<UserProfile | null> {
    console.log('authService: Carregando perfil do usuário:', authUser.email);
    
    const { data: profile, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('auth_user_id', authUser.id)
      .single();

    if (error) {
      console.error('authService: Erro ao carregar perfil:', error);
      if (error.code === 'PGRST116') {
        console.log('authService: Perfil não encontrado, usuário provavelmente precisa ser criado');
      }
      return null;
    }

    if (profile) {
      console.log('authService: Perfil carregado com sucesso:', profile.nome);
      return profile;
    }

    console.log('authService: Nenhum perfil encontrado');
    return null;
  },

  async signUp(email: string, password: string, nome: string): Promise<AuthResponse> {
    console.log('authService: Iniciando cadastro para:', email);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          nome: nome
        }
      }
    });

    console.log('authService: Cadastro realizado com sucesso');
    return { data, error };
  },

  async signIn(email: string, password: string): Promise<AuthResponse> {
    console.log('authService: Iniciando login para:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log('authService: Login realizado com sucesso');
    return { data, error };
  },

  async signOut(): Promise<{ error: any }> {
    console.log('authService: Iniciando logout');
    
    const { error } = await supabase.auth.signOut();
    
    if (!error) {
      console.log('authService: Logout realizado com sucesso');
    }
    
    return { error };
  },

  async getSession() {
    console.log('authService: Verificando sessão inicial...');
    return await supabase.auth.getSession();
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
};
