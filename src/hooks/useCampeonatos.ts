
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Campeonato = Database['public']['Tables']['campeonatos']['Row'];

export const useCampeonatos = () => {
  const [campeonatos, setCampeonatos] = useState<Campeonato[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('useCampeonatos: Iniciando busca de campeonatos');
    fetchCampeonatos();
  }, []);

  const fetchCampeonatos = async () => {
    try {
      console.log('useCampeonatos: Buscando campeonatos ativos');
      
      const { data, error } = await supabase
        .from('campeonatos')
        .select('*')
        .eq('ativo', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('useCampeonatos: Erro ao buscar campeonatos:', error);
        setCampeonatos([]);
        return;
      }

      console.log('useCampeonatos: Campeonatos encontrados:', data?.length || 0);
      console.log('useCampeonatos: Lista de campeonatos:', data);
      
      setCampeonatos(data || []);
    } catch (error) {
      console.error('useCampeonatos: Erro inesperado ao buscar campeonatos:', error);
      setCampeonatos([]);
    } finally {
      console.log('useCampeonatos: Finalizando carregamento');
      setLoading(false);
    }
  };

  return {
    campeonatos,
    loading,
    refetch: fetchCampeonatos
  };
};
