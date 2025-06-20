
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type ApostaInput = Database['public']['Tables']['apostas']['Insert'];

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
  createAposta: (data: Omit<ApostaInput, 'usuario_id'>) => Promise<any>;
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

      // Verificar apostas existentes no jogo
      const apostasNoJogo = getUserApostasCount(gameId);
      
      // Regra: máximo 3 apostas por jogo
      if (apostasNoJogo >= 3) {
        toast({
          title: "Limite atingido",
          description: "Máximo de 3 apostas por jogo atingido",
          variant: "destructive"
        });
        return;
      }

      // Calcular custo da aposta baseado nas regras de negócio
      let custoReal = 0;
      if (apostasNoJogo === 0) {
        custoReal = 0; // 1ª aposta gratuita
      } else if (apostasNoJogo === 1) {
        custoReal = 100; // 2ª aposta - 100 créditos
      } else if (apostasNoJogo === 2) {
        custoReal = 150; // 3ª aposta - 150 créditos
      }

      // Verificar se usuário tem créditos suficientes (apenas para apostas pagas)
      if (custoReal > 0 && user.creditos < custoReal) {
        toast({
          title: "Créditos insuficientes",
          description: `Você precisa de ${custoReal} créditos para fazer esta aposta`,
          variant: "destructive"
        });
        return;
      }

      // Verificar limite de apostas extras na rodada (apenas para 2ª e 3ª apostas)
      if (custoReal > 0) {
        const apostasExtrasRodada = getTotalApostasExtrasRodada(gameId);
        if (apostasExtrasRodada >= 10) {
          toast({
            title: "Limite atingido",
            description: "Limite de 10 apostas extras por rodada atingido",
            variant: "destructive"
          });
          return;
        }
      }

      // Verificar se o jogo ainda não começou (5 min de tolerância)
      const rodadaAtual = rodadas.find(r => r.jogos.some(j => j.id === gameId));
      const jogo = rodadaAtual?.jogos.find(j => j.id === gameId);
      if (jogo) {
        const dataJogo = new Date(jogo.data_jogo);
        const agora = new Date();
        if (agora.getTime() > dataJogo.getTime() - 5 * 60 * 1000) {
          toast({
            title: "Apostas encerradas",
            description: "Não é possível apostar em jogos que já aconteceram ou estão prestes a começar",
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
        creditos_apostados: custoReal
      });

      // Debitar créditos se for aposta paga
      if (custoReal > 0) {
        const { error } = await supabase
          .from('usuarios')
          .update({ creditos: user.creditos - custoReal })
          .eq('id', user.id);

        if (error) {
          console.error('Erro ao debitar créditos:', error);
          throw new Error('Erro ao debitar créditos');
        }
      }

      const tipoAposta = custoReal === 0 ? "gratuita" : `custou ${custoReal} créditos`;
      toast({
        title: "Aposta realizada!",
        description: `Aposta de ${placar1} x ${placar2} registrada (${tipoAposta})`,
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

  const getTotalApostasExtrasRodada = (gameId: number) => {
    // Encontrar a rodada do jogo
    const rodadaAtual = rodadas.find(r => r.jogos.some(j => j.id === gameId));
    if (!rodadaAtual) return 0;

    // Contar apostas extras (que custaram créditos) em todos os jogos da rodada
    const jogosRodada = rodadaAtual.jogos.map(j => j.id);
    return apostas.filter(aposta => 
      jogosRodada.includes(aposta.jogo_id) && aposta.creditos_apostados > 0
    ).length;
  };

  return { handleBet, getUserApostasCount, getTotalApostasExtrasRodada };
};

export default HomeBettingLogic;
