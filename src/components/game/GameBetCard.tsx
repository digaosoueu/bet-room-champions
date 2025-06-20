import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coins, Clock, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import LoginPrompt from '@/components/auth/LoginPrompt';

interface Game {
  id: number;
  time1: string;
  time2: string;
  data_jogo: string;
  placar_oficial1?: number;
  placar_oficial2?: number;
}

interface GameBetCardProps {
  game: Game;
  configuracoes: Record<string, string>;
  getUserApostasCount: (gameId: number) => number;
  getTotalApostasExtrasRodada: (gameId: number) => number;
  onBet: (gameId: number, placar1: number, placar2: number, creditos: number) => Promise<void>;
  user: any; // Adicionar prop user
}

const GameBetCard = ({ game, configuracoes, getUserApostasCount, getTotalApostasExtrasRodada, onBet, user }: GameBetCardProps) => {
  const [placar1, setPlacar1] = useState<number>(0);
  const [placar2, setPlacar2] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const { toast } = useToast();

  const apostasExistentes = getUserApostasCount(game.id);
  const apostasExtrasRodada = getTotalApostasExtrasRodada(game.id);
  const dataJogo = new Date(game.data_jogo);
  const agora = new Date();
  const jogoJaAconteceu = agora.getTime() > dataJogo.getTime() - 5 * 60 * 1000;
  const tempoParaJogo = dataJogo.getTime() - agora.getTime();
  const horasParaJogo = Math.floor(tempoParaJogo / (1000 * 60 * 60));

  const getCustoAposta = () => {
    if (apostasExistentes === 0) return 0; // 1ª aposta gratuita
    if (apostasExistentes === 1) return 100; // 2ª aposta - 100 créditos
    if (apostasExistentes === 2) return 150; // 3ª aposta - 150 créditos
    return 0;
  };

  const canMakeMoreBets = () => {
    // Máximo 3 apostas por jogo
    if (apostasExistentes >= 3) return false;
    
    // Não pode apostar se jogo já aconteceu
    if (jogoJaAconteceu) return false;
    
    // Para apostas extras (2ª e 3ª), verificar limite da rodada
    if (apostasExistentes > 0) {
      const limiteExtrasRodada = 10; // Máximo 10 apostas extras por rodada
      if (apostasExtrasRodada >= limiteExtrasRodada) return false;
    }
    
    return true;
  };

  const getMotivoBloqueio = () => {
    if (jogoJaAconteceu) return "Jogo já aconteceu";
    if (apostasExistentes >= 3) return "Limite de 3 apostas por jogo atingido";
    if (apostasExistentes > 0 && apostasExtrasRodada >= 10) return "Limite de 10 apostas extras por rodada atingido";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verificar se usuário está logado
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    
    if (!canMakeMoreBets()) {
      toast({
        title: "Não é possível apostar",
        description: getMotivoBloqueio(),
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const creditos = getCustoAposta();
      await onBet(game.id, placar1, placar2, creditos);
      
      const tipoAposta = creditos === 0 ? "gratuita" : `custou ${creditos} créditos`;
      toast({
        title: "Aposta realizada!",
        description: `Você apostou no placar ${placar1}x${placar2} (${tipoAposta})`,
      });
      
      // Reset form
      setPlacar1(0);
      setPlacar2(0);
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
    <>
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
            {!jogoJaAconteceu && canMakeMoreBets() && (
              <div className="flex items-center space-x-2">
                <Coins className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-medium">
                  {getCustoAposta() === 0 ? 'Grátis' : `${getCustoAposta()} créditos`}
                </span>
              </div>
            )}
          </div>

          {/* Informação sobre apostas extras na rodada */}
          {apostasExistentes > 0 && (
            <div className="mb-4 p-2 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-700">
                Apostas extras na rodada: {apostasExtrasRodada}/10
              </p>
            </div>
          )}

          {!canMakeMoreBets() ? (
            <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg">
              <Lock className="h-6 w-6 mx-auto mb-2" />
              <p className="font-medium">Apostas bloqueadas</p>
              <p className="text-sm">{getMotivoBloqueio()}</p>
            </div>
          ) : (
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
                    required
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
                    required
                  />
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                disabled={loading}
              >
                <Coins className="h-4 w-4 mr-2" />
                {loading ? 'Apostando...' : 
                  getCustoAposta() === 0 ? 'Apostar (Grátis)' : 
                  `Apostar (${getCustoAposta()} créditos)`
                }
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Modal de Login */}
      {showLoginPrompt && (
        <LoginPrompt onClose={() => setShowLoginPrompt(false)} />
      )}
    </>
  );
};

export default GameBetCard;
