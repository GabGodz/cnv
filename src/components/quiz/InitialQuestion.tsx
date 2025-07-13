import React from 'react';
import { Brain, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InitialQuestionProps {
  userName: string;
  onAnswer: (knowsCNV: boolean) => void;
}

const InitialQuestion: React.FC<InitialQuestionProps> = ({ userName, onAnswer }) => {
  return (
    <div className="card-glass max-w-2xl mx-auto text-center animate-slide-up">
      <div className="mb-8">
        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-accent to-success flex items-center justify-center mx-auto mb-6">
          <Brain className="w-10 h-10 text-white" />
        </div>
        
        <h2 className="text-3xl font-bold mb-4">
          Olá, <span className="text-accent">{userName}</span>!
        </h2>
        
        <p className="text-xl text-muted-foreground mb-8">
          Vamos começar calibrando nossa experiência para você
        </p>
        
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 mb-8">
          <h3 className="text-2xl font-semibold mb-4">
            Você já conhece ou ouviu falar sobre <span className="text-primary">CNV</span> (Comunicação Não Violenta)?
          </h3>
          <p className="text-muted-foreground">
            Esta resposta nos ajudará a personalizar o conteúdo para seu nível de conhecimento
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          onClick={() => onAnswer(true)}
          className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-success to-accent hover:scale-105 transition-transform"
          size="lg"
        >
          <Check className="w-5 h-5" />
          <span>Sim, já conheço</span>
        </Button>
        
        <Button 
          onClick={() => onAnswer(false)}
          className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-secondary hover:scale-105 transition-transform"
          size="lg"
        >
          <X className="w-5 h-5" />
          <span>Não, é novidade para mim</span>
        </Button>
      </div>
    </div>
  );
};

export default InitialQuestion;