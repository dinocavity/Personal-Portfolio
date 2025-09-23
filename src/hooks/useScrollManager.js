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

      // Find active section efficiently
      let activeSection = 'hero';

      // Build section cache only if empty (performance optimization)
      if (sectionsCache.current.size === 0) {
        const sections = document.querySelectorAll('section[id], footer[id]');
        console.log('🔍 Found sections:', Array.from(sections).map(s => s.id));
        sections.forEach(section => {
          sectionsCache.current.set(section.id, {
            element: section,
            offsetTop: section.offsetTop,
            offsetHeight: section.offsetHeight
          });
        });
        console.log('📐 Section positions cached');
      }

      // Find active section based on scroll position - more robust detection
      const viewportTop = scrollY;
      const viewportMiddle = scrollY + window.innerHeight / 2;
      const viewportBottom = scrollY + window.innerHeight;

      let foundSection = null;
      let bestSection = null;
      let maxVisibleArea = 0;

      // Find section with largest visible area (more reliable than just middle point)
      for (const [sectionId, data] of sectionsCache.current) {
        const { offsetTop, offsetHeight } = data;
        const sectionBottom = offsetTop + offsetHeight;

        // Calculate visible area of this section
        const visibleTop = Math.max(viewportTop, offsetTop);
        const visibleBottom = Math.min(viewportBottom, sectionBottom);
        const visibleArea = Math.max(0, visibleBottom - visibleTop);

        // If this section has the most visible area, it's the active one
        if (visibleArea > maxVisibleArea) {
          maxVisibleArea = visibleArea;
          bestSection = sectionId;
        }

        // Fallback: check if viewport middle is within this section
        if (viewportMiddle >= offsetTop && viewportMiddle < sectionBottom) {
          foundSection = sectionId;
        }
      }

      // Use the section with most visible area (more robust)
      activeSection = bestSection || foundSection || 'hero';

      // Special handling for footer - if we're near the bottom, prioritize footer
      const footer = sectionsCache.current.get('footer');
      if (footer && viewportBottom >= footer.offsetTop - 50) {
        activeSection = 'footer';
      }

      // Update state only if values changed significantly (with hysteresis for activeSection)
      setScrollData(prevData => {
        // For section changes, add some hysteresis to prevent rapid switching
        let newActiveSection = activeSection;
        if (prevData.activeSection !== activeSection) {
          // Only change section if it's been stable for a few frames or significantly different
          if (Math.abs(prevData.scrollY - scrollY) > 20) {
            newActiveSection = activeSection;
          } else {
            newActiveSection = prevData.activeSection; // Keep previous section
          }
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