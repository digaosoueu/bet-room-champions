
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, Coins } from 'lucide-react';

interface RankingEntry {
  posicao: number;
  nome: string;
  pontos: number;
  creditos_ganhos: number;
}

interface RoomRankingProps {
  roomId: string;
}

const RoomRanking = ({ roomId }: RoomRankingProps) => {
  // Dados mock para demonstração
  const [ranking] = useState<RankingEntry[]>([
    { posicao: 1, nome: 'João Silva', pontos: 1250, creditos_ganhos: 5800 },
    { posicao: 2, nome: 'Maria Santos', pontos: 1180, creditos_ganhos: 4920 },
    { posicao: 3, nome: 'Pedro Oliveira', pontos: 1050, creditos_ganhos: 3750 },
    { posicao: 4, nome: 'Ana Costa', pontos: 980, creditos_ganhos: 2800 },
    { posicao: 5, nome: 'Carlos Lima', pontos: 920, creditos_ganhos: 2100 },
    { posicao: 6, nome: 'Lucia Pereira', pontos: 850, creditos_ganhos: 1800 },
    { posicao: 7, nome: 'Roberto Dias', pontos: 780, creditos_ganhos: 1200 },
    { posicao: 8, nome: 'Sandra Alves', pontos: 720, creditos_ganhos: 900 },
  ]);

  const getPositionIcon = (posicao: number) => {
    switch (posicao) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-gray-500">#{posicao}</span>;
    }
  };

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <span>Top Apostadores</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {ranking.map((entry) => (
          <div
            key={entry.posicao}
            className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${getPositionColor(entry.posicao)}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getPositionIcon(entry.posicao)}
                <div>
                  <h4 className="font-semibold text-gray-900">{entry.nome}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="font-medium">{entry.pontos} pts</span>
                    <div className="flex items-center space-x-1">
                      <Coins className="h-3 w-3 text-emerald-600" />
                      <span>+{entry.creditos_ganhos}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {entry.posicao <= 3 && (
                <Badge 
                  variant="secondary" 
                  className={
                    entry.posicao === 1 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : entry.posicao === 2 
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-amber-100 text-amber-800'
                  }
                >
                  {entry.posicao === 1 ? '🥇' : entry.posicao === 2 ? '🥈' : '🥉'}
                </Badge>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default RoomRanking;
