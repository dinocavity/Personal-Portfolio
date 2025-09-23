import { memo, useMemo, useState } from 'react';
import ContactDialog from '../ui/ContactDialog';
import { useScroll } from '../../contexts/ScrollContext';


const Footer = memo(() => {
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { activeSection } = useScroll();

  // Get dynamic colors based on active section
  const colors = useMemo(() => {
    const colorMap = {
      hero: { primary: '#1e3a8a', light: '#3b82f6', accent: '#60a5fa' },      // blue
      skills: { primary: '#0f766e', light: '#14b8a6', accent: '#5eead4' },    // teal
      projects: { primary: '#92400e', light: '#f59e0b', accent: '#fbbf24' },  // amber
      certifications: { primary: '#c2410c', light: '#f97316', accent: '#fb923c' }, // orange
      personal: { primary: '#581c87', light: '#9333ea', accent: '#a855f7' },  // purple
      footer: { primary: '#991b1b', light: '#ef4444', accent: '#f87171' }     // red
    };
    return colorMap[activeSection] || colorMap.footer;
  }, [activeSection]);


  return (
    <footer id="footer" className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4" style={{ color: colors.light }}>Dion Marquez</h3>
            <p className="text-gray-400 mb-4">
              IT Student specializing in building exceptional web experiences.
            </p>
            <div className="flex space-x-4">
              <div className="relative group">
                <a
                  href="https://www.linkedin.com/in/dion-cedrick-marquez-014b97360/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 transition-colors"
                  aria-label="LinkedIn"
                  onMouseEnter={(e) => e.target.style.color = colors.light}
                  onMouseLeave={(e) => e.target.style.color = '#9CA3AF'}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
                  LinkedIn
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>

              <div className="relative group">
                <a href="https://github.com/Dae-de-bug" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="GitHub">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
                  GitHub
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>

              <div className="relative group">
                <a href="https://www.onlinejobs.ph/jobseekers/info/4451931" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="OnlineJobs.ph">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                    <circle cx="7" cy="9" r="2" fill="currentColor"/>
                    <path d="M14 10h5M14 13h3" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M5 16c0-1.5 1-3 2-3s2 1.5 2 3" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  </svg>
                </a>
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
                  OnlineJobs.ph
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>

              <div className="relative group">
                <a href="https://x.com/DionCedrickMar1" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="X (Twitter)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
                  X (Twitter)
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>

              <div className="relative group">
                <a href="/marquezcv.pdf" download className="text-gray-400 hover:text-white transition-colors" aria-label="Resume">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                    <polyline points="14,2 14,8 20,8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10,9 9,9 8,9"/>
                  </svg>
                </a>
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
                  Resume
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4" style={{ color: colors.light }}>Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#hero"
                  className="text-gray-400 transition-colors"
                  onMouseEnter={(e) => e.target.style.color = colors.light}
                  onMouseLeave={(e) => e.target.style.color = '#9CA3AF'}
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#skills"
                  className="text-gray-400 transition-colors"
                  onMouseEnter={(e) => e.target.style.color = colors.light}
                  onMouseLeave={(e) => e.target.style.color = '#9CA3AF'}
                >
                  Skills
                </a>
              </li>
              <li>
                <a
                  href="#projects"
                  className="text-gray-400 transition-colors"
                  onMouseEnter={(e) => e.target.style.color = colors.light}
                  onMouseLeave={(e) => e.target.style.color = '#9CA3AF'}
                >
                  Projects
                </a>
              </li>
              <li>
                <a
                  href="#certifications"
                  className="text-gray-400 transition-colors"
                  onMouseEnter={(e) => e.target.style.color = colors.light}
                  onMouseLeave={(e) => e.target.style.color = '#9CA3AF'}
                >
                  Certificates
                </a>
              </li>
              <li>
                <a
                  href="#personal"
                  className="text-gray-400 transition-colors"
                  onMouseEnter={(e) => e.target.style.color = colors.light}
                  onMouseLeave={(e) => e.target.style.color = '#9CA3AF'}
                >
                  Personal
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4" style={{ color: colors.light }}>Contact Info</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-start space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Malasiga Drive, San Roque, Zamboanga City, Philippines, 7000</span>
              </li>
              <li className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>dioncedrickmarquez@gmail.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+639067071311</span>
              </li>
            </ul>
            <button
              onClick={() => setIsDialogOpen(true)}
              className="mt-4 btn-primary !flex !items-center !space-x-2 !px-4 !py-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              <span className="relative z-10">Send Message</span>
            </button>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
          <p>&copy; {currentYear} Dion Cedrick Marquez. All rights reserved.</p>
        </div>
      </div>

      {/* Contact Dialog */}
      <ContactDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;