import { useEffect, useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  MdWork,
  MdSportsTennis,
  MdCameraAlt,
  MdSportsEsports,
  MdMenuBook,
  MdEmojiEvents,
  MdExpandMore,
  MdExpandLess
} from 'react-icons/md';
import { GiArcheryTarget } from 'react-icons/gi';
import {
  SiJavascript,
  SiReact,
  SiNodedotjs,
  SiPython,
  SiHtml5,
  SiCss3,
  SiTailwindcss,
  SiPhp,
  SiMysql,
  SiPostgresql,
  SiMongodb,
  SiFirebase,
  SiSupabase,
  SiGit,
  SiGithub,
  SiBootstrap,
  SiExpress,
  SiDjango,
  SiTensorflow
} from 'react-icons/si';

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeTab, setActiveTab] = useState('professional');
  const [educationExpanded, setEducationExpanded] = useState(false);
  const [languagesVisible, setLanguagesVisible] = useState(false);
  
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
  
  const technologies = [
    { name: 'JavaScript', icon: SiJavascript, color: '#F7DF1E' },
    { name: 'React.js', icon: SiReact, color: '#61DAFB' },
    { name: 'Node.js', icon: SiNodedotjs, color: '#339933' },
    { name: 'Python', icon: SiPython, color: '#3776AB' },
    { name: 'HTML5', icon: SiHtml5, color: '#E34F26' },
    { name: 'CSS3', icon: SiCss3, color: '#1572B6' },
    { name: 'Tailwind CSS', icon: SiTailwindcss, color: '#06B6D4' },
    { name: 'PHP', icon: SiPhp, color: '#777BB4' },
    { name: 'MySQL', icon: SiMysql, color: '#4479A1' },
    { name: 'PostgreSQL', icon: SiPostgresql, color: '#336791' },
    { name: 'MongoDB', icon: SiMongodb, color: '#47A248' },
    { name: 'Firebase', icon: SiFirebase, color: '#FFCA28' },
    { name: 'Supabase', icon: SiSupabase, color: '#3ECF8E' },
    { name: 'Git', icon: SiGit, color: '#F05032' },
    { name: 'GitHub', icon: SiGithub, color: '#181717' },
    { name: 'Bootstrap', icon: SiBootstrap, color: '#7952B3' },
    { name: 'Express.js', icon: SiExpress, color: '#000000' },
    { name: 'Django', icon: SiDjango, color: '#092E20' },
    { name: 'TensorFlow', icon: SiTensorflow, color: '#FF6F00' },
  ];
  
  const languages = [
    { name: 'Filipino', level: 'Native' },
    { name: 'English', level: 'Fluent' },
    { name: 'Chavacano', level: 'Fluent' },
    { name: 'Bisaya', level: 'Fluent' },
  ];

  const tabs = [
    { id: 'professional', label: 'Professional', icon: MdWork }
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
      icon: MdSportsTennis,
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
  
  return (
    <section id="about" className="py-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="section-title text-center mx-auto after:left-1/2 after:-translate-x-1/2">About Me</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">Get to know me better</p>
        </div>
        

        {/* Content */}
        <div className="max-w-6xl mx-auto" ref={ref}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12"
          >
              <div>
                {isInView && (
                  <motion.div
                    custom={0}
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                  >
                    <h3 className="text-2xl font-bold mb-4">Who I Am</h3>
                    <p className="text-gray-700 mb-4">
                      I'm Dion Cedrick Marquez, a Software Engineer based in Zamboanga City, Philippines.
                      I'm passionate about creating efficient and user-friendly web applications.
                    </p>
                    <p className="text-gray-700 mb-4">
                      With a Bachelor's degree in Information Technology from Western Mindanao State University,
                      I've built a strong foundation in software development and continue to expand my skills in modern web technologies.
                    </p>
                    <p className="text-gray-700 mb-8">
                      I specialize in full-stack development with expertise in React.js, Node.js, and modern web frameworks.
                      My goal is to create digital solutions that make a meaningful impact.
                    </p>

                    <AnimatePresence>
                      {languagesVisible && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mb-8 space-y-8"
                        >
                          <div>
                            <h4 className="text-xl font-semibold mb-4">Languages</h4>
                            <div className="grid grid-cols-2 gap-4">
                              {languages.map((language, index) => (
                                <div key={index} className="flex items-center">
                                  <div className="w-3 h-3 bg-blue-900 rounded-full mr-2"></div>
                                  <span className="text-gray-700 mr-2">{language.name}:</span>
                                  <span className="text-gray-600 font-medium">{language.level}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-xl font-semibold mb-6">Education</h4>
                            <div className="space-y-6">
                              <div className="flex items-start">
                                <div className="flex-shrink-0 w-3 h-3 bg-blue-900 rounded-full mt-2 mr-4"></div>
                                <div>
                                  <h5 className="text-lg font-semibold text-gray-900">Bachelor of Science in Information Technology</h5>
                                  <p className="text-blue-700 font-medium">Western Mindanao State University</p>
                                  <p className="text-gray-600 text-sm">2021 - 2025</p>
                                </div>
                              </div>

                              {educationExpanded && (
                                <>
                                  <div className="flex items-start">
                                    <div className="flex-shrink-0 w-3 h-3 bg-blue-900 rounded-full mt-2 mr-4"></div>
                                    <div>
                                      <h5 className="text-lg font-semibold text-gray-900">Accountancy and Business Management</h5>
                                      <p className="text-blue-700 font-medium">Don Pablo Lorenzo Memorial High School</p>
                                      <p className="text-gray-600 text-sm">2017 - 2021</p>
                                    </div>
                                  </div>

                                  <div className="flex items-start">
                                    <div className="flex-shrink-0 w-3 h-3 bg-blue-900 rounded-full mt-2 mr-4"></div>
                                    <div>
                                      <h5 className="text-lg font-semibold text-gray-900">Elementary Education</h5>
                                      <p className="text-blue-700 font-medium">San Roque Elementary School</p>
                                      <p className="text-gray-600 text-sm">2009 - 2015</p>
                                    </div>
                                  </div>
                                </>
                              )}

                              <button
                                onClick={() => setEducationExpanded(!educationExpanded)}
                                className="text-blue-900 hover:text-blue-700 transition-colors flex items-center text-sm"
                              >
                                {educationExpanded ? (
                                  <>
                                    <span className="mr-2">Show Less Education</span>
                                    <MdExpandLess className="w-4 h-4" />
                                  </>
                                ) : (
                                  <>
                                    <span className="mr-2">Show More Education</span>
                                    <MdExpandMore className="w-4 h-4" />
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <button
                      onClick={() => setLanguagesVisible(!languagesVisible)}
                      className="text-blue-900 hover:text-blue-700 transition-colors flex items-center"
                    >
                      {languagesVisible ? (
                        <>
                          <span className="mr-2">See Less</span>
                          <MdExpandLess className="w-5 h-5" />
                        </>
                      ) : (
                        <>
                          <span className="mr-2">See More</span>
                          <MdExpandMore className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </motion.div>
                )}
              </div>

              <div>
                {isInView && (
                  <motion.div
                    custom={1}
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                  >
                    <h3 className="text-2xl font-bold mb-6">Technologies</h3>
                    <div className="grid grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-4">
                      {technologies.map((tech, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.3 + (index * 0.05) }}
                          className="flex flex-col items-center group"
                        >
                          <div
                            className="w-12 h-12 flex items-center justify-center rounded-lg bg-white shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-110"
                            style={{ backgroundColor: `${tech.color}10` }}
                          >
                            <tech.icon
                              className="w-6 h-6 transition-colors duration-300"
                              style={{ color: tech.color }}
                            />
                          </div>
                          <span className="text-xs text-gray-600 mt-2 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {tech.name}
                          </span>
                        </motion.div>
                      ))}
                    </div>

                  </motion.div>
                )}
              </div>
            </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;