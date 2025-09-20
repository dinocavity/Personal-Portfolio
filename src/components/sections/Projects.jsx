import { useRef, useState, useMemo } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import useScrollManager from '../../hooks/useScrollManager';
import projects from '../../data/projects';
import experience from '../../data/experience';

const Projects = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { activeSection } = useScrollManager();

  // Get dynamic colors based on active section
  const colors = useMemo(() => {
    const colorMap = {
      hero: { primary: '#1e3a8a', light: '#3b82f6', accent: '#60a5fa' },      // blue: dark → medium → light
      about: { primary: '#581c87', light: '#9333ea', accent: '#a855f7' },     // purple: dark → medium → light
      projects: { primary: '#92400e', light: '#f59e0b', accent: '#fbbf24' },  // amber: dark → medium → light
      blog: { primary: '#991b1b', light: '#ef4444', accent: '#f87171' },      // red: dark → medium → light
      footer: { primary: '#065f46', light: '#10b981', accent: '#34d399' }     // emerald: dark → medium → light
    };
    return colorMap[activeSection] || colorMap.hero;
  }, [activeSection]);

  // Combine projects and experience into one array
  const allItems = [
    ...projects.map(item => ({ ...item, type: 'project' })),
    ...experience.map(item => ({ ...item, type: 'experience' }))
  ];

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
      // Scroll to top of projects section when changing pages
      document.getElementById('projects').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      document.getElementById('projects').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
    document.getElementById('projects').scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
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
    <section id="projects" className="py-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="section-title text-center mx-auto after:left-1/2 after:-translate-x-1/2">My Work</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">Showcasing projects and experiences that define my development journey</p>
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
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6 auto-rows-[160px] sm:auto-rows-[180px] md:auto-rows-[200px] lg:auto-rows-[220px] xl:auto-rows-[240px]"
              >
                {currentItems.map((item, index) => {
                // Define bento box sizes with better grid layout
                let gridClass = "";
                // True bento box layout that maintains bento aesthetic on ALL screen sizes
                const itemsOnCurrentPage = currentItems.length;
                const baseIndex = index % 6;

                // Mobile-first bento patterns (2-col base ensures bento look even on small screens)
                switch(baseIndex) {
                  case 0: // Featured hero - always gets prominence
                    gridClass = "col-span-2 row-span-2 sm:col-span-2 sm:row-span-2 md:col-span-2 md:row-span-2 lg:col-span-2 lg:row-span-2 xl:col-span-3 xl:row-span-2";
                    break;
                  case 1: // Secondary wide
                    gridClass = "col-span-1 row-span-1 sm:col-span-1 sm:row-span-1 md:col-span-2 md:row-span-1 lg:col-span-2 lg:row-span-1 xl:col-span-2 xl:row-span-1";
                    break;
                  case 2: // Vertical accent - key to bento aesthetic
                    gridClass = "col-span-1 row-span-2 sm:col-span-1 sm:row-span-2 md:col-span-1 md:row-span-2 lg:col-span-1 lg:row-span-2 xl:col-span-1 xl:row-span-2";
                    break;
                  case 3: // Balancing square
                    gridClass = "col-span-1 row-span-1 sm:col-span-1 sm:row-span-1 md:col-span-1 md:row-span-1 lg:col-span-2 lg:row-span-1 xl:col-span-2 xl:row-span-1";
                    break;
                  case 4: // Wide emphasis
                    gridClass = "col-span-2 row-span-1 sm:col-span-2 sm:row-span-1 md:col-span-2 md:row-span-1 lg:col-span-2 lg:row-span-1 xl:col-span-2 xl:row-span-1";
                    break;
                  case 5: // Finishing touch
                    gridClass = "col-span-1 row-span-1 sm:col-span-1 sm:row-span-1 md:col-span-2 md:row-span-1 lg:col-span-1 lg:row-span-1 xl:col-span-2 xl:row-span-1";
                    break;
                  default:
                    gridClass = "col-span-1 row-span-1";
                }

                // Enhanced sparse layouts that maintain bento feel
                if (itemsOnCurrentPage === 1) {
                  gridClass = "col-span-2 row-span-2 sm:col-span-3 sm:row-span-2 md:col-span-4 md:row-span-2 lg:col-span-5 lg:row-span-2 xl:col-span-6 xl:row-span-2";
                } else if (itemsOnCurrentPage === 2) {
                  switch(index) {
                    case 0:
                      gridClass = "col-span-2 row-span-2 sm:col-span-2 sm:row-span-2 md:col-span-3 md:row-span-2 lg:col-span-3 lg:row-span-2 xl:col-span-4 xl:row-span-2";
                      break;
                    case 1:
                      gridClass = "col-span-1 row-span-2 sm:col-span-1 sm:row-span-2 md:col-span-1 md:row-span-2 lg:col-span-2 lg:row-span-2 xl:col-span-2 xl:row-span-2";
                      break;
                  }
                } else if (itemsOnCurrentPage === 3) {
                  switch(index) {
                    case 0:
                      gridClass = "col-span-2 row-span-2 sm:col-span-2 sm:row-span-2 md:col-span-2 md:row-span-2 lg:col-span-2 lg:row-span-2 xl:col-span-3 xl:row-span-2";
                      break;
                    case 1:
                      gridClass = "col-span-1 row-span-1 sm:col-span-1 sm:row-span-1 md:col-span-2 md:row-span-1 lg:col-span-2 lg:row-span-1 xl:col-span-2 xl:row-span-1";
                      break;
                    case 2:
                      gridClass = "col-span-1 row-span-1 sm:col-span-1 sm:row-span-1 md:col-span-2 md:row-span-1 lg:col-span-1 lg:row-span-1 xl:col-span-1 xl:row-span-1";
                      break;
                  }
                } else if (itemsOnCurrentPage === 4) {
                  switch(index) {
                    case 0:
                      gridClass = "col-span-2 row-span-2 sm:col-span-2 sm:row-span-2 md:col-span-2 md:row-span-2 lg:col-span-2 lg:row-span-2 xl:col-span-3 xl:row-span-2";
                      break;
                    case 1:
                      gridClass = "col-span-1 row-span-1 sm:col-span-1 sm:row-span-1 md:col-span-2 md:row-span-1 lg:col-span-2 lg:row-span-1 xl:col-span-2 xl:row-span-1";
                      break;
                    case 2:
                      gridClass = "col-span-1 row-span-1 sm:col-span-1 sm:row-span-1 md:col-span-1 md:row-span-1 lg:col-span-1 lg:row-span-1 xl:col-span-1 xl:row-span-1";
                      break;
                    case 3:
                      gridClass = "col-span-2 row-span-1 sm:col-span-1 sm:row-span-1 md:col-span-1 md:row-span-1 lg:col-span-2 lg:row-span-1 xl:col-span-2 xl:row-span-1";
                      break;
                  }
                } else if (itemsOnCurrentPage === 5) {
                  switch(index) {
                    case 0:
                      gridClass = "col-span-2 row-span-2 sm:col-span-2 sm:row-span-2 md:col-span-2 md:row-span-2 lg:col-span-2 lg:row-span-2 xl:col-span-2 xl:row-span-2";
                      break;
                    case 1:
                      gridClass = "col-span-1 row-span-1 sm:col-span-1 sm:row-span-1 md:col-span-2 md:row-span-1 lg:col-span-2 lg:row-span-1 xl:col-span-2 xl:row-span-1";
                      break;
                    case 2:
                      gridClass = "col-span-1 row-span-2 sm:col-span-1 sm:row-span-2 md:col-span-1 md:row-span-1 lg:col-span-1 lg:row-span-1 xl:col-span-2 xl:row-span-1";
                      break;
                    case 3:
                      gridClass = "col-span-2 row-span-1 sm:col-span-1 sm:row-span-1 md:col-span-1 md:row-span-1 lg:col-span-2 lg:row-span-1 xl:col-span-1 xl:row-span-1";
                      break;
                    case 4:
                      gridClass = "col-span-1 row-span-1 sm:col-span-1 sm:row-span-1 md:col-span-1 md:row-span-1 lg:col-span-1 lg:row-span-1 xl:col-span-1 xl:row-span-1";
                      break;
                  }
                }

                const isProject = item.type === 'project';
                const itemKey = isProject ? item.id : `exp-${item.title}`;

                return (
                  <motion.div
                    key={itemKey}
                    variants={item}
                    className={`group relative rounded-3xl overflow-hidden bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-lg border border-gray-200/30 hover:border-white/60 transition-all duration-700 hover:shadow-2xl hover:shadow-gray-500/10 hover:scale-[1.02] hover:-translate-y-1 ${gridClass}`}
                  >
                    {/* Background Image or Fallback */}
                    <div className="absolute inset-0">
                      {item.image && !item.image.includes('placehold') ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${
                          isProject
                            ? 'from-blue-600 via-blue-700 to-blue-800'
                            : 'from-purple-600 via-purple-700 to-purple-800'
                        } transition-transform duration-700 group-hover:scale-105`}>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              {isProject ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white/30 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white/30 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 p-6 h-full flex flex-col justify-end">
                      <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        {/* Period for experience */}
                        {!isProject && (
                          <span className="text-gray-300 text-xs font-medium mb-1 block">{item.period}</span>
                        )}

                        <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">{item.title}</h3>

                        {/* Company for experience */}
                        {!isProject && (
                          <p className="text-blue-200 text-sm mb-2 font-medium">{item.company}</p>
                        )}

                        <p className="text-gray-200 text-sm mb-4 line-clamp-2 opacity-90">{item.description}</p>

                        {/* Technologies - show only on larger boxes */}
                        {(index % 6 === 0 || index % 6 === 1) && item.technologies && (
                          <div className="flex flex-wrap gap-1 mb-4">
                            {item.technologies.slice(0, 3).map((tech, i) => (
                              <span
                                key={i}
                                className="bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs font-medium"
                              >
                                {tech}
                              </span>
                            ))}
                            {item.technologies.length > 3 && (
                              <span className="bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs font-medium">
                                +{item.technologies.length - 3}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100">
                          {item.liveUrl && (
                            <a
                              href={item.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                              {isProject ? 'Live' : 'View'}
                            </a>
                          )}
                          {item.repoUrl && (
                            <a
                              href={item.repoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" className="mr-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.30.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                              </svg>
                              Code
                            </a>
                          )}
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
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
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
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border shadow-md`}
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
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
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

export default Projects;