
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Jogo = Database['public']['Tables']['jogos']['Row'] & {
  rodada: {
    numero: number;
    campeonato: {
      nome: string;
    };
  };
};

export const useJogos = (campeonatoId?: string) => {
  const [jogos, setJogos] = useState<Jogo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (campeonatoId) {
      fetchJogos();
    }
  }, [campeonatoId]);

  const fetchJogos = async () => {
    if (!campeonatoId) return;

    try {
      const { data, error } = await supabase
        .from('jogos')
        .select(`
          *,
          rodada:rodadas(
            numero,
            campeonato:campeonatos(nome)
          )
        `)
        .eq('rodada.campeonato_id', campeonatoId)
        .order('data_jogo', { ascending: true });

      if (error) {
        console.error('Erro ao buscar jogos:', error);
        return;
      }

      setJogos(data || []);
    } catch (error) {
      console.error('Erro ao buscar jogos:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    jogos,
    loading,
    refetch: fetchJogos
  };
};
