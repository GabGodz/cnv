import React, { useState } from 'react';
import InteractiveBackground from '@/components/InteractiveBackground';
import HeroSection from '@/components/HeroSection';
import QuizContainer from '@/components/QuizContainer';

const Index = () => {
  const [showQuiz, setShowQuiz] = useState(false);

  const handleStartQuiz = () => {
    setShowQuiz(true);
  };

  return (
    <div className="min-h-screen relative">
      <InteractiveBackground />
      
      <div className="relative z-10">
        {!showQuiz ? (
          <HeroSection onStartQuiz={handleStartQuiz} />
        ) : (
          <QuizContainer />
        )}
      </div>
    </div>
  );
};

export default Index;
