
import React, { useEffect } from 'react';
import { Calendar } from 'lucide-react';
import BrasileiroRoundCarousel from '@/components/round/BrasileiroRoundCarousel';
import HomeHeader from '@/components/home/HomeHeader';
import ChampionshipInfo from '@/components/home/ChampionshipInfo';
import HomeLoadingStates from '@/components/home/HomeLoadingStates';
import HomeErrorStates from '@/components/home/HomeErrorStates';
import HomeBettingLogic from '@/components/home/HomeBettingLogic';
import HomeDebugSection from '@/components/home/HomeDebugSection';
import { useRodadas } from '@/hooks/useRodadas';
import { useConfiguracoes } from '@/hooks/useConfiguracoes';
import { useCampeonatos } from '@/hooks/useCampeonatos';
import { useApostas } from '@/hooks/useApostas';
import { useGeneralRoom } from '@/hooks/useGeneralRoom';

interface User {
  id: number;
  nome: string;
  email: string;
  creditos: number;
}

interface HomeProps {
  user: User | null;
  onLogout: () => void;
}

const Home = ({ user, onLogout }: HomeProps) => {
  const { campeonatos, loading: campeonatosLoading } = useCampeonatos();
  
  // Buscar o Campeonato Brasileiro 2025
  const brasileirao = campeonatos.find(c => c.nome === 'Campeonato Brasileiro 2025');
  
  const { rodadas, loading: rodadasLoading, currentRoundIndex } = useRodadas(brasileirao?.id);
  const { configuracoes, loading: configLoading } = useConfiguracoes();
  const { salaGeral, loading: salaLoading } = useGeneralRoom(brasileirao?.id);
  const { apostas, createAposta, refetch: refetchApostas } = useApostas(salaGeral || undefined);

  const { handleBet, getUserApostasCount, getTotalApostasExtrasRodada } = HomeBettingLogic({
    user,
    salaGeral,
    rodadas,
    configuracoes,
    apostas,
    createAposta,
    refetchApostas
  });

  // Logs para debugging
  useEffect(() => {
    console.log('Estado atual da Home:');
    console.log('- Usuário logado:', user ? user.nome : 'Não logado');
    console.log('- Campeonatos encontrados:', campeonatos.length);
    console.log('- Brasileirão encontrado:', brasileirao);
    console.log('- Rodadas carregadas:', rodadas.length);
    console.log('- Rodada atual (index):', currentRoundIndex);
    console.log('- Configurações:', configuracoes);
    console.log('- Sala geral ID:', salaGeral);
    console.log('- Apostas carregadas:', apostas.length);
    console.log('- Loading states:', { campeonatosLoading, rodadasLoading, configLoading, salaLoading });
  }, [user, campeonatos, brasileirao, rodadas, currentRoundIndex, configuracoes, salaGeral, apostas, campeonatosLoading, rodadasLoading, configLoading, salaLoading]);

  return (
    <div className="min-h-screen bg-gray-50">
      <HomeHeader 
        user={user} 
        brasileiraoId={brasileirao?.id}
        onLogout={onLogout}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading States */}
        <HomeLoadingStates 
          campeonatosLoading={campeonatosLoading}
          rodadasLoading={rodadasLoading && brasileirao !== undefined}
          salaLoading={salaLoading && rodadas.length > 0}
        />

        {/* Error States */}
        <HomeErrorStates 
          campeonatosLoading={campeonatosLoading}
          brasileirao={brasileirao}
          rodadasLoading={rodadasLoading}
          rodadas={rodadas}
          salaLoading={salaLoading}
          salaGeral={salaGeral}
        />

        {/* Mostrar informações do campeonato se encontrado */}
        {brasileirao && (
          <>
            <ChampionshipInfo 
              rodadasCount={rodadas.length} 
              configuracoes={configuracoes} 
            />

            <HomeDebugSection
              rodadas={rodadas}
              currentRoundIndex={currentRoundIndex}
              salaGeral={salaGeral}
              brasileiraoId={brasileirao?.id}
              apostasCount={apostas.length}
            />

            {/* Rodadas do campeonato */}
            {rodadas.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center space-x-2 mb-6">
                  <Calendar className="h-6 w-6 text-emerald-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Rodadas do Brasileirão 2025</h2>
                </div>
                
                <BrasileiroRoundCarousel
                  rodadas={rodadas}
                  configuracoes={configuracoes}
                  getUserApostasCount={getUserApostasCount}
                  getTotalApostasExtrasRodada={getTotalApostasExtrasRodada}
                  onBet={handleBet}
                  initialRoundIndex={currentRoundIndex}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
