
-- Primeiro, vamos atualizar as datas das rodadas para corresponder aos seus dados
UPDATE public.rodadas SET 
  data_inicio = '2025-04-01',
  data_fim = '2025-04-03'
WHERE numero = 1;

UPDATE public.rodadas SET 
  data_inicio = '2025-04-08',
  data_fim = '2025-04-10'
WHERE numero = 2;

UPDATE public.rodadas SET 
  data_inicio = '2025-04-15',
  data_fim = '2025-04-17'
WHERE numero = 3;

UPDATE public.rodadas SET 
  data_inicio = '2025-04-22',
  data_fim = '2025-04-24'
WHERE numero = 4;

UPDATE public.rodadas SET 
  data_inicio = '2025-04-29',
  data_fim = '2025-05-01'
WHERE numero = 5;

UPDATE public.rodadas SET 
  data_inicio = '2025-05-06',
  data_fim = '2025-05-08'
WHERE numero = 6;

UPDATE public.rodadas SET 
  data_inicio = '2025-05-13',
  data_fim = '2025-05-15'
WHERE numero = 7;

UPDATE public.rodadas SET 
  data_inicio = '2025-05-20',
  data_fim = '2025-05-22'
WHERE numero = 8;

UPDATE public.rodadas SET 
  data_inicio = '2025-05-27',
  data_fim = '2025-05-29'
WHERE numero = 9;

UPDATE public.rodadas SET 
  data_inicio = '2025-06-03',
  data_fim = '2025-06-05'
WHERE numero = 10;

UPDATE public.rodadas SET 
  data_inicio = '2025-06-10',
  data_fim = '2025-06-12'
WHERE numero = 11;

UPDATE public.rodadas SET 
  data_inicio = '2025-06-17',
  data_fim = '2025-06-19'
WHERE numero = 12;

UPDATE public.rodadas SET 
  data_inicio = '2025-06-24',
  data_fim = '2025-06-26'
WHERE numero = 13;

UPDATE public.rodadas SET 
  data_inicio = '2025-07-01',
  data_fim = '2025-07-03'
WHERE numero = 14;

UPDATE public.rodadas SET 
  data_inicio = '2025-07-08',
  data_fim = '2025-07-10'
WHERE numero = 15;

-- Agora vamos inserir os jogos das primeiras 15 rodadas
WITH campeonato_brasileiro AS (
  SELECT id FROM public.campeonatos WHERE nome = 'Campeonato Brasileiro 2025' AND temporada = '2025'
),
rodadas_map AS (
  SELECT 
    r.id as rodada_id,
    r.numero
  FROM public.rodadas r
  JOIN campeonato_brasileiro cb ON r.campeonato_id = cb.id
  WHERE r.numero <= 15
)
INSERT INTO public.jogos (rodada_id, time1, time2, data_jogo)
SELECT 
  rm.rodada_id,
  jogos_data.time1,
  jogos_data.time2,
  jogos_data.data_jogo::timestamp with time zone
