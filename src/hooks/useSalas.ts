
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type Sala = Database['public']['Tables']['salas']['Row'] & {
  participantes_count?: number;
};

export const useSalas = (campeonatoId?: number) => {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (campeonatoId) {
      fetchSalas();
    }
  }, [campeonatoId]);

  const fetchSalas = async () => {
    if (!campeonatoId) return;

    try {
      const { data, error } = await supabase
        .from('salas')
        .select(`
          *,
          participantes(count)
        `)
        .eq('campeonato_id', campeonatoId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar salas:', error);
        return;
      }

      // Processar dados para incluir contagem de participantes
      const salasWithCount = (data || []).map(sala => ({
        ...sala,
        participantes_count: Array.isArray(sala.participantes) ? sala.participantes.length : 0
      }));

      setSalas(salasWithCount);
    } catch (error) {
      console.error('Erro ao buscar salas:', error);
    } finally {
      setLoading(false);
    }
  };

  const createSala = async (nome: string, tipo: 'publica' | 'privada', valorAposta: number) => {
    try {
      // Buscar o usuário autenticado
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('Usuário não autenticado');
      }

      // Buscar o perfil do usuário
      const { data: usuarioData, error: usuarioError } = await supabase
        .from('usuarios')
        .select('id')
        .eq('auth_user_id', userData.user.id)
        .single();

      if (usuarioError || !usuarioData) {
        throw new Error('Perfil do usuário não encontrado');
      }

      if (!campeonatoId) {
        throw new Error('Campeonato não especificado');
      }

      const { data, error } = await supabase
        .from('salas')
        .insert({
          nome,
          tipo,
          valor_aposta: valorAposta,
          dono_id: usuarioData.id,
          campeonato_id: campeonatoId
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar sala:', error);
        throw error;
      }

      toast({
        title: "Sala criada com sucesso!",
        description: `A sala "${nome}" foi criada.`,
      });

      await fetchSalas();
      return data;
    } catch (error: any) {
      console.error('Erro ao criar sala:', error);
      toast({
        title: "Erro ao criar sala",
        description: error.message || "Tente novamente",
        variant: "destructive",
      });
      throw error;
    }
  };

  const joinSala = async (salaId: number, codigoAcesso?: string) => {
    try {
      // Buscar o usuário autenticado
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('Usuário não autenticado');
      }

      // Buscar o perfil do usuário
      const { data: usuarioData, error: usuarioError } = await supabase
        .from('usuarios')
        .select('id')
        .eq('auth_user_id', userData.user.id)
        .single();

      if (usuarioError || !usuarioData) {
        throw new Error('Perfil do usuário não encontrado');
      }

      // Verificar se a sala existe e se o código está correto (se necessário)
      const { data: salaData, error: salaError } = await supabase
        .from('salas')
        .select('*')
        .eq('id', salaId)
        .single();

      if (salaError || !salaData) {
        throw new Error('Sala não encontrada');
      }

      if (salaData.tipo === 'privada' && salaData.codigo_acesso !== codigoAcesso) {
        throw new Error('Código de acesso inválido');
      }

      // Verificar se já é participante
      const { data: participanteExists } = await supabase
        .from('participantes')
        .select('id')
        .eq('usuario_id', usuarioData.id)
        .eq('sala_id', salaId)
        .maybeSingle();

      if (participanteExists) {
        throw new Error('Você já é participante desta sala');
      }

      // Adicionar como participante
      const { error: insertError } = await supabase
        .from('participantes')
        .insert({
          usuario_id: usuarioData.id,
          sala_id: salaId
        });

      if (insertError) {
        console.error('Erro ao entrar na sala:', insertError);
        throw insertError;
      }

      toast({
        title: "Entrada realizada com sucesso!",
        description: `Você agora faz parte da sala "${salaData.nome}".`,
      });

      await fetchSalas();
      return salaData;
    } catch (error: any) {
      console.error('Erro ao entrar na sala:', error);
      toast({
        title: "Erro ao entrar na sala",
        description: error.message || "Tente novamente",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    salas,
    loading,
    createSala,
    joinSala,
    refetch: fetchSalas
  };
};
