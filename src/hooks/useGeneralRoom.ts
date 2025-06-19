
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useGeneralRoom = (campeonatoId?: string) => {
  const [salaGeral, setSalaGeral] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (campeonatoId) {
      fetchSalaGeral();
    } else {
      setLoading(false);
    }
  }, [campeonatoId]);

  const fetchSalaGeral = async () => {
    if (!campeonatoId) return;

    try {
      console.log('Buscando sala geral para campeonato:', campeonatoId);
      
      // Buscar sala geral baseada apenas no campeonato e tipo
      const { data, error } = await supabase
        .from('salas')
        .select('id, nome, tipo')
        .eq('campeonato_id', campeonatoId)
        .eq('tipo', 'geral')
        .maybeSingle();

      if (error) {
        console.error('Erro ao buscar sala geral:', error);
        toast({
          title: "Erro",
          description: "Não foi possível encontrar a sala geral do campeonato",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      if (data) {
        console.log('Sala geral encontrada:', data);
        setSalaGeral(data.id);
        
        // Verificar se o usuário já é participante da sala geral
        await ensureUserInGeneralRoom(data.id);
      } else {
        console.log('Nenhuma sala geral encontrada para o campeonato');
        // Não mostrar erro se não encontrar a sala, apenas log
        console.warn('A sala geral do campeonato ainda não foi criada');
      }
    } catch (error) {
      console.error('Erro ao buscar sala geral:', error);
    } finally {
      setLoading(false);
    }
  };

  const ensureUserInGeneralRoom = async (salaId: string) => {
    try {
      // Buscar o ID do usuário na tabela usuarios
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data: usuarioData, error: usuarioError } = await supabase
        .from('usuarios')
        .select('id')
        .eq('auth_user_id', userData.user.id)
        .single();

      if (usuarioError || !usuarioData) {
        console.error('Perfil do usuário não encontrado:', usuarioError);
        return;
      }

      // Verificar se já é participante (sem usar RLS que pode causar recursão)
      const { data: participanteExists, error: checkError } = await supabase
        .from('participantes')
        .select('id')
        .eq('usuario_id', usuarioData.id)
        .eq('sala_id', salaId)
        .maybeSingle();

      if (checkError) {
        console.error('Erro ao verificar participação:', checkError);
        return;
      }

      if (!participanteExists) {
        // Adicionar como participante da sala geral
        const { error: insertError } = await supabase
          .from('participantes')
          .insert({
            usuario_id: usuarioData.id,
            sala_id: salaId
          });

        if (insertError) {
          console.error('Erro ao adicionar usuário à sala geral:', insertError);
        } else {
          console.log('Usuário adicionado à sala geral com sucesso');
        }
      } else {
        console.log('Usuário já é participante da sala geral');
      }
    } catch (error) {
      console.error('Erro ao verificar participação na sala geral:', error);
    }
  };

  return { salaGeral, loading };
};
