
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Sala = Database['public']['Tables']['salas']['Row'] & {
  campeonato: {
    nome: string;
  };
  participantes_count: number;
};

type SalaInput = Database['public']['Tables']['salas']['Insert'];

export const useSalas = () => {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSalas();
  }, []);

  const fetchSalas = async () => {
    try {
      const { data, error } = await supabase
        .from('salas')
        .select(`
          *,
          campeonato:campeonatos(nome),
          participantes(id)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar salas:', error);
        return;
      }

      const salasFormatted = data?.map(sala => ({
        ...sala,
        campeonato: {
          nome: sala.campeonato?.nome || 'Campeonato não encontrado'
        },
        participantes_count: sala.participantes?.length || 0
      })) || [];

      setSalas(salasFormatted);
    } catch (error) {
      console.error('Erro ao buscar salas:', error);
    } finally {
      setLoading(false);
    }
  };

  const createSala = async (salaData: Omit<SalaInput, 'dono_id'>) => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      throw new Error('Usuário não autenticado');
    }

    // Buscar o ID do usuário na tabela usuarios
    const { data: usuarioData, error: usuarioError } = await supabase
      .from('usuarios')
      .select('id')
      .eq('auth_user_id', userData.user.id)
      .single();

    if (usuarioError || !usuarioData) {
      throw new Error('Perfil do usuário não encontrado');
    }

    const { data, error } = await supabase
      .from('salas')
      .insert({
        ...salaData,
        dono_id: usuarioData.id
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    await fetchSalas();
    return data;
  };

  const joinSala = async (salaId: string) => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      throw new Error('Usuário não autenticado');
    }

    // Buscar o ID do usuário na tabela usuarios
    const { data: usuarioData, error: usuarioError } = await supabase
      .from('usuarios')
      .select('id')
      .eq('auth_user_id', userData.user.id)
      .single();

    if (usuarioError || !usuarioData) {
      throw new Error('Perfil do usuário não encontrado');
    }

    const { error } = await supabase
      .from('participantes')
      .insert({
        usuario_id: usuarioData.id,
        sala_id: salaId
      });

    if (error) {
      throw error;
    }

    await fetchSalas();
  };

  return {
    salas,
    loading,
    createSala,
    joinSala,
    refetch: fetchSalas
  };
};
