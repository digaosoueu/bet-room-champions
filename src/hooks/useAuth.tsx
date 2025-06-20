
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
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

export const useAuth = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    console.log('useAuth: Iniciando sistema de autenticação');
    
    // Configurar listener de mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('useAuth: Auth state changed:', event, newSession?.user?.email);
        
        setSession(newSession);
        
        if (event === 'SIGNED_IN' && newSession?.user) {
          await loadUserProfile(newSession.user);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setIsLoading(false);
        } else if (event === 'TOKEN_REFRESHED' && newSession?.user) {
          await loadUserProfile(newSession.user);
        }
      }
    );

    // Verificar sessão existente
    checkSession();

    return () => {
      console.log('useAuth: Limpando subscription');
      subscription.unsubscribe();
    };
  }, []);

  const checkSession = async () => {
    try {
      console.log('useAuth: Verificando sessão existente...');
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('useAuth: Erro ao buscar sessão:', error);
        setIsLoading(false);
        return;
      }

      setSession(currentSession);
      
      if (currentSession?.user) {
        console.log('useAuth: Sessão encontrada para:', currentSession.user.email);
        await loadUserProfile(currentSession.user);
      } else {
        console.log('useAuth: Nenhuma sessão ativa');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('useAuth: Erro ao verificar sessão:', error);
      setIsLoading(false);
    }
  };

  const loadUserProfile = async (authUser: User) => {
    try {
      console.log('useAuth: Carregando perfil do usuário:', authUser.email);
      
      const { data: profile, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('auth_user_id', authUser.id)
        .single();

      if (error) {
        console.error('useAuth: Erro ao carregar perfil:', error);
        setUser(null);
      } else if (profile) {
        console.log('useAuth: Perfil carregado:', profile.nome);
        setUser(profile);
      } else {
        console.log('useAuth: Perfil não encontrado');
        setUser(null);
      }
    } catch (error) {
      console.error('useAuth: Erro ao carregar perfil:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, nome: string) => {
    try {
      console.log('useAuth: Iniciando cadastro para:', email);
      
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

      if (error) {
        console.error('useAuth: Erro no cadastro:', error);
        throw error;
      }

      console.log('useAuth: Cadastro realizado com sucesso');
      
      toast({
        title: "Cadastro realizado!",
        description: "Verifique seu email para confirmar a conta.",
      });

      return { data, error: null };
    } catch (error: any) {
      console.error('useAuth: Erro no cadastro:', error);
      return { data: null, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log('useAuth: Iniciando login para:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('useAuth: Erro no login:', error);
        throw error;
      }

      console.log('useAuth: Login realizado com sucesso');
      
      toast({
        title: "Login realizado!",
        description: `Bem-vindo de volta!`,
      });

      return { data, error: null };
    } catch (error: any) {
      console.error('useAuth: Erro no login:', error);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      console.log('useAuth: Iniciando logout');
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('useAuth: Erro no logout:', error);
        throw error;
      }

      console.log('useAuth: Logout realizado com sucesso');
      
      setUser(null);
      setSession(null);
      
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
    } catch (error: any) {
      console.error('useAuth: Erro no logout:', error);
      toast({
        title: "Erro ao sair",
        description: "Ocorreu um erro ao tentar sair.",
        variant: "destructive",
      });
    }
  };

  const refreshProfile = async () => {
    if (session?.user) {
      await loadUserProfile(session.user);
    }
  };

  return {
    user,
    session,
    isLoading,
    signUp,
    signIn,
    signOut,
    refreshProfile
  };
};
