
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Coins, Trophy } from 'lucide-react';

interface Room {
  id: string;
  nome: string;
  tipo: 'geral' | 'publica' | 'privada';
  valor_aposta: number;
  participantes_count: number;
  campeonato: string;
}

interface RoomCardProps {
  room: Room;
  onEnterRoom: (roomId: string) => void;
}

const RoomCard = ({ room, onEnterRoom }: RoomCardProps) => {
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

  const getRoomTypeLabel = (tipo: string) => {
    switch (tipo) {
      case 'geral':
        return 'Geral';
      case 'publica':
        return 'Pública';
      case 'privada':
        return 'Privada';
      default:
        return tipo;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold">{room.nome}</CardTitle>
            <CardDescription className="text-sm text-gray-600">{room.campeonato}</CardDescription>
          </div>
          <Badge className={getRoomTypeColor(room.tipo)}>
            {getRoomTypeLabel(room.tipo)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <Coins className="h-4 w-4 text-emerald-600" />
            <span className="font-medium">{room.valor_aposta} créditos</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-gray-500" />
            <span>{room.participantes_count} jogadores</span>
          </div>
        </div>
        
        <Button 
          onClick={() => onEnterRoom(room.id)}
          className="w-full bg-emerald-600 hover:bg-emerald-700"
        >
          <Trophy className="h-4 w-4 mr-2" />
          Entrar na Sala
        </Button>
      </CardContent>
    </Card>
  );
};

export default RoomCard;
