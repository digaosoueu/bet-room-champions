
import React from 'react';

interface HomeLoadingStatesProps {
  campeonatosLoading: boolean;
  rodadasLoading: boolean;
  salaLoading: boolean;
}

const HomeLoadingStates = ({ 
  campeonatosLoading, 
  rodadasLoading, 
  salaLoading 
}: HomeLoadingStatesProps) => {
  if (campeonatosLoading) {
    return (
      <div className="text-center py-8">
        <div className="text-xl font-bold text-emerald-600 mb-2">Carregando campeonatos...</div>
        <div className="text-gray-600">Buscando dados do Brasileirão 2025</div>
      </div>
    );
  }

  if (rodadasLoading) {
    return (
      <div className="text-center py-8">
        <div className="text-xl font-bold text-emerald-600 mb-2">Carregando rodadas...</div>
        <div className="text-gray-600">Buscando jogos do campeonato</div>
      </div>
    );
  }

  if (salaLoading) {
    return (
      <div className="text-center py-8">
        <div className="text-xl font-bold text-emerald-600 mb-2">Preparando sala geral...</div>
        <div className="text-gray-600">Configurando sua participação na sala geral</div>
      </div>
    );
  }

  return null;
};

export default HomeLoadingStates;
