import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Optimized VuurGuide component using modern React patterns
 *
 * Improvements:
 * - Eliminated recursive setTimeout pattern
 * - Uses proper useEffect dependencies
 * - Implements proper cleanup
 * - Optimized with memo and useCallback
 * - More predictable state management
 */
const VuurGuide = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isInitialShown, setIsInitialShown] = useState(false);

  const messages = useMemo(() => [
    "👋 Hello! I'm Vuur, your AI guide. Click me for tips on navigating this portfolio.",
    "Use the progress bar at the top to see how far you've explored.",
    "Check out the Projects section to see my recent work and technical skills.",
    "Don't forget to visit the Blog section for insights and tutorials.",
    "Need to get in touch? The Contact form is fully functional - try it out!",
    "You can download my resume from the About section for more details."
  ], []);

  // Optimized typewriter effect using a single interval
  const startTypewriter = useCallback((text) => {
    setIsTyping(true);
    setDisplayText('');

    let index = 0;
    const typeInterval = setInterval(() => {
      if (index < text.length) {
        setDisplayText(prev => prev + text.charAt(index));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(typeInterval);
      }
    }, 30);

    return () => clearInterval(typeInterval);
  }, []);

  // Initial display timer
  useEffect(() => {
    if (!hasInteracted && !isInitialShown) {
      const initialTimer = setTimeout(() => {
        setIsOpen(true);
        setIsInitialShown(true);
        startTypewriter(messages[0]);
      }, 4000);

      return () => clearTimeout(initialTimer);
    }
  }, [hasInteracted, isInitialShown, messages, startTypewriter]);

  // Message rotation timer - only when open and user hasn't interacted
  useEffect(() => {
    if (isOpen && !hasInteracted && !isTyping) {
      const rotationTimer = setTimeout(() => {
        const nextMessage = (currentMessage + 1) % messages.length;
        setCurrentMessage(nextMessage);
        startTypewriter(messages[nextMessage]);
      }, 8000); // Reduced from 10s for better UX

      return () => clearTimeout(rotationTimer);
    }
  }, [isOpen, hasInteracted, isTyping, currentMessage, messages, startTypewriter]);

  const handleToggle = useCallback(() => {
    setHasInteracted(true);

    if (!isOpen) {
      setIsOpen(true);
      startTypewriter(messages[currentMessage]);
    } else {
      setIsOpen(false);
      setDisplayText('');
      setIsTyping(false);
    }
  }, [isOpen, messages, currentMessage, startTypewriter]);

  const handleNextTip = useCallback((e) => {
    e.stopPropagation();
    setHasInteracted(true);

    const nextMessage = (currentMessage + 1) % messages.length;
    setCurrentMessage(nextMessage);
    startTypewriter(messages[nextMessage]);
  }, [currentMessage, messages, startTypewriter]);

  // Animation variants for better performance
  const bubbleVariants = useMemo(() => ({
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 20,
      transition: { duration: 0.2 }
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3,
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    }
  }), []);

  const buttonVariants = useMemo(() => ({
    hover: { scale: 1.1 },
    tap: { scale: 0.95 }
  }), []);

  return (
    <div className="vuur-container">
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            className="vuur-bubble"
            variants={bubbleVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            layout
          >
            <p className="text-gray-700 pr-6 min-h-[2em] flex items-center">
              {displayText}
              {isTyping && (
                <motion.span
                  className="inline-block w-2 h-4 bg-primary-color/70 ml-1"
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                />
              )}
            </p>
            <button
              onClick={handleNextTip}
              className="absolute top-2 right-2 text-gray-400 hover:text-primary-color transition-colors p-1 focus:outline-none focus:ring-2 focus:ring-primary-color/20 rounded"
              title="Next tip"
              aria-label="Show next tip"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={handleToggle}
        className="vuur-button focus:outline-none focus:ring-2 focus:ring-primary-color/30"
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        aria-label={isOpen ? "Close guide" : "Open guide"}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.svg
              key="close"
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </motion.svg>
          ) : (
            <motion.svg
              key="bulb"
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
});

VuurGuide.displayName = 'VuurGuide';

export default VuurGuide;