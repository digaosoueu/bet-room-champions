
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Rodada = Database['public']['Tables']['rodadas']['Row'] & {
  jogos: Array<{
    id: number;
    time1: string;
    time2: string;
    data_jogo: string;
    placar_oficial1?: number;
    placar_oficial2?: number;
  }>;
};

export const useRodadas = (campeonatoId?: number) => {
  const [rodadas, setRodadas] = useState<Rodada[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);

  useEffect(() => {
    if (campeonatoId) {
      fetchRodadas();
    }
  }, [campeonatoId]);

  const getCurrentRoundIndex = (rodadas: Rodada[]) => {
    const now = new Date();
    
    // Encontrar a primeira rodada que ainda não terminou
    for (let i = 0; i < rodadas.length; i++) {
      const rodada = rodadas[i];
      const dataFim = new Date(rodada.data_fim);
      
      if (dataFim >= now) {
        return i;
      }
    }
    
    // Se todas as rodadas já terminaram, mostrar a última
    return Math.max(0, rodadas.length - 1);
  };

  const fetchRodadas = async () => {
    if (!campeonatoId) return;

    try {
      console.log('Buscando rodadas para campeonato:', campeonatoId);
      
      const { data, error } = await supabase
        .from('rodadas')
        .select(`
          *,
          jogos (
            id,
            time1,
            time2,
            data_jogo,
            placar_oficial1,
            placar_oficial2
          )
        `)
        .eq('campeonato_id', campeonatoId)
        .order('numero', { ascending: true });

      if (error) {
        console.error('Erro ao buscar rodadas:', error);
        return;
      }

      console.log('Rodadas encontradas:', data?.length);
      
      const rodadasWithJogos = (data || []).filter(r => r.jogos && r.jogos.length > 0);
      setRodadas(rodadasWithJogos);
      
      // Definir a rodada atual
      if (rodadasWithJogos.length > 0) {
        const currentIndex = getCurrentRoundIndex(rodadasWithJogos);
        setCurrentRoundIndex(currentIndex);
        console.log('Rodada atual definida como:', currentIndex + 1);
      }
    } catch (error) {
      console.error('Erro ao buscar rodadas:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    rodadas,
    loading,
    currentRoundIndex,
    refetch: fetchRodadas
  };
};
