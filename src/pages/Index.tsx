
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Home from '@/components/home/Home';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { user, isLoading, signOut } = useAuth();
  const [timeoutReached, setTimeoutReached] = useState(false);

  // Timeout de segurança para evitar loading infinito
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        console.warn('Index: Timeout de carregamento atingido, forçando saída do loading');
        setTimeoutReached(true);
      }
    }, 10000); // 10 segundos

    return () => clearTimeout(timer);
  }, [isLoading]);

  // Se o timeout foi atingido, mostrar a home mesmo se ainda estiver loading
  if (timeoutReached && isLoading) {
    console.warn('Index: Mostrando home devido ao timeout de segurança');
    return <Home user={user} onLogout={signOut} />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mx-auto mb-4" />
          <div className="text-xl font-semibold text-gray-900 mb-2">Carregando...</div>
          <div className="text-gray-600">Verificando autenticação</div>
        </div>
      </div>
    );
  }

  return <Home user={user} onLogout={signOut} />;
};

export default Index;
