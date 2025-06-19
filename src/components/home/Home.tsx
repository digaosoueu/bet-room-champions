
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Coins, Calendar, Trophy } from 'lucide-react';
import BrasileiroRoundCarousel from '@/components/round/BrasileiroRoundCarousel';
import { useRodadas } from '@/hooks/useRodadas';
import { useConfiguracoes } from '@/hooks/useConfiguracoes';
import { useCampeonatos } from '@/hooks/useCampeonatos';
import { useApostas } from '@/hooks/useApostas';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
  const { campeonatos, loading: campeonatosLoading } = useCampeonatos();
  
  // Buscar o Campeonato Brasileiro 2025
  const brasileirao = campeonatos.find(c => c.nome === 'Campeonato Brasileiro 2025');
  
  const { rodadas, loading: rodadasLoading } = useRodadas(brasileirao?.id);
  const { configuracoes, loading: configLoading } = useConfiguracoes();
  const { apostas, createAposta, refetch: refetchApostas } = useApostas();
  
  const [salaGeral, setSalaGeral] = useState<string>('');

  // Buscar sala geral do brasileirão
  useEffect(() => {
    if (brasileirao?.id) {
      fetchSalaGeral();
    }
  }, [brasileirao?.id]);

  const fetchSalaGeral = async () => {
    if (!brasileirao?.id) return;

    try {
      const { data, error } = await supabase
        .from('salas')
        .select('id')
        .eq('campeonato_id', brasileirao.id)
        .eq('tipo', 'geral')
        .single();

      if (error) {
        console.error('Erro ao buscar sala geral:', error);
        return;
      }

      setSalaGeral(data.id);
    } catch (error) {
      console.error('Erro ao buscar sala geral:', error);
    }
  };

  const getUserApostasCount = (gameId: string) => {
    return apostas.filter(aposta => aposta.jogo_id === gameId).length;
  };

  const handleBet = async (gameId: string, placar1: number, placar2: number, creditos: number) => {
    if (!salaGeral) {
      throw new Error('Sala geral não encontrada');
    }

    // Verificar se usuário tem créditos suficientes
    if (creditos > 0 && user.creditos < creditos) {
      throw new Error('Créditos insuficientes');
    }

    // Verificar limite de apostas na rodada se necessário
    const rodadaAtual = rodadas.find(r => r.jogos.some(j => j.id === gameId));
    if (rodadaAtual) {
      const apostasNaRodada = apostas.filter(a => 
        rodadaAtual.jogos.some(j => j.id === a.jogo_id)
      ).length;
      
      const limiteExtras = parseInt(configuracoes.limite_apostas_extras_por_rodada || '10');
      if (apostasNaRodada >= limiteExtras) {
        throw new Error(`Limite de ${limiteExtras} apostas por rodada atingido`);
      }
    }

    try {
      await createAposta({
        jogo_id: gameId,
        sala_id: salaGeral,
        placar_time1: placar1,
        placar_time2: placar2,
        creditos_apostados: creditos
      });

      // Debitar créditos se necessário
      if (creditos > 0) {
        const { error } = await supabase
          .from('usuarios')
          .update({ creditos: user.creditos - creditos })
          .eq('id', user.id);

        if (error) {
          console.error('Erro ao debitar créditos:', error);
        }
      }

      await refetchApostas();
    } catch (error: any) {
      throw error;
    }
  };

  const loading = campeonatosLoading || rodadasLoading || configLoading;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-emerald-600 mb-2">Carregando...</div>
          <div className="text-gray-600">Buscando dados do Brasileirão 2025</div>
        </div>
      </div>
    );
  }

  if (!brasileirao) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600 mb-2">Campeonato não encontrado</div>
          <div className="text-gray-600">O Campeonato Brasileiro 2025 ainda não foi configurado</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header de boas-vindas */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bem-vindo ao BetRooms, {user.nome}! ⚽
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Faça suas apostas no Campeonato Brasileiro 2025
          </p>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 bg-emerald-50 px-4 py-2 rounded-lg">
              <Coins className="h-5 w-5 text-emerald-600" />
              <span className="font-semibold text-emerald-700">{user.creditos}</span>
              <span className="text-sm text-emerald-600">créditos</span>
            </div>
          </div>
        </div>

        {/* Informações do campeonato */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-emerald-600" />
              <span>Campeonato Brasileiro 2025</span>
            </CardTitle>
            <CardDescription>
              Aposte nos jogos das 38 rodadas do Brasileirão 2025
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium">1ª aposta:</span> Grátis
              </div>
              <div>
                <span className="font-medium">2ª aposta:</span> {configuracoes.valor_segunda_aposta || '50'} créditos
              </div>
              <div>
                <span className="font-medium">3ª aposta:</span> {configuracoes.valor_terceira_aposta || '100'} créditos
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rodadas do campeonato */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-6">
            <Calendar className="h-6 w-6 text-emerald-600" />
            <h2 className="text-2xl font-bold text-gray-900">Rodadas do Brasileirão 2025</h2>
          </div>
          
          <BrasileiroRoundCarousel
            rodadas={rodadas}
            configuracoes={configuracoes}
            getUserApostasCount={getUserApostasCount}
            onBet={handleBet}
          />
        </div>

        {/* Estatísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="flex items-center justify-center p-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600 mb-1">{apostas.length}</div>
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
