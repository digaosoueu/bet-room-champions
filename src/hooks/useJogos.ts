
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

export const useJogos = (campeonatoId?: number) => {
  const [jogos, setJogos] = useState<Jogo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('useJogos: Hook iniciado com campeonatoId:', campeonatoId);
    
    if (campeonatoId) {
      fetchJogos();
    } else {
      console.log('useJogos: Nenhum campeonato fornecido, mantendo loading como true');
      setLoading(true);
    }
  }, [campeonatoId]);

  const fetchJogos = async () => {
    if (!campeonatoId) {
      console.log('useJogos: Sem campeonatoId, abortando fetch');
      return;
    }

    try {
      console.log('useJogos: Buscando jogos para campeonato:', campeonatoId);
      
      // Primeiro buscar as rodadas do campeonato
      const { data: rodadas, error: rodadasError } = await supabase
        .from('rodadas')
        .select('id')
        .eq('campeonato_id', campeonatoId);

      if (rodadasError) {
        console.error('useJogos: Erro ao buscar rodadas:', rodadasError);
        setJogos([]);
        return;
      }

      if (!rodadas || rodadas.length === 0) {
        console.log('useJogos: Nenhuma rodada encontrada para o campeonato');
        setJogos([]);
        return;
      }

      const rodadaIds = rodadas.map(r => r.id);
      console.log('useJogos: IDs das rodadas encontradas:', rodadaIds);

      // Agora buscar os jogos dessas rodadas
      const { data, error } = await supabase
        .from('jogos')
        .select(`
          *,
          rodada:rodadas(
            numero,
            campeonato:campeonatos(nome)
          )
        `)
        .in('rodada_id', rodadaIds)
        .order('data_jogo', { ascending: true });

      if (error) {
        console.error('useJogos: Erro ao buscar jogos:', error);
        setJogos([]);
        return;
      }

      console.log('useJogos: Jogos encontrados:', data?.length || 0);
      setJogos(data || []);
    } catch (error) {
      console.error('useJogos: Erro inesperado ao buscar jogos:', error);
      setJogos([]);
    } finally {
      console.log('useJogos: Finalizando carregamento');
      setLoading(false);
    }
  };

  return {
    jogos,
    loading,
    refetch: fetchJogos
  };
};
