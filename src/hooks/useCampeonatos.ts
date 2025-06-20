
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Campeonato = Database['public']['Tables']['campeonatos']['Row'];

export const useCampeonatos = () => {
  const [campeonatos, setCampeonatos] = useState<Campeonato[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampeonatos();
  }, []);

  const fetchCampeonatos = async () => {
    try {
      const { data, error } = await supabase
        .from('campeonatos')
        .select('*')
        .eq('ativo', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar campeonatos:', error);
        return;
      }

      console.log('Campeonatos encontrados:', data);
      setCampeonatos(data || []);
    } catch (error) {
      console.error('Erro ao buscar campeonatos:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    campeonatos,
    loading,
    refetch: fetchCampeonatos
  };
};
