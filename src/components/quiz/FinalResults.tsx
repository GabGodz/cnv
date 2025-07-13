import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Trophy, RotateCcw, Star, Brain, Loader2 } from 'lucide-react';
import { UserProfile, GameState } from '../QuizContainer';
import { generateFinalFeedback } from '@/services/geminiService';
import { useToast } from '@/hooks/use-toast';

interface FinalResultsProps {
  userProfile: UserProfile;
  gameState: GameState;
  onRestart: () => void;
}

const FinalResults: React.FC<FinalResultsProps> = ({ userProfile, gameState, onRestart }) => {
  const [finalFeedback, setFinalFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const totalPossible = useMemo(() => gameState.answers.length * 10, [gameState.answers.length]);
  const percentage = useMemo(() => Math.round((gameState.score / totalPossible) * 100), [gameState.score, totalPossible]);
  
  const getPerformanceLevel = useMemo(() => {
    if (percentage >= 80) return { level: 'Excelente', color: 'text-success', icon: '🏆' };
    if (percentage >= 60) return { level: 'Muito Bom', color: 'text-accent', icon: '⭐' };
    if (percentage >= 40) return { level: 'Bom', color: 'text-warning', icon: '👍' };
    return { level: 'Pode Melhorar', color: 'text-destructive', icon: '💪' };
  }, [percentage]);

  // Count answer categories with useMemo to prevent recalculation
  const answerCategories = useMemo(() => {
    return gameState.answers.reduce((acc, answer) => {
      if (answer.points === 10) acc.cnv++;
      else if (answer.points === 5) acc.neutral++;
      else if (answer.points === 3) acc.passive++;
      else acc.problematic++;
      return acc;
    }, { cnv: 0, neutral: 0, passive: 0, problematic: 0 });
  }, [gameState.answers]);

  useEffect(() => {
    const loadFinalFeedback = async () => {
      try {
        setIsLoading(true);
        const feedback = await generateFinalFeedback(
          userProfile.name,
          gameState.score,
          gameState.answers.length,
          answerCategories
        );
        setFinalFeedback(feedback);
        
        // Save user result to localStorage
        const userResult = {
          id: Date.now().toString(),
          name: userProfile.name,
          score: gameState.score,
          totalQuestions: gameState.answers.length,
          completedAt: new Date().toISOString(),
          knowsCNV: userProfile.knowsCNV,
          answers: gameState.answers
        };
        
        const existingResults = JSON.parse(localStorage.getItem('cnv-user-results') || '[]');
        const updatedResults = [...existingResults, userResult];
        localStorage.setItem('cnv-user-results', JSON.stringify(updatedResults));
        
      } catch (error) {
        console.error('Erro ao gerar feedback final:', error);
        setFinalFeedback(`Parabéns, ${userProfile.name}! Você completou o treinamento de CNV com ${gameState.score} pontos de ${totalPossible} possíveis (${percentage}%). Continue praticando para aprimorar suas habilidades de comunicação não violenta!`);
        toast({
          title: "Aviso",
          description: "Feedback personalizado não pôde ser gerado, mas seus resultados foram salvos.",
          variant: "default"
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Only run once when component mounts
    loadFinalFeedback();
  }, []); // Empty dependency array to run only once

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <h3 className="text-xl font-semibold mb-2">Gerando feedback personalizado...</h3>
          <p className="text-muted-foreground">
            Nossa IA está analisando seu desempenho
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-6">
            <Trophy className="w-6 h-6 text-accent" />
            <span className="font-medium">Treinamento Concluído</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Parabéns, <span className="text-neon">{userProfile.name}</span>!
          </h1>
          
          <p className="text-xl text-muted-foreground">
            Você completou o treinamento de Comunicação Não Violenta
          </p>
        </div>

        {/* Score Display */}
        <div className="card-glass mb-8 text-center">
          <div className="inline-flex items-center gap-4 mb-6">
            <Star className="w-12 h-12 text-accent" />
            <div>
              <div className="text-5xl font-bold mb-2">
                <span className={performance.color}>{gameState.score}</span>
                <span className="text-2xl text-muted-foreground">/{totalPossible}</span>
              </div>
              <div className="text-lg">
                <span className={getPerformanceLevel.color}>{getPerformanceLevel.level}</span> • {percentage}%
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-muted rounded-full h-3 mb-4">
            <div 
              className="bg-gradient-to-r from-primary to-accent h-3 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card-glass text-center">
            <div className="text-2xl font-bold text-success">{answerCategories.cnv}</div>
            <div className="text-sm text-muted-foreground">CNV</div>
          </div>
          <div className="card-glass text-center">
            <div className="text-2xl font-bold text-accent">{answerCategories.neutral}</div>
            <div className="text-sm text-muted-foreground">Neutras</div>
          </div>
          <div className="card-glass text-center">
            <div className="text-2xl font-bold text-warning">{answerCategories.passive}</div>
            <div className="text-sm text-muted-foreground">Passivas</div>
          </div>
          <div className="card-glass text-center">
            <div className="text-2xl font-bold text-destructive">{answerCategories.problematic}</div>
            <div className="text-sm text-muted-foreground">Problemáticas</div>
          </div>
        </div>

        {/* AI Generated Feedback */}
        <div className="card-glass text-left mb-8">
          <div className="flex items-start gap-4">
            <Brain className="w-8 h-8 text-accent mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-accent">Feedback</h3>
              <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {finalFeedback}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={onRestart} className="btn-hero">
            <RotateCcw className="w-4 h-4 mr-2" />
            Tentar Novamente
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FinalResults;