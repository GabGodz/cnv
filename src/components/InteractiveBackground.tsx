import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseVx: number;
  baseVy: number;
  size: number;
  color: string;
  opacity: number;
  timeOffset: number;
}

const InteractiveBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      const particles: Particle[] = [];
      const particleCount = Math.min(100, window.innerWidth / 12);
      
      const colors = [
        'hsl(217, 91%, 60%)', // primary
        'hsl(260, 75%, 65%)', // secondary  
        'hsl(150, 80%, 55%)', // accent
      ];

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          baseVx: (Math.random() - 0.5) * 0.5,
          baseVy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 3 + 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          opacity: Math.random() * 0.6 + 0.3,
          timeOffset: Math.random() * Math.PI * 2,
        });
      }
      
      particlesRef.current = particles;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const animate = () => {
      timeRef.current += 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      particles.forEach((particle, index) => {
        // Movimento base constante com ondas senoidais
        const waveX = Math.sin(timeRef.current + particle.timeOffset) * 0.3;
        const waveY = Math.cos(timeRef.current + particle.timeOffset * 1.5) * 0.3;
        
        // Aplicar movimento base
        particle.vx = particle.baseVx + waveX;
        particle.vy = particle.baseVy + waveY;

        // Influência do mouse (atração muito forte)
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Aumentar raio de influência e força de atração
        if (distance < 300 && distance > 0) {
          const force = (300 - distance) / 300;
          const attractionStrength = force * force * 0.3; // Força muito maior
          particle.vx += (dx / distance) * attractionStrength;
          particle.vy += (dy / distance) * attractionStrength;
          
          // Efeito adicional de "magnetismo" quando muito próximo
          if (distance < 100) {
            const magnetForce = (100 - distance) / 100 * 0.5;
            particle.vx += (dx / distance) * magnetForce;
            particle.vy += (dy / distance) * magnetForce;
          }
        }

        // Atualizar posição
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Verificar limites e fazer bounce suave
        if (particle.x <= 0 || particle.x >= canvas.width) {
          particle.baseVx *= -0.8;
          particle.vx *= -0.8;
          particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        }
        if (particle.y <= 0 || particle.y >= canvas.height) {
          particle.baseVy *= -0.8;
          particle.vy *= -0.8;
          particle.y = Math.max(0, Math.min(canvas.height, particle.y));
        }

        // Aplicar atrito mais suave para manter o movimento
        particle.vx *= 0.98;
        particle.vy *= 0.98;

        // Atualizar opacidade dinamicamente
        particle.opacity = 0.4 + Math.sin(timeRef.current + particle.timeOffset) * 0.3;

        // Desenhar partícula
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color.replace(')', `, ${Math.abs(particle.opacity)})`).replace('hsl', 'hsla');
        ctx.fill();

        // Desenhar conexões
        particles.slice(index + 1).forEach(otherParticle => {
          const dx2 = particle.x - otherParticle.x;
          const dy2 = particle.y - otherParticle.y;
          const distance2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

          if (distance2 < 80) {
            const opacity = (80 - distance2) / 80 * 0.4;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `hsla(217, 91%, 60%, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    createParticles();
    
    window.addEventListener('resize', () => {
      resizeCanvas();
      createParticles();
    });
    
    window.addEventListener('mousemove', handleMouseMove);
    
    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        background: 'var(--gradient-hero)',
      }}
    />
  );
};

export default InteractiveBackground;