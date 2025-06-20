
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import AuthPage from './AuthPage';

const LoginPrompt = () => {
  const [showAuth, setShowAuth] = useState(false);

  if (showAuth) {
    return <AuthPage />;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md mx-4">
        <div className="text-center">
          <LogIn className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Login Necessário</h2>
          <p className="text-gray-600 mb-4">
            Você precisa estar logado para fazer apostas no BetRooms.
          </p>
          <Button 
            onClick={() => setShowAuth(true)}
            className="w-full bg-emerald-600 hover:bg-emerald-700"
          >
            Fazer Login / Cadastro
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginPrompt;
