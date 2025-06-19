
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Trophy, Users, Coins, Calendar } from 'lucide-react';
import BetForm from './BetForm';
import RoomRanking from './RoomRanking';

interface Game {
  id: string;
  time1: string;
  time2: string;
  data_jogo: string;
  placar_oficial1?: number;
  placar_oficial2?: number;
}

interface RoomViewProps {
  roomId: string;
  onBack: () => void;
}

const RoomView = ({ roomId, onBack }: RoomViewProps) => {
  // Dados mock para demonstração
  const room = {
    id: roomId,
    nome: 'Brasileirão 2024',
    tipo: 'geral' as const,
    valor_aposta: 100,
    campeonato: 'Campeonato Brasileiro 2024',
    participantes_count: 1247
  };

  const [games] = useState<Game[]>([
    {
      id: '1',
      time1: 'Flamengo',
      time2: 'Palmeiras',
      data_jogo: '2024-06-22T16:00:00',
    },
    {
      id: '2',
      time1: 'São Paulo',
      time2: 'Corinthians',
      data_jogo: '2024-06-22T18:30:00',
    },
    {
      id: '3',
      time1: 'Santos',
      time2: 'Fluminense',
      data_jogo: '2024-06-23T16:00:00',
    }
  ]);

  const handleBet = (gameId: string, placar1: number, placar2: number, creditos: number) => {
    console.log('Aposta realizada:', { gameId, placar1, placar2, creditos });
    // Aqui seria implementada a lógica de aposta
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoomTypeColor = (tipo: string) => {
    switch (tipo) {
      case 'geral':
        return 'bg-blue-100 text-blue-800';
      case 'publica':
        return 'bg-green-100 text-green-800';
      case 'privada':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4 hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>

        {/* Informações da sala */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{room.nome}</CardTitle>
                <CardDescription className="text-lg mt-1">{room.campeonato}</CardDescription>
              </div>
              <Badge className={getRoomTypeColor(room.tipo)}>
                {room.tipo === 'geral' ? 'Geral' : room.tipo === 'publica' ? 'Pública' : 'Privada'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Coins className="h-5 w-5 text-emerald-600" />
                <span className="font-medium">{room.valor_aposta} créditos por aposta</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span>{room.participantes_count} participantes</span>
              </div>
              <div className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-yellow-600" />
                <span>Rodada 12</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Jogos e apostas */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Jogos da Rodada</h2>
            <div className="space-y-6">
              {games.map((game) => (
                <Card key={game.id}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">
                        {game.time1} vs {game.time2}
                      </CardTitle>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(game.data_jogo)}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <BetForm
                      gameId={game.id}
                      valorAposta={room.valor_aposta}
                      onBet={handleBet}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Ranking da sala */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Ranking da Sala</h2>
            <RoomRanking roomId={room.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomView;
