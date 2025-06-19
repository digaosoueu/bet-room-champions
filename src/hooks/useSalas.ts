
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
    fetchUserSalas();
  }, []);

  const fetchUserSalas = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      // Buscar o ID do usuário na tabela usuarios
      const { data: usuarioData, error: usuarioError } = await supabase
        .from('usuarios')
        .select('id')
        .eq('auth_user_id', userData.user.id)
        .single();

      if (usuarioError || !usuarioData) {
        console.error('Perfil do usuário não encontrado:', usuarioError);
        return;
      }

      // Buscar salas que o usuário participa com contagem de participantes
      const { data, error } = await supabase
        .from('participantes')
        .select(`
          sala:salas(
            *,
            campeonato:campeonatos(nome)
          )
        `)
        .eq('usuario_id', usuarioData.id);

      if (error) {
        console.error('Erro ao buscar salas:', error);
        return;
      }

      const salasWithCount = await Promise.all(
        (data?.map(p => p.sala).filter(Boolean) || []).map(async (sala: any) => {
          // Contar participantes para cada sala
          const { count } = await supabase
            .from('participantes')
            .select('*', { count: 'exact', head: true })
            .eq('sala_id', sala.id);

          return {
            ...sala,
            participantes_count: count || 0
          };
        })
      );

      setSalas(salasWithCount as Sala[]);
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

    await fetchUserSalas();
    return data;
  };

  const joinSala = async (salaId: string, codigo?: string) => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      throw new Error('Usuário não autenticado');
    }

    // Buscar o ID do usuário na tabela usuarios
    const { data: usuarioData, error: usuarioError } = await supabase
      .from('usuarios')
      .select('id, creditos')
      .eq('auth_user_id', userData.user.id)
      .single();

    if (usuarioError || !usuarioData) {
      throw new Error('Perfil do usuário não encontrado');
    }

    // Buscar dados da sala
    const { data: salaData, error: salaError } = await supabase
      .from('salas')
      .select('*')
      .eq('id', salaId)
      .single();

    if (salaError || !salaData) {
      throw new Error('Sala não encontrada');
    }

    // Verificar se é sala privada e se o código está correto
    if (salaData.tipo === 'privada' && salaData.codigo_acesso !== codigo) {
      throw new Error('Código de acesso inválido');
    }

    // Verificar se o usuário tem créditos suficientes para salas pagas
    if (salaData.tipo !== 'geral' && usuarioData.creditos < salaData.valor_aposta) {
      throw new Error('Créditos insuficientes');
    }

    // Adicionar usuário como participante
    const { error: participanteError } = await supabase
      .from('participantes')
      .insert({
        usuario_id: usuarioData.id,
        sala_id: salaId
      });

    if (participanteError) {
      throw participanteError;
    }

    // Debitar créditos se for sala paga
    if (salaData.tipo !== 'geral') {
      const { error: creditoError } = await supabase
        .from('usuarios')
        .update({
          creditos: usuarioData.creditos - salaData.valor_aposta
        })
        .eq('id', usuarioData.id);

      if (creditoError) {
        throw creditoError;
      }
    }

    await fetchUserSalas();
  };

  return {
    salas,
    loading,
    createSala,
    joinSala,
    refetch: fetchUserSalas
  };
};
