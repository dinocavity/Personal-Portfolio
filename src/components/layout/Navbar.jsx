import { useState, memo, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useScrollManager from '../../hooks/useScrollManager';

const Navbar = memo(() => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isScrolled, activeSection, scrollToSection, scrollY } = useScrollManager();
  const [logoText, setLogoText] = useState('D.');

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

  useEffect(() => {
    const fullName = 'Dion Cedrick Marquez';

    // Calculate scroll-based progress using more scroll distance
    const typeStartScroll = 100; // Start typing after 100px
    const typeEndScroll = 1500;  // Finish typing at 1500px (much longer range)

    console.log('Scroll Y:', scrollY, 'ActiveSection:', activeSection);

    if (activeSection === 'hero' || scrollY < typeStartScroll) {
      // At hero section or barely scrolled - show D.
      setLogoText('D.');
    } else if (scrollY >= typeStartScroll && scrollY < typeEndScroll) {
      // Scrolling through - progressively type name (much slower)
      const nameProgress = (scrollY - typeStartScroll) / (typeEndScroll - typeStartScroll);
      const charIndex = Math.floor(nameProgress * fullName.length);
      const currentText = fullName.slice(0, Math.max(1, charIndex));
      setLogoText(currentText || 'D');
    } else {
      // Fully scrolled - show DCM
      setLogoText('DCM');
    }
  }, [scrollY, activeSection]);

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
            <Link to="/" className="text-2xl font-bold font-heading text-gradient">
              <span className="inline-block min-w-[12rem]">
                {logoText}
              </span>
            </Link>
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

              {/* Resume Button - appears after hero section */}
              {activeSection !== 'hero' && (
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
              {activeSection !== 'hero' && (
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