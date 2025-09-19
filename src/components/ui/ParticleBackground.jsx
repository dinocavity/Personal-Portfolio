import { useEffect, useRef, memo } from 'react';

const ParticleBackground = memo(() => {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });

    // Update canvas size
    const updateCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      // Set explicit dimensions if rect is 0
      const width = rect.width || window.innerWidth;
      const height = rect.height || window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';

      ctx.scale(dpr, dpr);

      return { width, height };
    };

    // Simple particle class
    class Particle {
      constructor(canvasWidth, canvasHeight) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.size = Math.random() * 4 + 2;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.6 + 0.4;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce off walls
        if (this.x <= 0 || this.x >= this.canvasWidth) {
          this.speedX = -this.speedX;
        }
        if (this.y <= 0 || this.y >= this.canvasHeight) {
          this.speedY = -this.speedY;
        }
      }

      draw(ctx) {
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = '#3b82f6';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    let { width, height } = updateCanvasSize();

    // Create particles
    const createParticles = () => {
      const area = width * height;
      const count = Math.min(Math.max(Math.floor(area / 20000), 20), 80);
      particlesRef.current = [];

      for (let i = 0; i < count; i++) {
        particlesRef.current.push(new Particle(width, height));
      }
    };

    createParticles();
    console.log('Particles created:', particlesRef.current.length, 'Canvas size:', width, 'x', height);

    // Simple connection drawing
    const drawConnections = (ctx, particles) => {
      ctx.globalAlpha = 1;
      ctx.lineWidth = 1;

      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            const opacity = (1 - distance / 150) * 0.3;
            ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    };

    // Animation loop
    let lastFrameTime = 0;
    const targetFPS = 30;
    const frameInterval = 1000 / targetFPS;

    const animate = (currentTime) => {
      if (currentTime - lastFrameTime >= frameInterval) {
        ctx.clearRect(0, 0, width, height);

        const particles = particlesRef.current;

        for (let i = 0; i < particles.length; i++) {
          particles[i].update();
          particles[i].draw(ctx);
        }

        drawConnections(ctx, particles);

        lastFrameTime = currentTime;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Resize handler
    const handleResize = () => {
      const newDimensions = updateCanvasSize();
      width = newDimensions.width;
      height = newDimensions.height;

      particlesRef.current.forEach(particle => {
        particle.canvasWidth = width;
        particle.canvasHeight = height;
        particle.x = Math.min(particle.x, width);
        particle.y = Math.min(particle.y, height);
      });
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // Start animation with a slight delay to ensure canvas is ready
    setTimeout(() => {
      animationFrameRef.current = requestAnimationFrame(animate);
    }, 100);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{
        opacity: 0.6,
        backgroundColor: 'rgba(59, 130, 246, 0.02)',
        filter: 'blur(1.5px)'
      }}
    />
  );
});

ParticleBackground.displayName = 'ParticleBackground';

export default ParticleBackground;