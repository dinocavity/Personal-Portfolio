import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import blogposts from '../data/blogposts';

const BlogDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [prevPost, setPrevPost] = useState(null);
  const [nextPost, setNextPost] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [postImages, setPostImages] = useState([]);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [visiblePostsCount, setVisiblePostsCount] = useState(3);
  useEffect(() => {
    const currentIndex = blogposts.findIndex(post => post.id === parseInt(id));
    const foundPost = blogposts[currentIndex];

    setPost(foundPost);
    setPrevPost(currentIndex > 0 ? blogposts[currentIndex - 1] : null);
    setNextPost(currentIndex < blogposts.length - 1 ? blogposts[currentIndex + 1] : null);

    // Extract all images from post content for navigation
    if (foundPost) {
      const images = [];

      // Add cover image first
      if (foundPost.coverImage) {
        images.push({
          src: foundPost.coverImage,
          alt: foundPost.title,
          caption: 'Cover Image',
          type: 'cover'
        });
      }

      // Add content images
      foundPost.content.forEach((section, sectionIndex) => {
        if (section.image) {
          images.push({
            src: section.image,
            alt: section.imageAlt || 'Blog image',
            caption: section.imageCaption || 'Blog image',
            type: 'content',
            sectionIndex
          });
        }
      });

      setPostImages(images);
    }

    // Reset visible posts count when navigating to different blog posts
    setVisiblePostsCount(3);

    // Scroll to top when post loads
    window.scrollTo(0, 0);
  }, [id]);


  // Handle scroll progress and back to top button
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollTop / docHeight, 1) * 100;
      setScrollProgress(progress);

      // Show/hide back to top button based on scroll position
      setShowBackToTop(scrollTop > 300);

      // Progressive loading: load more blog posts when scrolled near bottom
      // Only trigger if we have meaningful document height (page fully loaded)
      if (docHeight > 0) {
        const scrollPercentage = scrollTop / docHeight;

        // More strict condition: must be scrolled past initial view AND near bottom
        if (scrollPercentage > 0.8 && scrollTop > 500 && visiblePostsCount < blogposts.length) {
          setVisiblePostsCount(prev => Math.min(prev + 3, blogposts.length));
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  // Image navigation functions
  const openImageModal = (imageIndex) => {
    setSelectedImageIndex(imageIndex);
  };

  const closeImageModal = () => {
    setSelectedImageIndex(null);
  };

  const navigateImage = (direction) => {
    if (selectedImageIndex === null) return;

    const newIndex = direction === 'next'
      ? (selectedImageIndex + 1) % postImages.length
      : (selectedImageIndex - 1 + postImages.length) % postImages.length;

    setSelectedImageIndex(newIndex);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (selectedImageIndex === null) return;

      if (e.key === 'ArrowLeft') navigateImage('prev');
      if (e.key === 'ArrowRight') navigateImage('next');
      if (e.key === 'Escape') closeImageModal();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedImageIndex]);
  
  if (!post) {
    return (
      <div className="container mx-auto px-4 md:px-8 py-16 min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Post not found</h2>
          <Link to="/#personal" className="btn-primary inline-block">
            Back to Portfolio
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative min-h-screen flex">
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
          style={{ width: `${scrollProgress}%` }}
          transition={{ ease: "easeOut" }}
        />
      </div>


      {/* Main Content */}
      <div className="flex-1">
        <div className="container mx-auto px-4 md:px-8 py-16 max-w-4xl">
          {/* Back Button - All Screens */}
          <Link to="/#personal" className="inline-flex items-center text-blue-900 mb-8 hover:underline">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Portfolio
          </Link>



      <article className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center text-gray-600 mb-6">
            <span className="mr-4">{post.date}</span>
            <span className="mr-4">·</span>
            <span>{post.readTime} min read</span>
          </div>
          <div
            className="relative overflow-hidden rounded-xl shadow-lg cursor-pointer group hover:shadow-xl transition-all duration-300"
            onClick={() => openImageModal(0)}
          >
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-64 object-cover mx-auto group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-2">
                <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </header>

        <div className="prose prose-lg max-w-none">
          {post.content.map((section, index) => {
            const sectionId = section.heading ? `section-${post.content.indexOf(section)}` : undefined;

            return (
              <section key={index} id={sectionId} className="mb-12 scroll-mt-20">
                {section.heading && (
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-2xl font-bold mb-6 text-gray-900 border-b border-gray-200 pb-2"
                  >
                    {section.heading}
                  </motion.h2>
                )}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="max-w-none"
                >
                  <div className="text-gray-700 leading-8 text-lg mb-8 max-w-3xl">
                    {section.text}
                  </div>
                  {section.image && (
                    <figure className="my-10">
                      <div
                        className="relative overflow-hidden rounded-xl shadow-lg cursor-pointer group hover:shadow-xl transition-all duration-300 max-w-2xl mx-auto"
                        onClick={() => {
                          const imageIndex = postImages.findIndex(img => img.src === section.image);
                          openImageModal(imageIndex);
                        }}
                      >
                        <img
                          src={section.image}
                          alt={section.imageAlt || 'Blog image'}
                          className="w-full h-64 object-cover mx-auto group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-2">
                            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      {section.imageCaption && (
                        <figcaption className="text-sm text-gray-500 mt-4 text-center italic max-w-3xl mx-auto">
                          {section.imageCaption}
                        </figcaption>
                      )}
                    </figure>
                  )}
                </motion.div>
              </section>
            );
          })}

        </div>

        {/* Navigation to previous/next posts */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="flex justify-between items-center">
            {prevPost ? (
              <Link
                to={`/blog/${prevPost.id}`}
                className="flex items-center group hover:text-blue-900 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <div>
                  <div className="text-sm text-gray-500">Previous</div>
                  <div className="font-medium">{prevPost.title}</div>
                </div>
              </Link>
            ) : (
              <div></div>
            )}

            {nextPost ? (
              <Link
                to={`/blog/${nextPost.id}`}
                className="flex items-center group hover:text-blue-900 transition-colors text-right"
              >
                <div>
                  <div className="text-sm text-gray-500">Next</div>
                  <div className="font-medium">{nextPost.title}</div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            ) : (
              <div></div>
            )}
          </div>
        </div>

        {/* Blog Navigation Menu */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">All Blog Posts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {blogposts.slice(0, visiblePostsCount).map((blogPost) => (
              <Link
                key={blogPost.id}
                to={`/blog/${blogPost.id}`}
                className={`block p-4 rounded-lg transition-all duration-200 ${
                  blogPost.id === parseInt(id)
                    ? 'text-blue-900 border-2 border-blue-200'
                    : 'text-gray-700 hover:text-gray-900 border border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <div className="text-sm font-medium mb-2 line-clamp-2">{blogPost.title}</div>
                <div className="text-xs text-gray-500 mb-2">{blogPost.date}</div>
                <div className="text-xs text-gray-600 line-clamp-2">{blogPost.excerpt}</div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {blogPost.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>

          {/* Load More Button / Loading Indicator */}
          {visiblePostsCount < blogposts.length && (
            <div className="mt-8 text-center">
              <button
                onClick={() => setVisiblePostsCount(prev => Math.min(prev + 3, blogposts.length))}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Load More Posts ({blogposts.length - visiblePostsCount} remaining)
              </button>
            </div>
          )}

          {/* All Posts Loaded Message */}
          {visiblePostsCount >= blogposts.length && blogposts.length > 3 && (
            <div className="mt-8 text-center text-gray-500 text-sm">
              All blog posts loaded ({blogposts.length} total)
            </div>
          )}
        </div>

      </article>
        </div>
      </div>

      {/* Floating Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 z-50 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:-translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={closeImageModal}
          >
            <div className="relative max-w-7xl max-h-full flex items-center justify-center">
              {/* Navigation Buttons */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImage('prev');
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors group z-10"
              >
                <svg className="w-6 h-6 text-white group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateImage('next');
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors group z-10"
              >
                <svg className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>

              {/* Close Button */}
              <button
                onClick={closeImageModal}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Image */}
              <motion.div
                key={selectedImageIndex}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={postImages[selectedImageIndex]?.src}
                  alt={postImages[selectedImageIndex]?.alt}
                  className="max-w-full max-h-[80vh] object-contain rounded-lg"
                />

                {/* Image Info */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 rounded-b-lg">
                  <p className="text-white text-center">
                    {postImages[selectedImageIndex]?.caption}
                  </p>
                  <p className="text-white/70 text-sm text-center mt-2">
                    {selectedImageIndex + 1} of {postImages.length}
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlogDetail;