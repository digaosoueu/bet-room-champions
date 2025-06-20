
-- Atualizar as datas das rodadas conforme fornecido
UPDATE public.rodadas SET 
  data_inicio = '2025-04-01', data_fim = '2025-04-03' WHERE numero = 1;
UPDATE public.rodadas SET 
  data_inicio = '2025-04-08', data_fim = '2025-04-10' WHERE numero = 2;
UPDATE public.rodadas SET 
  data_inicio = '2025-04-15', data_fim = '2025-04-17' WHERE numero = 3;
UPDATE public.rodadas SET 
  data_inicio = '2025-04-22', data_fim = '2025-04-24' WHERE numero = 4;
UPDATE public.rodadas SET 
  data_inicio = '2025-04-29', data_fim = '2025-05-01' WHERE numero = 5;
UPDATE public.rodadas SET 
  data_inicio = '2025-05-06', data_fim = '2025-05-08' WHERE numero = 6;
UPDATE public.rodadas SET 
  data_inicio = '2025-05-13', data_fim = '2025-05-15' WHERE numero = 7;
UPDATE public.rodadas SET 
  data_inicio = '2025-05-20', data_fim = '2025-05-22' WHERE numero = 8;
UPDATE public.rodadas SET 
  data_inicio = '2025-05-27', data_fim = '2025-05-29' WHERE numero = 9;
UPDATE public.rodadas SET 
  data_inicio = '2025-06-03', data_fim = '2025-06-05' WHERE numero = 10;
UPDATE public.rodadas SET 
  data_inicio = '2025-06-10', data_fim = '2025-06-12' WHERE numero = 11;
UPDATE public.rodadas SET 
  data_inicio = '2025-06-17', data_fim = '2025-06-19' WHERE numero = 12;
UPDATE public.rodadas SET 
  data_inicio = '2025-06-24', data_fim = '2025-06-26' WHERE numero = 13;
UPDATE public.rodadas SET 
  data_inicio = '2025-07-01', data_fim = '2025-07-03' WHERE numero = 14;
UPDATE public.rodadas SET 
  data_inicio = '2025-07-08', data_fim = '2025-07-10' WHERE numero = 15;
UPDATE public.rodadas SET 
  data_inicio = '2025-07-15', data_fim = '2025-07-17' WHERE numero = 16;
UPDATE public.rodadas SET 
  data_inicio = '2025-07-22', data_fim = '2025-07-24' WHERE numero = 17;
UPDATE public.rodadas SET 
  data_inicio = '2025-07-29', data_fim = '2025-07-31' WHERE numero = 18;
UPDATE public.rodadas SET 
  data_inicio = '2025-08-05', data_fim = '2025-08-07' WHERE numero = 19;
UPDATE public.rodadas SET 
  data_inicio = '2025-08-12', data_fim = '2025-08-14' WHERE numero = 20;
UPDATE public.rodadas SET 
  data_inicio = '2025-08-19', data_fim = '2025-08-21' WHERE numero = 21;
UPDATE public.rodadas SET 
  data_inicio = '2025-08-26', data_fim = '2025-08-28' WHERE numero = 22;
UPDATE public.rodadas SET 
  data_inicio = '2025-09-02', data_fim = '2025-09-04' WHERE numero = 23;
UPDATE public.rodadas SET 
  data_inicio = '2025-09-09', data_fim = '2025-09-11' WHERE numero = 24;
UPDATE public.rodadas SET 
  data_inicio = '2025-09-16', data_fim = '2025-09-18' WHERE numero = 25;
UPDATE public.rodadas SET 
  data_inicio = '2025-09-23', data_fim = '2025-09-25' WHERE numero = 26;
UPDATE public.rodadas SET 
  data_inicio = '2025-09-30', data_fim = '2025-10-02' WHERE numero = 27;
UPDATE public.rodadas SET 
  data_inicio = '2025-10-07', data_fim = '2025-10-09' WHERE numero = 28;
UPDATE public.rodadas SET 
  data_inicio = '2025-10-14', data_fim = '2025-10-16' WHERE numero = 29;
UPDATE public.rodadas SET 
  data_inicio = '2025-10-21', data_fim = '2025-10-23' WHERE numero = 30;
UPDATE public.rodadas SET 
  data_inicio = '2025-10-28', data_fim = '2025-10-30' WHERE numero = 31;
UPDATE public.rodadas SET 
  data_inicio = '2025-11-04', data_fim = '2025-11-06' WHERE numero = 32;
