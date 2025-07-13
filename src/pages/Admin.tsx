import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, User, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface UserResult {
  id: string;
  name: string;
  score: number;
  totalQuestions: number;
  completedAt: string;
  knowsCNV: boolean;
  answers: Array<{
    scenario: string;
    chosen: string;
    feedback: string;
    points: number;
  }>;
}

const Admin: React.FC = () => {
  const [results, setResults] = useState<UserResult[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedResults = localStorage.getItem('cnv-user-results');
    if (savedResults) {
      setResults(JSON.parse(savedResults));
    }
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / (total * 10)) * 100;
    if (percentage >= 80) return 'text-success';
    if (percentage >= 60) return 'text-accent';
    if (percentage >= 40) return 'text-warning';
    return 'text-destructive';
  };

  const clearResults = () => {
    localStorage.removeItem('cnv-user-results');
    setResults([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => navigate('/')}
              className="hover:bg-primary/10"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-neon">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground">
                Resultados dos usuários do treinamento CNV
              </p>
            </div>
          </div>
          
          {results.length > 0 && (
            <Button 
              variant="destructive"
              onClick={clearResults}
              className="hover:bg-destructive/90"
            >
              Limpar Dados
            </Button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card-glass">
            <div className="flex items-center gap-3">
              <User className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{results.length}</p>
                <p className="text-sm text-muted-foreground">Total de Usuários</p>
              </div>
            </div>
          </div>
          
          <div className="card-glass">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-accent" />
              <div>
                <p className="text-2xl font-bold">
                  {results.length > 0 
                    ? Math.round(results.reduce((acc, r) => acc + r.score, 0) / results.length)
                    : 0
                  }
                </p>
                <p className="text-sm text-muted-foreground">Pontuação Média</p>
              </div>
            </div>
          </div>
          
          <div className="card-glass">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-secondary" />
              <div>
                <p className="text-2xl font-bold">
                  {results.filter(r => r.knowsCNV).length}
                </p>
                <p className="text-sm text-muted-foreground">Já conheciam CNV</p>
              </div>
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="card-glass">
          {results.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Nenhum resultado ainda</h3>
              <p className="text-muted-foreground">
                Os resultados dos usuários aparecerão aqui após completarem o treinamento.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Pontuação</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Conhecia CNV</TableHead>
                    <TableHead>Data/Hora</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results
                    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
                    .map((result) => (
                    <TableRow key={result.id}>
                      <TableCell className="font-medium">{result.name}</TableCell>
                      <TableCell>
                        <span className={`font-bold ${getScoreColor(result.score, result.totalQuestions)}`}>
                          {result.score}/{result.totalQuestions * 10}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-primary to-accent h-2 rounded-full"
                              style={{ 
                                width: `${(result.score / (result.totalQuestions * 10)) * 100}%` 
                              }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {Math.round((result.score / (result.totalQuestions * 10)) * 100)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          result.knowsCNV 
                            ? 'bg-success/20 text-success' 
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {result.knowsCNV ? 'Sim' : 'Não'}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(result.completedAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;