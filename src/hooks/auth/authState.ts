
import { useState } from 'react';
import type { AuthState, UserProfile } from './types';
import type { Session } from '@supabase/supabase-js';

export const useAuthState = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const updateUser = (newUser: UserProfile | null) => {
    setUser(newUser);
  };

  const updateSession = (newSession: Session | null) => {
    setSession(newSession);
  };

  const updateLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  const resetState = () => {
    setUser(null);
    setSession(null);
    setIsLoading(false);
  };

  return {
    user,
    session,
    isLoading,
    updateUser,
    updateSession,
    updateLoading,
    resetState
  };
};
