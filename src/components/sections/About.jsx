import { useState, useRef } from 'react';
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

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
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

  return (
    <section id="about" className="py-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="section-title text-center mx-auto after:left-1/2 after:-translate-x-1/2">About Me</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">Get to know me better beyond my technical skills</p>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto" ref={ref}>
          {isInView && (
            <motion.div
              custom={0}
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="text-center mb-12"
            >
              <h3 className="text-2xl font-bold mb-6">Who I Am</h3>
              <p className="text-gray-700 mb-4 text-lg">
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
                      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                        {languages.map((language, index) => (
                          <div key={index} className="flex items-center">
                            <div className="w-3 h-3 bg-purple-600 rounded-full mr-2"></div>
                            <span className="text-gray-700 mr-2">{language.name}:</span>
                            <span className="text-gray-600 font-medium">{language.level}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xl font-semibold mb-6">Education</h4>
                      <div className="space-y-6 max-w-2xl mx-auto text-left">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 w-3 h-3 bg-purple-600 rounded-full mt-2 mr-4"></div>
                          <div>
                            <h5 className="text-lg font-semibold text-gray-900">Bachelor of Science in Information Technology</h5>
                            <p className="text-purple-700 font-medium">Western Mindanao State University</p>
                            <p className="text-gray-600 text-sm">2021 - 2025</p>
                          </div>
                        </div>

                        {educationExpanded && (
                          <>
                            <div className="flex items-start">
                              <div className="flex-shrink-0 w-3 h-3 bg-purple-600 rounded-full mt-2 mr-4"></div>
                              <div>
                                <h5 className="text-lg font-semibold text-gray-900">Accountancy and Business Management</h5>
                                <p className="text-purple-700 font-medium">Don Pablo Lorenzo Memorial High School</p>
                                <p className="text-gray-600 text-sm">2017 - 2021</p>
                              </div>
                            </div>

                            <div className="flex items-start">
                              <div className="flex-shrink-0 w-3 h-3 bg-purple-600 rounded-full mt-2 mr-4"></div>
                              <div>
                                <h5 className="text-lg font-semibold text-gray-900">Elementary Education</h5>
                                <p className="text-purple-700 font-medium">San Roque Elementary School</p>
                                <p className="text-gray-600 text-sm">2009 - 2015</p>
                              </div>
                            </div>
                          </>
                        )}

                        <button
                          onClick={() => setEducationExpanded(!educationExpanded)}
                          className="text-purple-600 hover:text-purple-700 transition-colors flex items-center text-sm"
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
                className="text-purple-600 hover:text-purple-700 transition-colors flex items-center mx-auto mb-12"
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

          {/* Interests & Achievements */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Interests */}
            <div>
              {isInView && (
                <motion.div
                  custom={1}
                  initial="hidden"
                  animate="visible"
                  variants={fadeIn}
                >
                  <h3 className="text-2xl font-bold mb-6 text-center">Interests & Hobbies</h3>
                  <div className="space-y-6">
                    {interests.map((interest, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
                        className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-purple-50 transition-colors"
                      >
                        <interest.icon className="w-8 h-8 text-purple-600 mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">{interest.name}</h4>
                          <p className="text-gray-600 text-sm">{interest.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Achievements */}
            <div>
              {isInView && (
                <motion.div
                  custom={2}
                  initial="hidden"
                  animate="visible"
                  variants={fadeIn}
                >
                  <h3 className="text-2xl font-bold mb-6 text-center">Achievements</h3>
                  <div className="space-y-6">
                    {achievements.map((achievement, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 + (index * 0.1) }}
                        className="border-l-4 border-purple-600 pl-4 py-2"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                          <span className="text-purple-600 font-medium text-sm">{achievement.year}</span>
                        </div>
                        <p className="text-purple-700 font-medium mb-1">{achievement.achievement}</p>
                        <p className="text-gray-600 text-sm">{achievement.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;