
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Configuracao = Database['public']['Tables']['configuracoes']['Row'];

export const useConfiguracoes = () => {
  const [configuracoes, setConfiguracoes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConfiguracoes();
  }, []);

  const fetchConfiguracoes = async () => {
    try {
      const { data, error } = await supabase
        .from('configuracoes')
        .select('*');

      if (error) {
        console.error('Erro ao buscar configurações:', error);
        return;
      }

      const configMap = (data || []).reduce((acc, config) => {
        acc[config.chave] = config.valor;
        return acc;
      }, {} as Record<string, string>);

      setConfiguracoes(configMap);
    } catch (error) {
      console.error('Erro ao buscar configurações:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    configuracoes,
    loading,
    refetch: fetchConfiguracoes
  };
};
