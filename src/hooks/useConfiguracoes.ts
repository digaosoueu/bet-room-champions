
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useConfiguracoes = () => {
  const [configuracoes, setConfiguracoes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('useConfiguracoes: Iniciando busca de configurações');
    fetchConfiguracoes();
  }, []);

  const fetchConfiguracoes = async () => {
    try {
      console.log('useConfiguracoes: Buscando configurações do sistema');
      
      const { data, error } = await supabase
        .from('configuracoes')
        .select('chave, valor');

      if (error) {
        console.error('useConfiguracoes: Erro ao buscar configurações:', error);
        setConfiguracoes({});
        return;
      }

      console.log('useConfiguracoes: Configurações encontradas:', data?.length || 0);
      
      // Converter array para objeto
      const configObj: Record<string, string> = {};
      data?.forEach(config => {
        configObj[config.chave] = config.valor;
      });
      
      console.log('useConfiguracoes: Configurações processadas:', configObj);
      setConfiguracoes(configObj);
    } catch (error) {
      console.error('useConfiguracoes: Erro inesperado ao buscar configurações:', error);
      setConfiguracoes({});
    } finally {
      console.log('useConfiguracoes: Finalizando carregamento');
      setLoading(false);
    }
  };

  return {
    configuracoes,
    loading,
    refetch: fetchConfiguracoes
  };
};
