import { useEffect, useRef, memo } from 'react';
import useScrollManager from '../../hooks/useScrollManager';

const ParticleBackground = memo(() => {
  const { progress, activeSection } = useScrollManager();

  // Debug: log the activeSection whenever it changes
  useEffect(() => {
    console.log('ParticleBackground - Active section changed to:', activeSection);
  }, [activeSection]);

  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const particlesRef = useRef([]);

  // Global connection color state for smooth transitions
  const connectionColorStateRef = useRef({
    current: { r: 59, g: 130, b: 246 }, // Start with hero color
    target: { r: 59, g: 130, b: 246 },
    transitionSpeed: 0.08
  });

  // Mouse interaction states
  const mouseRef = useRef({ x: 0, y: 0 });
  const draggedParticleRef = useRef(null);
  const isDraggingRef = useRef(false);
  const interactionLayerRef = useRef(null);

  // Single consolidated effect for everything
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });

    // Ensure true full screen canvas size
    const updateCanvasSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Set canvas dimensions to full viewport
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';

      return { width, height };
    };

    // Simple mouse position calculation
    const getMousePos = (e) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    // Simple particle class with smooth color transitions
    class Particle {
      constructor(canvasWidth, canvasHeight) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.3 + 0.8;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        // For smooth color transitions
        this.currentColor = { r: 59, g: 130, b: 246 }; // Start with hero color
        this.targetColor = { r: 59, g: 130, b: 246 };
        this.colorTransitionSpeed = 0.08; // Smooth transition speed

        // For mouse interaction
        this.isDragged = false;
        this.originalSpeedX = this.speedX;
        this.originalSpeedY = this.speedY;
      }

      // Check if mouse is over this particle
      isMouseOver(mouseX, mouseY) {
        const distance = Math.sqrt((mouseX - this.x) ** 2 + (mouseY - this.y) ** 2);
        return distance <= this.size + 20; // Increased tolerance for easier selection
      }

      // Start dragging this particle
      startDrag() {
        this.isDragged = true;
        this.speedX = 0;
        this.speedY = 0;
      }

      // Stop dragging and restore movement
      stopDrag() {
        this.isDragged = false;
        this.speedX = this.originalSpeedX;
        this.speedY = this.originalSpeedY;
      }

      // Move particle to specific position
      moveTo(x, y) {
        if (this.isDragged) {
          this.x = x;
          this.y = y;
        }
      }

      update() {
        // Only update position if not being dragged
        if (!this.isDragged) {
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

        // Smooth color transition
        this.currentColor.r += (this.targetColor.r - this.currentColor.r) * this.colorTransitionSpeed;
        this.currentColor.g += (this.targetColor.g - this.currentColor.g) * this.colorTransitionSpeed;
        this.currentColor.b += (this.targetColor.b - this.currentColor.b) * this.colorTransitionSpeed;
      }

      draw(ctx, activeSection) {
        // Define colors for each section - more vibrant and contrasting
        const sectionColors = {
          hero: { r: 59, g: 130, b: 246 },      // #3b82f6 (blue)
          about: { r: 147, g: 51, b: 234 },     // #9333ea (purple)
          projects: { r: 245, g: 158, b: 11 },   // #f59e0b (amber)
          blog: { r: 239, g: 68, b: 68 },       // #ef4444 (red)
          contact: { r: 16, g: 185, b: 129 }    // #10b981 (green)
        };

        // Update target color for current section
        const newTargetColor = sectionColors[activeSection] || sectionColors.hero;
        this.targetColor = { ...newTargetColor };

        // Use current interpolated color for rendering
        const r = Math.round(this.currentColor.r);
        const g = Math.round(this.currentColor.g);
        const b = Math.round(this.currentColor.b);

        // Draw particle with highlight if being dragged
        ctx.globalAlpha = this.isDragged ? 1.0 : this.opacity;
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.isDragged ? this.size * 1.5 : this.size, 0, Math.PI * 2);
        ctx.fill();

        // Add glow effect for dragged particle
        if (this.isDragged) {
          ctx.globalAlpha = 0.3;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size * 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
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

    // Connection drawing with smooth section-based color transitions
    const drawConnections = (ctx, particles, activeSection) => {
      ctx.globalAlpha = 1;
      ctx.lineWidth = 1;

      // Define colors for each section - matching particle colors
      const sectionColors = {
        hero: { r: 59, g: 130, b: 246 },      // #3b82f6 (blue)
        about: { r: 147, g: 51, b: 234 },     // #9333ea (purple)
        projects: { r: 245, g: 158, b: 11 },   // #f59e0b (amber)
        blog: { r: 239, g: 68, b: 68 },       // #ef4444 (red)
        contact: { r: 16, g: 185, b: 129 }    // #10b981 (green)
      };

      // Update target color and interpolate
      const newTargetColor = sectionColors[activeSection] || sectionColors.hero;
      connectionColorStateRef.current.target = { ...newTargetColor };

      // Smooth interpolation
      const state = connectionColorStateRef.current;
      state.current.r += (state.target.r - state.current.r) * state.transitionSpeed;
      state.current.g += (state.target.g - state.current.g) * state.transitionSpeed;
      state.current.b += (state.target.b - state.current.b) * state.transitionSpeed;

      const connectionColor = {
        r: Math.round(state.current.r),
        g: Math.round(state.current.g),
        b: Math.round(state.current.b)
      };

      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            const opacity = (1 - distance / 150) * 0.8;
            ctx.strokeStyle = `rgba(${connectionColor.r}, ${connectionColor.g}, ${connectionColor.b}, ${opacity})`;
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
          particles[i].draw(ctx, activeSection);
        }

        drawConnections(ctx, particles, activeSection);

        // Debug: Draw mouse position and hover indicators
        if (mouseRef.current.x !== undefined && mouseRef.current.y !== undefined) {
          // Draw mouse position indicator
          ctx.globalAlpha = 0.5;
          ctx.strokeStyle = '#ff0000';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.arc(mouseRef.current.x, mouseRef.current.y, 3, 0, Math.PI * 2);
          ctx.stroke();

          // Draw crosshair
          ctx.beginPath();
          ctx.moveTo(mouseRef.current.x - 3, mouseRef.current.y);
          ctx.lineTo(mouseRef.current.x + 3, mouseRef.current.y);
          ctx.moveTo(mouseRef.current.x, mouseRef.current.y - 3);
          ctx.lineTo(mouseRef.current.x, mouseRef.current.y + 3);
          ctx.stroke();

          // Highlight hovered particles
          let hoveredParticle = null;
          particles.forEach((particle, i) => {
            const distance = Math.sqrt((mouseRef.current.x - particle.x) ** 2 + (mouseRef.current.y - particle.y) ** 2);
            if (particle.isMouseOver(mouseRef.current.x, mouseRef.current.y)) {
              hoveredParticle = particle;
            }
          });

          // Draw hover indicator for the hovered particle
          if (hoveredParticle) {
            ctx.globalAlpha = 0.6;
            ctx.strokeStyle = '#ffff00';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(hoveredParticle.x, hoveredParticle.y, hoveredParticle.size + 5, 0, Math.PI * 2);
            ctx.stroke();

            // Draw line from mouse to hovered particle
            ctx.globalAlpha = 0.3;
            ctx.strokeStyle = '#ffff00';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(mouseRef.current.x, mouseRef.current.y);
            ctx.lineTo(hoveredParticle.x, hoveredParticle.y);
            ctx.stroke();
          }
        }

        // Debug: Log active section (remove this later)
        if (Math.random() < 0.01) { // Only log occasionally to avoid spam
          console.log('Active section:', activeSection);
        }

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

    // Add resize event listener
    window.addEventListener('resize', handleResize, { passive: true });

    // Consolidated mouse event handlers
    const handleGlobalMouseMove = (e) => {
      const mousePos = getMousePos(e);
      mouseRef.current = mousePos;

      if (isDraggingRef.current && draggedParticleRef.current) {
        draggedParticleRef.current.moveTo(mousePos.x, mousePos.y);
      }

      // Update cursor based on particle proximity
      if (!isDraggingRef.current &&
          !e.target.closest('a, button, input, textarea, select, [role="button"], [tabindex]') &&
          !e.target.hasAttribute('onclick')) {

        let overParticle = false;
        const particles = particlesRef.current;
        for (let i = 0; i < particles.length; i++) {
          if (particles[i].isMouseOver(mousePos.x, mousePos.y)) {
            overParticle = true;
            break;
          }
        }
        document.body.style.cursor = overParticle ? 'grab' : '';
      }
    };

    const handleGlobalMouseDown = (e) => {
      if (e.target.tagName === 'CANVAS' ||
          (!e.target.closest('a, button, input, textarea, select, [role="button"], [tabindex]') &&
           !e.target.hasAttribute('onclick'))) {

        const mousePos = getMousePos(e);
        mouseRef.current = mousePos;

        console.log('Mouse click at:', mousePos);

        const particles = particlesRef.current;
        for (let i = particles.length - 1; i >= 0; i--) {
          const particle = particles[i];
          if (particle.isMouseOver(mousePos.x, mousePos.y)) {
            console.log('✅ Found particle at:', particle.x, particle.y);
            draggedParticleRef.current = particle;
            isDraggingRef.current = true;
            particle.startDrag();
            document.body.style.cursor = 'grabbing';
            e.preventDefault();
            break;
          }
        }
      }
    };

    const handleGlobalMouseUp = () => {
      if (isDraggingRef.current && draggedParticleRef.current) {
        draggedParticleRef.current.stopDrag();
        draggedParticleRef.current = null;
        isDraggingRef.current = false;
        document.body.style.cursor = '';
      }
    };

    // Add all event listeners
    window.addEventListener('resize', handleResize, { passive: true });
    document.addEventListener('mousemove', handleGlobalMouseMove, { passive: false });
    document.addEventListener('mousedown', handleGlobalMouseDown, { passive: false });
    document.addEventListener('mouseup', handleGlobalMouseUp, { passive: true });

    // Start animation
    setTimeout(() => {
      animationFrameRef.current = requestAnimationFrame(animate);
    }, 100);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mousedown', handleGlobalMouseDown);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (isDraggingRef.current) {
        document.body.style.cursor = '';
      }
    };
  }, [activeSection]); // Single dependency

  // Get background color based on active section
  const getBackgroundColor = (activeSection) => {
    const colors = {
      hero: 'rgba(59, 130, 246, 0.04)',      // blue
      about: 'rgba(147, 51, 234, 0.04)',     // purple
      projects: 'rgba(245, 158, 11, 0.04)',   // amber
      blog: 'rgba(239, 68, 68, 0.04)',       // red
      contact: 'rgba(16, 185, 129, 0.04)'    // green
    };
    return colors[activeSection] || colors.hero;
  };

  return (
    <>
      {/* Debug indicator - remove later */}
      <div className="fixed top-20 right-4 z-50 bg-black text-white px-3 py-1 rounded text-sm">
        Section: {activeSection}
      </div>

      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-0"
        style={{
          opacity: 0.85,
          backgroundColor: getBackgroundColor(activeSection),
          filter: 'blur(1.2px)',
          transition: 'background-color 0.8s ease, filter 0.3s ease',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          position: 'fixed'
        }}
      />
    </>
  );
});

ParticleBackground.displayName = 'ParticleBackground';

export default ParticleBackground;