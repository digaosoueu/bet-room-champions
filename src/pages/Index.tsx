
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import AuthPage from '@/components/auth/AuthPage';
import Home from '@/components/home/Home';

const Index = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-emerald-600 mb-2">Carregando...</div>
          <div className="text-gray-600">Verificando autenticação</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return <Home user={user} />;
};

export default Index;
