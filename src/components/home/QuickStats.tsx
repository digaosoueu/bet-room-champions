
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface QuickStatsProps {
  apostasCount: number;
}

const QuickStats = ({ apostasCount }: QuickStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600 mb-1">{apostasCount}</div>
            <div className="text-sm text-gray-600">Apostas Realizadas</div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">0</div>
            <div className="text-sm text-gray-600">Apostas Ganhas</div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600 mb-1">-</div>
            <div className="text-sm text-gray-600">Taxa de Acerto</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickStats;
