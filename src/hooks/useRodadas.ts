
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Rodada = Database['public']['Tables']['rodadas']['Row'] & {
  jogos: Array<{
    id: string;
    time1: string;
    time2: string;
    data_jogo: string;
    placar_oficial1?: number;
    placar_oficial2?: number;
  }>;
};

export const useRodadas = (campeonatoId?: string) => {
  const [rodadas, setRodadas] = useState<Rodada[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (campeonatoId) {
      fetchRodadas();
    }
  }, [campeonatoId]);

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
      console.log('Primeira rodada com jogos:', data?.[0]);
      
      setRodadas(data || []);
    } catch (error) {
      console.error('Erro ao buscar rodadas:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    rodadas,
    loading,
    refetch: fetchRodadas
  };
};
