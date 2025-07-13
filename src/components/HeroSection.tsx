import React, { useState, useEffect } from 'react';
import { ArrowRight, Brain, Users, Target, Sparkles, Gamepad2 } from 'lucide-react';
interface HeroSectionProps {
  onStartQuiz: () => void;
}
const HeroSection: React.FC<HeroSectionProps> = ({
  onStartQuiz
}) => {
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0
  });
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth * 100,
        y: e.clientY / window.innerHeight * 100
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  const parallaxStyle = {
    transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
  };
  return <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Elementos decorativos que seguem o mouse */}
      <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 blur-xl animate-float" style={parallaxStyle} />
      <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full bg-gradient-to-r from-accent/20 to-primary/20 blur-xl animate-float" style={{
      transform: `translate(${mousePosition.x * -0.03}px, ${mousePosition.y * -0.03}px)`,
      animationDelay: '2s'
    }} />
      <div className="absolute top-1/2 left-10 w-24 h-24 rounded-full bg-gradient-to-r from-secondary/30 to-accent/30 blur-lg animate-float" style={{
      transform: `translate(${mousePosition.x * 0.015}px, ${mousePosition.y * 0.015}px)`,
      animationDelay: '4s'
    }} />

      {/* Conteúdo principal */}
      <div className="relative z-10 text-center max-w-6xl mx-auto">
        {/* Badge tecnológico */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-8 animate-slide-up">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-sm font-medium text-muted-foreground">Turma 88</span>
        </div>

        {/* Título principal */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight animate-slide-up">
          <span className="block text-neon">Transforme sua</span>
          <span className="block bg-gradient-to-r from-accent to-success bg-clip-text text-transparent">
            Comunicação
          </span>
        </h1>

        {/* Subtítulo */}
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed animate-slide-up">
          Domine a <strong className="text-accent">Comunicação Não Violenta</strong> através de cenários interativos 
          personalizados por IA. Desenvolva habilidades que transformam conflitos em conexões.
        </p>

        {/* Features em cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
          <div className="card-glass hover-lift group">
            <Target className="w-8 h-8 text-primary mb-3 mx-auto group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold mb-2">Cenários Personalizados</h3>
            <p className="text-sm text-muted-foreground">
              IA cria situações baseadas no seu perfil profissional
            </p>
          </div>
          
          <div className="card-glass hover-lift group">
            <Users className="w-8 h-8 text-secondary mb-3 mx-auto group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold mb-2">Feedback Inteligente</h3>
            <p className="text-sm text-muted-foreground">
              Análise em tempo real das suas escolhas comunicativas
            </p>
          </div>
          
          <div className="card-glass hover-lift group">
            <Gamepad2 className="w-8 h-8 text-accent mb-3 mx-auto group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold mb-2">Gamificação</h3>
            <p className="text-sm text-muted-foreground">
              Sistema de pontuação que torna o aprendizado envolvente
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="space-y-4 animate-slide-up">
          <button onClick={onStartQuiz} className="btn-hero group inline-flex items-center gap-3">
            <span>Iniciar Jornada CNV</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <p className="text-sm text-muted-foreground">✨  6 perguntas • 10 cenários • Feedback personalizado</p>
        </div>

        {/* Estatísticas */}
        <div className="flex justify-center items-center gap-8 mt-16 text-sm text-muted-foreground">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">10</div>
            <div>Cenários Únicos</div>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="text-center">
            <div className="text-2xl font-bold text-secondary">100%</div>
            <div>Personalizado</div>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">IA</div>
            <div>Powered</div>
          </div>
        </div>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-background/30 pointer-events-none" />
    </div>;
};
export default HeroSection;