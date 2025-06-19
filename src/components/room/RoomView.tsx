
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Trophy, Users, Coins, Calendar } from 'lucide-react';
import BetForm from './BetForm';
import RoomRanking from './RoomRanking';
import { useJogos } from '@/hooks/useJogos';
import { useApostas } from '@/hooks/useApostas';
import { useToast } from '@/hooks/use-toast';

interface RoomViewProps {
  roomId: string;
  onBack: () => void;
}

const RoomView = ({ roomId, onBack }: RoomViewProps) => {
  const { toast } = useToast();
  const { apostas, createAposta } = useApostas(roomId);
  
  // Mock data - em produção viria do Supabase
  const room = {
    id: roomId,
    nome: 'Brasileirão 2024',
    tipo: 'geral' as const,
    valor_aposta: 100,
    campeonato: 'Campeonato Brasileiro 2024',
    participantes_count: 1247
  };

  const [games] = useState([
    {
      id: '1',
      time1: 'Flamengo',
      time2: 'Palmeiras',
      data_jogo: '2024-06-22T16:00:00',
      placar_oficial1: null,
      placar_oficial2: null,
    },
    {
      id: '2',
      time1: 'São Paulo',
      time2: 'Corinthians',
      data_jogo: '2024-06-22T18:30:00',
      placar_oficial1: null,
      placar_oficial2: null,
    },
    {
      id: '3',
      time1: 'Santos',
      time2: 'Fluminense',
      data_jogo: '2024-06-23T16:00:00',
      placar_oficial1: null,
      placar_oficial2: null,
    }
  ]);

  const handleBet = async (gameId: string, placar1: number, placar2: number, creditos: number) => {
    try {
      // Verificar se o jogo já começou
      const game = games.find(g => g.id === gameId);
      if (game && new Date(game.data_jogo) <= new Date()) {
        toast({
          title: "Erro",
          description: "Não é possível apostar em jogos que já começaram.",
          variant: "destructive",
        });
        return;
      }

      // Contar apostas existentes para este jogo
      const apostasExistentes = apostas.filter(a => a.jogo_id === gameId);
      
      // Primeira aposta é grátis, demais consomem créditos
      const creditosNecessarios = apostasExistentes.length === 0 ? 0 : creditos;

      await createAposta({
        sala_id: roomId,
        jogo_id: gameId,
        placar_time1: placar1,
        placar_time2: placar2,
        creditos_apostados: creditosNecessarios
      });

      toast({
        title: "Aposta realizada!",
        description: `Aposta registrada: ${placar1}x${placar2}${creditosNecessarios > 0 ? ` por ${creditosNecessarios} créditos` : ' (grátis)'}`,
      });
    } catch (error: any) {
      toast({
        title: "Erro ao apostar",
        description: error.message || "Não foi possível realizar a aposta.",
        variant: "destructive",
      });
    }
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

  const getApostasCount = (gameId: string) => {
    return apostas.filter(a => a.jogo_id === gameId).length;
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
                <span className="font-medium">
                  {room.tipo === 'geral' ? 'Apostas grátis' : `${room.valor_aposta} créditos por aposta extra`}
                </span>
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
              {games.map((game) => {
                const apostasCount = getApostasCount(game.id);
                const isGameStarted = new Date(game.data_jogo) <= new Date();
                
                return (
                  <Card key={game.id} className={isGameStarted ? 'opacity-60' : ''}>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">
                          {game.time1} vs {game.time2}
                        </CardTitle>
                        <div className="flex items-center space-x-4">
                          {apostasCount > 0 && (
                            <Badge variant="secondary">
                              {apostasCount} aposta{apostasCount > 1 ? 's' : ''}
                            </Badge>
                          )}
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(game.data_jogo)}</span>
                          </div>
                        </div>
                      </div>
                      {isGameStarted && (
                        <CardDescription className="text-red-600 font-medium">
                          Jogo já iniciado - Apostas bloqueadas
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      {!isGameStarted ? (
                        <BetForm
                          gameId={game.id}
                          valorAposta={room.valor_aposta}
                          apostasExistentes={apostasCount}
                          onBet={handleBet}
                        />
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          Apostas encerradas para este jogo
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
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
