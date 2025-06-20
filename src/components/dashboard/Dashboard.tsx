
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Users, Trophy, Coins } from 'lucide-react';
import RoomCard from './RoomCard';
import { useSalas } from '@/hooks/useSalas';

interface User {
  id: number;
  nome: string;
  email: string;
  creditos: number;
}

interface DashboardProps {
  user: User;
  onCreateRoom: () => void;
  onJoinRoom: () => void;
  onViewRanking: () => void;
  onEnterRoom: (roomId: number) => void;
}

const Dashboard = ({ user, onCreateRoom, onJoinRoom, onViewRanking, onEnterRoom }: DashboardProps) => {
  const { salas: userRooms, loading } = useSalas();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-emerald-600 mb-2">Carregando...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header de boas-vindas */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Olá, {user.nome}! 👋
          </h1>
          <div className="flex items-center space-x-2 text-lg">
            <Coins className="h-6 w-6 text-emerald-600" />
            <span className="text-gray-700">Créditos disponíveis:</span>
            <span className="font-bold text-emerald-600">{user.creditos}</span>
          </div>
        </div>

        {/* Ações rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onCreateRoom}>
            <CardContent className="flex items-center justify-center p-6 space-x-3">
              <Plus className="h-8 w-8 text-emerald-600" />
              <div>
                <h3 className="font-semibold">Criar Nova Sala</h3>
                <p className="text-sm text-gray-600">Monte sua própria sala</p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onJoinRoom}>
            <CardContent className="flex items-center justify-center p-6 space-x-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="font-semibold">Entrar com Código</h3>
                <p className="text-sm text-gray-600">Use código ou escolha pública</p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={onViewRanking}>
            <CardContent className="flex items-center justify-center p-6 space-x-3">
              <Trophy className="h-8 w-8 text-yellow-600" />
              <div>
                <h3 className="font-semibold">Ranking Geral</h3>
                <p className="text-sm text-gray-600">Veja os melhores apostadores</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Suas salas */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Suas Salas</h2>
          {userRooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userRooms.map((room) => (
                <RoomCard
                  key={room.id}
                  room={{
                    ...room,
                    campeonato: { nome: 'Campeonato Brasileiro 2025' }
                  }}
                  onEnterRoom={onEnterRoom}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Você ainda não participa de nenhuma sala
                </h3>
                <p className="text-gray-600 text-center mb-6">
                  Crie uma nova sala ou entre em uma existente para começar a apostar!
                </p>
                <div className="flex space-x-3">
                  <Button onClick={onCreateRoom} className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Sala
                  </Button>
                  <Button onClick={onJoinRoom} variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    Entrar em Sala
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
