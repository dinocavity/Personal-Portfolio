import { useState, memo, useCallback, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useScrollManager from '../../hooks/useScrollManager';

const Navbar = memo(() => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isScrolled, activeSection, scrollToSection, scrollY } = useScrollManager();

  // Get CSS custom properties for gradient colors to match particles exactly
  // Both dark and light colors follow the particle color theme
  const getGradientColors = (activeSection) => {
    const colors = {
      hero: { primary: '#1e3a8a', accent: '#3b82f6' },      // blue: dark → light
      about: { primary: '#581c87', accent: '#9333ea' },     // purple: dark → light
      projects: { primary: '#92400e', accent: '#f59e0b' },  // amber: dark → light
      blog: { primary: '#991b1b', accent: '#ef4444' },      // red: dark → light
      contact: { primary: '#065f46', accent: '#10b981' },   // emerald: dark → light
      footer: { primary: '#065f46', accent: '#10b981' }     // emerald: dark → light
    };
    return colors[activeSection] || colors.hero;
  };

  const navLinks = [
    { title: 'Home', href: '#hero' },
    { title: 'About', href: '#about' },
    { title: 'Work', href: '#projects' },
    { title: 'Blog', href: '#blog' },
    { title: 'Contact', href: '#contact' }
  ];
  
  const handleNavClick = useCallback((e, href) => {
    e.preventDefault();
    const sectionId = href.substring(1); // Remove the '#'
    scrollToSection(sectionId);
    setMobileMenuOpen(false);
  }, [scrollToSection]);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  const handleLogoClick = useCallback((e) => {
    e.preventDefault();
    scrollToSection('hero');
  }, [scrollToSection]);

  // Calculate logo text using useMemo instead of useEffect for better performance
  const logoText = useMemo(() => {
    const fullName = 'Dion Cedrick Marquez';

    // Debug logging to check what's happening with section detection
    console.log('🔍 Navbar Debug - activeSection:', activeSection, 'scrollY:', scrollY);

    if (activeSection === 'hero') {
      // Only show typewriting effect when in hero section
      const heroSection = document.querySelector('#hero');
      if (heroSection) {
        const heroHeight = heroSection.offsetHeight;
        const heroTop = heroSection.offsetTop;
        const heroProgress = Math.max(0, Math.min(1, (scrollY - heroTop) / (heroHeight * 0.8))); // Use 80% of hero height for typing

        if (heroProgress === 0) {
          return 'D.';
        } else if (heroProgress < 1) {
          // Smooth typewriting - allow name to complete before leaving hero
          const charIndex = Math.floor(heroProgress * fullName.length);
          const currentText = fullName.slice(0, Math.max(1, charIndex + 1));
          return currentText;
        } else {
          // Completed typing in hero section
          return fullName;
        }
      } else {
        return 'D.';
      }
    } else if (activeSection === 'about' || activeSection === 'projects' || activeSection === 'blog') {
      // Show full name for middle sections
      return fullName;
    } else {
      // Show DCM for contact and footer sections
      return 'DCM';
    }
  }, [activeSection, scrollY]);

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
      isScrolled ? 'py-3 glass' : 'bg-transparent py-6'
    }`}>
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center">
              <Link to="/" onClick={handleLogoClick} className="text-2xl font-bold font-heading cursor-pointer">
                <span
                  className="inline-block min-w-[16rem] transition-all duration-500 text-gradient"
                  style={{
                    '--primary-color': getGradientColors(activeSection).primary,
                    '--accent-color': getGradientColors(activeSection).accent,
                    filter: 'blur(0.3px)', // Subtle blur effect
                    textShadow: '0 0 8px rgba(0,0,0,0.1)' // Soft glow
                  }}
                >
                  {logoText}
                </span>
              </Link>

              {/* Resume button - show when displaying full name, hide when DCM */}
              <AnimatePresence>
                {logoText === 'Dion Cedrick Marquez' && (
                  <motion.a
                    href="/marquezcv.pdf"
                    download
                    className="text-xs underline decoration-1 hover:no-underline transition-all duration-300"
                    style={{
                      color: getGradientColors(activeSection).accent,
                      opacity: 0.7,
                      fontSize: '10px',
                      marginLeft: '16px',
                      textUnderlineOffset: '2px'
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.7 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    Resume
                  </motion.a>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-8 items-center">
              {navLinks.map((link, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`relative font-medium transition-colors ${
                      activeSection === link.href.substring(1)
                        ? 'text-primary-color'
                        : 'text-gray-700 hover:text-primary-light'
                    }`}
                  >
                    {link.title}
                    {activeSection === link.href.substring(1) && (
                      <motion.span
                        className="absolute -bottom-1 left-0 h-0.5 bg-primary-light"
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 0.3 }}
                      ></motion.span>
                    )}
                  </a>
                </motion.li>
              ))}

              {/* Resume Button - appears after hero section, but only when not showing full name next to logo */}
              {activeSection !== 'hero' && logoText !== 'Dion Cedrick Marquez' && (
                <motion.li
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <a
                    href="/marquezcv.pdf"
                    download
                    className="btn-primary text-sm px-4 py-2"
                  >
                    Resume
                  </a>
                </motion.li>
              )}
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden text-gray-700 z-50"
            onClick={toggleMobileMenu}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-8 h-8 flex flex-col justify-center items-center">
              <span 
                className={`block w-6 h-0.5 bg-gray-700 transition-all duration-300 ${
                  mobileMenuOpen ? 'transform rotate-45 translate-y-1' : 'mb-1.5'
                }`}
              ></span>
              <span 
                className={`block w-6 h-0.5 bg-gray-700 transition-all duration-300 ${
                  mobileMenuOpen ? 'opacity-0' : 'mb-1.5'
                }`}
              ></span>
              <span 
                className={`block w-6 h-0.5 bg-gray-700 transition-all duration-300 ${
                  mobileMenuOpen ? 'transform -rotate-45 -translate-y-1' : ''
                }`}
              ></span>
            </div>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="md:hidden glass py-6 px-6 absolute top-full left-0 w-full"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ul className="space-y-4">
              {navLinks.map((link, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`block py-2 font-medium ${
                      activeSection === link.href.substring(1)
                        ? 'text-primary-color'
                        : 'text-gray-700'
                    }`}
                  >
                    {link.title}
                  </a>
                </motion.li>
              ))}

              {/* Resume Button - mobile menu */}
              {activeSection !== 'hero' && logoText !== 'Dion Cedrick Marquez' && (
                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: navLinks.length * 0.1 }}
                >
                  <a
                    href="/marquezcv.pdf"
                    download
                    className="btn-primary inline-block text-sm px-4 py-2 mt-2"
                  >
                    Resume
                  </a>
                </motion.li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;