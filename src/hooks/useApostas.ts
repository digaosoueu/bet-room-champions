
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Aposta = Database['public']['Tables']['apostas']['Row'];

export const useApostas = (salaId?: number) => {
  const [apostas, setApostas] = useState<Aposta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('useApostas: Hook iniciado com salaId:', salaId);
    
    if (salaId) {
      fetchApostas();
    } else {
      console.log('useApostas: Nenhuma sala fornecida, mantendo loading como true');
      setLoading(true);
    }
  }, [salaId]);

  const fetchApostas = async () => {
    if (!salaId) {
      console.log('useApostas: Sem salaId, abortando fetch');
      return;
    }

    try {
      console.log('useApostas: Buscando apostas para sala:', salaId);
      
      const { data, error } = await supabase
        .from('apostas')
        .select('*')
        .eq('sala_id', salaId)
        .order('data_aposta', { ascending: false });

      if (error) {
        console.error('useApostas: Erro ao buscar apostas:', error);
        setApostas([]);
        return;
      }

      console.log('useApostas: Apostas encontradas:', data?.length || 0);
      setApostas(data || []);
    } catch (error) {
      console.error('useApostas: Erro inesperado ao buscar apostas:', error);
      setApostas([]);
    } finally {
      console.log('useApostas: Finalizando carregamento');
      setLoading(false);
    }
  };

  const createAposta = async (aposta: Omit<Aposta, 'id' | 'data_aposta'>) => {
    try {
      console.log('useApostas: Criando nova aposta:', aposta);
      
      const { data, error } = await supabase
        .from('apostas')
        .insert(aposta)
        .select()
        .single();

      if (error) {
        console.error('useApostas: Erro ao criar aposta:', error);
        throw error;
      }

      console.log('useApostas: Aposta criada com sucesso:', data.id);
      
      // Atualizar lista de apostas
      await fetchApostas();
      
      return data;
    } catch (error) {
      console.error('useApostas: Erro inesperado ao criar aposta:', error);
      throw error;
    }
  };

  const refetch = () => {
    if (salaId) {
      fetchApostas();
    }
  };

  return {
    apostas,
    loading,
    createAposta,
    refetch
  };
};
