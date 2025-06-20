
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Trophy, Users, Coins } from 'lucide-react';

interface Room {
  id: number;
  nome: string;
  tipo: 'geral' | 'publica' | 'privada';
  valor_aposta: number;
  campeonato: string;
  participantes_count: number;
}

interface RoomHeaderProps {
  room: Room;
  onBack: () => void;
}

const RoomHeader = ({ room, onBack }: RoomHeaderProps) => {
  const getRoomTypeColor = (tipo: string) => {
    switch (tipo) {
      case 'geral':
        return 'bg-blue-100 text-blue-800';
      case 'publica':
        return 'bg-green-100 text-green-800';
      case 'privada':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4 hover:bg-gray-100"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{room.nome}</CardTitle>
              <CardDescription className="text-lg mt-1">{room.campeonato}</CardDescription>
            </div>
            <Badge className={getRoomTypeColor(room.tipo)}>
              {room.tipo === 'geral' ? 'Geral' : room.tipo === 'publica' ? 'Pública' : 'Privada'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Coins className="h-5 w-5 text-emerald-600" />
              <span className="font-medium">
                {room.tipo === 'geral' ? 'Apostas grátis' : `${room.valor_aposta} créditos por aposta extra`}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span>{room.participantes_count} participantes</span>
            </div>
            <div className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-yellow-600" />
              <span>Rodada 12</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default RoomHeader;
