
-- Primeiro, vamos criar uma sala geral para o Campeonato Brasileiro 2025
WITH campeonato_brasileiro AS (
  SELECT id FROM public.campeonatos WHERE nome = 'Campeonato Brasileiro 2025' LIMIT 1
)
INSERT INTO public.salas (nome, tipo, campeonato_id, dono_id, valor_aposta)
SELECT 
  'Sala Geral - Brasileirão 2025',
  'geral'::tipo_sala,
  cb.id,
  (SELECT id FROM public.usuarios LIMIT 1), -- Pega qualquer usuário como dono temporário
  0
FROM campeonato_brasileiro cb
WHERE NOT EXISTS (
  SELECT 1 FROM public.salas s 
  JOIN campeonato_brasileiro cb2 ON s.campeonato_id = cb2.id 
  WHERE s.tipo = 'geral'
);

-- Adicionar políticas RLS para a tabela salas para permitir leitura
CREATE POLICY "Allow read access to salas" ON public.salas
  FOR SELECT USING (true);

-- Adicionar políticas RLS para a tabela participantes para permitir inserção
CREATE POLICY "Allow insert participantes" ON public.participantes
  FOR INSERT WITH CHECK (true);

-- Adicionar políticas RLS para a tabela participantes para permitir leitura
CREATE POLICY "Allow read participantes" ON public.participantes
  FOR SELECT USING (true);

-- Adicionar políticas RLS para a tabela apostas para permitir inserção
CREATE POLICY "Allow insert apostas" ON public.apostas
  FOR INSERT WITH CHECK (true);

-- Adicionar políticas RLS para a tabela apostas para permitir leitura
CREATE POLICY "Allow read apostas" ON public.apostas
  FOR SELECT USING (true);

-- Adicionar políticas RLS para a tabela usuarios para permitir leitura e atualização
CREATE POLICY "Allow read usuarios" ON public.usuarios
  FOR SELECT USING (true);

CREATE POLICY "Allow update usuarios" ON public.usuarios
  FOR UPDATE USING (true);
