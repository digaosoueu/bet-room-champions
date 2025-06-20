
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Aposta = Database['public']['Tables']['apostas']['Row'];
type ApostaInput = Database['public']['Tables']['apostas']['Insert'];

export const useApostas = (salaId?: number) => {
  const [apostas, setApostas] = useState<Aposta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (salaId) {
      fetchApostas();
    } else {
      setLoading(false);
    }
  }, [salaId]);

  const fetchApostas = async () => {
    if (!salaId) return;

    try {
      console.log('Buscando apostas para sala:', salaId);
      
      // Buscar o ID do usuário na tabela usuarios
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        console.log('Usuário não autenticado');
        setLoading(false);
        return;
      }

      const { data: usuarioData, error: usuarioError } = await supabase
        .from('usuarios')
        .select('id')
        .eq('auth_user_id', userData.user.id)
        .single();

      if (usuarioError || !usuarioData) {
        console.error('Perfil do usuário não encontrado:', usuarioError);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('apostas')
        .select('*')
        .eq('sala_id', salaId)
        .eq('usuario_id', usuarioData.id)
        .order('data_aposta', { ascending: false });

      if (error) {
        console.error('Erro ao buscar apostas:', error);
        return;
      }

      console.log('Apostas encontradas:', data?.length || 0);
      setApostas(data || []);
    } catch (error) {
      console.error('Erro ao buscar apostas:', error);
    } finally {
      setLoading(false);
    }
  };

  const createAposta = async (apostaData: Omit<ApostaInput, 'usuario_id'>) => {
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

    console.log('Criando aposta:', { ...apostaData, usuario_id: usuarioData.id });

    const { data, error } = await supabase
      .from('apostas')
      .insert({
        ...apostaData,
        usuario_id: usuarioData.id
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar aposta:', error);
      throw error;
    }

    console.log('Aposta criada com sucesso:', data);
    await fetchApostas();
    return data;
  };

  return {
    apostas,
    loading,
    createAposta,
    refetch: fetchApostas
  };
};
