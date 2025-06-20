
import { useCallback } from 'react';

interface User {
  id: number;
  nome: string;
  email: string;
  creditos: number;
}

interface HomeBettingLogicProps {
  user: User | null;
  salaGeral: number | null;
  rodadas: any[];
  configuracoes: Record<string, string>;
  apostas: any[];
  createAposta: (aposta: any) => Promise<any>;
  refetchApostas: () => void;
}

const HomeBettingLogic = ({
  user,
  salaGeral,
  rodadas,
  configuracoes,
  apostas,
  createAposta,
  refetchApostas
}: HomeBettingLogicProps) => {
  
  const handleBet = useCallback(async (gameId: number, placar1: number, placar2: number, creditos: number) => {
    if (!user || !salaGeral) {
      console.error('HomeBettingLogic: Usuário ou sala não encontrados');
      return;
    }

    try {
      console.log('HomeBettingLogic: Criando aposta:', { gameId, placar1, placar2, creditos });
      
      await createAposta({
        usuario_id: user.id,
        sala_id: salaGeral,
        jogo_id: gameId,
        placar_time1: placar1,
        placar_time2: placar2,
        creditos_apostados: creditos
      });

      console.log('HomeBettingLogic: Aposta criada com sucesso');
    } catch (error) {
      console.error('HomeBettingLogic: Erro ao criar aposta:', error);
      throw error;
    }
  }, [user, salaGeral, createAposta]);

  const getUserApostasCount = useCallback((gameId: number) => {
    if (!user) return 0;
    
    const userApostas = apostas.filter(aposta => 
      aposta.jogo_id === gameId && aposta.usuario_id === user.id
    );
    
    return userApostas.length;
  }, [apostas, user]);

  const getTotalApostasExtrasRodada = useCallback((gameId: number) => {
    const gameApostas = apostas.filter(aposta => aposta.jogo_id === gameId);
    return gameApostas.reduce((total, aposta) => total + (aposta.creditos_apostados || 0), 0);
  }, [apostas]);

  return {
    handleBet,
    getUserApostasCount,
    getTotalApostasExtrasRodada
  };
};

export default HomeBettingLogic;
