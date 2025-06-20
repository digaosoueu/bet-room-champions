
import React from 'react';
import { Coins, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface User {
  id: number;
  nome: string;
  email: string;
  creditos: number;
}

interface HomeHeaderProps {
  user: User | null;
}

const HomeHeader = ({ user }: HomeHeaderProps) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {user ? `Bem-vindo ao BetRooms, ${user.nome}! ⚽` : 'Bem-vindo ao BetRooms! ⚽'}
      </h1>
      <p className="text-lg text-gray-600 mb-4">
        {user ? 'Faça suas apostas no Campeonato Brasileiro 2025' : 'Entre para fazer suas apostas no Campeonato Brasileiro 2025'}
      </p>
      
      <div className="flex items-center space-x-6">
        {user ? (
          <div className="flex items-center space-x-2 bg-emerald-50 px-4 py-2 rounded-lg">
            <Coins className="h-5 w-5 text-emerald-600" />
            <span className="font-semibold text-emerald-700">{user.creditos}</span>
            <span className="text-sm text-emerald-600">créditos</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-lg">
            <LogIn className="h-5 w-5 text-gray-600" />
            <span className="text-sm text-gray-600">Faça login para apostar</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeHeader;
