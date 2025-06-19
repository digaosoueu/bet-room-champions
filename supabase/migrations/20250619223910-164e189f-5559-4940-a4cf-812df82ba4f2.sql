
-- Criar o Campeonato Brasileiro 2025
INSERT INTO public.campeonatos (nome, temporada, ativo)
VALUES ('Campeonato Brasileiro 2025', '2025', true);

-- Criar as 38 rodadas do campeonato com datas válidas
-- Começando em abril de 2025 e distribuindo ao longo do ano
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

-- Criar a sala geral padrão para o Campeonato Brasileiro 2025
WITH campeonato_brasileiro AS (
  SELECT id FROM public.campeonatos WHERE nome = 'Campeonato Brasileiro 2025' AND temporada = '2025'
),
admin_user AS (
  SELECT id FROM public.usuarios LIMIT 1
)
INSERT INTO public.salas (nome, tipo, valor_aposta, campeonato_id, dono_id)
SELECT 
  'Sala Geral - Brasileirão 2025',
  'geral'::tipo_sala,
  0,
  cb.id,
  au.id
FROM campeonato_brasileiro cb, admin_user au
WHERE NOT EXISTS (
  SELECT 1 FROM public.salas s 
  JOIN campeonato_brasileiro cb2 ON s.campeonato_id = cb2.id 
  WHERE s.tipo = 'geral'
);

-- Adicionar configuração para apostas extras
CREATE TABLE IF NOT EXISTS public.configuracoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chave TEXT NOT NULL UNIQUE,
  valor TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Inserir configurações padrão
INSERT INTO public.configuracoes (chave, valor) 
VALUES 
  ('limite_apostas_extras_por_rodada', '10'),
  ('valor_segunda_aposta', '50'),
  ('valor_terceira_aposta', '100')
ON CONFLICT (chave) DO UPDATE SET 
  valor = EXCLUDED.valor,
  updated_at = now();
