
import React, { useEffect } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselApi,
} from '@/components/ui/carousel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import GameBetCard from '@/components/game/GameBetCard';

interface Game {
  id: number;
  time1: string;
  time2: string;
  data_jogo: string;
  placar_oficial1?: number;
  placar_oficial2?: number;
}

interface Round {
  id: number;
  numero: number;
  data_inicio: string;
  data_fim: string;
  jogos: Game[];
}

interface BrasileiroRoundCarouselProps {
  rodadas: Round[];
  configuracoes: any;
  getUserApostasCount: (gameId: number) => number;
  onBet: (gameId: number, placar1: number, placar2: number, creditos: number) => Promise<void>;
  initialRoundIndex?: number;
}

const BrasileiroRoundCarousel = ({ 
  rodadas, 
  configuracoes, 
  getUserApostasCount, 
  onBet,
  initialRoundIndex = 0
}: BrasileiroRoundCarouselProps) => {
  const [api, setApi] = React.useState<CarouselApi>();

  // Scroll to the initial round when component mounts or initialRoundIndex changes
  useEffect(() => {
    if (api && initialRoundIndex >= 0 && initialRoundIndex < rodadas.length) {
      console.log('Definindo carrossel para rodada:', initialRoundIndex + 1);
      // Use setTimeout to ensure the carousel is fully initialized
      setTimeout(() => {
        api.scrollTo(initialRoundIndex);
      }, 100);
    }
  }, [api, initialRoundIndex, rodadas.length]);

  if (!rodadas || rodadas.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nenhuma rodada disponível no momento.</p>
      </div>
    );
  }

  return (
    <Carousel 
      className="w-full"
      setApi={setApi}
    >
      <CarouselContent>
        {rodadas.map((round) => (
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
                      <GameBetCard
                        key={game.id}
                        game={game}
                        configuracoes={configuracoes}
                        getUserApostasCount={getUserApostasCount}
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
