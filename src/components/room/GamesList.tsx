
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import BetForm from './BetForm';

interface Game {
  id: number;
  time1: string;
  time2: string;
  data_jogo: string;
  placar_oficial1: number | null;
  placar_oficial2: number | null;
}

interface GamesListProps {
  games: Game[];
  valorAposta: number;
  apostas: any[];
  onBet: (gameId: number, placar1: number, placar2: number, creditos: number) => void;
}

const GamesList = ({ games, valorAposta, apostas, onBet }: GamesListProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getApostasCount = (gameId: number) => {
    return apostas.filter(a => a.jogo_id === gameId).length;
  };

  return (
    <div>
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
                    valorAposta={valorAposta}
                    apostasExistentes={apostasCount}
                    onBet={onBet}
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
  );
};

export default GamesList;
