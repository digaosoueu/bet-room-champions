
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type RankingItem = Database['public']['Tables']['ranking']['Row'] & {
  usuario: {
    nome: string;
  };
};

export const useRanking = (salaId?: string) => {
  const [ranking, setRanking] = useState<RankingItem[]>([]);
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
          usuario:usuarios(nome)
        `)
        .eq('sala_id', salaId)
        .order('pontos', { ascending: false });

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
