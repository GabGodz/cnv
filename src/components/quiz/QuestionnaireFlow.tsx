import React, { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuestionnaireFlowProps {
  userName: string;
  knowsCNV: boolean;
  onComplete: (answers: string[]) => void;
}

interface Question {
  id: string;
  text: string;
  options: string[];
}

const QuestionnaireFlow: React.FC<QuestionnaireFlowProps> = ({ 
  userName, 
  knowsCNV, 
  onComplete 
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  // Perguntas adaptadas baseadas no conhecimento de CNV
  const questionsForBeginner: Question[] = [
    {
      id: 'area',
      text: 'Qual é sua principal área de atuação profissional?',
      options: ['Liderança/Gestão', 'Vendas/Comercial', 'Atendimento ao Cliente', 'Recursos Humanos', 'Outra área']
    },
    {
      id: 'communication_challenge',
      text: 'Qual seu maior desafio na comunicação no trabalho?',
      options: ['Dar feedback difícil', 'Lidar com conflitos', 'Negociar com clientes', 'Motivar a equipe', 'Expressar opiniões']
    },
    {
      id: 'conflict_reaction',
      text: 'Quando surge um conflito, você geralmente:',
      options: ['Evita o confronto', 'Tenta resolver imediatamente', 'Busca mediação', 'Analisa antes de agir', 'Prefere não se envolver']
    },
    {
      id: 'communication_style',
      text: 'Como você se descreveria ao comunicar:',
      options: ['Direto e objetivo', 'Empático e cuidadoso', 'Analítico e detalhista', 'Energético e persuasivo', 'Calmo e observador']
    },
    {
      id: 'learning_goal',
      text: 'O que mais gostaria de melhorar na sua comunicação?',
      options: ['Escuta ativa', 'Clareza na fala', 'Controle emocional', 'Persuasão', 'Empatia']
    }
  ];

  const questionsForAdvanced: Question[] = [
    {
      id: 'cnv_experience',
      text: 'Há quanto tempo você conhece CNV?',
      options: ['Menos de 1 ano', '1-2 anos', '3-5 anos', 'Mais de 5 anos', 'Estudei formalmente']
    },
    {
      id: 'cnv_application',
      text: 'Onde você mais aplica os princípios de CNV?',
      options: ['Vida pessoal', 'Ambiente profissional', 'Ambos igualmente', 'Raramente aplico', 'Ainda estou aprendendo']
    },
    {
      id: 'cnv_challenges',
      text: 'Qual sua maior dificuldade ao praticar CNV?',
      options: ['Identificar sentimentos', 'Reconhecer necessidades', 'Fazer pedidos claros', 'Observar sem julgar', 'Manter a prática consistente']
    },
    {
      id: 'professional_context',
      text: 'Em que contexto profissional você mais gostaria de aplicar CNV?',
      options: ['Reuniões de equipe', 'Feedback para colaboradores', 'Negociações', 'Resolução de conflitos', 'Atendimento ao cliente']
    },
    {
      id: 'cnv_advancement',
      text: 'O que gostaria de aprofundar em CNV?',
      options: ['Autoconexão', 'Expressar raiva construtivamente', 'Gratidão e celebração', 'Mediação de conflitos', 'Liderança compassiva']
    }
  ];

  const questions = knowsCNV ? questionsForAdvanced : questionsForBeginner;
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (isLastQuestion) {
      onComplete(newAnswers);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setAnswers(answers.slice(0, -1));
    }
  };

  return (
    <div className="card-glass max-w-3xl mx-auto animate-slide-up">
      {/* Header com progresso */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">
            Olá, <span className="text-accent">{userName}</span>
          </h2>
          <div className="text-sm text-muted-foreground">
            {currentQuestionIndex + 1} de {questions.length}
          </div>
        </div>
        
        {/* Barra de progresso */}
        <div className="w-full bg-muted rounded-full h-2 mb-6">
          <div 
            className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        <div className="bg-primary/10 border border-primary/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4">
            {currentQuestion.text}
          </h3>
          <p className="text-sm text-muted-foreground">
            {knowsCNV 
              ? 'Suas respostas nos ajudarão a criar cenários mais avançados' 
              : 'Vamos conhecer seu perfil para personalizar sua experiência'
            }
          </p>
        </div>
      </div>

      {/* Opções de resposta */}
      <div className="space-y-3 mb-8">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(option)}
            className="w-full text-left p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 group"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{option}</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </button>
        ))}
      </div>

      {/* Botão voltar */}
      {currentQuestionIndex > 0 && (
        <div className="flex justify-start">
          <Button 
            variant="outline" 
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Voltar
          </Button>
        </div>
      )}
    </div>
  );
};

export default QuestionnaireFlow;