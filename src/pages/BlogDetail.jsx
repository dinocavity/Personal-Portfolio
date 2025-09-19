import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import blogposts from '../data/blogposts';

const BlogDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [prevPost, setPrevPost] = useState(null);
  const [nextPost, setNextPost] = useState(null);

  useEffect(() => {
    const currentIndex = blogposts.findIndex(post => post.id === parseInt(id));
    const foundPost = blogposts[currentIndex];

    setPost(foundPost);
    setPrevPost(currentIndex > 0 ? blogposts[currentIndex - 1] : null);
    setNextPost(currentIndex < blogposts.length - 1 ? blogposts[currentIndex + 1] : null);

    // Scroll to top when post loads
    window.scrollTo(0, 0);
  }, [id]);
  
  if (!post) {
    return (
      <div className="container mx-auto px-4 md:px-8 py-16 min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Post not found</h2>
          <Link to="/#blog" className="btn-primary inline-block">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 md:px-8 py-16">
      <Link to="/#blog" className="inline-flex items-center text-blue-900 mb-8 hover:underline">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Blog
      </Link>
      
      <article className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center text-gray-600 mb-6">
            <span className="mr-4">{post.date}</span>
            <span className="mr-4">·</span>
            <span>{post.readTime} min read</span>
          </div>
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-64 md:h-80 object-cover rounded-lg shadow-md"
          />
        </header>
        
        <div className="prose prose-lg max-w-none">
          {post.content.map((section, index) => (
            <section key={index} className="mb-8">
              {section.heading && (
                <h2 className="text-2xl font-bold mb-4 text-gray-900">{section.heading}</h2>
              )}
              <p className="mb-6 text-gray-700 leading-relaxed text-lg">{section.text}</p>
              {section.image && (
                <figure className="my-6">
                  <img
                    src={section.image}
                    alt={section.imageAlt || 'Blog image'}
                    className="w-full max-w-2xl mx-auto h-48 md:h-64 object-cover rounded-lg shadow-sm"
                  />
                  {section.imageCaption && (
                    <figcaption className="text-sm text-gray-500 mt-2 text-center">
                      {section.imageCaption}
                    </figcaption>
                  )}
                </figure>
              )}
            </section>
          ))}
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

        {/* Back to all posts */}
        <div className="mt-8 text-center">
          <Link
            to="/#blog"
            className="inline-flex items-center px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            View All Posts
          </Link>
        </div>
      </article>
    </div>
  );
};

export default BlogDetail;