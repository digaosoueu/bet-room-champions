
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Aposta = Database['public']['Tables']['apostas']['Row'];
type ApostaInput = Database['public']['Tables']['apostas']['Insert'];

export const useApostas = (salaId?: string) => {
  const [apostas, setApostas] = useState<Aposta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (salaId) {
      fetchApostas();
    }
  }, [salaId]);

  const fetchApostas = async () => {
    if (!salaId) return;

    try {
      const { data, error } = await supabase
        .from('apostas')
        .select('*')
        .eq('sala_id', salaId)
        .order('data_aposta', { ascending: false });

      if (error) {
        console.error('Erro ao buscar apostas:', error);
        return;
      }

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

    const { data, error } = await supabase
      .from('apostas')
      .insert({
        ...apostaData,
        usuario_id: usuarioData.id
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

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
