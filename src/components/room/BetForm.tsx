
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Coins } from 'lucide-react';

interface BetFormProps {
  gameId: string;
  valorAposta: number;
  onBet: (gameId: string, placar1: number, placar2: number, creditos: number) => void;
}

const BetForm = ({ gameId, valorAposta, onBet }: BetFormProps) => {
  const [placar1, setPlacar1] = useState<number>(0);
  const [placar2, setPlacar2] = useState<number>(0);
  const [creditosApostados, setCreditosApostados] = useState<number>(valorAposta);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onBet(gameId, placar1, placar2, creditosApostados);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-3 gap-4 items-end">
        <div className="space-y-2">
          <Label htmlFor={`placar1-${gameId}`}>Placar Time 1</Label>
          <Input
            id={`placar1-${gameId}`}
            type="number"
            min="0"
            max="20"
            value={placar1}
            onChange={(e) => setPlacar1(Number(e.target.value))}
            className="text-center text-lg font-bold"
          />
        </div>
        
        <div className="text-center">
          <span className="text-2xl font-bold text-gray-400">×</span>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`placar2-${gameId}`}>Placar Time 2</Label>
          <Input
            id={`placar2-${gameId}`}
            type="number"
            min="0"
            max="20"
            value={placar2}
            onChange={(e) => setPlacar2(Number(e.target.value))}
            className="text-center text-lg font-bold"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor={`creditos-${gameId}`}>Créditos a Apostar</Label>
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <Coins className="absolute left-3 top-3 h-4 w-4 text-emerald-600" />
            <Input
              id={`creditos-${gameId}`}
              type="number"
              min={valorAposta}
              step={valorAposta}
              value={creditosApostados}
              onChange={(e) => setCreditosApostados(Number(e.target.value))}
              className="pl-10"
            />
          </div>
          <Button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            Apostar
          </Button>
        </div>
      </div>
    </form>
  );
};

export default BetForm;
