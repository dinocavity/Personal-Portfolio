import { useState, useEffect, useMemo, memo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScroll } from '../../contexts/ScrollContext';

const SocialSidebar = memo(() => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [position, setPosition] = useState({ y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const sidebarRef = useRef(null);
  const { activeSection } = useScroll();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const socialLinks = useMemo(() => [
    { icon: 'linkedin', url: 'https://www.linkedin.com/in/dion-cedrick-marquez-014b97360/', label: 'LinkedIn' },
    { icon: 'github', url: 'https://github.com/Dae-de-bug', label: 'GitHub' },
    { icon: 'onlinejobs', url: 'https://www.onlinejobs.ph/jobseekers/info/4451931', label: 'OnlineJobs.ph' },
    { icon: 'x', url: 'https://x.com/DionCedrickMar1', label: 'X (Twitter)' },
  ], []);

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(true);
    const startY = e.clientY;
    const startPos = position.y;

    const handleMouseMove = (e) => {
      e.preventDefault();
      e.stopPropagation();

      const deltaY = e.clientY - startY;
      const newY = Math.max(-400, Math.min(150, startPos + deltaY));
      setPosition({ y: newY });
    };

    const handleMouseUp = (e) => {
      e.preventDefault();
      e.stopPropagation();

      setIsDragging(false);

      // Use current position.y for decision making
      const currentY = position.y;

      if (currentY > 80) {
        // Dragged down significantly - hide
        setIsHidden(true);
        setPosition({ y: 0 });
      } else if (currentY < -200) {
        // Dragged up significantly - snap to top
        setPosition({ y: -300 });
      } else {
        // Return to default
        setPosition({ y: 0 });
      }

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: false });
    document.addEventListener('mouseup', handleMouseUp, { passive: false });
  }, [position.y]);

  // Hide social sidebar when on footer section or if manually hidden
  if (!isVisible || activeSection === 'footer') return null;

  // Get gradient colors to match other components
  const getGradientColors = (activeSection) => {
    const colors = {
      hero: { primary: '#1e3a8a', light: '#3b82f6', accent: '#60a5fa' },      // blue: dark → medium → light
      personal: { primary: '#581c87', light: '#9333ea', accent: '#a855f7' },  // purple: dark → medium → light
      projects: { primary: '#92400e', light: '#f59e0b', accent: '#fbbf24' },  // amber: dark → medium → light
      blog: { primary: '#991b1b', light: '#ef4444', accent: '#f87171' },      // red: dark → medium → light
      footer: { primary: '#991b1b', light: '#ef4444', accent: '#f87171' }     // red: dark → medium → light
    };
    return colors[activeSection] || colors.hero;
  };

  const currentColors = getGradientColors(activeSection);

  return (
    <>
      <AnimatePresence>
        {!isHidden && (
          <motion.div
            ref={sidebarRef}
            className="fixed left-8 bottom-0 z-50 hidden lg:flex flex-col items-center"
            animate={{ y: position.y }}
            exit={{ y: 100, opacity: 0 }}
            transition={{
              type: "spring",
              damping: isDragging ? 50 : 25,
              stiffness: isDragging ? 800 : 400,
              duration: isDragging ? 0 : 0.3
            }}
            initial={{ y: 0, opacity: 1 }}
            style={{ pointerEvents: 'auto' }}
          >
            {/* Drag handle indicator */}
            <div
              className={`flex items-center justify-center mb-6 transition-all duration-200 ${
                isDragging
                  ? 'cursor-grabbing scale-110'
                  : 'cursor-grab'
              }`}
              onMouseDown={handleMouseDown}
              style={{ userSelect: 'none' }}
            >
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" className="text-gray-500">
                <path d="M8 6h8v2H8V6zm0 4h8v2H8v-2zm0 4h8v2H8v-2z"/>
              </svg>
            </div>

            <div className="flex flex-col space-y-6 mb-6" style={{ pointerEvents: 'auto' }}>
              {/* Resume icon - at the top */}
              <AnimatePresence>
                {activeSection !== 'hero' && (
                  <motion.div
                    className="relative group"
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 10 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    <a
                      href="/marquezcv.pdf"
                      download
                      className="text-gray-600 transition-colors duration-300 block"
                      style={{
                        '--hover-color': currentColors.primary
                      }}
                      onMouseEnter={(e) => {
                        const colors = getGradientColors(activeSection);
                        e.target.style.color = colors.primary;
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = '#4B5563'; // text-gray-600
                      }}
                      aria-label="Download Resume"
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Tooltip */}
                      <div className="absolute left-12 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
                        Resume
                        <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                        <polyline points="14,2 14,8 20,8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/>
                        <line x1="16" y1="17" x2="8" y2="17"/>
                        <polyline points="10,9 9,9 8,9"/>
                      </svg>
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>

              {socialLinks.map((social) => (
                <motion.div
                  key={social.icon}
                  className="relative group"
                  initial={{ opacity: 1, scale: 1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 transition-colors duration-300 block"
                    style={{
                      '--hover-color': currentColors.primary
                    }}
                    onMouseEnter={(e) => {
                      const colors = getGradientColors(activeSection);
                      e.target.style.color = colors.primary;
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = '#4B5563'; // text-gray-600
                    }}
                    aria-label={social.label}
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Tooltip */}
                    <div className="absolute left-12 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
                      {social.label}
                      <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                    </div>
            {social.icon === 'linkedin' && (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            )}
            {social.icon === 'github' && (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            )}
            {social.icon === 'onlinejobs' && (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <circle cx="7" cy="9" r="2" fill="currentColor"/>
                <path d="M14 10h5M14 13h3" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M5 16c0-1.5 1-3 2-3s2 1.5 2 3" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              </svg>
            )}
            {social.icon === 'x' && (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            )}
            {social.icon === 'resume' && (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10,9 9,9 8,9"/>
              </svg>
            )}
            {social.icon === 'facebook' && (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
              </svg>
            )}
                  </a>
                </motion.div>
              ))}
            </div>
            <div className="w-px h-24 bg-gray-300"></div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pull-up tab when hidden - simple button approach */}
      {isHidden && (
        <motion.div
          className="fixed left-8 bottom-0 z-50 hidden lg:block"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <button
            className="bg-gray-600 text-white px-4 py-2 rounded-t-lg shadow-lg hover:bg-gray-700 transition-all duration-300 hover:-translate-y-1"
            onClick={() => {
              setIsHidden(false);
              setPosition({ y: 0 });
            }}
          >
            <div className="flex flex-col items-center space-y-1">
              <svg width="12" height="8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 14l5-5 5 5z"/>
              </svg>
              <span className="text-xs font-medium">Social</span>
            </div>
          </button>
        </motion.div>
      )}
    </>
  );
});

SocialSidebar.displayName = 'SocialSidebar';

export default SocialSidebar;
