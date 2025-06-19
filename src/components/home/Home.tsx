
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trophy, Coins, Calendar } from 'lucide-react';
import RoundCarousel from '@/components/round/RoundCarousel';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  nome: string;
  email: string;
  creditos: number;
}

interface HomeProps {
  user: User;
}

const Home = ({ user }: HomeProps) => {
  const [valorAposta, setValorAposta] = useState<number>(100);
  const { toast } = useToast();

  // Dados mock das rodadas - em uma aplicação real viriam do Supabase
  const rounds = [
    {
      id: '1',
      numero: 1,
      data_inicio: '2024-01-15',
      data_fim: '2024-01-21',
      jogos: [
        {
          id: '1',
          time1: 'Flamengo',
          time2: 'Vasco',
          data_jogo: '2024-01-15T16:00:00',
          placar_oficial1: undefined,
          placar_oficial2: undefined
        },
        {
          id: '2',
          time1: 'Palmeiras',
          time2: 'Corinthians',
          data_jogo: '2024-01-15T18:30:00',
          placar_oficial1: undefined,
          placar_oficial2: undefined
        },
        {
          id: '3',
          time1: 'São Paulo',
          time2: 'Santos',
          data_jogo: '2024-01-16T20:00:00',
          placar_oficial1: undefined,
          placar_oficial2: undefined
        }
      ]
    },
    {
      id: '2',
      numero: 2,
      data_inicio: '2024-01-22',
      data_fim: '2024-01-28',
      jogos: [
        {
          id: '4',
          time1: 'Botafogo',
          time2: 'Fluminense',
          data_jogo: '2024-01-22T16:00:00',
          placar_oficial1: undefined,
          placar_oficial2: undefined
        },
        {
          id: '5',
          time1: 'Atlético-MG',
          time2: 'Cruzeiro',
          data_jogo: '2024-01-22T18:30:00',
          placar_oficial1: undefined,
          placar_oficial2: undefined
        }
      ]
    }
  ];

  const handleBet = (gameId: string, placar1: number, placar2: number, creditos: number) => {
    console.log('Aposta realizada:', { gameId, placar1, placar2, creditos });
    
    toast({
      title: "Aposta realizada!",
      description: `Você apostou ${creditos} créditos no placar ${placar1}x${placar2}`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header de boas-vindas */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bem-vindo ao BetRooms, {user.nome}! ⚽
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Faça suas apostas nos jogos do campeonato
          </p>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 bg-emerald-50 px-4 py-2 rounded-lg">
              <Coins className="h-5 w-5 text-emerald-600" />
              <span className="font-semibold text-emerald-700">{user.creditos}</span>
              <span className="text-sm text-emerald-600">créditos</span>
            </div>
          </div>
        </div>

        {/* Configuração da aposta */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-emerald-600" />
              <span>Configurar Apostas</span>
            </CardTitle>
            <CardDescription>
              Defina o valor da sua aposta para os jogos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="flex-1 max-w-xs">
                <Label htmlFor="valor-aposta">Valor da Aposta (créditos)</Label>
                <Input
                  id="valor-aposta"
                  type="number"
                  min="10"
                  max={user.creditos}
                  value={valorAposta}
                  onChange={(e) => setValorAposta(Number(e.target.value))}
                  className="mt-1"
                />
              </div>
              <div className="text-sm text-gray-600">
                <div>Mínimo: 10 créditos</div>
                <div>Máximo: {user.creditos} créditos</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rodadas do campeonato */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-6">
            <Calendar className="h-6 w-6 text-emerald-600" />
            <h2 className="text-2xl font-bold text-gray-900">Rodadas do Campeonato</h2>
          </div>
          
          <RoundCarousel
            rounds={rounds}
            valorAposta={valorAposta}
            onBet={handleBet}
          />
        </div>

        {/* Estatísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="flex items-center justify-center p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600 mb-1">0</div>
                <div className="text-sm text-gray-600">Apostas Realizadas</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center justify-center p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">0</div>
                <div className="text-sm text-gray-600">Apostas Ganhas</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center justify-center p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600 mb-1">-</div>
                <div className="text-sm text-gray-600">Taxa de Acerto</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
