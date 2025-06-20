
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Coins, Calendar, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Game {
  id: number;
  time1: string;
  time2: string;
  data_jogo: string;
  placar_oficial1?: number;
  placar_oficial2?: number;
}

interface GameCardProps {
  game: Game;
  valorAposta: number;
  onBet: (gameId: number, placar1: number, placar2: number, creditos: number) => void;
}

const GameCard = ({ game, valorAposta, onBet }: GameCardProps) => {
  const [placar1, setPlacar1] = useState<number>(0);
  const [placar2, setPlacar2] = useState<number>(0);
  const [creditosApostados, setCreditosApostados] = useState<number>(valorAposta);
  const [showBetForm, setShowBetForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onBet(game.id, placar1, placar2, creditosApostados);
    setShowBetForm(false);
    setPlacar1(0);
    setPlacar2(0);
    setCreditosApostados(valorAposta);
  };

  const gameDate = new Date(game.data_jogo);
  const isGameStarted = gameDate < new Date();
  const isGameFinished = game.placar_oficial1 !== undefined && game.placar_oficial2 !== undefined;

  return (
    <Card className="w-full max-w-md mx-auto hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>{gameDate.toLocaleDateString('pt-BR')}</span>
            <Clock className="h-4 w-4" />
            <span>{gameDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          {isGameFinished && (
            <Badge variant="secondary">Finalizado</Badge>
          )}
          {isGameStarted && !isGameFinished && (
            <Badge variant="destructive">Em andamento</Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-center flex-1">
            <p className="font-semibold text-lg">{game.time1}</p>
            {isGameFinished && (
              <p className="text-2xl font-bold text-emerald-600">{game.placar_oficial1}</p>
            )}
          </div>
          
          <div className="px-4">
            <span className="text-2xl font-bold text-gray-400">×</span>
          </div>
          
          <div className="text-center flex-1">
            <p className="font-semibold text-lg">{game.time2}</p>
            {isGameFinished && (
              <p className="text-2xl font-bold text-emerald-600">{game.placar_oficial2}</p>
            )}
          </div>
        </div>

        {!isGameStarted && !showBetForm && (
          <Button 
            onClick={() => setShowBetForm(true)}
            className="w-full bg-emerald-600 hover:bg-emerald-700"
          >
            <Coins className="h-4 w-4 mr-2" />
            Apostar
          </Button>
        )}

        {showBetForm && !isGameStarted && (
          <form onSubmit={handleSubmit} className="space-y-4 border-t pt-4">
            <div className="grid grid-cols-3 gap-4 items-end">
              <div className="space-y-2">
                <Label htmlFor={`placar1-${game.id}`}>Placar {game.time1}</Label>
                <Input
                  id={`placar1-${game.id}`}
                  type="number"
                  min="0"
                  max="20"
                  value={placar1}
                  onChange={(e) => setPlacar1(Number(e.target.value))}
                  className="text-center text-lg font-bold"
                />
              </div>
              
              <div className="text-center">
                <span className="text-xl font-bold text-gray-400">×</span>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`placar2-${game.id}`}>Placar {game.time2}</Label>
                <Input
                  id={`placar2-${game.id}`}
                  type="number"
                  min="0"
                  max="20"
                  value={placar2}
                  onChange={(e) => setPlacar2(Number(e.target.value))}
                  className="text-center text-lg font-bold"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`creditos-${game.id}`}>Créditos a Apostar</Label>
              <div className="relative">
                <Coins className="absolute left-3 top-3 h-4 w-4 text-emerald-600" />
                <Input
                  id={`creditos-${game.id}`}
                  type="number"
                  min={valorAposta}
                  step={valorAposta}
                  value={creditosApostados}
                  onChange={(e) => setCreditosApostados(Number(e.target.value))}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowBetForm(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              >
                Confirmar Aposta
              </Button>
            </div>
          </form>
        )}

        {isGameStarted && (
          <p className="text-center text-sm text-gray-500">
            {isGameFinished ? 'Jogo finalizado' : 'Apostas encerradas'}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default GameCard;
