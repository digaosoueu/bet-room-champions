
import { useToast } from '@/hooks/use-toast';
import { authService } from './authService';
import type { User } from '@supabase/supabase-js';
import type { UserProfile } from './types';

export const useAuthHandlers = (
  updateUser: (user: UserProfile | null) => void,
  updateSession: (session: any) => void,
  updateLoading: (loading: boolean) => void,
  resetState: () => void
) => {
  const { toast } = useToast();

  const handleAuthStateChange = async (event: string, newSession: any) => {
    console.log('authHandlers: Auth state changed:', event, newSession?.user?.email);
    
    updateSession(newSession);
    
    if (event === 'SIGNED_IN' && newSession?.user) {
      console.log('authHandlers: Usuário logado, carregando perfil...');
      await loadUserProfile(newSession.user);
    } else if (event === 'SIGNED_OUT') {
      console.log('authHandlers: Usuário deslogado');
      resetState();
    } else if (event === 'TOKEN_REFRESHED' && newSession?.user) {
      console.log('authHandlers: Token atualizado, recarregando perfil...');
      await loadUserProfile(newSession.user);
    } else if (event === 'INITIAL_SESSION') {
      console.log('authHandlers: Sessão inicial verificada');
      if (newSession?.user) {
        await loadUserProfile(newSession.user);
      } else {
        updateLoading(false);
      }
    }
  };

  const loadUserProfile = async (authUser: User) => {
    try {
      const profile = await authService.loadUserProfile(authUser);
      updateUser(profile);
    } catch (error) {
      console.error('authHandlers: Erro inesperado ao carregar perfil:', error);
      updateUser(null);
    } finally {
      console.log('authHandlers: Finalizando carregamento do perfil');
      updateLoading(false);
    }
  };

  const checkInitialSession = async () => {
    try {
      const { data: { session: currentSession }, error } = await authService.getSession();
      
      if (error) {
        console.error('authHandlers: Erro ao buscar sessão:', error);
        updateLoading(false);
        return;
      }

      console.log('authHandlers: Sessão inicial encontrada:', currentSession?.user?.email || 'nenhuma');
      
      if (!currentSession) {
        updateLoading(false);
      }
    } catch (error) {
      console.error('authHandlers: Erro ao verificar sessão inicial:', error);
      updateLoading(false);
    }
  };

  const signUp = async (email: string, password: string, nome: string) => {
    try {
      updateLoading(true);
      
      const { data, error } = await authService.signUp(email, password, nome);

      if (error) {
        console.error('authHandlers: Erro no cadastro:', error);
        throw error;
      }
      
      toast({
        title: "Cadastro realizado!",
        description: "Verifique seu email para confirmar a conta.",
      });

      return { data, error: null };
    } catch (error: any) {
      console.error('authHandlers: Erro no cadastro:', error);
      return { data: null, error };
    } finally {
      updateLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      updateLoading(true);
      
      const { data, error } = await authService.signIn(email, password);

      if (error) {
        console.error('authHandlers: Erro no login:', error);
        throw error;
      }
      
      toast({
        title: "Login realizado!",
        description: `Bem-vindo de volta!`,
      });

      return { data, error: null };
    } catch (error: any) {
      console.error('authHandlers: Erro no login:', error);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      updateLoading(true);
      
      const { error } = await authService.signOut();
      
      if (error) {
        console.error('authHandlers: Erro no logout:', error);
        throw error;
      }
      
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
    } catch (error: any) {
      console.error('authHandlers: Erro no logout:', error);
      toast({
        title: "Erro ao sair",
        description: "Ocorreu um erro ao tentar sair.",
        variant: "destructive",
      });
    }
  };

  return {
    handleAuthStateChange,
    checkInitialSession,
    loadUserProfile,
    signUp,
    signIn,
    signOut
  };
};
