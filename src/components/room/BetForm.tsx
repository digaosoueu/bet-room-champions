
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Coins, Info } from 'lucide-react';

interface BetFormProps {
  gameId: number;
  valorAposta: number;
  apostasExistentes: number;
  onBet: (gameId: number, placar1: number, placar2: number, creditos: number) => void;
}

const BetForm = ({ gameId, valorAposta, apostasExistentes, onBet }: BetFormProps) => {
  const [placar1, setPlacar1] = useState<number>(0);
  const [placar2, setPlacar2] = useState<number>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calcular créditos necessários
    // Primeira aposta é grátis, segunda custa valor base, terceira custa valor base * 2
    let creditosNecessarios = 0;
    if (apostasExistentes === 1) {
      creditosNecessarios = valorAposta;
    } else if (apostasExistentes >= 2) {
      creditosNecessarios = valorAposta * 2;
    }

    onBet(gameId, placar1, placar2, creditosNecessarios);
  };

  const getCustoAposta = () => {
    if (apostasExistentes === 0) return 'Grátis';
    if (apostasExistentes === 1) return `${valorAposta} créditos`;
    if (apostasExistentes >= 2) return `${valorAposta * 2} créditos`;
    return 'Grátis';
  };

  const canMakeMoreBets = apostasExistentes < 3;

  return (
    <div className="space-y-4">
      {/* Informações sobre a aposta */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-start space-x-2">
          <Info className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-blue-900 mb-1">Regras de Apostas:</p>
            <ul className="text-blue-800 space-y-1">
              <li>• 1ª aposta: <strong>Grátis</strong></li>
              <li>• 2ª aposta: <strong>{valorAposta} créditos</strong></li>
              <li>• 3ª aposta: <strong>{valorAposta * 2} créditos</strong></li>
              <li>• Máximo de 3 apostas por jogo</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Status atual */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Apostas realizadas:</span>
          <Badge variant="secondary">{apostasExistentes}/3</Badge>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Próxima aposta:</span>
          <Badge className={apostasExistentes === 0 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
            {getCustoAposta()}
          </Badge>
        </div>
      </div>

      {canMakeMoreBets ? (
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
          
          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700"
          >
            <Coins className="h-4 w-4 mr-2" />
            Apostar ({getCustoAposta()})
          </Button>
        </form>
      ) : (
        <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg">
          <p className="font-medium">Limite de apostas atingido</p>
          <p className="text-sm">Você já fez 3 apostas neste jogo</p>
        </div>
      )}
    </div>
  );
};

export default BetForm;
