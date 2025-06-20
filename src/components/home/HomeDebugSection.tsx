
import React from 'react';
import DebugInfo from '@/components/home/DebugInfo';
import QuickStats from '@/components/home/QuickStats';

interface HomeDebugSectionProps {
  rodadas: any[];
  currentRoundIndex: number;
  salaGeral: number | null;
  brasileiraoId: number | undefined;
  apostasCount: number;
}

const HomeDebugSection = ({
  rodadas,
  currentRoundIndex,
  salaGeral,
  brasileiraoId,
  apostasCount
}: HomeDebugSectionProps) => {
  const totalJogos = rodadas.reduce((acc, r) => acc + (r.jogos?.length || 0), 0);

  return (
    <>
      <DebugInfo
        rodadasCount={rodadas.length}
        currentRoundIndex={currentRoundIndex}
        totalJogos={totalJogos}
        salaGeralId={salaGeral?.toString() || ''}
        campeonatoId={brasileiraoId?.toString() || ''}
      />
      <QuickStats apostasCount={apostasCount} />
    </>
  );
};

export default HomeDebugSection;
