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
 */
const useScrollManager = () => {
  const [scrollData, setScrollData] = useState({
    progress: 0,
    activeSection: 'hero',
    isScrolled: false,
    scrollY: 0
  });

  const rafRef = useRef(null);
  const sectionsCache = useRef(new Map());
  const lastUpdate = useRef(0);

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

      // Find active section efficiently
      let activeSection = 'hero';

      // Always rebuild section cache to ensure accurate positions
      sectionsCache.current.clear();
      const sections = document.querySelectorAll('section[id], footer[id]');
      sections.forEach(section => {
        sectionsCache.current.set(section.id, {
          element: section,
          offsetTop: section.offsetTop,
          offsetHeight: section.offsetHeight
        });
      });

      // Find active section based on scroll position
      const viewportMiddle = scrollY + window.innerHeight / 2;

      for (const [sectionId, data] of sectionsCache.current) {
        const { offsetTop, offsetHeight } = data;
        if (viewportMiddle >= offsetTop && viewportMiddle < offsetTop + offsetHeight) {
          activeSection = sectionId;
          break;
        }
      }

      // Update state only if values changed
      setScrollData(prevData => {
        if (
          Math.abs(prevData.progress - progress) > 0.1 || // Only update if progress changed by more than 0.1%
          prevData.activeSection !== activeSection ||
          prevData.isScrolled !== isScrolled ||
          Math.abs(prevData.scrollY - scrollY) > 10 // Only update scrollY if changed by more than 10px
        ) {
          return {
            progress: Math.round(progress * 10) / 10, // Round to 1 decimal place
            activeSection,
            isScrolled,
            scrollY
          };
        }
        return prevData;
      });
    });
  }, []);

  // Debounced resize handler to update section positions
  const handleResize = useCallback(() => {
    // Clear section cache on resize
    sectionsCache.current.clear();
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

  // Smooth scroll utility function
  const scrollToSection = useCallback((sectionId) => {
    const element = document.querySelector(`#${sectionId}`);
    if (element) {
      const targetPosition = element.offsetTop - 80; // Account for navbar height

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  }, []);

  return {
    ...scrollData,
    scrollToSection
  };
};

export default useScrollManager;