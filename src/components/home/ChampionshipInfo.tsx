
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy } from 'lucide-react';

interface ChampionshipInfoProps {
  rodadasCount: number;
  configuracoes: Record<string, string>;
}

const ChampionshipInfo = ({ rodadasCount, configuracoes }: ChampionshipInfoProps) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Trophy className="h-5 w-5 text-emerald-600" />
          <span>Campeonato Brasileiro 2025</span>
        </CardTitle>
        <CardDescription>
          Aposte nos jogos das {rodadasCount} rodadas do Brasileirão 2025
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium">1ª aposta:</span> Grátis
          </div>
          <div>
            <span className="font-medium">2ª aposta:</span> {configuracoes.valor_segunda_aposta || '50'} créditos
          </div>
          <div>
            <span className="font-medium">3ª aposta:</span> {configuracoes.valor_terceira_aposta || '100'} créditos
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChampionshipInfo;