UPDATE public.rodadas SET 
  data_inicio = '2025-11-11', data_fim = '2025-11-13' WHERE numero = 33;
UPDATE public.rodadas SET 
  data_inicio = '2025-11-18', data_fim = '2025-11-20' WHERE numero = 34;
UPDATE public.rodadas SET 
  data_inicio = '2025-11-25', data_fim = '2025-11-27' WHERE numero = 35;
UPDATE public.rodadas SET 
  data_inicio = '2025-12-02', data_fim = '2025-12-04' WHERE numero = 36;
UPDATE public.rodadas SET 
  data_inicio = '2025-12-09', data_fim = '2025-12-11' WHERE numero = 37;
UPDATE public.rodadas SET 
  data_inicio = '2025-12-16', data_fim = '2025-12-18' WHERE numero = 38;

-- Inserir jogos da Rodada 1
WITH rodada_1 AS (SELECT id FROM public.rodadas WHERE numero = 1)
INSERT INTO public.jogos (rodada_id, time1, time2, data_jogo) 
SELECT r.id, 'Flamengo', 'Palmeiras', '2025-04-01T20:00:00-03:00' FROM rodada_1 r;

WITH rodada_1 AS (SELECT id FROM public.rodadas WHERE numero = 1)
INSERT INTO public.jogos (rodada_id, time1, time2, data_jogo) 
SELECT r.id, 'Palmeiras', 'Flamengo', '2025-04-02T20:00:00-03:00' FROM rodada_1 r;

WITH rodada_1 AS (SELECT id FROM public.rodadas WHERE numero = 1)
INSERT INTO public.jogos (rodada_id, time1, time2, data_jogo) 
SELECT r.id, 'Flamengo', 'Corinthians', '2025-04-03T20:00:00-03:00' FROM rodada_1 r;

WITH rodada_1 AS (SELECT id FROM public.rodadas WHERE numero = 1)
INSERT INTO public.jogos (rodada_id, time1, time2, data_jogo) 
SELECT r.id, 'Corinthians', 'Flamengo', '2025-04-01T21:00:00-03:00' FROM rodada_1 r;

WITH rodada_1 AS (SELECT id FROM public.rodadas WHERE numero = 1)
INSERT INTO public.jogos (rodada_id, time1, time2, data_jogo) 
SELECT r.id, 'Flamengo', 'São Paulo', '2025-04-02T21:00:00-03:00' FROM rodada_1 r;

WITH rodada_1 AS (SELECT id FROM public.rodadas WHERE numero = 1)
INSERT INTO public.jogos (rodada_id, time1, time2, data_jogo) 
SELECT r.id, 'São Paulo', 'Flamengo', '2025-04-03T21:00:00-03:00' FROM rodada_1 r;

WITH rodada_1 AS (SELECT id FROM public.rodadas WHERE numero = 1)
INSERT INTO public.jogos (rodada_id, time1, time2, data_jogo) 
SELECT r.id, 'Flamengo', 'Fluminense', '2025-04-01T19:00:00-03:00' FROM rodada_1 r;

WITH rodada_1 AS (SELECT id FROM public.rodadas WHERE numero = 1)
INSERT INTO public.jogos (rodada_id, time1, time2, data_jogo) 
SELECT r.id, 'Fluminense', 'Flamengo', '2025-04-02T19:00:00-03:00' FROM rodada_1 r;

WITH rodada_1 AS (SELECT id FROM public.rodadas WHERE numero = 1)
INSERT INTO public.jogos (rodada_id, time1, time2, data_jogo) 
SELECT r.id, 'Flamengo', 'Botafogo', '2025-04-03T19:00:00-03:00' FROM rodada_1 r;

WITH rodada_1 AS (SELECT id FROM public.rodadas WHERE numero = 1)
INSERT INTO public.jogos (rodada_id, time1, time2, data_jogo) 
SELECT r.id, 'Botafogo', 'Flamengo', '2025-04-01T18:00:00-03:00' FROM rodada_1 r;

-- Inserir jogos da Rodada 2
WITH rodada_2 AS (SELECT id FROM public.rodadas WHERE numero = 2)
INSERT INTO public.jogos (rodada_id, time1, time2, data_jogo) 
SELECT r.id, 'Flamengo', 'Vasco da Gama', '2025-04-09T20:00:00-03:00' FROM rodada_2 r;

WITH rodada_2 AS (SELECT id FROM public.rodadas WHERE numero = 2)
INSERT INTO public.jogos (rodada_id, time1, time2, data_jogo) 
SELECT r.id, 'Vasco da Gama', 'Flamengo', '2025-04-10T20:00:00-03:00' FROM rodada_2 r;

