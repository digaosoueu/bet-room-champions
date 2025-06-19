
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Coins, Search } from 'lucide-react';
import { useSalas } from '@/hooks/useSalas';
import { useToast } from '@/hooks/use-toast';

interface JoinRoomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJoinSuccess: () => void;
}

const JoinRoomDialog = ({ open, onOpenChange, onJoinSuccess }: JoinRoomDialogProps) => {
  const { joinSala } = useSalas();
  const { toast } = useToast();
  const [codigo, setCodigo] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  
  // Mock de salas públicas - em produção viria do Supabase
  const [salasPublicas] = useState([
    {
      id: '1',
      nome: 'Brasileirão 2024',
      tipo: 'publica' as const,
      valor_aposta: 100,
      participantes_count: 1247,
      campeonato: { nome: 'Campeonato Brasileiro 2024' }
    },
    {
      id: '2',
      nome: 'Champions League',
      tipo: 'publica' as const,
      valor_aposta: 200,
      participantes_count: 342,
      campeonato: { nome: 'UEFA Champions League 2024' }
    }
  ]);

  const handleJoinWithCode = async () => {
    if (!codigo.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira o código da sala.",
        variant: "destructive",
      });
      return;
    }

    setIsJoining(true);
    try {
      // Em produção, buscar sala pelo código primeiro
      await joinSala('mock-sala-id', codigo);
      
      toast({
        title: "Sucesso!",
        description: "Você entrou na sala com sucesso.",
      });
      
      onJoinSuccess();
      onOpenChange(false);
      setCodigo('');
    } catch (error: any) {
      toast({
        title: "Erro ao entrar na sala",
        description: error.message || "Código inválido ou sala não encontrada.",
        variant: "destructive",
      });
    } finally {
      setIsJoining(false);
    }
  };

  const handleJoinPublicRoom = async (salaId: string) => {
    setIsJoining(true);
    try {
      await joinSala(salaId);
      
      toast({
        title: "Sucesso!",
        description: "Você entrou na sala com sucesso.",
      });
      
      onJoinSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Erro ao entrar na sala",
        description: error.message || "Não foi possível entrar na sala.",
        variant: "destructive",
      });
    } finally {
      setIsJoining(false);
    }
  };

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Entrar em Sala</DialogTitle>
          <DialogDescription>
            Entre com código de uma sala privada ou escolha uma sala pública
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Entrar com código */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="h-5 w-5" />
                <span>Entrar com Código</span>
              </CardTitle>
              <CardDescription>
                Use o código fornecido pelo dono da sala privada
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="codigo">Código da Sala</Label>
                <Input
                  id="codigo"
                  placeholder="Ex: ABC12345"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                  maxLength={8}
                />
              </div>
              <Button 
                onClick={handleJoinWithCode}
                disabled={isJoining || !codigo.trim()}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                {isJoining ? 'Entrando...' : 'Entrar na Sala'}
              </Button>
            </CardContent>
          </Card>

          {/* Salas públicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Salas Públicas</span>
              </CardTitle>
              <CardDescription>
                Escolha uma sala pública para participar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {salasPublicas.map((sala) => (
                  <Card key={sala.id} className="border-gray-200">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{sala.nome}</CardTitle>
                          <CardDescription className="text-sm">
                            {sala.campeonato.nome}
                          </CardDescription>
                        </div>
                        <Badge className={getRoomTypeColor(sala.tipo)}>
                          Pública
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <Coins className="h-4 w-4 text-emerald-600" />
                          <span className="font-medium">{sala.valor_aposta} créditos</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span>{sala.participantes_count} jogadores</span>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={() => handleJoinPublicRoom(sala.id)}
                        disabled={isJoining}
                        className="w-full bg-emerald-600 hover:bg-emerald-700"
                        size="sm"
                      >
                        {isJoining ? 'Entrando...' : 'Entrar na Sala'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JoinRoomDialog;
