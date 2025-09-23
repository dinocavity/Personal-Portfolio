import { useRef, useState, useMemo } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import useScrollManager from '../../hooks/useScrollManager';
import certifications from '../../data/certifications';

const Certifications = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { activeSection } = useScrollManager();

  // Modal state for viewing certificates
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Search functionality
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

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

  // Generate suggestions based on available data
  const generateSuggestions = useMemo(() => {
    const allSuggestions = new Set();
    certifications.forEach(cert => {
      allSuggestions.add(cert.title);
      cert.skills.forEach(skill => allSuggestions.add(skill));
      allSuggestions.add(cert.issuer);
    });
    return Array.from(allSuggestions).sort();
  }, []);

  // Filter certifications based on search term
  const filteredCertifications = useMemo(() => {
    if (!searchTerm) return certifications;
    return certifications.filter(cert =>
      cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
      cert.description.toLowerCase().includes(searchTerm.toLowerCase())
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

  // Use filtered certifications
  const allItems = filteredCertifications.map(item => ({ ...item, type: 'certification' }));

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

  // Modal functions
  const openModal = (certificate) => {
    setSelectedCertificate(certificate);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCertificate(null);
    document.body.style.overflow = 'unset';
  };

  const goToNextCertificate = () => {
    const currentIndex = allItems.findIndex(item => item.credentialId === selectedCertificate.credentialId);
    const nextIndex = (currentIndex + 1) % allItems.length;
    setSelectedCertificate(allItems[nextIndex]);
  };

  const goToPreviousCertificate = () => {
    const currentIndex = allItems.findIndex(item => item.credentialId === selectedCertificate.credentialId);
    const prevIndex = currentIndex === 0 ? allItems.length - 1 : currentIndex - 1;
    setSelectedCertificate(allItems[prevIndex]);
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!isModalOpen) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowRight') goToNextCertificate();
    if (e.key === 'ArrowLeft') goToPreviousCertificate();
  };

  // Keyboard navigation (handled in modal directly)

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
        <div className="mb-16">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div className="text-center md:text-left">
              <h2 className="section-title">Certifications</h2>
              <p className="text-gray-600 max-w-3xl">Professional certifications that demonstrate my commitment to continuous learning and skill development</p>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-sm mx-auto md:mx-0">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search certificates..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => searchTerm && setShowSuggestions(suggestions.length > 0)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="block w-full pl-12 pr-12 py-2.5 border border-white/20 rounded-xl leading-5 bg-white/10 backdrop-blur-md placeholder-gray-400 text-gray-800 focus:outline-none focus:placeholder-gray-500 focus:ring-2 focus:ring-white/30 focus:border-white/40 sm:text-sm transition-all duration-300 hover:bg-white/15"
                style={{
                  borderColor: searchTerm ? colors.light + '80' : 'rgba(255, 255, 255, 0.2)',
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
                Found {allItems.length} certificate{allItems.length !== 1 ? 's' : ''} matching "{searchTerm}"
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

                return (
                  <motion.div
                    key={item.title}
                    variants={item}
                    className={`group relative rounded-lg overflow-hidden bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-lg border border-gray-200/30 hover:border-white/60 transition-all duration-700 hover:shadow-2xl hover:shadow-gray-500/10 hover:scale-[1.02] hover:-translate-y-1 cursor-pointer ${gridClass}`}
                    onClick={() => openModal(item)}
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

                    {/* Certificate Image */}
                    <div className="absolute inset-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          // If image fails to load, hide it and show gradient background
                          e.target.style.display = 'none';
                        }}
                      />
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
                              href={item.pdfUrl || item.image}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <span>View Certificate</span>
                            </a>
                            {item.verificationUrl && (
                              <a
                                href={item.verificationUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <span>Verify</span>
                              </a>
                            )}
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

        {/* Certificate Modal */}
        {isModalOpen && selectedCertificate && createPortal(
          <AnimatePresence>
            {isModalOpen && selectedCertificate && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 z-[9999]"
              onClick={closeModal}
              onKeyDown={handleKeyDown}
              tabIndex={0}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: "spring", duration: 0.3, bounce: 0.1 }}
                className="relative w-full max-w-4xl h-[90vh] max-h-[600px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl overflow-hidden shadow-2xl flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={closeModal}
                  className="absolute top-3 sm:top-4 right-3 sm:right-4 z-20 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white rounded-xl p-2.5 sm:p-3 transition-all duration-300 hover:scale-105 border border-white/30"
                  style={{ backgroundColor: colors.primary + '40' }}
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Navigation Buttons */}
                <button
                  onClick={goToPreviousCertificate}
                  className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white rounded-lg p-2 transition-all duration-300 hover:scale-105 border border-white/30"
                  style={{ backgroundColor: colors.primary + '40' }}
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <button
                  onClick={goToNextCertificate}
                  className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white rounded-lg p-2 transition-all duration-300 hover:scale-105 border border-white/30"
                  style={{ backgroundColor: colors.primary + '40' }}
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Certificate Image */}
                <div className="flex-1 p-3 sm:p-4">
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg p-2 sm:p-3 h-full flex items-center justify-center">
                    <img
                      src={selectedCertificate.image}
                      alt={selectedCertificate.title}
                      className="w-full h-full max-h-[300px] sm:max-h-[350px] object-contain rounded"
                    />
                  </div>
                </div>

                {/* Certificate Info */}
                <div className="p-3 sm:p-4 bg-white/10 backdrop-blur-md border-t border-white/20 flex-shrink-0">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:text-lg font-bold text-white mb-1 truncate">{selectedCertificate.title}</h3>
                      <p className="text-white/90 mb-1 text-xs sm:text-sm">{selectedCertificate.issuer} • {selectedCertificate.issueDate}</p>
                      <p className="text-xs text-white/80 mb-2 line-clamp-2">{selectedCertificate.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedCertificate.skills.slice(0, 4).map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-0.5 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full border border-white/30"
                          >
                            {skill}
                          </span>
                        ))}
                        {selectedCertificate.skills.length > 4 && (
                          <span className="px-2 py-0.5 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full border border-white/30">
                            +{selectedCertificate.skills.length - 4}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-row sm:flex-col gap-2 sm:min-w-[100px]">
                      <a
                        href={selectedCertificate.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center bg-white/20 backdrop-blur-md hover:bg-white/30 text-white px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 hover:scale-105 border border-white/30 flex-1 sm:flex-none"
                        onClick={(e) => e.stopPropagation()}
                        style={{ backgroundColor: colors.primary + '60' }}
                      >
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        PDF
                      </a>
                      {selectedCertificate.verificationUrl && (
                        <a
                          href={selectedCertificate.verificationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center bg-white/20 backdrop-blur-md hover:bg-white/30 text-white px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 hover:scale-105 border border-white/30 flex-1 sm:flex-none"
                          onClick={(e) => e.stopPropagation()}
                          style={{ backgroundColor: colors.accent + '60' }}
                        >
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Verify
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Navigation Indicator */}
                <div className="absolute bottom-1 sm:bottom-2 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-sm font-medium border border-black/20 shadow-lg">
                  {allItems.findIndex(item => item.credentialId === selectedCertificate.credentialId) + 1} / {allItems.length}
                </div>
              </motion.div>
            </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
      </div>
    </section>
  );
};

export default Certifications;