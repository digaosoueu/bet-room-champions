
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/layout/Navbar';
import LoginForm from '@/components/auth/LoginForm';
import Dashboard from '@/components/dashboard/Dashboard';
import CreateRoomForm from '@/components/room/CreateRoomForm';
import RoomView from '@/components/room/RoomView';
import GlobalRanking from '@/components/ranking/GlobalRanking';

type Page = 'login' | 'dashboard' | 'create-room' | 'room' | 'ranking';

interface User {
  id: string;
  nome: string;
  email: string;
  creditos: number;
}

const Index = () => {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentRoomId, setCurrentRoomId] = useState<string>('');
  const { toast } = useToast();

  const handleLogin = (email: string, password: string) => {
    // Simulação de login - em uma aplicação real, isso seria conectado ao backend
    console.log('Login attempt:', { email, password });
    
    // Mock user data
    const mockUser: User = {
      id: '1',
      nome: 'João Silva',
      email: email,
      creditos: 2500
    };
    
    setCurrentUser(mockUser);
    setCurrentPage('dashboard');
    
    toast({
      title: "Login realizado com sucesso!",
      description: `Bem-vindo de volta, ${mockUser.nome}!`,
    });
  };

  const handleRegister = (name: string, email: string, password: string) => {
    // Simulação de registro
    console.log('Register attempt:', { name, email, password });
    
    const mockUser: User = {
      id: '1',
      nome: name,
      email: email,
      creditos: 1000 // Créditos iniciais
    };
    
    setCurrentUser(mockUser);
    setCurrentPage('dashboard');
    
    toast({
      title: "Conta criada com sucesso!",
      description: `Bem-vindo, ${mockUser.nome}! Você ganhou 1000 créditos iniciais.`,
    });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('login');
    toast({
      title: "Logout realizado",
      description: "Até mais!",
    });
  };

  const handleCreateRoom = (roomData: any) => {
    console.log('Creating room:', roomData);
    
    toast({
      title: "Sala criada com sucesso!",
      description: `A sala "${roomData.nome}" foi criada e você já está participando.`,
    });
    
    // Simular que a sala foi criada e voltar ao dashboard
    setCurrentPage('dashboard');
  };

  const handleEnterRoom = (roomId: string) => {
    setCurrentRoomId(roomId);
    setCurrentPage('room');
  };

  const handleJoinRoom = () => {
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A funcionalidade de entrar com código estará disponível em breve!",
    });
  };

  if (currentPage === 'login') {
    return (
      <LoginForm
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {currentUser && (
        <Navbar
          userName={currentUser.nome}
          credits={currentUser.creditos}
          onLogout={handleLogout}
        />
      )}
      
      {currentPage === 'dashboard' && currentUser && (
        <Dashboard
          user={currentUser}
          onCreateRoom={() => setCurrentPage('create-room')}
          onJoinRoom={handleJoinRoom}
          onViewRanking={() => setCurrentPage('ranking')}
          onEnterRoom={handleEnterRoom}
        />
      )}
      
      {currentPage === 'create-room' && (
        <CreateRoomForm
          onBack={() => setCurrentPage('dashboard')}
          onCreateRoom={handleCreateRoom}
        />
      )}
      
      {currentPage === 'room' && (
        <RoomView
          roomId={currentRoomId}
          onBack={() => setCurrentPage('dashboard')}
        />
      )}
      
      {currentPage === 'ranking' && (
        <GlobalRanking
          onBack={() => setCurrentPage('dashboard')}
        />
      )}
    </div>
  );
};

export default Index;