WITH rodada_2 AS (SELECT id FROM public.rodadas WHERE numero = 2)
INSERT INTO public.jogos (rodada_id, time1, time2, data_jogo) 
SELECT r.id, 'Flamengo', 'Santos', '2025-04-08T20:00:00-03:00' FROM rodada_2 r;

WITH rodada_2 AS (SELECT id FROM public.rodadas WHERE numero = 2)
INSERT INTO public.jogos (rodada_id, time1, time2, data_jogo) 
SELECT r.id, 'Santos', 'Flamengo', '2025-04-09T21:00:00-03:00' FROM rodada_2 r;

WITH rodada_2 AS (SELECT id FROM public.rodadas WHERE numero = 2)
INSERT INTO public.jogos (rodada_id, time1, time2, data_jogo) 
SELECT r.id, 'Flamengo', 'Grêmio', '2025-04-10T21:00:00-03:00' FROM rodada_2 r;

WITH rodada_2 AS (SELECT id FROM public.rodadas WHERE numero = 2)
INSERT INTO public.jogos (rodada_id, time1, time2, data_jogo) 
SELECT r.id, 'Grêmio', 'Flamengo', '2025-04-08T21:00:00-03:00' FROM rodada_2 r;

WITH rodada_2 AS (SELECT id FROM public.rodadas WHERE numero = 2)
INSERT INTO public.jogos (rodada_id, time1, time2, data_jogo) 
SELECT r.id, 'Flamengo', 'Internacional', '2025-04-09T19:00:00-03:00' FROM rodada_2 r;

WITH rodada_2 AS (SELECT id FROM public.rodadas WHERE numero = 2)
INSERT INTO public.jogos (rodada_id, time1, time2, data_jogo) 
SELECT r.id, 'Internacional', 'Flamengo', '2025-04-10T19:00:00-03:00' FROM rodada_2 r;

WITH rodada_2 AS (SELECT id FROM public.rodadas WHERE numero = 2)
INSERT INTO public.jogos (rodada_id, time1, time2, data_jogo) 
SELECT r.id, 'Flamengo', 'Atlético Mineiro', '2025-04-08T19:00:00-03:00' FROM rodada_2 r;

WITH rodada_2 AS (SELECT id FROM public.rodadas WHERE numero = 2)
INSERT INTO public.jogos (rodada_id, time1, time2, data_jogo) 
SELECT r.id, 'Atlético Mineiro', 'Flamengo', '2025-04-09T18:00:00-03:00' FROM rodada_2 r;

-- Inserir mais jogos das outras rodadas (sample)
WITH rodada_3 AS (SELECT id FROM public.rodadas WHERE numero = 3)
INSERT INTO public.jogos (rodada_id, time1, time2, data_jogo) 
SELECT r.id, 'Flamengo', 'Cruzeiro', '2025-04-17T20:00:00-03:00' FROM rodada_3 r;

WITH rodada_3 AS (SELECT id FROM public.rodadas WHERE numero = 3)
INSERT INTO public.jogos (rodada_id, time1, time2, data_jogo) 
SELECT r.id, 'Cruzeiro', 'Flamengo', '2025-04-15T20:00:00-03:00' FROM rodada_3 r;

WITH rodada_4 AS (SELECT id FROM public.rodadas WHERE numero = 4)
INSERT INTO public.jogos (rodada_id, time1, time2, data_jogo) 
SELECT r.id, 'Palmeiras', 'Corinthians', '2025-04-24T20:00:00-03:00' FROM rodada_4 r;

WITH rodada_4 AS (SELECT id FROM public.rodadas WHERE numero = 4)
INSERT INTO public.jogos (rodada_id, time1, time2, data_jogo) 
SELECT r.id, 'Corinthians', 'Palmeiras', '2025-04-22T20:00:00-03:00' FROM rodada_4 r;

WITH rodada_5 AS (SELECT id FROM public.rodadas WHERE numero = 5)
INSERT INTO public.jogos (rodada_id, time1, time2, data_jogo) 
SELECT r.id, 'Palmeiras', 'São Paulo', '2025-04-30T20:00:00-03:00' FROM rodada_5 r;

WITH rodada_5 AS (SELECT id FROM public.rodadas WHERE numero = 5)
INSERT INTO public.jogos (rodada_id, time1, time2, data_jogo) 
SELECT r.id, 'São Paulo', 'Palmeiras', '2025-05-01T20:00:00-03:00' FROM rodada_5 r;
