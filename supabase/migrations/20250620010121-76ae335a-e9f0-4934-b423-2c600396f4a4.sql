
-- Primeiro, vamos dropar as constraints de foreign key que dependem dos UUIDs
ALTER TABLE public.apostas DROP CONSTRAINT IF EXISTS apostas_jogo_id_fkey;
ALTER TABLE public.apostas DROP CONSTRAINT IF EXISTS apostas_sala_id_fkey;
ALTER TABLE public.apostas DROP CONSTRAINT IF EXISTS apostas_usuario_id_fkey;
ALTER TABLE public.jogos DROP CONSTRAINT IF EXISTS jogos_rodada_id_fkey;
ALTER TABLE public.participantes DROP CONSTRAINT IF EXISTS participantes_sala_id_fkey;
ALTER TABLE public.participantes DROP CONSTRAINT IF EXISTS participantes_usuario_id_fkey;
ALTER TABLE public.ranking DROP CONSTRAINT IF EXISTS ranking_sala_id_fkey;
ALTER TABLE public.ranking DROP CONSTRAINT IF EXISTS ranking_usuario_id_fkey;
ALTER TABLE public.rodadas DROP CONSTRAINT IF EXISTS rodadas_campeonato_id_fkey;
ALTER TABLE public.salas DROP CONSTRAINT IF EXISTS salas_campeonato_id_fkey;
ALTER TABLE public.salas DROP CONSTRAINT IF EXISTS salas_dono_id_fkey;

-- Dropar as tabelas existentes
DROP TABLE IF EXISTS public.apostas CASCADE;
DROP TABLE IF EXISTS public.ranking CASCADE;
DROP TABLE IF EXISTS public.participantes CASCADE;
DROP TABLE IF EXISTS public.jogos CASCADE;
DROP TABLE IF EXISTS public.salas CASCADE;
DROP TABLE IF EXISTS public.rodadas CASCADE;
DROP TABLE IF EXISTS public.campeonatos CASCADE;
DROP TABLE IF EXISTS public.usuarios CASCADE;

