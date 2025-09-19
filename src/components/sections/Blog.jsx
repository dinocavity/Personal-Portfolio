import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import blogposts from '../../data/blogposts';

const Blog = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;
  const indexOfFirstPost = (currentPage - 1) * postsPerPage;
  const indexOfLastPost = indexOfFirstPost + postsPerPage;
  const totalPages = Math.ceil(blogposts.length / postsPerPage);
  
  // Get current posts to display
  const currentPosts = blogposts.slice(indexOfFirstPost, indexOfLastPost);
  
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
                className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 auto-rows-[200px]"
              >
                {currentPosts.map((post, index) => {
                  // Define bento box sizes for blog posts (6 posts pattern)
                  let gridClass = "";
                  switch(index % 6) {
                    case 0: // First post - Large featured
                      gridClass = "md:col-span-2 md:row-span-2 lg:col-span-3 lg:row-span-2";
                      break;
                    case 1: // Second post - Medium wide
                      gridClass = "md:col-span-2 md:row-span-1 lg:col-span-2 lg:row-span-1";
                      break;
                    case 2: // Third post - Tall
                      gridClass = "md:col-span-2 md:row-span-2 lg:col-span-1 lg:row-span-2";
                      break;
                    case 3: // Fourth post - Medium
                      gridClass = "md:col-span-2 md:row-span-1 lg:col-span-2 lg:row-span-1";
                      break;
                    case 4: // Fifth post - Small
                      gridClass = "md:col-span-1 md:row-span-1 lg:col-span-2 lg:row-span-1";
                      break;
                    case 5: // Sixth post - Medium tall
                      gridClass = "md:col-span-1 md:row-span-1 lg:col-span-2 lg:row-span-1";
                      break;
                    default:
                      gridClass = "md:col-span-1 md:row-span-1";
                  }

                  const isLarge = index % 6 === 0;

                  return (
                    <motion.div
                      key={post.id}
                      variants={item}
                      className={`group relative rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm border border-gray-200/50 hover:border-blue-200 transition-all duration-500 hover:shadow-xl hover:shadow-blue-100/20 ${gridClass}`}
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
                      : 'bg-white text-blue-900 border border-blue-900 hover:bg-blue-50 hover:shadow-md'
                  }`}
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
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                        currentPage === i + 1
                          ? 'bg-blue-900 text-white shadow-md' 
                          : 'bg-white text-blue-900 border border-gray-200 hover:bg-blue-50 hover:border-blue-200 hover:shadow-md'
                      }`}
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
                      : 'bg-white text-blue-900 border border-blue-900 hover:bg-blue-50 hover:shadow-md'
                  }`}
                  aria-label="Next page"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              {/* On mobile, show View All button as an alternative */}
              <div className="block md:hidden">
                <button 
                  onClick={() => goToPage(1)} 
                  className="btn-outline inline-flex items-center"
                >
                  <span>View All Posts</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
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
