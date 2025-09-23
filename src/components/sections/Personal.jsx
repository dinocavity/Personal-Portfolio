import { useState, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  MdWork,
  MdSportsTennis,
  MdCameraAlt,
  MdSportsEsports,
  MdMenuBook,
  MdEmojiEvents,
  MdExpandMore,
  MdExpandLess,
  MdPerson,
  MdInterests,
  MdArticle,
  MdTranslate,
  MdSchool,
  MdAccountCircle
} from 'react-icons/md';
import { GiArcheryTarget } from 'react-icons/gi';
import useScrollManager from '../../hooks/useScrollManager';
import blogposts from '../../data/blogposts';

const Personal = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { activeSection } = useScrollManager();

  const [activeTab, setActiveTab] = useState('about');

  // Blog pagination for compact view
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;
  const totalPages = Math.ceil(blogposts.length / postsPerPage);

  // Get dynamic colors based on active section
  const colors = useMemo(() => {
    const colorMap = {
      hero: { primary: '#1e3a8a', light: '#3b82f6', accent: '#60a5fa' },
      skills: { primary: '#0f766e', light: '#14b8a6', accent: '#5eead4' },
      projects: { primary: '#92400e', light: '#f59e0b', accent: '#fbbf24' },
      certifications: { primary: '#059669', light: '#10b981', accent: '#6ee7b7' },
      personal: { primary: '#581c87', light: '#9333ea', accent: '#a855f7' },
      footer: { primary: '#065f46', light: '#10b981', accent: '#34d399' }
    };
    return colorMap[activeSection] || colorMap.personal;
  }, [activeSection]);

  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: custom * 0.2,
        duration: 0.6,
        ease: 'easeOut'
      }
    })
  };

  const languages = [
    { name: 'Filipino', level: 'Native' },
    { name: 'English', level: 'Fluent' },
    { name: 'Chavacano', level: 'Fluent' },
    { name: 'Bisaya', level: 'Fluent' },
  ];

  const achievements = [
    {
      title: 'ASEAN Youth Archery Championship',
      year: '2019',
      achievement: 'Bronze Medal',
      description: 'Competed at international level representing the Philippines'
    },
    {
      title: 'National Youth Championship',
      year: '2018',
      achievement: 'Silver Medal',
      description: 'Recurve bow category, youth division'
    },
    {
      title: 'Regional Championships',
      year: '2017-2019',
      achievement: 'Multiple Gold Medals',
      description: 'Consistent winner in regional archery competitions'
    }
  ];

  const interests = [
    {
      name: 'Archery',
      icon: GiArcheryTarget,
      description: 'Competitive archer with international experience. Archery has taught me focus, patience, and precision - skills I apply to coding.'
    },
    {
      name: 'Photography',
      icon: MdCameraAlt,
      description: 'Capturing moments and exploring visual composition. Photography enhances my eye for UI/UX design.'
    },
    {
      name: 'Gaming',
      icon: MdSportsEsports,
      description: 'Strategic games and problem-solving challenges that keep my analytical thinking sharp.'
    },
    {
      name: 'Reading',
      icon: MdMenuBook,
      description: 'Technology blogs, programming books, and personal development literature.'
    }
  ];

  const tabs = [
    { id: 'about', label: 'About Me', icon: MdPerson },
    { id: 'interests', label: 'Interests & Achievements', icon: MdInterests },
    { id: 'experiences', label: 'Experiences & Stories', icon: MdArticle }
  ];

  // Blog pagination logic
  const getEquallyDistributedPosts = () => {
    const postsPerLastPage = blogposts.length % postsPerPage;
    const shouldRedistribute = postsPerLastPage > 0 && postsPerLastPage < 3 && totalPages > 1;

    if (shouldRedistribute) {
      const adjustedPostsPerPage = Math.floor(blogposts.length / totalPages);
      const extraPosts = blogposts.length % totalPages;

      let startIndex = 0;
      for (let i = 1; i < currentPage; i++) {
        startIndex += adjustedPostsPerPage + (i <= extraPosts ? 1 : 0);
      }

      const currentPagePosts = adjustedPostsPerPage + (currentPage <= extraPosts ? 1 : 0);
      return blogposts.slice(startIndex, startIndex + currentPagePosts);
    } else {
      const indexOfFirstPost = (currentPage - 1) * postsPerPage;
      const indexOfLastPost = indexOfFirstPost + postsPerPage;
      return blogposts.slice(indexOfFirstPost, indexOfLastPost);
    }
  };

  const currentPosts = getEquallyDistributedPosts();

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderAboutTab = () => (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      custom={0}
      className="space-y-12"
    >
      {/* Hero Introduction */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        custom={0}
        className="text-center mb-16"
      >
        <h3 className="text-3xl font-bold mb-4">
          Meet <span style={{ color: colors.primary }}>Dion Cedrick Marquez</span>
        </h3>
        <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
          An AI literate Software Engineer who enjoys creating dynamic, creative, and useful designs
        </p>
      </motion.div>

      {/* Main Content Grid - Better organized layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* About Me Content - Main section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          custom={1}
          className="lg:col-span-2"
        >
          <div className="border border-gray-200/50 rounded-2xl p-8 hover:border-violet-200 hover:shadow-lg transition-all duration-300">
            <h4 className="text-2xl font-bold mb-6 flex items-center">
              <MdAccountCircle
                className="w-6 h-6 mr-3"
                style={{ color: colors.primary }}
              />
              About Me
            </h4>
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p>
                I'm a dedicated <strong>Software Engineer</strong> based in <strong>Zamboanga City, Philippines</strong>,
                with strong AI literacy and experience in creating efficient and user-friendly web applications.
              </p>
              <p>
                My journey in technology began with curiosity and has evolved into creating <strong>dynamic, creative, and useful</strong>
                digital solutions that solve real-world problems.
              </p>
              <p>
                With a <strong>Bachelor's degree in Information Technology</strong> from Western Mindanao
                State University, I've built a strong foundation in software development and continuously
                expand my expertise in modern web technologies.
              </p>
              <p>
                I specialize in <strong style={{ color: colors.primary }}>full-stack development</strong>,
                working with cutting-edge frameworks like React.js and Node.js. I enjoy creating designs
                that are both visually appealing and highly functional, combining technical excellence with
                innovative user interfaces.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Side Information */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          custom={2}
          className="space-y-8"
        >
          {/* Languages Section - Achievement style */}
          <div className="border border-gray-200/50 rounded-2xl p-6 hover:border-violet-200 hover:shadow-lg transition-all duration-300">
            <h4 className="text-xl font-bold mb-6 flex items-center">
              <MdTranslate
                className="w-5 h-5 mr-3"
                style={{ color: colors.primary }}
              />
              Languages
            </h4>
            <div className="space-y-4">
              {languages.map((language, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
                  className="border-l-4 pl-4 py-2"
                  style={{ borderLeftColor: colors.primary }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="font-semibold text-gray-900">{language.name}</h5>
                    <span
                      className="font-medium text-sm px-2 py-1 rounded-full"
                      style={{
                        color: colors.primary,
                        backgroundColor: colors.accent + '20'
                      }}
                    >
                      {language.level}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Education Section - Achievement style */}
          <div className="border border-gray-200/50 rounded-2xl p-6 hover:border-violet-200 hover:shadow-lg transition-all duration-300">
            <h4 className="text-xl font-bold mb-6 flex items-center">
              <MdSchool
                className="w-5 h-5 mr-3"
                style={{ color: colors.primary }}
              />
              Education
            </h4>
            <div className="space-y-4">
              {/* Current Education */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="border-l-4 pl-4 py-2"
                style={{ borderLeftColor: colors.primary }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-semibold text-gray-900">BS Information Technology</h5>
                  <span
                    className="font-medium text-sm"
                    style={{ color: colors.primary }}
                  >
                    2021-2025
                  </span>
                </div>
                <p
                  className="font-medium mb-1"
                  style={{ color: colors.light }}
                >
                  Final Year Student
                </p>
                <p className="text-gray-600 text-sm">Western Mindanao State University</p>
              </motion.div>

              {/* High School */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="border-l-4 pl-4 py-2"
                style={{ borderLeftColor: colors.light }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-semibold text-gray-900">Senior High School</h5>
                  <span
                    className="font-medium text-sm"
                    style={{ color: colors.primary }}
                  >
                    2017-2021
                  </span>
                </div>
                <p
                  className="font-medium mb-1"
                  style={{ color: colors.light }}
                >
                  ABM Strand Graduate
                </p>
                <p className="text-gray-600 text-sm">Accounting, Business & Management</p>
              </motion.div>

              {/* Elementary */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="border-l-4 pl-4 py-2"
                style={{ borderLeftColor: colors.accent }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-semibold text-gray-900">Elementary Education</h5>
                  <span
                    className="font-medium text-sm"
                    style={{ color: colors.primary }}
                  >
                    2009-2015
                  </span>
                </div>
                <p
                  className="font-medium mb-1"
                  style={{ color: colors.light }}
                >
                  Primary Graduate
                </p>
                <p className="text-gray-600 text-sm">San Roque Elementary School</p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );

  const renderInterestsTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Interests */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        custom={1}
      >
        <h3 className="text-2xl font-bold mb-6 text-center">Interests & Hobbies</h3>
        <div className="space-y-6">
          {interests.map((interest, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
              className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg transition-colors"
              style={{
                '&:hover': {
                  backgroundColor: colors.accent + '20'
                }
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.accent + '20'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
            >
              <interest.icon
                className="w-8 h-8 mt-1 flex-shrink-0"
                style={{ color: colors.primary }}
              />
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">{interest.name}</h4>
                <p className="text-gray-600 text-sm">{interest.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        custom={2}
      >
        <h3 className="text-2xl font-bold mb-6 text-center">Achievements</h3>
        <div className="space-y-6">
          {achievements.map((achievement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + (index * 0.1) }}
              className="border-l-4 pl-4 py-2"
              style={{ borderLeftColor: colors.primary }}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                <span
                  className="font-medium text-sm"
                  style={{ color: colors.primary }}
                >
                  {achievement.year}
                </span>
              </div>
              <p
                className="font-medium mb-1"
                style={{ color: colors.light }}
              >
                {achievement.achievement}
              </p>
              <p className="text-gray-600 text-sm">{achievement.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );

  const renderExperiencesTab = () => (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      custom={0}
    >
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-4">Experiences & Stories</h3>
        <p className="text-gray-600">Personal experiences, travels, and insights from my journey</p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`group relative rounded-lg overflow-hidden bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-lg border border-gray-200/30 hover:border-white/60 transition-all duration-700 hover:shadow-2xl hover:shadow-gray-500/10 hover:scale-[1.02] hover:-translate-y-1 ${gridClass}`}
              >
                <Link to={`/blog/${post.id}`} className="block h-full">
                  <div className="absolute inset-0">
                    {post.coverImage && (
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  </div>

                  <div className="relative z-10 p-4 h-full flex flex-col justify-end">
                    <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <div className="flex items-center text-white/80 text-xs mb-2">
                        <span>{post.date}</span>
                        <span className="mx-2">•</span>
                        <span>{post.readTime} min read</span>
                      </div>

                      <h3 className="text-white font-bold text-sm mb-2 line-clamp-2">{post.title}</h3>
                      <p className="text-gray-200 text-xs mb-3 line-clamp-2 opacity-90">{post.excerpt}</p>

                      {post.tags && (
                        <div className="flex flex-wrap gap-1">
                          {post.tags.slice(0, 2).map((tag, i) => (
                            <span
                              key={i}
                              className="bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Pagination */}
      {blogposts.length > postsPerPage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex flex-col items-center mt-12 space-y-4"
        >
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
                borderColor: colors.primary
              } : {}}
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
                  className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 border shadow-md"
                  style={currentPage === i + 1 ? {
                    backgroundColor: colors.primary,
                    color: 'white',
                    borderColor: colors.primary
                  } : {
                    backgroundColor: 'white',
                    color: colors.primary,
                    borderColor: '#e5e7eb'
                  }}
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
                borderColor: colors.primary
              } : {}}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );

  return (
    <section id="personal" className="py-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="section-title text-center mx-auto after:left-1/2 after:-translate-x-1/2">Personal</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">Get to know me beyond my technical skills - my story, interests, and experiences</p>
        </div>

        <div className="max-w-6xl mx-auto" ref={ref}>
          {/* Tab Navigation */}
          <div className="mb-12">
            <div className="grid grid-cols-3 gap-3 lg:gap-4 max-w-4xl mx-auto">
              {tabs.map((tab, index) => (
                <motion.button
                  key={tab.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative overflow-hidden z-10 !px-4 !py-3 lg:!px-6 lg:!py-3 rounded-lg font-medium transition-all duration-300 text-sm lg:text-base text-center !flex !items-center !justify-center ${
                    activeTab === tab.id
                      ? 'btn-primary text-white'
                      : 'bg-white/60 backdrop-blur-sm text-gray-700 hover:bg-violet-50/80 hover:text-violet-800 hover:border-violet-200 hover:transform hover:translateY(-2px) shadow-md border border-gray-200/50 hover:shadow-lg'
                  }`}
                >
                  <tab.icon className="w-5 h-5 mr-2 lg:mr-3 relative z-10" />
                  <span className="relative z-10 hidden sm:inline">{tab.label}</span>
                  <span className="relative z-10 sm:hidden">{tab.label.split(' ')[0]}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {isInView && (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'about' && renderAboutTab()}
                {activeTab === 'interests' && renderInterestsTab()}
                {activeTab === 'experiences' && renderExperiencesTab()}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </section>
  );
};

export default Personal;