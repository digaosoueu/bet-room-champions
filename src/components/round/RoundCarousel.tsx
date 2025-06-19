
import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import GameCard from '@/components/game/GameCard';

interface Game {
  id: string;
  time1: string;
  time2: string;
  data_jogo: string;
  placar_oficial1?: number;
  placar_oficial2?: number;
}

interface Round {
  id: string;
  numero: number;
  data_inicio: string;
  data_fim: string;
  jogos: Game[];
}

interface RoundCarouselProps {
  rounds: Round[];
  valorAposta: number;
  onBet: (gameId: string, placar1: number, placar2: number, creditos: number) => void;
}

const RoundCarousel = ({ rounds, valorAposta, onBet }: RoundCarouselProps) => {
  if (!rounds || rounds.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nenhuma rodada disponível no momento.</p>
      </div>
    );
  }

  return (
    <Carousel className="w-full">
      <CarouselContent>
        {rounds.map((round) => (
          <CarouselItem key={round.id}>
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-emerald-600">
                  Rodada {round.numero}
                </CardTitle>
                <p className="text-sm text-gray-600">
                  {new Date(round.data_inicio).toLocaleDateString('pt-BR')} - {new Date(round.data_fim).toLocaleDateString('pt-BR')}
                </p>
              </CardHeader>
              
              <CardContent>
                {round.jogos && round.jogos.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {round.jogos.map((game) => (
                      <GameCard
                        key={game.id}
                        game={game}
                        valorAposta={valorAposta}
                        onBet={onBet}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Nenhum jogo disponível nesta rodada.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default RoundCarousel;
