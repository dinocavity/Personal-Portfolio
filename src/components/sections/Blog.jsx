import { useRef, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import useScrollManager from '../../hooks/useScrollManager';
import blogposts from '../../data/blogposts';

const Blog = () => {
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
  
  // Pagination state with equal distribution
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;
  const totalPages = Math.ceil(blogposts.length / postsPerPage);

  // Distribute posts equally across all pages
  const getEquallyDistributedPosts = () => {
    const postsPerLastPage = blogposts.length % postsPerPage;
    const shouldRedistribute = postsPerLastPage > 0 && postsPerLastPage < 3 && totalPages > 1;

    if (shouldRedistribute) {
      // Calculate new distribution to balance pages
      const adjustedPostsPerPage = Math.floor(blogposts.length / totalPages);
      const extraPosts = blogposts.length % totalPages;

      let startIndex = 0;
      for (let i = 1; i < currentPage; i++) {
        startIndex += adjustedPostsPerPage + (i <= extraPosts ? 1 : 0);
      }

      const currentPagePosts = adjustedPostsPerPage + (currentPage <= extraPosts ? 1 : 0);
      return blogposts.slice(startIndex, startIndex + currentPagePosts);
    } else {
      // Use standard pagination
      const indexOfFirstPost = (currentPage - 1) * postsPerPage;
      const indexOfLastPost = indexOfFirstPost + postsPerPage;
      return blogposts.slice(indexOfFirstPost, indexOfLastPost);
    }
  };

  // Get current posts to display
  const currentPosts = getEquallyDistributedPosts();
  
  // Handle page changes
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      // Scroll to top of blog section when changing pages
      document.getElementById('blog').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      document.getElementById('blog').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
    document.getElementById('blog').scrollIntoView({ behavior: 'smooth', block: 'start' });
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
    <section id="blog" className="py-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="section-title text-center mx-auto after:left-1/2 after:-translate-x-1/2">Blog</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">Thoughts, tutorials and insights</p>
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
                {currentPosts.map((post, index) => {
                  // True bento box layout that maintains bento aesthetic on ALL screen sizes
                  let gridClass = "";
                  const postsOnCurrentPage = currentPosts.length;
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
                  if (postsOnCurrentPage === 1) {
                    gridClass = "col-span-2 row-span-2 sm:col-span-3 sm:row-span-2 md:col-span-4 md:row-span-2 lg:col-span-5 lg:row-span-2 xl:col-span-6 xl:row-span-2";
                  } else if (postsOnCurrentPage === 2) {
                    switch(index) {
                      case 0:
                        gridClass = "col-span-2 row-span-2 sm:col-span-2 sm:row-span-2 md:col-span-3 md:row-span-2 lg:col-span-3 lg:row-span-2 xl:col-span-4 xl:row-span-2";
                        break;
                      case 1:
                        gridClass = "col-span-1 row-span-2 sm:col-span-1 sm:row-span-2 md:col-span-1 md:row-span-2 lg:col-span-2 lg:row-span-2 xl:col-span-2 xl:row-span-2";
                        break;
                    }
                  } else if (postsOnCurrentPage === 3) {
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
                  } else if (postsOnCurrentPage === 4) {
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
                  } else if (postsOnCurrentPage === 5) {
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

                  const isLarge = index % 6 === 0;

                  return (
                    <motion.div
                      key={post.id}
                      variants={item}
                      className={`group relative rounded-3xl overflow-hidden bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-lg border border-gray-200/30 hover:border-white/60 transition-all duration-700 hover:shadow-2xl hover:shadow-gray-500/10 hover:scale-[1.02] hover:-translate-y-1 ${gridClass}`}
                    >
                      <Link to={`/blog/${post.id}`} className="block h-full">
                        {/* Background Image */}
                        <div className="absolute inset-0">
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `https://placehold.co/600x400/3b82f6/ffffff?text=${encodeURIComponent(post.title)}`;
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                        </div>

                        {/* Content */}
                        <div className="relative z-10 p-6 h-full flex flex-col justify-end">
                          <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                            {/* Meta info */}
                            <div className="flex items-center text-gray-300 text-xs mb-2 opacity-90">
                              <span>{post.date}</span>
                              <span className="mx-2">•</span>
                              <span>{post.readTime} min read</span>
                            </div>

                            <h3 className={`text-white font-bold mb-2 line-clamp-2 group-hover:text-blue-200 transition-colors ${isLarge ? 'text-xl' : 'text-lg'}`}>
                              {post.title}
                            </h3>

                            {/* Show excerpt only on larger boxes */}
                            {isLarge && (
                              <p className="text-gray-200 text-sm mb-4 line-clamp-3 opacity-90">
                                {post.excerpt}
                              </p>
                            )}

                            {/* Tags - show fewer on smaller boxes */}
                            <div className="flex flex-wrap gap-1 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 delay-100">
                              {post.tags.slice(0, isLarge ? 3 : 2).map((tag, i) => (
                                <span
                                  key={i}
                                  className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md font-medium"
                                >
                                  {tag}
                                </span>
                              ))}
                              {post.tags.length > (isLarge ? 3 : 2) && (
                                <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md font-medium">
                                  +{post.tags.length - (isLarge ? 3 : 2)}
                                </span>
                              )}
                            </div>

                            {/* Read more indicator */}
                            <div className="mt-3 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 delay-150">
                              <div className="flex items-center text-white text-sm">
                                <span className="mr-2">Read More</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          )}
          
          {blogposts.length > postsPerPage && (
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

export default Blog;
