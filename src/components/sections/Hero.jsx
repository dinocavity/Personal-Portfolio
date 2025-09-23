import { useState, useEffect, useMemo, memo, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  SiReact,
  SiJavascript,
  SiNodedotjs,
  SiPython
} from 'react-icons/si';
import {
  MdCode
} from 'react-icons/md';
import ContactDialog from '../ui/ContactDialog';

const Hero = memo(() => {
  const [isVisible, setIsVisible] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const jsIconRef = useRef(null);
  const dragStartRef = useRef({ x: 0, y: 0, rotation: 0 });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Calculate font scale from rotation (0-360° maps to 0.8x-1.4x)
  const fontScale = useMemo(() => {
    const normalizedRotation = ((rotation % 360) + 360) % 360;
    return 0.8 + (normalizedRotation / 360) * 0.6;
  }, [rotation]);

  // Update global font scale
  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', fontScale.toString());
  }, [fontScale]);

  // Mouse drag handlers
  const handleMouseDown = useCallback((e) => {
    if (!jsIconRef.current) return;

    const rect = jsIconRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - centerX,
      y: e.clientY - centerY,
      rotation: rotation
    };

    e.preventDefault();
  }, [rotation]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !jsIconRef.current) return;

    const rect = jsIconRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const currentX = e.clientX - centerX;
    const currentY = e.clientY - centerY;

    const startAngle = Math.atan2(dragStartRef.current.y, dragStartRef.current.x);
    const currentAngle = Math.atan2(currentY, currentX);
    const angleDiff = (currentAngle - startAngle) * (180 / Math.PI);

    setRotation(dragStartRef.current.rotation + angleDiff);
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Global mouse events for drag
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const fadeIn = useMemo(() => ({
    hidden: { opacity: 0, y: 40 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: custom * 0.2,
        duration: 0.8,
        ease: [0.215, 0.61, 0.355, 1]
      }
    })
  }), []);
  
  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      
      <div className="container mx-auto px-6 md:px-12 z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          <div className="lg:w-1/2">
            {isVisible && (
              <>
                <motion.h1
                  custom={0}
                  initial="hidden"
                  animate="visible"
                  variants={fadeIn}
                  className="text-5xl sm:text-7xl font-bold mb-6"
                >
                  I'm <span className="text-gradient">Dion Cedrick</span> Marquez
                </motion.h1>

                <motion.p
                  custom={1}
                  initial="hidden"
                  animate="visible"
                  variants={fadeIn}
                  className="text-gray-700 text-lg mb-10 max-w-xl"
                >
                  Information Technology graduate specializing in frontend development and full-stack web applications. Experienced in commissioned client projects and business systems using React.js, JavaScript, and modern web technologies.
                </motion.p>

                <motion.div
                  custom={2}
                  initial="hidden"
                  animate="visible"
                  variants={fadeIn}
                  className="flex flex-wrap gap-5"
                >
                  <button
                    onClick={() => setContactDialogOpen(true)}
                    className="btn-primary"
                  >
                    <span className="relative z-10">Let's Talk</span>
                  </button>
                  <a href="/documents/resume.pdf" download className="btn-outline">
                    See Resume
                  </a>
                </motion.div>
                
              </>
            )}
          </div>
          
          <div className="lg:w-1/2 flex justify-center">
            {isVisible && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ 
                  duration: 1, 
                  delay: 0.4, 
                  ease: [0.215, 0.61, 0.355, 1] 
                }}
                className="relative"
              >
                <div className="absolute -inset-4 bg-gradient-to-tr from-primary-color via-primary-light to-accent-color rounded-full opacity-10 blur-2xl animate-pulse"></div>
                <div className="relative">
                  <div className="w-72 h-72 sm:w-96 sm:h-96 rounded-2xl bg-white p-2 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                    <div className="w-full h-full rounded-xl overflow-hidden">
                      <img 
                        src="/profile/hero1.jpg" 
                        alt="Dion Cedrick Marquez" 
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                  </div>
                  
                  {/* Technology badge */}
                  <motion.div
                    className="absolute -right-8 top-10 bg-white rounded-xl px-4 py-2 shadow-lg"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1, duration: 0.5 }}
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-primary-color/10 flex items-center justify-center rounded-full mr-2">
                        <SiReact className="h-5 w-5 text-primary-color" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">React.js</div>
                        <div className="text-primary-color font-bold">Developer</div>
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Skill badge */}
                  <motion.div
                    className="absolute -left-10 top-2/3 bg-white rounded-xl px-4 py-2 shadow-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.3, duration: 0.5 }}
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-accent-color/10 flex items-center justify-center rounded-full mr-2">
                        <MdCode className="h-5 w-5 text-accent-color" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">Full Stack Dev</div>
                        <div className="text-accent-color font-bold">React & Node.js</div>
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Tech icons with dynamic animations */}
                  {[
                    { icon: SiJavascript, color: '#F7DF1E', top: '-10%', left: '15%', delay: 1.6 },
                    { icon: SiReact, color: '#61DAFB', top: '10%', right: '-15%', delay: 1.8 },
                    { icon: SiNodedotjs, color: '#339933', bottom: '-5%', right: '20%', delay: 2 },
                    { icon: SiPython, color: '#3776AB', bottom: '15%', left: '-10%', delay: 2.2 }
                  ].map((tech, index) => (
                    <motion.div
                      key={index}
                      className="absolute w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform duration-300"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: tech.delay, duration: 0.5, type: 'spring' }}
                      style={{
                        top: tech.top || 'auto',
                        left: tech.left || 'auto',
                        right: tech.right || 'auto',
                        bottom: tech.bottom || 'auto'
                      }}
                    >
                      <tech.icon className="w-7 h-7" style={{ color: tech.color }} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Contact Dialog */}
      <ContactDialog
        isOpen={contactDialogOpen}
        onClose={() => setContactDialogOpen(false)}
      />

    </section>
  );
});

Hero.displayName = 'Hero';

export default Hero;