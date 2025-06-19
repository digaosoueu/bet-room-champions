
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import RoundCarousel from '@/components/round/RoundCarousel';

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
  const { toast } = useToast();

  // Mock data - em uma aplicação real, isso viria do backend
  const mockRounds = [
    {
      id: '1',
      numero: 1,
      data_inicio: '2024-01-15',
      data_fim: '2024-01-21',
      jogos: [
        {
          id: '1',
          time1: 'Flamengo',
          time2: 'Palmeiras',
          data_jogo: '2024-01-15T16:00:00',
        },
        {
          id: '2',
          time1: 'Corinthians',
          time2: 'São Paulo',
          data_jogo: '2024-01-15T18:30:00',
        },
        {
          id: '3',
          time1: 'Vasco',
          time2: 'Fluminense',
          data_jogo: '2024-01-16T16:00:00',
        },
        {
          id: '4',
          time1: 'Grêmio',
          time2: 'Internacional',
          data_jogo: '2024-01-16T18:30:00',
        },
        {
          id: '5',
          time1: 'Atlético-MG',
          time2: 'Cruzeiro',
          data_jogo: '2024-01-17T16:00:00',
        },
        {
          id: '6',
          time1: 'Santos',
          time2: 'Botafogo',
          data_jogo: '2024-01-17T18:30:00',
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
          id: '7',
          time1: 'Palmeiras',
          time2: 'Corinthians',
          data_jogo: '2024-01-22T16:00:00',
        },
        {
          id: '8',
          time1: 'Flamengo',
          time2: 'Vasco',
          data_jogo: '2024-01-22T18:30:00',
        },
        {
          id: '9',
          time1: 'São Paulo',
          time2: 'Santos',
          data_jogo: '2024-01-23T16:00:00',
        },
        {
          id: '10',
          time1: 'Fluminense',
          time2: 'Botafogo',
          data_jogo: '2024-01-23T18:30:00',
        },
        {
          id: '11',
          time1: 'Internacional',
          time2: 'Atlético-MG',
          data_jogo: '2024-01-24T16:00:00',
        },
        {
          id: '12',
          time1: 'Cruzeiro',
          time2: 'Grêmio',
          data_jogo: '2024-01-24T18:30:00',
        }
      ]
    },
    {
      id: '3',
      numero: 3,
      data_inicio: '2024-01-29',
      data_fim: '2024-02-04',
      jogos: [
        {
          id: '13',
          time1: 'Flamengo',
          time2: 'São Paulo',
          data_jogo: '2024-01-29T16:00:00',
          placar_oficial1: 2,
          placar_oficial2: 1,
        },
        {
          id: '14',
          time1: 'Palmeiras',
          time2: 'Vasco',
          data_jogo: '2024-01-29T18:30:00',
          placar_oficial1: 3,
          placar_oficial2: 0,
        },
        {
          id: '15',
          time1: 'Corinthians',
          time2: 'Fluminense',
          data_jogo: '2024-01-30T16:00:00',
          placar_oficial1: 1,
          placar_oficial2: 1,
        },
        {
          id: '16',
          time1: 'Grêmio',
          time2: 'Santos',
          data_jogo: '2024-01-30T18:30:00',
          placar_oficial1: 0,
          placar_oficial2: 2,
        }
      ]
    }
  ];

  const handleBet = (gameId: string, placar1: number, placar2: number, creditos: number) => {
    console.log('Aposta realizada:', { gameId, placar1, placar2, creditos, userId: user.id });
    
    // Verificar se o usuário tem créditos suficientes
    if (user.creditos < creditos) {
      toast({
        title: "Créditos insuficientes",
        description: "Você não tem créditos suficientes para esta aposta.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Aposta realizada com sucesso!",
      description: `Você apostou ${creditos} créditos no placar ${placar1} x ${placar2}`,
    });

    // Em uma aplicação real, aqui seria feita a chamada para o backend
    // para registrar a aposta e atualizar os créditos do usuário
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-2">
          Campeonato Brasileiro - Série A
        </h1>
        <p className="text-center text-gray-600">
          Faça suas apostas nos jogos das rodadas do campeonato
        </p>
      </div>

      <RoundCarousel
        rounds={mockRounds}
        valorAposta={100} // Valor mínimo de aposta
        onBet={handleBet}
      />
    </div>
  );
};

export default Home;
