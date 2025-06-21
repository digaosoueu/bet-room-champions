
-- Corrigir políticas RLS para permitir acesso quando usuário está autenticado

-- Salas: permitir inserção para usuários autenticados
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.salas;
CREATE POLICY "Enable insert for authenticated users" ON public.salas
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Salas: permitir atualização para usuários autenticados  
CREATE POLICY "Enable update for authenticated users" ON public.salas
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Participantes: melhorar políticas
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.participantes;
CREATE POLICY "Enable insert for authenticated users" ON public.participantes
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON public.participantes
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Apostas: melhorar políticas
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.apostas;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON public.apostas;

CREATE POLICY "Enable insert for authenticated users" ON public.apostas
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON public.apostas
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Ranking: melhorar políticas
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.ranking;
CREATE POLICY "Enable insert for authenticated users" ON public.ranking
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON public.ranking
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Usuários: permitir inserção e atualização
DROP POLICY IF EXISTS "Enable update for authenticated users" ON public.usuarios;
CREATE POLICY "Enable insert for authenticated users" ON public.usuarios
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON public.usuarios
  FOR UPDATE USING (auth.role() = 'authenticated');
