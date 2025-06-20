
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
        setLoading(false);
        return;
      }

      if (data) {
        console.log('Sala geral encontrada:', data);
        setSalaGeral(data.id);
        
        // Verificar se o usuário já é participante da sala geral
        await ensureUserInGeneralRoom(data.id);
      } else {
        console.log('Nenhuma sala geral encontrada - tentando criar uma');
        // Se não encontrar, tentar criar uma sala geral
        await createGeneralRoom();
      }
    } catch (error) {
      console.error('Erro ao buscar sala geral:', error);
    } finally {
      setLoading(false);
    }
  };

  const createGeneralRoom = async () => {
    if (!campeonatoId) return;

    try {
      // Buscar o ID do usuário na tabela usuarios para ser o dono
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data: usuarioData } = await supabase
        .from('usuarios')
        .select('id')
        .eq('auth_user_id', userData.user.id)
        .single();

      if (!usuarioData) return;

      console.log('Criando sala geral para o campeonato');
      
      const { data: novaSala, error } = await supabase
        .from('salas')
        .insert({
          nome: 'Sala Geral',
          tipo: 'geral',
          campeonato_id: campeonatoId,
          dono_id: usuarioData.id,
          valor_aposta: 0
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar sala geral:', error);
        return;
      }

      console.log('Sala geral criada com sucesso:', novaSala);
      setSalaGeral(novaSala.id);
      
      // Adicionar o usuário como participante
      await ensureUserInGeneralRoom(novaSala.id);
    } catch (error) {
      console.error('Erro ao criar sala geral:', error);
    }
  };

  const ensureUserInGeneralRoom = async (salaId: string) => {
    try {
      // Buscar o ID do usuário na tabela usuarios
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data: usuarioData } = await supabase
        .from('usuarios')
        .select('id')
        .eq('auth_user_id', userData.user.id)
        .single();

      if (!usuarioData) {
        console.error('Perfil do usuário não encontrado');
        return;
      }

      // Verificar se já é participante
      const { data: participanteExists } = await supabase
        .from('participantes')
        .select('id')
        .eq('usuario_id', usuarioData.id)
        .eq('sala_id', salaId)
        .maybeSingle();

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