FROM rodadas_map rm
JOIN (
  VALUES
  -- Rodada 1
  (1, 'Flamengo', 'Palmeiras', '2025-04-01 20:00:00'),
  (1, 'Palmeiras', 'Flamengo', '2025-04-02 20:00:00'),
  (1, 'Flamengo', 'Corinthians', '2025-04-03 20:00:00'),
  (1, 'Corinthians', 'Flamengo', '2025-04-01 16:00:00'),
  (1, 'Flamengo', 'São Paulo', '2025-04-02 16:00:00'),
  (1, 'São Paulo', 'Flamengo', '2025-04-03 16:00:00'),
  (1, 'Flamengo', 'Fluminense', '2025-04-01 18:00:00'),
  (1, 'Fluminense', 'Flamengo', '2025-04-02 18:00:00'),
  (1, 'Flamengo', 'Botafogo', '2025-04-03 18:00:00'),
  (1, 'Botafogo', 'Flamengo', '2025-04-01 21:00:00'),
  
  -- Rodada 2
  (2, 'Flamengo', 'Vasco da Gama', '2025-04-09 20:00:00'),
  (2, 'Vasco da Gama', 'Flamengo', '2025-04-10 20:00:00'),
  (2, 'Flamengo', 'Santos', '2025-04-08 20:00:00'),
  (2, 'Santos', 'Flamengo', '2025-04-09 16:00:00'),
  (2, 'Flamengo', 'Grêmio', '2025-04-10 16:00:00'),
  (2, 'Grêmio', 'Flamengo', '2025-04-08 16:00:00'),
  (2, 'Flamengo', 'Internacional', '2025-04-09 18:00:00'),
  (2, 'Internacional', 'Flamengo', '2025-04-10 18:00:00'),
  (2, 'Flamengo', 'Atlético Mineiro', '2025-04-08 18:00:00'),
  (2, 'Atlético Mineiro', 'Flamengo', '2025-04-09 21:00:00'),
  
  -- Rodada 3
  (3, 'Flamengo', 'Cruzeiro', '2025-04-17 20:00:00'),
  (3, 'Cruzeiro', 'Flamengo', '2025-04-15 20:00:00'),
  (3, 'Flamengo', 'Athletico Paranaense', '2025-04-16 20:00:00'),
  (3, 'Athletico Paranaense', 'Flamengo', '2025-04-17 16:00:00'),
  (3, 'Flamengo', 'Coritiba', '2025-04-15 16:00:00'),
  (3, 'Coritiba', 'Flamengo', '2025-04-16 16:00:00'),
  (3, 'Flamengo', 'Bahia', '2025-04-17 18:00:00'),
  (3, 'Bahia', 'Flamengo', '2025-04-15 18:00:00'),
  (3, 'Flamengo', 'Fortaleza', '2025-04-16 18:00:00'),
  (3, 'Fortaleza', 'Flamengo', '2025-04-17 21:00:00'),
  
  -- Rodada 4
  (4, 'Flamengo', 'Ceará', '2025-04-22 20:00:00'),
  (4, 'Ceará', 'Flamengo', '2025-04-23 20:00:00'),
  (4, 'Flamengo', 'Goiás', '2025-04-24 20:00:00'),
  (4, 'Goiás', 'Flamengo', '2025-04-22 16:00:00'),
  (4, 'Flamengo', 'Red Bull Bragantino', '2025-04-23 16:00:00'),
  (4, 'Red Bull Bragantino', 'Flamengo', '2025-04-24 16:00:00'),
  (4, 'Flamengo', 'Juventude', '2025-04-22 18:00:00'),
  (4, 'Juventude', 'Flamengo', '2025-04-23 18:00:00'),
  (4, 'Palmeiras', 'Corinthians', '2025-04-24 18:00:00'),
  (4, 'Corinthians', 'Palmeiras', '2025-04-22 21:00:00'),
  
  -- Rodada 5
  (5, 'Palmeiras', 'São Paulo', '2025-04-30 20:00:00'),
  (5, 'São Paulo', 'Palmeiras', '2025-05-01 20:00:00'),
  (5, 'Palmeiras', 'Fluminense', '2025-04-29 20:00:00'),
  (5, 'Fluminense', 'Palmeiras', '2025-04-30 16:00:00'),
  (5, 'Palmeiras', 'Botafogo', '2025-05-01 16:00:00'),
  (5, 'Botafogo', 'Palmeiras', '2025-04-29 16:00:00'),
  (5, 'Palmeiras', 'Vasco da Gama', '2025-04-30 18:00:00'),
  (5, 'Vasco da Gama', 'Palmeiras', '2025-05-01 18:00:00'),
  (5, 'Palmeiras', 'Santos', '2025-04-29 18:00:00'),
  (5, 'Santos', 'Palmeiras', '2025-04-30 21:00:00'),
  
  -- Rodada 6
  (6, 'Palmeiras', 'Grêmio', '2025-05-08 20:00:00'),
  (6, 'Grêmio', 'Palmeiras', '2025-05-06 20:00:00'),
  (6, 'Palmeiras', 'Internacional', '2025-05-07 20:00:00'),
  (6, 'Internacional', 'Palmeiras', '2025-05-08 16:00:00'),
  (6, 'Palmeiras', 'Atlético Mineiro', '2025-05-06 16:00:00'),
  (6, 'Atlético Mineiro', 'Palmeiras', '2025-05-07 16:00:00'),
  (6, 'Palmeiras', 'Cruzeiro', '2025-05-08 18:00:00'),
  (6, 'Cruzeiro', 'Palmeiras', '2025-05-06 18:00:00'),
  (6, 'Palmeiras', 'Athletico Paranaense', '2025-05-07 18:00:00'),
  (6, 'Athletico Paranaense', 'Palmeiras', '2025-05-08 21:00:00'),
  
  -- Rodada 7
  (7, 'Palmeiras', 'Coritiba', '2025-05-13 20:00:00'),
  (7, 'Coritiba', 'Palmeiras', '2025-05-14 20:00:00'),
  (7, 'Palmeiras', 'Bahia', '2025-05-15 20:00:00'),
  (7, 'Bahia', 'Palmeiras', '2025-05-13 16:00:00'),
  (7, 'Palmeiras', 'Fortaleza', '2025-05-14 16:00:00'),
  (7, 'Fortaleza', 'Palmeiras', '2025-05-15 16:00:00'),
  (7, 'Palmeiras', 'Ceará', '2025-05-13 18:00:00'),
  (7, 'Ceará', 'Palmeiras', '2025-05-14 18:00:00'),
  (7, 'Palmeiras', 'Goiás', '2025-05-15 18:00:00'),
  (7, 'Goiás', 'Palmeiras', '2025-05-13 21:00:00'),
  
  -- Rodada 8
  (8, 'Palmeiras', 'Red Bull Bragantino', '2025-05-21 20:00:00'),
  (8, 'Red Bull Bragantino', 'Palmeiras', '2025-05-22 20:00:00'),
  (8, 'Palmeiras', 'Juventude', '2025-05-20 20:00:00'),
  (8, 'Juventude', 'Palmeiras', '2025-05-21 16:00:00'),
  (8, 'Corinthians', 'São Paulo', '2025-05-22 16:00:00'),
  (8, 'São Paulo', 'Corinthians', '2025-05-20 16:00:00'),
  (8, 'Corinthians', 'Fluminense', '2025-05-21 18:00:00'),
  (8, 'Fluminense', 'Corinthians', '2025-05-22 18:00:00'),
  (8, 'Corinthians', 'Botafogo', '2025-05-20 18:00:00'),
  (8, 'Botafogo', 'Corinthians', '2025-05-21 21:00:00'),
  
  -- Rodada 9
  (9, 'Corinthians', 'Vasco da Gama', '2025-05-29 20:00:00'),
  (9, 'Vasco da Gama', 'Corinthians', '2025-05-27 20:00:00'),
  (9, 'Corinthians', 'Santos', '2025-05-28 20:00:00'),
  (9, 'Santos', 'Corinthians', '2025-05-29 16:00:00'),
  (9, 'Corinthians', 'Grêmio', '2025-05-27 16:00:00'),
  (9, 'Grêmio', 'Corinthians', '2025-05-28 16:00:00'),
  (9, 'Corinthians', 'Internacional', '2025-05-29 18:00:00'),
  (9, 'Internacional', 'Corinthians', '2025-05-27 18:00:00'),
  (9, 'Corinthians', 'Atlético Mineiro', '2025-05-28 18:00:00'),
  (9, 'Atlético Mineiro', 'Corinthians', '2025-05-29 21:00:00'),
  
  -- Rodada 10
  (10, 'Corinthians', 'Cruzeiro', '2025-06-03 20:00:00'),
  (10, 'Cruzeiro', 'Corinthians', '2025-06-04 20:00:00'),
  (10, 'Corinthians', 'Athletico Paranaense', '2025-06-05 20:00:00'),
  (10, 'Athletico Paranaense', 'Corinthians', '2025-06-03 16:00:00'),
  (10, 'Corinthians', 'Coritiba', '2025-06-04 16:00:00'),
  (10, 'Coritiba', 'Corinthians', '2025-06-05 16:00:00'),
  (10, 'Corinthians', 'Bahia', '2025-06-03 18:00:00'),
  (10, 'Bahia', 'Corinthians', '2025-06-04 18:00:00'),
  (10, 'Corinthians', 'Fortaleza', '2025-06-05 18:00:00'),
  (10, 'Fortaleza', 'Corinthians', '2025-06-03 21:00:00'),
  
  -- Rodada 11
  (11, 'Corinthians', 'Ceará', '2025-06-11 20:00:00'),
  (11, 'Ceará', 'Corinthians', '2025-06-12 20:00:00'),
  (11, 'Corinthians', 'Goiás', '2025-06-10 20:00:00'),
  (11, 'Goiás', 'Corinthians', '2025-06-11 16:00:00'),
  (11, 'Corinthians', 'Red Bull Bragantino', '2025-06-12 16:00:00'),
  (11, 'Red Bull Bragantino', 'Corinthians', '2025-06-10 16:00:00'),
  (11, 'Corinthians', 'Juventude', '2025-06-11 18:00:00'),
  (11, 'Juventude', 'Corinthians', '2025-06-12 18:00:00'),
  (11, 'São Paulo', 'Fluminense', '2025-06-10 18:00:00'),
  (11, 'Fluminense', 'São Paulo', '2025-06-11 21:00:00'),
  
  -- Rodada 12
  (12, 'São Paulo', 'Botafogo', '2025-06-19 20:00:00'),
  (12, 'Botafogo', 'São Paulo', '2025-06-17 20:00:00'),
  (12, 'São Paulo', 'Vasco da Gama', '2025-06-18 20:00:00'),
  (12, 'Vasco da Gama', 'São Paulo', '2025-06-19 16:00:00'),
  (12, 'São Paulo', 'Santos', '2025-06-17 16:00:00'),
  (12, 'Santos', 'São Paulo', '2025-06-18 16:00:00'),
  (12, 'São Paulo', 'Grêmio', '2025-06-19 18:00:00'),
  (12, 'Grêmio', 'São Paulo', '2025-06-17 18:00:00'),
  (12, 'São Paulo', 'Internacional', '2025-06-18 18:00:00'),
  (12, 'Internacional', 'São Paulo', '2025-06-19 21:00:00'),
  
  -- Rodada 13
  (13, 'São Paulo', 'Atlético Mineiro', '2025-06-24 20:00:00'),
  (13, 'Atlético Mineiro', 'São Paulo', '2025-06-25 20:00:00'),
  (13, 'São Paulo', 'Cruzeiro', '2025-06-26 20:00:00'),
  (13, 'Cruzeiro', 'São Paulo', '2025-06-24 16:00:00'),
  (13, 'São Paulo', 'Athletico Paranaense', '2025-06-25 16:00:00'),
  (13, 'Athletico Paranaense', 'São Paulo', '2025-06-26 16:00:00'),
  (13, 'São Paulo', 'Coritiba', '2025-06-24 18:00:00'),
  (13, 'Coritiba', 'São Paulo', '2025-06-25 18:00:00'),
  (13, 'São Paulo', 'Bahia', '2025-06-26 18:00:00'),
  (13, 'Bahia', 'São Paulo', '2025-06-24 21:00:00'),
  
  -- Rodada 14
  (14, 'São Paulo', 'Fortaleza', '2025-07-02 20:00:00'),
  (14, 'Fortaleza', 'São Paulo', '2025-07-03 20:00:00'),
  (14, 'São Paulo', 'Ceará', '2025-07-01 20:00:00'),
  (14, 'Ceará', 'São Paulo', '2025-07-02 16:00:00'),
  (14, 'São Paulo', 'Goiás', '2025-07-03 16:00:00'),
  (14, 'Goiás', 'São Paulo', '2025-07-01 16:00:00'),
  (14, 'São Paulo', 'Red Bull Bragantino', '2025-07-02 18:00:00'),
  (14, 'Red Bull Bragantino', 'São Paulo', '2025-07-03 18:00:00'),
  (14, 'São Paulo', 'Juventude', '2025-07-01 18:00:00'),
  (14, 'Juventude', 'São Paulo', '2025-07-02 21:00:00'),
  
  -- Rodada 15
  (15, 'Fluminense', 'Botafogo', '2025-07-10 20:00:00'),
  (15, 'Botafogo', 'Fluminense', '2025-07-08 20:00:00'),
  (15, 'Fluminense', 'Vasco da Gama', '2025-07-09 20:00:00'),
  (15, 'Vasco da Gama', 'Fluminense', '2025-07-10 16:00:00'),
  (15, 'Fluminense', 'Santos', '2025-07-08 16:00:00'),
  (15, 'Santos', 'Fluminense', '2025-07-09 16:00:00'),
  (15, 'Fluminense', 'Grêmio', '2025-07-10 18:00:00'),
  (15, 'Grêmio', 'Fluminense', '2025-07-08 18:00:00'),
  (15, 'Fluminense', 'Internacional', '2025-07-09 18:00:00'),
  (15, 'Internacional', 'Fluminense', '2025-07-10 21:00:00')
) AS jogos_data(numero_rodada, time1, time2, data_jogo)
ON rm.numero = jogos_data.numero_rodada;
