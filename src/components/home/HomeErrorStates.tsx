
import React from 'react';

interface Campeonato {
  id: number;
  nome: string;
  temporada: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

interface HomeErrorStatesProps {
  campeonatosLoading: boolean;
  brasileirao: Campeonato | undefined;
  rodadasLoading: boolean;
  rodadas: any[];
  salaLoading: boolean;
  salaGeral: number | null;
}

const HomeErrorStates = ({
  campeonatosLoading,
  brasileirao,
  rodadasLoading,
  rodadas,
  salaLoading,
  salaGeral
}: HomeErrorStatesProps) => {
  // Verificar se o campeonato foi encontrado
  if (!campeonatosLoading && !brasileirao) {
    return (
      <div className="text-center py-8">
        <div className="text-xl font-bold text-yellow-600 mb-2">Campeonato não encontrado</div>
        <div className="text-gray-600">O Campeonato Brasileiro 2025 ainda não foi configurado</div>
      </div>
    );
  }

  // Verificar se existem rodadas
  if (!rodadasLoading && rodadas.length === 0 && brasileirao) {
    return (
      <div className="text-center py-8">
        <div className="text-xl font-bold text-yellow-600 mb-2">Nenhuma rodada encontrada</div>
        <div className="text-gray-600">As rodadas do Brasileirão 2025 ainda não foram cadastradas</div>
      </div>
    );
  }

  // Se não conseguiu criar/encontrar a sala geral
  if (!salaLoading && !salaGeral && rodadas.length > 0) {
    return (
      <div className="text-center py-8">
        <div className="text-xl font-bold text-red-600 mb-2">Erro na sala geral</div>
        <div className="text-gray-600">Não foi possível configurar a sala geral. Tente recarregar a página.</div>
      </div>
    );
  }

  return null;
};

export default HomeErrorStates;
