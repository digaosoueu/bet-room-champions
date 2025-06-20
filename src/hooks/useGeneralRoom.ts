
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useGeneralRoom = (campeonatoId?: number) => {
  const [salaGeral, setSalaGeral] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('useGeneralRoom: Hook iniciado com campeonatoId:', campeonatoId);
    
    if (campeonatoId) {
      fetchOrCreateGeneralRoom();
    } else {
      console.log('useGeneralRoom: Nenhum campeonato fornecido, mantendo loading como true');
      setLoading(true);
    }
  }, [campeonatoId]);

  const fetchOrCreateGeneralRoom = async () => {
    if (!campeonatoId) {
      console.log('useGeneralRoom: Sem campeonatoId, abortando fetch');
      return;
    }

    try {
      console.log('useGeneralRoom: Buscando sala geral para campeonato:', campeonatoId);
      
      // Buscar sala geral existente (dono_id = 0 indica sala geral)
      const { data: existingRoom, error: fetchError } = await supabase
        .from('salas')
        .select('id')
        .eq('campeonato_id', campeonatoId)
        .eq('dono_id', 0)
        .eq('tipo', 'publica')
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('useGeneralRoom: Erro ao buscar sala geral:', fetchError);
        setSalaGeral(null);
        return;
      }

      if (existingRoom) {
        console.log('useGeneralRoom: Sala geral encontrada:', existingRoom.id);
        setSalaGeral(existingRoom.id);
        return;
      }

      // Criar sala geral se não existir
      console.log('useGeneralRoom: Criando nova sala geral');
      const { data: newRoom, error: createError } = await supabase
        .from('salas')
        .insert({
          nome: 'Sala Geral',
          campeonato_id: campeonatoId,
          dono_id: 0,
          tipo: 'publica',
          valor_aposta: 0
        })
        .select('id')
        .single();

      if (createError) {
        console.error('useGeneralRoom: Erro ao criar sala geral:', createError);
        setSalaGeral(null);
        return;
      }

      console.log('useGeneralRoom: Nova sala geral criada:', newRoom.id);
      setSalaGeral(newRoom.id);
    } catch (error) {
      console.error('useGeneralRoom: Erro inesperado:', error);
      setSalaGeral(null);
    } finally {
      console.log('useGeneralRoom: Finalizando carregamento');
      setLoading(false);
    }
  };

  return {
    salaGeral,
    loading,
    refetch: fetchOrCreateGeneralRoom
  };
};
