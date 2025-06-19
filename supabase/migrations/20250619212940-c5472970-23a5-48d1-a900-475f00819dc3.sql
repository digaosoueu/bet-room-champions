
-- Criar tabela de campeonatos
CREATE TABLE public.campeonatos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  temporada TEXT NOT NULL,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de rodadas
CREATE TABLE public.rodadas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campeonato_id UUID REFERENCES public.campeonatos(id) ON DELETE CASCADE NOT NULL,
  numero INTEGER NOT NULL,
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(campeonato_id, numero)
);

-- Criar tabela de jogos
CREATE TABLE public.jogos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rodada_id UUID REFERENCES public.rodadas(id) ON DELETE CASCADE NOT NULL,
  time1 TEXT NOT NULL,
  time2 TEXT NOT NULL,
  data_jogo TIMESTAMP WITH TIME ZONE NOT NULL,
  placar_oficial1 INTEGER,
  placar_oficial2 INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tipo enum para tipos de sala
CREATE TYPE public.tipo_sala AS ENUM ('geral', 'publica', 'privada');

-- Criar tabela de salas
CREATE TABLE public.salas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  tipo public.tipo_sala NOT NULL DEFAULT 'publica',
  valor_aposta INTEGER NOT NULL,
  dono_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE NOT NULL,
  campeonato_id UUID REFERENCES public.campeonatos(id) ON DELETE CASCADE NOT NULL,
  codigo_acesso TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de participantes
CREATE TABLE public.participantes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE NOT NULL,
  sala_id UUID REFERENCES public.salas(id) ON DELETE CASCADE NOT NULL,
  data_entrada TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(usuario_id, sala_id)
);

-- Criar tabela de apostas
CREATE TABLE public.apostas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE NOT NULL,
  sala_id UUID REFERENCES public.salas(id) ON DELETE CASCADE NOT NULL,
  jogo_id UUID REFERENCES public.jogos(id) ON DELETE CASCADE NOT NULL,
  placar_time1 INTEGER NOT NULL,
  placar_time2 INTEGER NOT NULL,
  creditos_apostados INTEGER NOT NULL,
  data_aposta TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(usuario_id, sala_id, jogo_id)
);

-- Criar tabela de ranking
CREATE TABLE public.ranking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE NOT NULL,
  sala_id UUID REFERENCES public.salas(id) ON DELETE CASCADE NOT NULL,
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

-- Políticas RLS para campeonatos (todos podem ver)
CREATE POLICY "Todos podem ver campeonatos" 
  ON public.campeonatos 
  FOR SELECT 
  TO authenticated 
  USING (true);

-- Políticas RLS para rodadas (todos podem ver)
CREATE POLICY "Todos podem ver rodadas" 
  ON public.rodadas 
  FOR SELECT 
  TO authenticated 
  USING (true);

-- Políticas RLS para jogos (todos podem ver)
CREATE POLICY "Todos podem ver jogos" 
  ON public.jogos 
  FOR SELECT 
  TO authenticated 
  USING (true);

-- Políticas RLS para salas
CREATE POLICY "Todos podem ver salas públicas e gerais" 
  ON public.salas 
  FOR SELECT 
  TO authenticated 
  USING (tipo IN ('geral', 'publica'));

CREATE POLICY "Participantes podem ver salas privadas" 
  ON public.salas 
  FOR SELECT 
  TO authenticated 
  USING (
    tipo = 'privada' AND 
    (dono_id = auth.uid() OR 
     EXISTS (SELECT 1 FROM public.participantes WHERE sala_id = id AND usuario_id = auth.uid()))
  );

CREATE POLICY "Usuários podem criar salas" 
  ON public.salas 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (dono_id = auth.uid());

CREATE POLICY "Donos podem atualizar suas salas" 
  ON public.salas 
  FOR UPDATE 
  TO authenticated 
  USING (dono_id = auth.uid());

-- Políticas RLS para participantes
CREATE POLICY "Participantes podem ver participantes da mesma sala" 
  ON public.participantes 
  FOR SELECT 
  TO authenticated 
  USING (
    EXISTS (SELECT 1 FROM public.participantes WHERE sala_id = participantes.sala_id AND usuario_id = auth.uid())
  );

CREATE POLICY "Usuários podem se inscrever em salas" 
  ON public.participantes 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (usuario_id = auth.uid());

-- Políticas RLS para apostas
CREATE POLICY "Usuários podem ver apostas de salas que participam" 
  ON public.apostas 
  FOR SELECT 
  TO authenticated 
  USING (
    EXISTS (SELECT 1 FROM public.participantes WHERE sala_id = apostas.sala_id AND usuario_id = auth.uid())
  );

CREATE POLICY "Usuários podem criar suas próprias apostas" 
  ON public.apostas 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (usuario_id = auth.uid());

CREATE POLICY "Usuários podem atualizar suas próprias apostas" 
  ON public.apostas 
  FOR UPDATE 
  TO authenticated 
  USING (usuario_id = auth.uid());

-- Políticas RLS para ranking
CREATE POLICY "Participantes podem ver ranking de salas que participam" 
  ON public.ranking 
  FOR SELECT 
  TO authenticated 
  USING (
    EXISTS (SELECT 1 FROM public.participantes WHERE sala_id = ranking.sala_id AND usuario_id = auth.uid())
  );

-- Função para gerar código de acesso para salas privadas
CREATE OR REPLACE FUNCTION public.generate_room_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  code TEXT;
BEGIN
  code := upper(substring(gen_random_uuid()::text from 1 for 8));
  RETURN code;
END;
$$;

-- Trigger para gerar código de acesso automaticamente para salas privadas
CREATE OR REPLACE FUNCTION public.handle_new_private_room()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.tipo = 'privada' AND NEW.codigo_acesso IS NULL THEN
    NEW.codigo_acesso := public.generate_room_code();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_private_room_created
  BEFORE INSERT ON public.salas
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_private_room();

-- Função para adicionar automaticamente o dono como participante
CREATE OR REPLACE FUNCTION public.add_owner_as_participant()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.participantes (usuario_id, sala_id)
  VALUES (NEW.dono_id, NEW.id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_room_created_add_owner
  AFTER INSERT ON public.salas
  FOR EACH ROW EXECUTE FUNCTION public.add_owner_as_participant();

-- Função para inicializar ranking quando usuário entra em sala
CREATE OR REPLACE FUNCTION public.initialize_user_ranking()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.ranking (usuario_id, sala_id, pontos, creditos_ganhos)
  VALUES (NEW.usuario_id, NEW.sala_id, 0, 0)
  ON CONFLICT (usuario_id, sala_id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_participant_added
  AFTER INSERT ON public.participantes
  FOR EACH ROW EXECUTE FUNCTION public.initialize_user_ranking();
