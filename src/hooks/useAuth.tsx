
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

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
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Verificar se já existe um usuário logado
    getCurrentUser();

    // Ouvir mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          await getCurrentUser();
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const getCurrentUser = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (authUser) {
        // Buscar perfil do usuário na tabela usuarios
        const { data: profile, error } = await supabase
          .from('usuarios')
          .select('*')
          .eq('auth_user_id', authUser.id)
          .single();

        if (error) {
          console.error('Erro ao buscar perfil:', error);
        } else if (profile) {
          setUser(profile);
        }
      }
    } catch (error) {
      console.error('Erro ao obter usuário atual:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, nome: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nome: nome
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        toast({
          title: "Conta criada com sucesso!",
          description: "Bem-vindo ao nosso sistema de apostas esportivas.",
        });
      }

      return { data, error: null };
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      return { data: null, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo de volta!`,
      });

      return { data, error: null };
    } catch (error: any) {
      console.error('Erro no login:', error);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
    } catch (error: any) {
      console.error('Erro no logout:', error);
      toast({
        title: "Erro ao sair",
        description: "Ocorreu um erro ao tentar sair.",
        variant: "destructive",
      });
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { error: 'Usuário não encontrado' };

    try {
      const { data, error } = await supabase
        .from('usuarios')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      setUser(data);
      return { data, error: null };
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      return { data: null, error };
    }
  };

  return {
    user,
    isLoading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    refetch: getCurrentUser
  };
};
