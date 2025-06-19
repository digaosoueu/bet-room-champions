
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/layout/Navbar';
import AuthPage from '@/components/auth/AuthPage';
import Dashboard from '@/components/dashboard/Dashboard';
import CreateRoomForm from '@/components/room/CreateRoomForm';
import RoomView from '@/components/room/RoomView';
import GlobalRanking from '@/components/ranking/GlobalRanking';
import Home from '@/components/home/Home';
import { useAuth } from '@/hooks/useAuth';

type Page = 'home' | 'dashboard' | 'create-room' | 'room' | 'ranking';

const Index = () => {
  const [currentPage, setCurrentPage] = React.useState<Page>('home');
  const [currentRoomId, setCurrentRoomId] = React.useState<string>('');
  const { toast } = useToast();
  const { user, userProfile, loading, signOut } = useAuth();

  const handleLogout = async () => {
    const { error } = await signOut();
    
    if (error) {
      toast({
        title: "Erro no logout",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setCurrentPage('home');
      toast({
        title: "Logout realizado",
        description: "Até mais!",
      });
    }
  };

  const handleCreateRoom = (roomData: any) => {
    console.log('Creating room:', roomData);
    
    toast({
      title: "Sala criada com sucesso!",
      description: `A sala "${roomData.nome}" foi criada e você já está participando.`,
    });
    
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

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
  };

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-2xl font-bold text-emerald-600 mb-2">BetRooms</div>
          <div className="text-gray-600">Carregando...</div>
        </div>
      </div>
    );
  }

  // Se não estiver autenticado, mostrar página de login
  if (!user || !userProfile) {
    return <AuthPage />;
  }

  // Se estiver autenticado, mostrar aplicação
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        userName={userProfile.nome}
        credits={userProfile.creditos}
        onLogout={handleLogout}
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />
      
      {currentPage === 'home' && (
        <Home user={userProfile} />
      )}
      
      {currentPage === 'dashboard' && (
        <Dashboard
          user={userProfile}
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
