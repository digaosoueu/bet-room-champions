
import React, { useState } from 'react';
import RoomHeader from './RoomHeader';
import GamesList from './GamesList';
import RoomRanking from './RoomRanking';
import { useApostas } from '@/hooks/useApostas';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface RoomViewProps {
  roomId: number;
  onBack: () => void;
}

const RoomView = ({ roomId, onBack }: RoomViewProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
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
      id: 1,
      time1: 'Flamengo',
      time2: 'Palmeiras',
      data_jogo: '2024-06-22T16:00:00',
      placar_oficial1: null,
      placar_oficial2: null,
    },
    {
      id: 2,
      time1: 'São Paulo',
      time2: 'Corinthians',
      data_jogo: '2024-06-22T18:30:00',
      placar_oficial1: null,
      placar_oficial2: null,
    },
    {
      id: 3,
      time1: 'Santos',
      time2: 'Fluminense',
      data_jogo: '2024-06-23T16:00:00',
      placar_oficial1: null,
      placar_oficial2: null,
    }
  ]);

  const handleBet = async (gameId: number, placar1: number, placar2: number, creditos: number) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para apostar.",
        variant: "destructive",
      });
      return;
    }

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
        usuario_id: user.id,
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RoomHeader room={room} onBack={onBack} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <GamesList
              games={games}
              valorAposta={room.valor_aposta}
              apostas={apostas}
              onBet={handleBet}
            />
          </div>

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
