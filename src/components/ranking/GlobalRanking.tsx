
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Trophy, Coins, Users } from 'lucide-react';

interface GlobalRankingProps {
  onBack: () => void;
}

const GlobalRanking = ({ onBack }: GlobalRankingProps) => {
  // Dados mock para demonstração
  const [globalRanking] = useState([
    { posicao: 1, nome: 'João Silva', pontos: 15420, creditos_ganhos: 89500, salas_participando: 12 },
    { posicao: 2, nome: 'Maria Santos', pontos: 14850, creditos_ganhos: 78200, salas_participando: 10 },
    { posicao: 3, nome: 'Pedro Oliveira', pontos: 13980, creditos_ganhos: 65800, salas_participando: 15 },
    { posicao: 4, nome: 'Ana Costa', pontos: 12750, creditos_ganhos: 52900, salas_participando: 8 },
    { posicao: 5, nome: 'Carlos Lima', pontos: 11880, creditos_ganhos: 48600, salas_participando: 11 },
    { posicao: 6, nome: 'Lucia Pereira', pontos: 10950, creditos_ganhos: 42300, salas_participando: 9 },
    { posicao: 7, nome: 'Roberto Dias', pontos: 9820, creditos_ganhos: 38100, salas_participando: 13 },
    { posicao: 8, nome: 'Sandra Alves', pontos: 9240, creditos_ganhos: 34800, salas_participando: 7 },
    { posicao: 9, nome: 'Fernando Cruz', pontos: 8650, creditos_ganhos: 31200, salas_participando: 14 },
    { posicao: 10, nome: 'Carla Mendes', pontos: 8120, creditos_ganhos: 28900, salas_participando: 6 },
  ]);

  const getPositionColor = (posicao: number) => {
    switch (posicao) {
      case 1:
        return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200';
      case 2:
        return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200';
      case 3:
        return 'bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200';
      default:
        return 'bg-white border-gray-200';
    }
  };

  const getPositionEmoji = (posicao: number) => {
    switch (posicao) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4 hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div className="text-center">
            <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Ranking Geral</h1>
            <p className="text-gray-600 text-lg">Os melhores apostadores de todas as salas</p>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>🏆 Hall da Fama</CardTitle>
            <CardDescription>
              Top apostadores com base em pontos acumulados em todas as salas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {globalRanking.map((entry, index) => (
                <div
                  key={entry.posicao}
                  className={`p-6 rounded-lg border transition-all duration-200 hover:shadow-lg ${getPositionColor(entry.posicao)}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-center min-w-[60px]">
                        {entry.posicao <= 3 ? (
                          <div className="text-3xl">{getPositionEmoji(entry.posicao)}</div>
                        ) : (
                          <div className="text-2xl font-bold text-gray-500">#{entry.posicao}</div>
                        )}
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{entry.nome}</h3>
                        <div className="flex items-center space-x-6 text-sm text-gray-600 mt-1">
                          <div className="flex items-center space-x-1">
                            <Trophy className="h-4 w-4 text-yellow-600" />
                            <span className="font-medium">{entry.pontos.toLocaleString()} pts</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Coins className="h-4 w-4 text-emerald-600" />
                            <span className="font-medium">+{entry.creditos_ganhos.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4 text-blue-600" />
                            <span>{entry.salas_participando} salas</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {entry.posicao <= 3 && (
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-600">
                          {entry.posicao === 1 ? 'Campeão' : entry.posicao === 2 ? 'Vice-Campeão' : '3º Lugar'}
                        </div>
                        <div className="text-xs text-gray-500">
                          Parabéns! 🎉
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-gray-600">
          <p>Ranking atualizado em tempo real baseado no desempenho em todas as salas.</p>
        </div>
      </div>
    </div>
  );
};

export default GlobalRanking;
