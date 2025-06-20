
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
  createAposta: (data: any) => Promise<void>;
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
  const { toast } = useToast();

  const handleBet = async (gameId: number, placar1: number, placar2: number, creditos: number) => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Você precisa estar logado para fazer apostas.",
        variant: "destructive"
      });
      return;
    }

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

      // Verificar se usuário tem créditos suficientes (apenas para apostas extras)
      if (creditos > 0 && user.creditos < creditos) {
        toast({
          title: "Créditos insuficientes",
          description: `Você precisa de ${creditos} créditos para fazer esta aposta`,
          variant: "destructive"
        });
        return;
      }

      // Verificar limite de apostas extras na rodada
      const rodadaAtual = rodadas.find(r => r.jogos.some(j => j.id === gameId));
      if (rodadaAtual && creditos > 0) {
        const apostasExtrasNaRodada = apostas.filter(a => {
          const jogoNaRodada = rodadaAtual.jogos.some(j => j.id === a.jogo_id);
          return jogoNaRodada && a.creditos_apostados > 0;
        }).length;
        
        const limiteExtras = parseInt(configuracoes.limite_apostas_extras_por_rodada || '10');
        if (apostasExtrasNaRodada >= limiteExtras) {
          toast({
            title: "Limite atingido",
            description: `Limite de ${limiteExtras} apostas extras por rodada atingido`,
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

      // Debitar créditos se for aposta extra
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
        description: `Aposta de ${placar1} x ${placar2} registrada com sucesso${creditos > 0 ? ` (${creditos} créditos)` : ' (grátis)'}`,
      });

      // Recarregar apostas
      refetchApostas();

    } catch (error: any) {
      console.error('Erro ao fazer aposta:', error);
      toast({
        title: "Erro ao apostar",
        description: error.message || "Tente novamente",
        variant: "destructive"
      });
    }
  };

  const getUserApostasCount = (gameId: number) => {
    return apostas.filter(aposta => aposta.jogo_id === gameId).length;
  };

  return { handleBet, getUserApostasCount };
};

export default HomeBettingLogic;
