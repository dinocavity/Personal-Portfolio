import { useEffect, useRef, memo } from 'react';
import { useScroll } from '../../contexts/ScrollContext';

const ParticleBackground = memo(() => {
  const { progress, activeSection } = useScroll();

  // Store current activeSection in a ref that gets updated on each render
  const currentActiveSectionRef = useRef(activeSection);
  const lastLoggedSectionRef = useRef(activeSection);

  // Update current section and log changes (only once per change)
  if (currentActiveSectionRef.current !== activeSection && lastLoggedSectionRef.current !== activeSection) {
    const colorMap = {
      hero: '🔵 Blue',
      skills: '🟢 Teal',
      projects: '🟡 Amber',
      certifications: '🟠 Orange',
      personal: '🟣 Purple',
      footer: '🔴 Red'
    };
    console.log(`🎨 Colors: ${colorMap[currentActiveSectionRef.current] || currentActiveSectionRef.current} → ${colorMap[activeSection] || activeSection}`);
    lastLoggedSectionRef.current = activeSection;
  }
  currentActiveSectionRef.current = activeSection;

  const canvasRef = useRef(null);
  const textCanvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const particlesRef = useRef([]);
  const hintParticleRef = useRef(null);
  const showHintRef = useRef(true);
  const hintTimerRef = useRef(null);

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
    const textCanvas = textCanvasRef.current;
    if (!canvas || !textCanvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    const textCtx = textCanvas.getContext('2d', { alpha: true });

    // Ensure true full screen canvas size
    const updateCanvasSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Set canvas dimensions to full viewport for both canvases
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';

      textCanvas.width = width;
      textCanvas.height = height;
      textCanvas.style.width = width + 'px';
      textCanvas.style.height = height + 'px';

      return { width, height };
    };

    // Mouse and touch position calculation
    const getPointerPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      // Handle both mouse and touch events
      const clientX = e.clientX || (e.touches && e.touches[0]?.clientX) || (e.changedTouches && e.changedTouches[0]?.clientX);
      const clientY = e.clientY || (e.touches && e.touches[0]?.clientY) || (e.changedTouches && e.changedTouches[0]?.clientY);

      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    };

    // Special hint particle class that moves gently with a message bubble
    class HintParticle {
      constructor(canvasWidth, canvasHeight) {
        this.x = canvasWidth * 0.8; // Position on the right side
        this.y = canvasHeight * 0.3; // Upper portion
        this.size = 4;
        this.speedX = (Math.random() - 0.5) * 0.3; // Gentle movement
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.originalSpeedX = this.speedX;
        this.originalSpeedY = this.speedY;
        this.opacity = 1;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.isDragged = false;
        this.pulsePhase = 0;
        this.showBubble = true;
        this.bubbleOpacity = 1;

        // For smooth color transitions
        this.currentColor = { r: 59, g: 130, b: 246 };
        this.targetColor = { r: 59, g: 130, b: 246 };
        this.colorTransitionSpeed = 0.08;
      }

      isMouseOver(mouseX, mouseY) {
        const distance = Math.sqrt((mouseX - this.x) ** 2 + (mouseY - this.y) ** 2);
        return distance <= this.size + 20;
      }

      startDrag() {
        this.isDragged = true;
        this.speedX = 0;
        this.speedY = 0;
        this.showBubble = false; // Hide bubble when dragged
      }

      stopDrag() {
        this.isDragged = false;
        // Resume autonomous movement with new random speeds
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.originalSpeedX = this.speedX;
        this.originalSpeedY = this.speedY;
        // Don't show bubble again after being dragged
      }

      moveTo(x, y) {
        if (this.isDragged) {
          this.x = x;
          this.y = y;
        }
      }

      update() {
        // Pulsing animation
        this.pulsePhase += 0.08;

        // Gentle autonomous movement when not being dragged
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

      draw(ctx, activeSection, textCtx = null) {
        // Define colors for each section - diverse color palette
        const sectionColors = {
          hero: { r: 59, g: 130, b: 246 },        // #3b82f6 (blue)
          skills: { r: 20, g: 184, b: 166 },      // #14b8a6 (teal)
          projects: { r: 245, g: 158, b: 11 },    // #f59e0b (amber)
          certifications: { r: 249, g: 115, b: 22 }, // #f97316 (orange)
          personal: { r: 147, g: 51, b: 234 },    // #9333ea (purple)
          footer: { r: 239, g: 68, b: 68 }        // #ef4444 (red)
        };

        const newTargetColor = sectionColors[activeSection] || sectionColors.hero;
        this.targetColor = { ...newTargetColor };

        const r = Math.round(this.currentColor.r);
        const g = Math.round(this.currentColor.g);
        const b = Math.round(this.currentColor.b);

        // Draw pulsing particle
        const pulseSize = this.size + Math.sin(this.pulsePhase) * 1.5;
        ctx.globalAlpha = this.isDragged ? 1.0 : this.opacity;
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, pulseSize, 0, Math.PI * 2);
        ctx.fill();

        // Add glow effect
        ctx.globalAlpha = 0.4;
        ctx.beginPath();
        ctx.arc(this.x, this.y, pulseSize * 2, 0, Math.PI * 2);
        ctx.fill();

        // Draw message bubble on separate text canvas if visible and textCtx is provided
        if (this.showBubble && this.bubbleOpacity > 0 && textCtx) {
          this.drawMessageBubble(textCtx, r, g, b);
        }
      }

      drawMessageBubble(ctx, r, g, b) {
        const bubbleX = this.x - 120;
        const bubbleY = this.y - 50;
        const bubbleWidth = 140;
        const bubbleHeight = 35;
        const cornerRadius = 8;

        ctx.globalAlpha = this.bubbleOpacity * 0.9;

        // Draw bubble background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.beginPath();
        ctx.roundRect(bubbleX, bubbleY, bubbleWidth, bubbleHeight, cornerRadius);
        ctx.fill();

        // Draw bubble border
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.6)`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Draw bubble tail (pointing to particle)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.beginPath();
        ctx.moveTo(bubbleX + bubbleWidth - 10, bubbleY + bubbleHeight);
        ctx.lineTo(this.x - 8, this.y - 8);
        ctx.lineTo(bubbleX + bubbleWidth, bubbleY + bubbleHeight - 10);
        ctx.closePath();
        ctx.fill();

        // Draw text
        ctx.globalAlpha = this.bubbleOpacity;
        ctx.fillStyle = 'white';
        ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('You can drag any particle!', bubbleX + bubbleWidth/2, bubbleY + bubbleHeight/2 + 4);
      }

      hideBubble() {
        this.showBubble = false;
      }
    }

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
        // Define colors for each section - diverse color palette
        const sectionColors = {
          hero: { r: 59, g: 130, b: 246 },        // #3b82f6 (blue)
          skills: { r: 20, g: 184, b: 166 },      // #14b8a6 (teal)
          projects: { r: 245, g: 158, b: 11 },    // #f59e0b (amber)
          certifications: { r: 249, g: 115, b: 22 }, // #f97316 (orange)
          personal: { r: 147, g: 51, b: 234 },    // #9333ea (purple)
          footer: { r: 239, g: 68, b: 68 }        // #ef4444 (red)
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

      // Create hint particle
      hintParticleRef.current = new HintParticle(width, height);

      // Set timer to hide hint after 10 seconds
      if (hintTimerRef.current) {
        clearTimeout(hintTimerRef.current);
      }
      hintTimerRef.current = setTimeout(() => {
        if (hintParticleRef.current) {
          hintParticleRef.current.hideBubble();
        }
      }, 10000);
    };

    createParticles();
    console.log('Particles created:', particlesRef.current.length, 'Canvas size:', width, 'x', height);

    // Connection drawing with smooth section-based color transitions
    const drawConnections = (ctx, particles, activeSection) => {
      ctx.globalAlpha = 1;
      ctx.lineWidth = 1;

      // Define colors for each section - matching App.jsx color system
      const sectionColors = {
        hero: { r: 59, g: 130, b: 246 },        // #3b82f6 (blue)
        skills: { r: 20, g: 184, b: 166 },      // #14b8a6 (teal)
        projects: { r: 245, g: 158, b: 11 },    // #f59e0b (amber)
        certifications: { r: 249, g: 115, b: 22 }, // #f97316 (orange)
        personal: { r: 147, g: 51, b: 234 },    // #9333ea (purple)
        footer: { r: 239, g: 68, b: 68 }        // #ef4444 (red)
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

      // Create combined array of all particles including hint particle
      const allParticles = [...particles];
      if (hintParticleRef.current) {
        allParticles.push(hintParticleRef.current);
      }

      for (let a = 0; a < allParticles.length; a++) {
        for (let b = a + 1; b < allParticles.length; b++) {
          const dx = allParticles[a].x - allParticles[b].x;
          const dy = allParticles[a].y - allParticles[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            const opacity = (1 - distance / 150) * 0.8;
            ctx.strokeStyle = `rgba(${connectionColor.r}, ${connectionColor.g}, ${connectionColor.b}, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(allParticles[a].x, allParticles[a].y);
            ctx.lineTo(allParticles[b].x, allParticles[b].y);
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
        textCtx.clearRect(0, 0, width, height);

        const particles = particlesRef.current;

        for (let i = 0; i < particles.length; i++) {
          particles[i].update();
          particles[i].draw(ctx, currentActiveSectionRef.current);
        }

        // Update and draw hint particle
        if (hintParticleRef.current) {
          hintParticleRef.current.update();
          hintParticleRef.current.draw(ctx, currentActiveSectionRef.current, textCtx);
        }

        drawConnections(ctx, particles, currentActiveSectionRef.current);

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

          // Check hint particle hover
          if (hintParticleRef.current && hintParticleRef.current.isMouseOver(mouseRef.current.x, mouseRef.current.y)) {
            hoveredParticle = hintParticleRef.current;
          }

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

      // Update hint particle position for new canvas size
      if (hintParticleRef.current) {
        hintParticleRef.current.canvasWidth = width;
        hintParticleRef.current.canvasHeight = height;
        // Reposition to maintain relative position
        hintParticleRef.current.x = Math.min(width * 0.8, width - 150);
        hintParticleRef.current.y = Math.min(height * 0.3, height - 100);
      }
    };

    // Add resize event listener
    window.addEventListener('resize', handleResize, { passive: true });

    // Consolidated pointer event handlers (mouse and touch)
    const handleGlobalPointerMove = (e) => {
      const pointerPos = getPointerPos(e);
      mouseRef.current = pointerPos;

      if (isDraggingRef.current && draggedParticleRef.current) {
        draggedParticleRef.current.moveTo(pointerPos.x, pointerPos.y);
      }

      // Update cursor based on particle proximity (only for mouse, not touch)
      if (!isDraggingRef.current && e.type === 'mousemove' &&
          !e.target.closest('a, button, input, textarea, select, [role="button"], [tabindex]') &&
          !e.target.hasAttribute('onclick')) {

        let overParticle = false;
        const particles = particlesRef.current;
        for (let i = 0; i < particles.length; i++) {
          if (particles[i].isMouseOver(pointerPos.x, pointerPos.y)) {
            overParticle = true;
            break;
          }
        }

        // Check hint particle
        if (!overParticle && hintParticleRef.current && hintParticleRef.current.isMouseOver(pointerPos.x, pointerPos.y)) {
          overParticle = true;
        }

        document.body.style.cursor = overParticle ? 'grab' : '';
      }
    };

    const handleGlobalPointerDown = (e) => {
      if (e.target.tagName === 'CANVAS' ||
          (!e.target.closest('a, button, input, textarea, select, [role="button"], [tabindex]') &&
           !e.target.hasAttribute('onclick'))) {

        const pointerPos = getPointerPos(e);
        mouseRef.current = pointerPos;

        console.log('Pointer down at:', pointerPos);

        const particles = particlesRef.current;

        // Check hint particle first
        if (hintParticleRef.current && hintParticleRef.current.isMouseOver(pointerPos.x, pointerPos.y)) {
          console.log('✅ Found hint particle at:', hintParticleRef.current.x, hintParticleRef.current.y);
          draggedParticleRef.current = hintParticleRef.current;
          isDraggingRef.current = true;
          hintParticleRef.current.startDrag();
          if (e.type === 'mousedown') {
            document.body.style.cursor = 'grabbing';
          }
          e.preventDefault();
          return;
        }

        // Check regular particles
        for (let i = particles.length - 1; i >= 0; i--) {
          const particle = particles[i];
          if (particle.isMouseOver(pointerPos.x, pointerPos.y)) {
            console.log('✅ Found particle at:', particle.x, particle.y);
            draggedParticleRef.current = particle;
            isDraggingRef.current = true;
            particle.startDrag();
            if (e.type === 'mousedown') {
              document.body.style.cursor = 'grabbing';
            }
            e.preventDefault();
            break;
          }
        }
      }
    };

    const handleGlobalPointerUp = () => {
      if (isDraggingRef.current && draggedParticleRef.current) {
        draggedParticleRef.current.stopDrag();
        draggedParticleRef.current = null;
        isDraggingRef.current = false;
        document.body.style.cursor = '';
      }
    };

    // Add all event listeners (mouse and touch)
    window.addEventListener('resize', handleResize, { passive: true });

    // Mouse events
    document.addEventListener('mousemove', handleGlobalPointerMove, { passive: false });
    document.addEventListener('mousedown', handleGlobalPointerDown, { passive: false });
    document.addEventListener('mouseup', handleGlobalPointerUp, { passive: true });

    // Touch events for mobile
    document.addEventListener('touchmove', handleGlobalPointerMove, { passive: false });
    document.addEventListener('touchstart', handleGlobalPointerDown, { passive: false });
    document.addEventListener('touchend', handleGlobalPointerUp, { passive: true });

    // Start animation
    setTimeout(() => {
      animationFrameRef.current = requestAnimationFrame(animate);
    }, 100);

    return () => {
      window.removeEventListener('resize', handleResize);

      // Remove mouse events
      document.removeEventListener('mousemove', handleGlobalPointerMove);
      document.removeEventListener('mousedown', handleGlobalPointerDown);
      document.removeEventListener('mouseup', handleGlobalPointerUp);

      // Remove touch events
      document.removeEventListener('touchmove', handleGlobalPointerMove);
      document.removeEventListener('touchstart', handleGlobalPointerDown);
      document.removeEventListener('touchend', handleGlobalPointerUp);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (hintTimerRef.current) {
        clearTimeout(hintTimerRef.current);
      }
      if (isDraggingRef.current) {
        document.body.style.cursor = '';
      }
    };
  }, []); // Run only once on mount

  // Get background color based on active section
  const getBackgroundColor = (activeSection) => {
    const colors = {
      hero: 'rgba(59, 130, 246, 0.04)',        // blue
      skills: 'rgba(20, 184, 166, 0.04)',      // teal
      projects: 'rgba(245, 158, 11, 0.04)',    // amber
      certifications: 'rgba(16, 185, 129, 0.04)', // emerald
      personal: 'rgba(147, 51, 234, 0.04)',    // purple
      footer: 'rgba(239, 68, 68, 0.04)'        // red
    };
    return colors[activeSection] || colors.hero;
  };

  return (
    <>

      {/* Main particle canvas with blur effect */}
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

      {/* Text overlay canvas (unblurred) */}
      <canvas
        ref={textCanvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none z-0"
        style={{
          opacity: 1,
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