-- Recriar tabela usuarios com ID inteiro
CREATE TABLE public.usuarios (
  id SERIAL PRIMARY KEY,
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  creditos INTEGER NOT NULL DEFAULT 1000,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Recriar tabela campeonatos com ID inteiro
CREATE TABLE public.campeonatos (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  temporada TEXT NOT NULL,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Recriar tabela rodadas com ID inteiro
CREATE TABLE public.rodadas (
  id SERIAL PRIMARY KEY,
  campeonato_id INTEGER REFERENCES public.campeonatos(id) ON DELETE CASCADE NOT NULL,
  numero INTEGER NOT NULL,
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(campeonato_id, numero)
);

-- Recriar tabela jogos com ID inteiro
CREATE TABLE public.jogos (
  id SERIAL PRIMARY KEY,
  rodada_id INTEGER REFERENCES public.rodadas(id) ON DELETE CASCADE NOT NULL,
  time1 TEXT NOT NULL,
  time2 TEXT NOT NULL,
  data_jogo TIMESTAMP WITH TIME ZONE NOT NULL,
  placar_oficial1 INTEGER,
  placar_oficial2 INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Recriar tabela salas com ID inteiro e sem foreign key para dono_id
CREATE TABLE public.salas (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  tipo public.tipo_sala NOT NULL DEFAULT 'publica',
  valor_aposta INTEGER NOT NULL,
  dono_id INTEGER NOT NULL DEFAULT 0, -- 0 para sala geral, sem foreign key
  campeonato_id INTEGER REFERENCES public.campeonatos(id) ON DELETE CASCADE NOT NULL,
  codigo_acesso TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Recriar tabela participantes com ID inteiro
CREATE TABLE public.participantes (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES public.usuarios(id) ON DELETE CASCADE NOT NULL,
  sala_id INTEGER REFERENCES public.salas(id) ON DELETE CASCADE NOT NULL,
  data_entrada TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(usuario_id, sala_id)
);

-- Recriar tabela apostas com ID inteiro
CREATE TABLE public.apostas (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES public.usuarios(id) ON DELETE CASCADE NOT NULL,
  sala_id INTEGER REFERENCES public.salas(id) ON DELETE CASCADE NOT NULL,
  jogo_id INTEGER REFERENCES public.jogos(id) ON DELETE CASCADE NOT NULL,
  placar_time1 INTEGER NOT NULL,
  placar_time2 INTEGER NOT NULL,
  creditos_apostados INTEGER NOT NULL,
  data_aposta TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(usuario_id, sala_id, jogo_id)
);

-- Recriar tabela ranking com ID inteiro
CREATE TABLE public.ranking (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES public.usuarios(id) ON DELETE CASCADE NOT NULL,
  sala_id INTEGER REFERENCES public.salas(id) ON DELETE CASCADE NOT NULL,
  pontos INTEGER NOT NULL DEFAULT 0,
  creditos_ganhos INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(usuario_id, sala_id)
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.campeonatos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rodadas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jogos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apostas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ranking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

-- Recriar políticas RLS simplificadas
CREATE POLICY "Enable read access for all users" ON public.campeonatos
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON public.rodadas
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON public.jogos
  FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON public.salas
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON public.salas
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for all users" ON public.participantes
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON public.participantes
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for all users" ON public.apostas
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON public.apostas
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON public.apostas
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for all users" ON public.ranking
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON public.ranking
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for all users" ON public.usuarios
  FOR SELECT USING (true);

CREATE POLICY "Enable update for authenticated users" ON public.usuarios
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Atualizar função que adiciona o dono como participante (sem foreign key agora)
CREATE OR REPLACE FUNCTION public.add_owner_as_participant()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Só adiciona como participante se dono_id não for 0 (sala geral)
  IF NEW.dono_id != 0 THEN
    INSERT INTO public.participantes (usuario_id, sala_id)
    VALUES (NEW.dono_id, NEW.id);
  END IF;
  RETURN NEW;
END;
$$;

-- Recriar trigger
CREATE TRIGGER on_room_created_add_owner
  AFTER INSERT ON public.salas
  FOR EACH ROW EXECUTE FUNCTION public.add_owner_as_participant();

-- Recriar trigger para inicializar ranking
CREATE TRIGGER on_participant_added
  AFTER INSERT ON public.participantes
  FOR EACH ROW EXECUTE FUNCTION public.initialize_user_ranking();

-- Inserir dados básicos
INSERT INTO public.campeonatos (nome, temporada, ativo)
VALUES ('Campeonato Brasileiro 2025', '2025', true);

-- Inserir as 38 rodadas
WITH campeonato_brasileiro AS (
  SELECT id FROM public.campeonatos WHERE nome = 'Campeonato Brasileiro 2025' AND temporada = '2025'
),
rodadas_data AS (
  SELECT 
    generate_series(1, 38) as numero,
    ('2025-04-13'::date + (generate_series(1, 38) - 1) * interval '1 week') as data_inicio
)
INSERT INTO public.rodadas (campeonato_id, numero, data_inicio, data_fim)
SELECT 
  cb.id,
  rd.numero,
  rd.data_inicio,
  rd.data_inicio + interval '6 days' as data_fim
FROM campeonato_brasileiro cb, rodadas_data rd;

-- Criar sala geral com dono_id = 0
WITH campeonato_brasileiro AS (
  SELECT id FROM public.campeonatos WHERE nome = 'Campeonato Brasileiro 2025' AND temporada = '2025'
)
INSERT INTO public.salas (nome, tipo, valor_aposta, campeonato_id, dono_id)
SELECT 
  'Sala Geral - Brasileirão 2025',
  'geral'::tipo_sala,
  0,
  cb.id,
  0
FROM campeonato_brasileiro cb;

-- Inserir configurações
INSERT INTO public.configuracoes (chave, valor) 
VALUES 
  ('limite_apostas_extras_por_rodada', '10'),
  ('valor_segunda_aposta', '50'),
  ('valor_terceira_aposta', '100')
ON CONFLICT (chave) DO UPDATE SET 
  valor = EXCLUDED.valor,
  updated_at = now();
