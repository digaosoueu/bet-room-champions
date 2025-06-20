
import React, { useEffect } from 'react';
import { Calendar } from 'lucide-react';
import BrasileiroRoundCarousel from '@/components/round/BrasileiroRoundCarousel';
import HomeHeader from '@/components/home/HomeHeader';
import ChampionshipInfo from '@/components/home/ChampionshipInfo';
import QuickStats from '@/components/home/QuickStats';
import DebugInfo from '@/components/home/DebugInfo';
import { useRodadas } from '@/hooks/useRodadas';
import { useConfiguracoes } from '@/hooks/useConfiguracoes';
import { useCampeonatos } from '@/hooks/useCampeonatos';
import { useApostas } from '@/hooks/useApostas';
import { useGeneralRoom } from '@/hooks/useGeneralRoom';
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
  
  const { rodadas, loading: rodadasLoading, currentRoundIndex } = useRodadas(brasileirao?.id);
  const { configuracoes, loading: configLoading } = useConfiguracoes();
  const { salaGeral, loading: salaLoading } = useGeneralRoom(brasileirao?.id);
  const { apostas, createAposta, refetch: refetchApostas } = useApostas(salaGeral);

  const getUserApostasCount = (gameId: string) => {
    return apostas.filter(aposta => aposta.jogo_id === gameId).length;
  };

  const handleBet = async (gameId: string, placar1: number, placar2: number, creditos: number) => {
    if (!salaGeral) {
      toast({
        title: "Erro",
        description: "Sala geral não encontrada. Aguarde o carregamento.",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('Iniciando aposta:', { gameId, placar1, placar2, creditos, salaGeral });

      // Verificar se usuário tem créditos suficientes
      if (creditos > 0 && user.creditos < creditos) {
        toast({
          title: "Créditos insuficientes",
          description: `Você precisa de ${creditos} créditos para fazer esta aposta`,
          variant: "destructive"
        });
        return;
      }

      // Verificar limite de apostas na rodada se necessário
      const rodadaAtual = rodadas.find(r => r.jogos.some(j => j.id === gameId));
      if (rodadaAtual) {
        const apostasNaRodada = apostas.filter(a => 
          rodadaAtual.jogos.some(j => j.id === a.jogo_id)
        ).length;
        
        const limiteExtras = parseInt(configuracoes.limite_apostas_extras_por_rodada || '10');
        if (apostasNaRodada >= limiteExtras) {
          toast({
            title: "Limite atingido",
            description: `Limite de ${limiteExtras} apostas por rodada atingido`,
            variant: "destructive"
          });
          return;
        }
      }

      // Criar a aposta
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

      toast({
        title: "Aposta realizada!",
        description: `Aposta de ${placar1} x ${placar2} registrada com sucesso`,
      });

    } catch (error: any) {
      console.error('Erro ao fazer aposta:', error);
      toast({
        title: "Erro ao apostar",
        description: error.message || "Tente novamente",
        variant: "destructive"
      });
    }
  };

  const loading = campeonatosLoading || rodadasLoading || configLoading || salaLoading;

  // Logs para debugging
  useEffect(() => {
    console.log('Estado atual:');
    console.log('- Campeonatos encontrados:', campeonatos.length);
    console.log('- Brasileirão encontrado:', brasileirao);
    console.log('- Rodadas carregadas:', rodadas.length);
    console.log('- Rodada atual (index):', currentRoundIndex);
    console.log('- Configurações:', configuracoes);
    console.log('- Sala geral ID:', salaGeral);
    console.log('- Apostas carregadas:', apostas.length);
    console.log('- Loading states:', { campeonatosLoading, rodadasLoading, configLoading, salaLoading });
  }, [campeonatos, brasileirao, rodadas, currentRoundIndex, configuracoes, salaGeral, apostas, campeonatosLoading, rodadasLoading, configLoading, salaLoading]);

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

  if (rodadas.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600 mb-2">Nenhuma rodada encontrada</div>
          <div className="text-gray-600">As rodadas do Brasileirão 2025 ainda não foram cadastradas</div>
        </div>
      </div>
    );
  }

  // Se chegou até aqui, tem campeonato e rodadas, mas sem sala geral ainda
  if (!salaGeral) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600 mb-2">Preparando sala geral...</div>
          <div className="text-gray-600">A sala geral do campeonato está sendo configurada</div>
        </div>
      </div>
    );
  }

  const totalJogos = rodadas.reduce((acc, r) => acc + (r.jogos?.length || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <HomeHeader user={user} />
        
        <ChampionshipInfo 
          rodadasCount={rodadas.length} 
          configuracoes={configuracoes} 
        />

        <DebugInfo
          rodadasCount={rodadas.length}
          currentRoundIndex={currentRoundIndex}
          totalJogos={totalJogos}
          salaGeralId={salaGeral}
          campeonatoId={brasileirao?.id || ''}
        />

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
            initialRoundIndex={currentRoundIndex}
          />
        </div>

        <QuickStats apostasCount={apostas.length} />
      </div>
    </div>
  );
};

export default Home;
