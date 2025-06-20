
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import GameBetCard from '@/components/game/GameBetCard';

interface Game {
  id: number;
  time1: string;
  time2: string;
  data_jogo: string;
  placar_oficial1?: number;
  placar_oficial2?: number;
}

interface Rodada {
  id: number;
  numero: number;
  data_inicio: string;
  data_fim: string;
  jogos: Game[];
}

interface BrasileiroRoundCarouselProps {
  rodadas: Rodada[];
  configuracoes: Record<string, string>;
  getUserApostasCount: (gameId: number) => number;
  getTotalApostasExtrasRodada: (gameId: number) => number;
  onBet: (gameId: number, placar1: number, placar2: number, creditos: number) => Promise<void>;
  initialRoundIndex?: number;
}

const BrasileiroRoundCarousel = ({ 
  rodadas, 
  configuracoes, 
  getUserApostasCount, 
  getTotalApostasExtrasRodada,
  onBet, 
  initialRoundIndex = 0 
}: BrasileiroRoundCarouselProps) => {
  const [currentRoundIndex, setCurrentRoundIndex] = useState(initialRoundIndex);

  useEffect(() => {
    console.log('Definindo carrossel para rodada:', rodadas[initialRoundIndex]?.numero || 'indefinida');
    setCurrentRoundIndex(initialRoundIndex);
  }, [initialRoundIndex]);

  if (!rodadas || rodadas.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-gray-500">Nenhuma rodada encontrada</p>
        </CardContent>
      </Card>
    );
  }

  const currentRound = rodadas[currentRoundIndex];

  const goToPrevious = () => {
    setCurrentRoundIndex(prev => prev > 0 ? prev - 1 : rodadas.length - 1);
  };

  const goToNext = () => {
    setCurrentRoundIndex(prev => prev < rodadas.length - 1 ? prev + 1 : 0);
  };

  return (
    <div className="space-y-6">
      {/* Header da rodada */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="icon"
              onClick={goToPrevious}
              className="h-10 w-10"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="text-center">
              <CardTitle className="text-xl font-bold">
                Rodada {currentRound.numero}
              </CardTitle>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 mt-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(currentRound.data_inicio).toLocaleDateString('pt-BR')} - {new Date(currentRound.data_fim).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
            
            <Button
              variant="outline"
              size="icon"
              onClick={goToNext}
              className="h-10 w-10"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Jogos da rodada */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentRound.jogos.map((game) => (
          <GameBetCard
            key={game.id}
            game={game}
            configuracoes={configuracoes}
            getUserApostasCount={getUserApostasCount}
            getTotalApostasExtrasRodada={getTotalApostasExtrasRodada}
            onBet={onBet}
          />
        ))}
      </div>
    </div>
  );
};

export default BrasileiroRoundCarousel;
