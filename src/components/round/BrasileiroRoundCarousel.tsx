
import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import GameBetCard from '@/components/game/GameBetCard';

interface Game {
  id: string;
  time1: string;
  time2: string;
  data_jogo: string;
  placar_oficial1?: number;
  placar_oficial2?: number;
}

interface Rodada {
  id: string;
  numero: number;
  data_inicio: string;
  data_fim: string;
  jogos: Game[];
}

interface BrasileiroRoundCarouselProps {
  rodadas: Rodada[];
  configuracoes: Record<string, string>;
  getUserApostasCount: (gameId: string) => number;
  onBet: (gameId: string, placar1: number, placar2: number, creditos: number) => Promise<void>;
}

const BrasileiroRoundCarousel = ({ 
  rodadas, 
  configuracoes, 
  getUserApostasCount, 
  onBet 
}: BrasileiroRoundCarouselProps) => {
  if (!rodadas || rodadas.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nenhuma rodada disponível no momento.</p>
      </div>
    );
  }

  return (
    <Carousel className="w-full">
      <CarouselContent>
        {rodadas.map((rodada) => (
          <CarouselItem key={rodada.id}>
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-emerald-600">
                  {rodada.numero}ª Rodada
                </CardTitle>
                <p className="text-sm text-gray-600">
                  {new Date(rodada.data_inicio).toLocaleDateString('pt-BR')} - {new Date(rodada.data_fim).toLocaleDateString('pt-BR')}
                </p>
              </CardHeader>
              
              <CardContent>
                {rodada.jogos && rodada.jogos.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rodada.jogos.map((game) => (
                      <GameBetCard
                        key={game.id}
                        game={game}
                        apostasExistentes={getUserApostasCount(game.id)}
                        configuracoes={configuracoes}
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

export default BrasileiroRoundCarousel;
