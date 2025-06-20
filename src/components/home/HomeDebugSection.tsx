
import React from 'react';
import DebugInfo from './DebugInfo';

interface HomeDebugSectionProps {
  rodadas: any[];
  currentRoundIndex: number;
  salaGeral: number | null;
  brasileiraoId?: number;
  apostasCount: number;
}

const HomeDebugSection = ({
  rodadas,
  currentRoundIndex,
  salaGeral,
  brasileiraoId,
  apostasCount
}: HomeDebugSectionProps) => {
  const totalJogos = rodadas.reduce((total, rodada) => total + (rodada.jogos?.length || 0), 0);

  return (
    <DebugInfo
      rodadasCount={rodadas.length}
      currentRoundIndex={currentRoundIndex}
      totalJogos={totalJogos}
      salaGeralId={salaGeral?.toString() || ''}
      campeonatoId={brasileiraoId?.toString() || ''}
    />
  );
};

export default HomeDebugSection;
