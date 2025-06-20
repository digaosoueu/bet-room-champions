
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type RankingEntry = Database['public']['Tables']['ranking']['Row'] & {
  usuario: {
    nome: string;
    email: string;
  };
};

export const useRanking = (salaId?: number) => {
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (salaId) {
      fetchRanking();
    }
  }, [salaId]);

  const fetchRanking = async () => {
    if (!salaId) return;

    try {
      const { data, error } = await supabase
        .from('ranking')
        .select(`
          *,
          usuario:usuarios(nome, email)
        `)
        .eq('sala_id', salaId)
        .order('pontos', { ascending: false })
        .order('creditos_ganhos', { ascending: false });

      if (error) {
        console.error('Erro ao buscar ranking:', error);
        return;
      }

      setRanking(data || []);
    } catch (error) {
      console.error('Erro ao buscar ranking:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    ranking,
    loading,
    refetch: fetchRanking
  };
};
