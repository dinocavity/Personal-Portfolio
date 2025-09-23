import { useRef, useState, useMemo } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import useScrollManager from '../../hooks/useScrollManager';
import certifications from '../../data/certifications';

const Certifications = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { activeSection } = useScrollManager();

  // Get dynamic colors based on active section
  const colors = useMemo(() => {
    const colorMap = {
      hero: { primary: '#1e3a8a', light: '#3b82f6', accent: '#60a5fa' },      // blue: dark → medium → light
      skills: { primary: '#0f766e', light: '#14b8a6', accent: '#5eead4' },    // teal: dark → medium → light
      projects: { primary: '#92400e', light: '#f59e0b', accent: '#fbbf24' },  // amber: dark → medium → light
      personal: { primary: '#581c87', light: '#9333ea', accent: '#a855f7' },  // purple: dark → medium → light
      certifications: { primary: '#059669', light: '#10b981', accent: '#6ee7b7' }, // emerald: dark → medium → light
      blog: { primary: '#991b1b', light: '#ef4444', accent: '#f87171' },      // red: dark → medium → light
      footer: { primary: '#065f46', light: '#10b981', accent: '#34d399' }     // emerald: dark → medium → light
    };
    return colorMap[activeSection] || colorMap.hero;
  }, [activeSection]);

  // Use only certifications
  const allItems = certifications.map(item => ({ ...item, type: 'certification' }));

  // Pagination state with equal distribution
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(allItems.length / itemsPerPage);

  // Distribute items equally across all pages
  const getEquallyDistributedItems = () => {
    const itemsPerLastPage = allItems.length % itemsPerPage;
    const shouldRedistribute = itemsPerLastPage > 0 && itemsPerLastPage < 3 && totalPages > 1;

    if (shouldRedistribute) {
      // Calculate new distribution to balance pages
      const adjustedItemsPerPage = Math.floor(allItems.length / totalPages);
      const extraItems = allItems.length % totalPages;

      let startIndex = 0;
      for (let i = 1; i < currentPage; i++) {
        startIndex += adjustedItemsPerPage + (i <= extraItems ? 1 : 0);
      }

      const currentPageItems = adjustedItemsPerPage + (currentPage <= extraItems ? 1 : 0);
      return allItems.slice(startIndex, startIndex + currentPageItems);
    } else {
      // Use standard pagination
      const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
      const indexOfLastItem = indexOfFirstItem + itemsPerPage;
      return allItems.slice(indexOfFirstItem, indexOfLastItem);
    }
  };

  const currentItems = getEquallyDistributedItems();

  // Handle page changes
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      // Scroll to top of certifications section when changing pages
      document.getElementById('certifications').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      document.getElementById('certifications').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
    document.getElementById('certifications').scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <section id="certifications" className="py-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="section-title text-center mx-auto after:left-1/2 after:-translate-x-1/2">Certifications</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">Professional certifications that demonstrate my commitment to continuous learning and skill development</p>
        </div>

        <div ref={ref}>
          {isInView && (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage} // Re-render animation when page changes
                variants={container}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[120px] sm:auto-rows-[140px] md:auto-rows-[160px]"
              >
                {currentItems.map((item, index) => {
                // Simplified bento box layout that works well on all screen sizes
                let gridClass = "";
                const itemsOnCurrentPage = currentItems.length;
                const baseIndex = index % 6;

                // Simpler responsive bento patterns
                switch(baseIndex) {
                  case 0: // Featured large box
                    gridClass = "col-span-2 row-span-2";
                    break;
                  case 1: // Wide box
                    gridClass = "col-span-1 row-span-1 sm:col-span-2 md:col-span-2";
                    break;
                  case 2: // Tall box
                    gridClass = "col-span-1 row-span-2";
                    break;
                  case 3: // Standard box
                    gridClass = "col-span-1 row-span-1";
                    break;
                  case 4: // Wide box
                    gridClass = "col-span-2 row-span-1";
                    break;
                  case 5: // Standard box
                    gridClass = "col-span-1 row-span-1";
                    break;
                  default:
                    gridClass = "col-span-1 row-span-1";
                }

                // Special layouts for sparse items
                if (itemsOnCurrentPage === 1) {
                  gridClass = "col-span-2 row-span-2";
                } else if (itemsOnCurrentPage === 2) {
                  gridClass = index === 0 ? "col-span-2 row-span-2" : "col-span-1 row-span-2 sm:col-span-2 sm:row-span-1";
                } else if (itemsOnCurrentPage === 3) {
                  switch(index) {
                    case 0: gridClass = "col-span-2 row-span-2"; break;
                    case 1: gridClass = "col-span-1 row-span-1"; break;
                    case 2: gridClass = "col-span-1 row-span-1"; break;
                  }
                }

                return (
                  <motion.div
                    key={item.title}
                    variants={item}
                    className={`group relative rounded-lg overflow-hidden bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-lg border border-gray-200/30 hover:border-white/60 transition-all duration-700 hover:shadow-2xl hover:shadow-gray-500/10 hover:scale-[1.02] hover:-translate-y-1 ${gridClass}`}
                  >
                    {/* Background gradient overlay for each certification */}
                    <div className="absolute inset-0 opacity-60">
                      <div className={`w-full h-full bg-gradient-to-br ${
                        // Emerald theme for certifications
                        index % 4 === 0 ? 'from-emerald-400/20 to-green-600/30' :
                        index % 4 === 1 ? 'from-green-400/20 to-emerald-600/30' :
                        index % 4 === 2 ? 'from-teal-400/20 to-emerald-600/30' :
                        'from-emerald-500/20 to-green-500/30'
                      }`}></div>
                    </div>

                    {/* Content overlay */}
                    <div className="relative h-full flex flex-col">
                      {/* Top section with gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                      {/* Content positioned at bottom */}
                      <div className="relative flex-1 flex flex-col justify-end p-3 sm:p-4 md:p-5 lg:p-6">
                        <div className="space-y-1 sm:space-y-2">
                          {/* Title */}
                          <h3 className="text-white font-bold text-xs sm:text-sm md:text-base lg:text-lg leading-tight line-clamp-2">
                            {item.title}
                          </h3>

                          {/* Issuer */}
                          <p className="text-white/90 text-xs sm:text-sm font-medium">
                            {item.issuer}
                          </p>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-1 mt-2">
                            <span className="bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs font-medium">
                              {item.issueDate}
                            </span>
                            {item.featured && (
                              <span className="bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs font-medium">
                                Featured
                              </span>
                            )}
                          </div>

                          {/* Action buttons */}
                          <div className="flex flex-wrap gap-2 mt-3">
                            <a
                              href={item.verificationUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <span>View Certificate</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
                })}
              </motion.div>
            </AnimatePresence>
          )}

          {allItems.length > itemsPerPage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-col items-center mt-16 space-y-4"
            >
              {/* Pagination controls */}
              <div className="flex justify-center space-x-2">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white border hover:shadow-md'
                  }`}
                  style={currentPage !== 1 ? {
                    color: colors.primary,
                    borderColor: colors.primary,
                    '--hover-bg': colors.accent + '20' // 20% opacity
                  } : {}}
                  onMouseEnter={(e) => {
                    if (currentPage !== 1) {
                      e.target.style.backgroundColor = colors.accent + '20'; // 20% opacity
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentPage !== 1) {
                      e.target.style.backgroundColor = 'white';
                    }
                  }}
                  aria-label="Previous page"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>

                <div className="hidden md:flex space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => goToPage(i + 1)}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 border shadow-md`}
                      style={currentPage === i + 1 ? {
                        backgroundColor: colors.primary,
                        color: 'white',
                        borderColor: colors.primary
                      } : {
                        backgroundColor: 'white',
                        color: colors.primary,
                        borderColor: '#e5e7eb' // gray-200
                      }}
                      onMouseEnter={(e) => {
                        if (currentPage !== i + 1) {
                          e.target.style.backgroundColor = colors.accent + '20'; // 20% opacity
                          e.target.style.borderColor = colors.light;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (currentPage !== i + 1) {
                          e.target.style.backgroundColor = 'white';
                          e.target.style.borderColor = '#e5e7eb'; // gray-200
                        }
                      }}
                      aria-label={`Page ${i + 1}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <div className="flex md:hidden items-center px-4">
                  <span className="text-gray-600 font-medium">
                    {currentPage} / {totalPages}
                  </span>
                </div>

                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white border hover:shadow-md'
                  }`}
                  style={currentPage !== totalPages ? {
                    color: colors.primary,
                    borderColor: colors.primary,
                    '--hover-bg': colors.accent + '20' // 20% opacity
                  } : {}}
                  onMouseEnter={(e) => {
                    if (currentPage !== totalPages) {
                      e.target.style.backgroundColor = colors.accent + '20'; // 20% opacity
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentPage !== totalPages) {
                      e.target.style.backgroundColor = 'white';
                    }
                  }}
                  aria-label="Next page"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Certifications;