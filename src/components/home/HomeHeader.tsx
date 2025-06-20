
import React from 'react';
import Navbar from '@/components/layout/Navbar';

interface User {
  id: number;
  nome: string;
  email: string;
  creditos: number;
}

interface HomeHeaderProps {
  user: User | null;
  brasileiraoId: number | undefined;
  onLogout: () => void;
}

const HomeHeader = ({ user, brasileiraoId, onLogout }: HomeHeaderProps) => {
  const handleNavigate = (page: string) => {
    console.log('Navegando para:', page);
    // TODO: Implementar navegação real quando as páginas estiverem prontas
  };

  return (
    <Navbar 
      userName={user?.nome || 'Visitante'} 
      credits={user?.creditos || 0} 
      onLogout={onLogout}
      currentPage="home"
      onNavigate={handleNavigate}
    />
  );
};

export default HomeHeader;
