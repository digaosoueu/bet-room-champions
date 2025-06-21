
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
      .maybeSingle();

    if (error) {
      console.error('authService: Erro ao carregar perfil:', error);
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

    if (!error) {
      console.log('authService: Cadastro realizado com sucesso');
    }
    return { data, error };
  },

  async signIn(email: string, password: string): Promise<AuthResponse> {
    console.log('authService: Iniciando login para:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error) {
      console.log('authService: Login realizado com sucesso');
    }
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
    console.log('authService: Verificando sessão atual...');
    try {
      const { data, error } = await supabase.auth.getSession();
      console.log('authService: Resultado getSession:', { 
        hasSession: !!data.session, 
        hasUser: !!data.session?.user,
        userEmail: data.session?.user?.email,
        error 
      });
      return { data, error };
    } catch (error) {
      console.error('authService: Erro ao buscar sessão:', error);
      return { data: { session: null }, error };
    }
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    console.log('authService: Configurando listener de mudanças de autenticação');
    return supabase.auth.onAuthStateChange(callback);
  }
};
