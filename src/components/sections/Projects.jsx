import { useRef, useState, useMemo } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useScroll } from '../../contexts/ScrollContext';
import projects from '../../data/projects';

const Projects = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { activeSection } = useScroll();

  // Search functionality
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  // Get dynamic colors based on active section
  const colors = useMemo(() => {
    const colorMap = {
      hero: { primary: '#1e3a8a', light: '#3b82f6', accent: '#60a5fa' },      // blue: dark → medium → light
      personal: { primary: '#581c87', light: '#9333ea', accent: '#a855f7' },  // purple: dark → medium → light
      projects: { primary: '#92400e', light: '#f59e0b', accent: '#fbbf24' },  // amber: dark → medium → light
      blog: { primary: '#991b1b', light: '#ef4444', accent: '#f87171' },      // red: dark → medium → light
      footer: { primary: '#991b1b', light: '#ef4444', accent: '#f87171' }     // red: dark → medium → light
    };
    return colorMap[activeSection] || colorMap.hero;
  }, [activeSection]);

  // Generate suggestions based on available data
  const generateSuggestions = useMemo(() => {
    const allSuggestions = new Set();
    if (projects && Array.isArray(projects)) {
      projects.forEach(project => {
        if (project.title) allSuggestions.add(project.title);
        if (project.technologies && Array.isArray(project.technologies)) {
          project.technologies.forEach(tech => allSuggestions.add(tech));
        }
        if (project.category) allSuggestions.add(project.category);
      });
    }
    return Array.from(allSuggestions).sort();
  }, []);

  // Filter projects based on search term
  const filteredProjects = useMemo(() => {
    if (!searchTerm || !projects || !Array.isArray(projects)) return projects || [];
    return projects.filter(project =>
      (project.title && project.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (project.technologies && Array.isArray(project.technologies) && project.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()))) ||
      (project.category && project.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm]);

  // Handle search input and suggestions
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    if (value.length > 0) {
      const filteredSuggestions = generateSuggestions
        .filter(suggestion =>
          suggestion.toLowerCase().includes(value.toLowerCase()) &&
          suggestion.toLowerCase() !== value.toLowerCase()
        )
        .slice(0, 5);
      setSuggestions(filteredSuggestions);
      setShowSuggestions(filteredSuggestions.length > 0);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  };

  const selectSuggestion = (suggestion) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  // Use filtered projects
  const allItems = filteredProjects.map(item => ({ ...item, type: 'project' }));

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
        <div className="mb-16">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div className="text-center md:text-left">
              <h2 className="section-title">Projects</h2>
              <p className="text-gray-600 max-w-3xl">Showcasing my development projects that demonstrate my technical skills and problem-solving abilities</p>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-sm mx-auto md:mx-0">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <div className="bg-white/80 rounded-full p-1">
                  <svg className="h-4 w-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => searchTerm && setShowSuggestions(suggestions.length > 0)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="block w-full pl-12 pr-12 py-2.5 border border-white/40 rounded-xl leading-5 bg-white/20 backdrop-blur-md placeholder-gray-500 text-gray-900 focus:outline-none focus:placeholder-gray-600 focus:ring-2 focus:ring-white/50 focus:border-white/60 sm:text-sm transition-all duration-300 hover:bg-white/25 shadow-md"
                style={{
                  borderColor: searchTerm ? colors.light + '80' : 'rgba(255, 255, 255, 0.4)',
                  boxShadow: searchTerm ? `0 0 0 2px ${colors.light}40` : 'none'
                }}
              />
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setShowSuggestions(false);
                    setSuggestions([]);
                  }}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center group"
                >
                  <svg className="h-5 w-5 text-gray-400 hover:text-gray-600 group-hover:scale-110 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}

              {/* Search Suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md border border-white/30 rounded-xl shadow-lg z-50 overflow-hidden">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      className="w-full px-4 py-2.5 text-left text-gray-700 hover:bg-white/60 transition-colors duration-200 border-b border-gray-200/30 last:border-b-0"
                      onClick={() => selectSuggestion(suggestion)}
                    >
                      <span className="text-sm">{suggestion}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Search Results Info */}
          {searchTerm && (
            <div className="text-center mb-4">
              <p className="text-sm text-gray-600">
                Found {allItems.length} project{allItems.length !== 1 ? 's' : ''} matching "{searchTerm}"
              </p>
            </div>
          )}
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

                const isProject = item.type === 'project';
                const isCertification = item.type === 'certification';
                const itemKey = isProject ? item.id : `cert-${item.title}`;

                return (
                  <motion.div
                    key={itemKey}
                    variants={item}
                    className={`group relative rounded-lg overflow-hidden bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-lg border border-gray-200/30 hover:border-white/60 transition-all duration-700 hover:shadow-2xl hover:shadow-gray-500/10 hover:scale-[1.02] hover:-translate-y-1 ${gridClass}`}
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
                            : 'from-green-600 via-green-700 to-green-800'
                        } transition-transform duration-700 group-hover:scale-105`}>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              {isProject ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white/30 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white/30 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
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
                        {/* Issue date for certification or period for experience */}
                        {isCertification && (
                          <span className="text-gray-300 text-xs font-medium mb-1 block">{item.issueDate}</span>
                        )}

                        <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">{item.title}</h3>

                        {/* Issuer for certification */}
                        {isCertification && (
                          <p className="text-green-200 text-sm mb-2 font-medium">{item.issuer}</p>
                        )}

                        <p className="text-gray-200 text-sm mb-4 line-clamp-2 opacity-90">{item.description}</p>

                        {/* Technologies/Skills - show only on larger boxes */}
                        {(index % 6 === 0 || index % 6 === 1) && (item.technologies || item.skills) && (
                          <div className="flex flex-wrap gap-1 mb-4">
                            {(item.technologies || item.skills).slice(0, 3).map((tech, i) => (
                              <span
                                key={i}
                                className="bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs font-medium"
                              >
                                {tech}
                              </span>
                            ))}
                            {(item.technologies || item.skills).length > 3 && (
                              <span className="bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs font-medium">
                                +{(item.technologies || item.skills).length - 3}
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
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 backdrop-blur-md ${
                    currentPage === 1
                      ? 'bg-white/20 text-gray-400 cursor-not-allowed border border-white/30'
                      : 'bg-white/20 border border-white/40 hover:shadow-md hover:bg-white/30'
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
                      e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
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
                      className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 border shadow-md backdrop-blur-md bg-white/20 hover:bg-white/30`}
                      style={currentPage === i + 1 ? {
                        backgroundColor: colors.primary,
                        color: 'white',
                        borderColor: colors.primary
                      } : {
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        color: colors.primary,
                        borderColor: 'rgba(255, 255, 255, 0.4)'
                      }}
                      onMouseEnter={(e) => {
                        if (currentPage !== i + 1) {
                          e.target.style.backgroundColor = colors.accent + '20'; // 20% opacity
                          e.target.style.borderColor = colors.light;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (currentPage !== i + 1) {
                          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                          e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)';
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
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 backdrop-blur-md ${
                    currentPage === totalPages
                      ? 'bg-white/20 text-gray-400 cursor-not-allowed border border-white/30'
                      : 'bg-white/20 border border-white/40 hover:shadow-md hover:bg-white/30'
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
                      e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
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