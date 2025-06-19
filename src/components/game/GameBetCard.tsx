
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coins, Clock, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Game {
  id: string;
  time1: string;
  time2: string;
  data_jogo: string;
  placar_oficial1?: number;
  placar_oficial2?: number;
}

interface GameBetCardProps {
  game: Game;
  configuracoes: Record<string, string>;
  getUserApostasCount: (gameId: string) => number;
  onBet: (gameId: string, placar1: number, placar2: number, creditos: number) => Promise<void>;
}

const GameBetCard = ({ game, configuracoes, getUserApostasCount, onBet }: GameBetCardProps) => {
  const [placar1, setPlacar1] = useState<number>(0);
  const [placar2, setPlacar2] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const apostasExistentes = getUserApostasCount(game.id);
  const dataJogo = new Date(game.data_jogo);
  const agora = new Date();
  const jogoJaAconteceu = dataJogo < agora;
  const tempoParaJogo = dataJogo.getTime() - agora.getTime();
  const horasParaJogo = Math.floor(tempoParaJogo / (1000 * 60 * 60));

  const getCustoAposta = () => {
    if (apostasExistentes === 0) return 0;
    if (apostasExistentes === 1) return parseInt(configuracoes.valor_segunda_aposta || '50');
    if (apostasExistentes >= 2) return parseInt(configuracoes.valor_terceira_aposta || '100');
    return 0;
  };

  const canMakeMoreBets = apostasExistentes < 3 && !jogoJaAconteceu;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (jogoJaAconteceu) {
      toast({
        title: "Apostas encerradas",
        description: "Não é possível apostar em jogos que já aconteceram",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const creditos = getCustoAposta();
      await onBet(game.id, placar1, placar2, creditos);
      
      toast({
        title: "Aposta realizada!",
        description: `Você apostou no placar ${placar1}x${placar2}${creditos > 0 ? ` por ${creditos} créditos` : ' (grátis)'}`,
      });
    } catch (error: any) {
      toast({
        title: "Erro ao apostar",
        description: error.message || "Tente novamente",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold text-center">
          {game.time1} vs {game.time2}
        </CardTitle>
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
          <Clock className="h-4 w-4" />
          <span>{dataJogo.toLocaleDateString('pt-BR')} às {dataJogo.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        {horasParaJogo > 0 && horasParaJogo < 24 && (
          <Badge variant="secondary" className="mx-auto">
            {horasParaJogo}h restantes
          </Badge>
        )}
      </CardHeader>
      
      <CardContent>
        {/* Status das apostas */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Apostas:</span>
            <Badge variant="secondary">{apostasExistentes}/3</Badge>
          </div>
          {!jogoJaAconteceu && (
            <div className="flex items-center space-x-2">
              <Coins className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-medium">
                {getCustoAposta() === 0 ? 'Grátis' : `${getCustoAposta()} créditos`}
              </span>
            </div>
          )}
        </div>

        {jogoJaAconteceu ? (
          <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg">
            <Lock className="h-6 w-6 mx-auto mb-2" />
            <p className="font-medium">Apostas encerradas</p>
            <p className="text-sm">O jogo já aconteceu</p>
          </div>
        ) : canMakeMoreBets ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-3 gap-4 items-end">
              <div className="space-y-2">
                <Label htmlFor={`placar1-${game.id}`}>{game.time1}</Label>
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
                <span className="text-2xl font-bold text-gray-400">×</span>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`placar2-${game.id}`}>{game.time2}</Label>
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
            
            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              disabled={loading}
            >
              <Coins className="h-4 w-4 mr-2" />
              {loading ? 'Apostando...' : `Apostar ${getCustoAposta() === 0 ? '(Grátis)' : `(${getCustoAposta()} créditos)`}`}
            </Button>
          </form>
        ) : (
          <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg">
            <p className="font-medium">Limite de apostas atingido</p>
            <p className="text-sm">Você já fez 3 apostas neste jogo</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GameBetCard;
