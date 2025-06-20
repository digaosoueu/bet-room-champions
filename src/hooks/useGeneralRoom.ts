
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useGeneralRoom = (campeonatoId?: string) => {
  const [salaGeral, setSalaGeral] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (campeonatoId) {
      fetchOrCreateSalaGeral();
    } else {
      setLoading(false);
    }
  }, [campeonatoId]);

  const fetchOrCreateSalaGeral = async () => {
    if (!campeonatoId) return;

    try {
      console.log('Buscando/criando sala geral para campeonato:', campeonatoId);
      
      // Primeiro verificar se já existe uma sala geral para este campeonato
      const { data: salaExistente, error: searchError } = await supabase
        .from('salas')
        .select('id, nome, tipo')
        .eq('campeonato_id', campeonatoId)
        .eq('tipo', 'geral')
        .maybeSingle();

      if (searchError) {
        console.error('Erro ao buscar sala geral:', searchError);
        // Tentar criar uma sala geral mesmo com erro de busca
        await createGeneralRoom();
        return;
      }

      if (salaExistente) {
        console.log('Sala geral encontrada:', salaExistente);
        setSalaGeral(salaExistente.id);
        await ensureUserInGeneralRoom(salaExistente.id);
      } else {
        console.log('Sala geral não encontrada - criando uma nova');
        await createGeneralRoom();
      }
    } catch (error) {
      console.error('Erro ao buscar/criar sala geral:', error);
      // Mesmo com erro, tentar criar a sala
      await createGeneralRoom();
    } finally {
      setLoading(false);
    }
  };

  const createGeneralRoom = async () => {
    if (!campeonatoId) return;

    try {
      console.log('Criando sala geral para o campeonato');
      
      // Buscar o usuário autenticado
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        console.error('Usuário não autenticado');
        return;
      }

      // Buscar o perfil do usuário na tabela usuarios
      const { data: usuarioData } = await supabase
        .from('usuarios')
        .select('id')
        .eq('auth_user_id', userData.user.id)
        .single();

      if (!usuarioData) {
        console.error('Perfil do usuário não encontrado');
        return;
      }

      // Criar a sala geral
      const { data: novaSala, error: createError } = await supabase
        .from('salas')
        .insert({
          nome: 'Sala Geral - Brasileirão 2025',
          tipo: 'geral',
          campeonato_id: campeonatoId,
          dono_id: usuarioData.id,
          valor_aposta: 0 // Apostas grátis na sala geral
        })
        .select()
        .single();

      if (createError) {
        console.error('Erro ao criar sala geral:', createError);
        return;
      }

      console.log('Sala geral criada com sucesso:', novaSala);
      setSalaGeral(novaSala.id);
      
      // Garantir que o usuário seja participante da sala
      await ensureUserInGeneralRoom(novaSala.id);
    } catch (error) {
      console.error('Erro ao criar sala geral:', error);
    }
  };

  const ensureUserInGeneralRoom = async (salaId: string) => {
    try {
      // Buscar o usuário autenticado
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      // Buscar o perfil do usuário
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
