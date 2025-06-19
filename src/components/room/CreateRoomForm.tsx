
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

interface CreateRoomFormProps {
  onBack: () => void;
  onCreateRoom: (roomData: {
    nome: string;
    tipo: 'geral' | 'publica' | 'privada';
    valor_aposta: number;
    campeonato: string;
  }) => void;
}

const CreateRoomForm = ({ onBack, onCreateRoom }: CreateRoomFormProps) => {
  const [formData, setFormData] = useState({
    nome: '',
    tipo: '' as 'geral' | 'publica' | 'privada',
    valor_aposta: 100,
    campeonato: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.nome && formData.tipo && formData.campeonato) {
      onCreateRoom(formData);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4 hover:bg-gray-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Criar Nova Sala</h1>
          <p className="text-gray-600 mt-2">Configure sua sala de apostas personalizada</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações da Sala</CardTitle>
            <CardDescription>
              Defina as configurações da sua sala de apostas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Sala</Label>
                <Input
                  id="nome"
                  placeholder="Ex: Sala dos Amigos"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo da Sala</Label>
                <Select
                  value={formData.tipo}
                  onValueChange={(value: 'geral' | 'publica' | 'privada') =>
                    setFormData({ ...formData, tipo: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo da sala" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="geral">Geral - Todos podem participar</SelectItem>
                    <SelectItem value="publica">Pública - Visível para todos</SelectItem>
                    <SelectItem value="privada">Privada - Apenas com convite</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="valor_aposta">Valor da Aposta (créditos)</Label>
                <Input
                  id="valor_aposta"
                  type="number"
                  min="10"
                  max="1000"
                  step="10"
                  value={formData.valor_aposta}
                  onChange={(e) => setFormData({ ...formData, valor_aposta: Number(e.target.value) })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="campeonato">Campeonato</Label>
                <Select
                  value={formData.campeonato}
                  onValueChange={(value) => setFormData({ ...formData, campeonato: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o campeonato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="brasileirao-2024">Campeonato Brasileiro 2024</SelectItem>
                    <SelectItem value="champions-2024">UEFA Champions League 2024</SelectItem>
                    <SelectItem value="libertadores-2024">Copa Libertadores 2024</SelectItem>
                    <SelectItem value="copa-brasil-2024">Copa do Brasil 2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex space-x-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                >
                  Criar Sala
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateRoomForm;
