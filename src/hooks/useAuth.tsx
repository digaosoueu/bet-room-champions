
import { useEffect } from 'react';
import { authService } from './auth/authService';
import { useAuthState } from './auth/authState';
import { useAuthHandlers } from './auth/authHandlers';

export type { UserProfile } from './auth/types';

export const useAuth = () => {
  const {
    user,
    session,
    isLoading,
    updateUser,
    updateSession,
    updateLoading,
    resetState
  } = useAuthState();

  const {
    handleAuthStateChange,
    checkInitialSession,
    loadUserProfile,
    signUp,
    signIn,
    signOut
  } = useAuthHandlers(updateUser, updateSession, updateLoading, resetState);

  useEffect(() => {
    console.log('useAuth: Iniciando sistema de autenticação');
    
    // Primeiro, configurar o listener de mudanças de estado
    const { data: { subscription } } = authService.onAuthStateChange(handleAuthStateChange);

    // Depois, verificar se já existe uma sessão
    checkInitialSession();

    return () => {
      console.log('useAuth: Limpando subscription');
      subscription.unsubscribe();
    };
  }, []);

  const refreshProfile = async () => {
    if (session?.user) {
      updateLoading(true);
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
