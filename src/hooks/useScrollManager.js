import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Consolidated scroll manager hook that handles all scroll-related functionality
 * Eliminates redundant scroll listeners and optimizes performance
 *
 * Features:
 * - Single scroll event listener for the entire app
 * - Throttled scroll events for better performance
 * - Progress calculation
 * - Active section tracking
 * - Scroll state management
 * - Minimal re-renders with stable references
 */
// Generate unique instance ID to track multiple hook instances
let instanceCounter = 0;

const useScrollManager = () => {
  const instanceId = useRef(++instanceCounter);

  const [scrollData, setScrollData] = useState({
    progress: 0,
    activeSection: 'hero',
    isScrolled: false,
    scrollY: 0
  });

  const rafRef = useRef(null);
  const lastUpdate = useRef(0);
  const stableScrollDataRef = useRef(scrollData);

  // Throttled scroll handler using requestAnimationFrame
  const handleScroll = useCallback(() => {
    // Cancel previous frame if pending
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      const now = performance.now();

      // Throttle to ~60fps max (16.67ms between updates)
      if (now - lastUpdate.current < 16.67) return;
      lastUpdate.current = now;

      const scrollY = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

      // Calculate progress (0-100)
      const progress = documentHeight > 0 ? Math.min((scrollY / documentHeight) * 100, 100) : 0;

      // Check if scrolled past threshold
      const isScrolled = scrollY > 50;

      // Simple real-time section detection without caching
      let activeSection = 'hero';

      // Get all sections fresh every time
      const sections = document.querySelectorAll('section[id], footer[id]');
      const viewportTop = scrollY;
      const viewportMiddle = scrollY + window.innerHeight / 2;
      const viewportBottom = scrollY + window.innerHeight;

      let bestSection = null;
      let maxVisibleArea = 0;
      let debugInfo = `\n📊 Real-time Scroll (scrollY: ${Math.round(scrollY)}):\n`;

      // Check each section in real-time
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const offsetTop = section.offsetTop;
        const offsetHeight = section.offsetHeight;
        const sectionBottom = offsetTop + offsetHeight;

        // Calculate visible area of this section
        const visibleTop = Math.max(viewportTop, offsetTop);
        const visibleBottom = Math.min(viewportBottom, sectionBottom);
        const visibleArea = Math.max(0, visibleBottom - visibleTop);
        const visiblePercentage = offsetHeight > 0 ? (visibleArea / offsetHeight * 100).toFixed(1) : '0.0';

        debugInfo += `  ${section.id}: ${Math.round(visibleArea)}px (${visiblePercentage}%) visible\n`;

        // If this section has the most visible area, it's the active one
        if (visibleArea > maxVisibleArea) {
          maxVisibleArea = visibleArea;
          bestSection = section.id;
        }
      });

      // Log debug info occasionally
      if (Math.random() < 0.1) {
        console.log(debugInfo + `  → Active: ${bestSection} (${Math.round(maxVisibleArea)}px visible)`);
      }

      // Use the section with most visible area
      activeSection = bestSection || 'hero';

      // Update state when values change significantly
      setScrollData(prevData => {
        // Use the calculated active section directly (no hysteresis)
        let newActiveSection = activeSection;
        if (prevData.activeSection !== activeSection) {
          console.log(`🔄 Section change: ${prevData.activeSection} → ${activeSection} (scrollY: ${Math.round(scrollY)})`);
        }

        if (
          Math.abs(prevData.progress - progress) > 0.1 || // Only update if progress changed by more than 0.1%
          prevData.activeSection !== newActiveSection ||
          prevData.isScrolled !== isScrolled ||
          Math.abs(prevData.scrollY - scrollY) > 10 // Only update scrollY if changed by more than 10px
        ) {
          const newData = {
            progress: Math.round(progress * 10) / 10, // Round to 1 decimal place
            activeSection: newActiveSection,
            isScrolled,
            scrollY
          };
          stableScrollDataRef.current = newData;
          return newData;
        }
        return prevData;
      });
    });
  }, []);

  // Simple resize handler
  const handleResize = useCallback(() => {
    // No cache to clear, just recalculate
    handleScroll(); // Recalculate immediately
  }, [handleScroll]);

  useEffect(() => {
    // Use passive listener for better performance
    const scrollOptions = { passive: true };
    const resizeOptions = { passive: true };

    window.addEventListener('scroll', handleScroll, scrollOptions);
    window.addEventListener('resize', handleResize, resizeOptions);

    // Initial calculation
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll, scrollOptions);
      window.removeEventListener('resize', handleResize, resizeOptions);

      // Cancel any pending animation frame
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [handleScroll, handleResize]);

  // Smooth scroll utility function with retry logic
  const scrollToSection = useCallback((sectionId, retryCount = 0) => {
    console.log('🔍 Scrolling to section:', sectionId, 'Retry:', retryCount);
    const element = document.querySelector(`#${sectionId}`);

    if (element) {
      const targetPosition = element.offsetTop - 80; // Account for navbar height
      console.log('📍 Element found, scrolling to position:', targetPosition);

      // Try alternative scroll method if smooth scrolling doesn't work
      try {
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      } catch (error) {
        // Fallback for older browsers or mobile issues
        console.log('⚠️ Smooth scroll failed, using fallback');
        window.scrollTo(0, targetPosition);
      }
    } else {
      console.error('❌ Element not found:', `#${sectionId}`, 'Retry:', retryCount);

      // Retry up to 3 times with increasing delays for navigation scenarios
      if (retryCount < 3) {
        const delay = (retryCount + 1) * 200; // 200ms, 400ms, 600ms
        setTimeout(() => {
          scrollToSection(sectionId, retryCount + 1);
        }, delay);
      } else {
        console.error('❌ Failed to find element after retries:', `#${sectionId}`);
      }
    }
  }, []);

  return {
    ...scrollData,
    scrollToSection
  };
};

export default useScrollManager;