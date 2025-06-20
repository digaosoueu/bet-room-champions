
-- Remover políticas existentes que podem estar causando recursão
DROP POLICY IF EXISTS "Allow read participantes" ON public.participantes;
DROP POLICY IF EXISTS "Allow insert participantes" ON public.participantes;

-- Remover políticas existentes que podem estar causando recursão
DROP POLICY IF EXISTS "Allow read salas" ON public.salas;
DROP POLICY IF EXISTS "Allow insert apostas" ON public.apostas;
DROP POLICY IF EXISTS "Allow read apostas" ON public.apostas;
DROP POLICY IF EXISTS "Allow read usuarios" ON public.usuarios;
DROP POLICY IF EXISTS "Allow update usuarios" ON public.usuarios;

-- Criar políticas mais simples para permitir acesso básico
CREATE POLICY "Enable read access for all users" ON public.salas
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON public.participantes
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON public.participantes
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for all users" ON public.apostas
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON public.apostas
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for all users" ON public.usuarios
  FOR SELECT USING (true);

CREATE POLICY "Enable update for authenticated users" ON public.usuarios
  FOR UPDATE USING (auth.role() = 'authenticated');
