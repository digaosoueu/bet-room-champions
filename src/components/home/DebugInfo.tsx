
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface DebugInfoProps {
  rodadasCount: number;
  currentRoundIndex: number;
  totalJogos: number;
  salaGeralId: string;
  campeonatoId: string;
}

const DebugInfo = ({ 
  rodadasCount, 
  currentRoundIndex, 
  totalJogos, 
  salaGeralId, 
  campeonatoId 
}: DebugInfoProps) => {
  return (
    <Card className="mb-8 bg-blue-50">
      <CardContent className="py-4">
        <div className="text-sm text-blue-800">
          <p><strong>Debug Info:</strong></p>
          <p>• Rodadas total: {rodadasCount}</p>
          <p>• Rodada atual: {currentRoundIndex + 1}</p>
          <p>• Total de jogos: {totalJogos}</p>
          <p>• Sala geral ID: {salaGeralId || 'Não encontrada'}</p>
          <p>• Campeonato ID: {campeonatoId || 'Não encontrado'}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DebugInfo;
