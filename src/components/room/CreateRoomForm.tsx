import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useCampeonatos } from '@/hooks/useCampeonatos';
import { useSalas } from '@/hooks/useSalas';
import { useToast } from '@/hooks/use-toast';

interface CreateRoomFormProps {
  onBack: () => void;
  onCreateRoom: (roomData: any) => void;
}

const CreateRoomForm = ({ onBack, onCreateRoom }: CreateRoomFormProps) => {
  const { campeonatos, loading: campeonatosLoading } = useCampeonatos();
  const { createSala } = useSalas();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    nome: '',
    tipo: '' as 'geral' | 'publica' | 'privada',
    valor_aposta: 100,
    campeonato_id: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.tipo || !formData.campeonato_id) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const newRoom = await createSala(
        formData.nome,
        formData.tipo,
        formData.valor_aposta,
        parseInt(formData.campeonato_id)
      );

      toast({
        title: "Sala criada com sucesso!",
        description: `A sala "${formData.nome}" foi criada e você já está participando.`,
      });

      onCreateRoom(newRoom);
    } catch (error: any) {
      toast({
        title: "Erro ao criar sala",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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
                  value={formData.campeonato_id}
                  onValueChange={(value) => setFormData({ ...formData, campeonato_id: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o campeonato" />
                  </SelectTrigger>
                  <SelectContent>
                    {campeonatosLoading ? (
                      <SelectItem value="" disabled>Carregando...</SelectItem>
                    ) : (
                      campeonatos.map((campeonato) => (
                        <SelectItem key={campeonato.id} value={campeonato.id.toString()}>
                          {campeonato.nome} - {campeonato.temporada}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex space-x-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Criando...' : 'Criar Sala'}
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
