import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
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
import { MdWeb, MdDeveloperMode, MdStorage, MdBuild } from 'react-icons/md';

const Skills = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeCategory, setActiveCategory] = useState('frontend');

  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: custom * 0.1,
        duration: 0.6,
        ease: 'easeOut'
      }
    })
  };

  const skillCategories = {
    frontend: {
      title: 'Frontend Development',
      icon: MdWeb,
      skills: [
        { name: 'JavaScript', icon: SiJavascript, color: '#F7DF1E', experience: 'Advanced', description: 'Modern ES6+ features and frameworks' },
        { name: 'React.js', icon: SiReact, color: '#61DAFB', experience: 'Advanced', description: 'Hooks, Context API, and component libraries' },
        { name: 'HTML5', icon: SiHtml5, color: '#E34F26', experience: 'Expert', description: 'Semantic markup and accessibility' },
        { name: 'CSS3', icon: SiCss3, color: '#1572B6', experience: 'Advanced', description: 'Flexbox, Grid, and animations' },
        { name: 'Tailwind CSS', icon: SiTailwindcss, color: '#06B6D4', experience: 'Advanced', description: 'Utility-first CSS framework' },
        { name: 'Bootstrap', icon: SiBootstrap, color: '#7952B3', experience: 'Intermediate', description: 'Responsive design components' }
      ]
    },
    backend: {
      title: 'Backend Development',
      icon: MdDeveloperMode,
      skills: [
        { name: 'Node.js', icon: SiNodedotjs, color: '#339933', experience: 'Intermediate', description: 'Server-side JavaScript runtime' },
        { name: 'Express.js', icon: SiExpress, color: '#000000', experience: 'Intermediate', description: 'RESTful APIs and middleware' },
        { name: 'PHP', icon: SiPhp, color: '#777BB4', experience: 'Advanced', description: 'Server-side scripting and frameworks' },
        { name: 'Python', icon: SiPython, color: '#3776AB', experience: 'Intermediate', description: 'Web development and data analysis' },
        { name: 'Django', icon: SiDjango, color: '#092E20', experience: 'Beginner', description: 'Python web framework' }
      ]
    },
    database: {
      title: 'Databases & Tools',
      icon: MdStorage,
      skills: [
        { name: 'MySQL', icon: SiMysql, color: '#4479A1', experience: 'Advanced', description: 'Relational database management' },
        { name: 'PostgreSQL', icon: SiPostgresql, color: '#336791', experience: 'Intermediate', description: 'Advanced SQL features' },
        { name: 'MongoDB', icon: SiMongodb, color: '#47A248', experience: 'Beginner', description: 'NoSQL document database' },
        { name: 'Firebase', icon: SiFirebase, color: '#FFCA28', experience: 'Intermediate', description: 'Real-time database and hosting' },
        { name: 'Supabase', icon: SiSupabase, color: '#3ECF8E', experience: 'Beginner', description: 'Open source Firebase alternative' }
      ]
    },
    tools: {
      title: 'Development Tools',
      icon: MdBuild,
      skills: [
        { name: 'Git', icon: SiGit, color: '#F05032', experience: 'Advanced', description: 'Version control and collaboration' },
        { name: 'GitHub', icon: SiGithub, color: '#181717', experience: 'Advanced', description: 'Code hosting and project management' },
        { name: 'TensorFlow', icon: SiTensorflow, color: '#FF6F00', experience: 'Beginner', description: 'Machine learning framework' }
      ]
    }
  };

  const categories = Object.keys(skillCategories);

  return (
    <section id="skills" className="py-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="section-title text-center mx-auto after:left-1/2 after:-translate-x-1/2">Technical Skills</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">Technologies and tools I work with to bring ideas to life</p>
        </div>

        <div className="max-w-6xl mx-auto" ref={ref}>
          {/* Category Tabs */}
          <div className="mb-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 max-w-4xl mx-auto">
              {categories.map((category, index) => {
                // Short labels for mobile, full labels for desktop
                const mobileLabels = {
                  frontend: 'Frontend',
                  backend: 'Backend',
                  database: 'Database',
                  tools: 'Tools'
                };

                const CategoryIcon = skillCategories[category].icon;

                return (
                  <motion.button
                    key={category}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    onClick={() => setActiveCategory(category)}
                    className={`relative overflow-hidden z-10 !px-4 !py-3 lg:!px-6 lg:!py-3 rounded-lg font-medium transition-all duration-300 text-sm lg:text-base text-center !flex !items-center !justify-center ${
                      activeCategory === category
                        ? 'btn-primary text-white'
                        : 'bg-white/60 backdrop-blur-sm text-gray-700 hover:bg-teal-50/80 hover:text-teal-800 hover:border-teal-200 hover:transform hover:translateY(-2px) shadow-md border border-gray-200/50 hover:shadow-lg'
                    }`}
                  >
                    <CategoryIcon className="w-5 h-5 mr-2 lg:mr-3 relative z-10" />
                    {/* Show short labels on mobile, full labels on desktop */}
                    <span className="relative z-10 lg:hidden">{mobileLabels[category]}</span>
                    <span className="relative z-10 hidden lg:inline">{skillCategories[category].title}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Skills Grid */}
          {isInView && (
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white/60 backdrop-blur-lg border border-gray-200/30 rounded-2xl p-4 sm:p-8 shadow-lg"
            >
              <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">
                {skillCategories[activeCategory].title}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
                {skillCategories[activeCategory].skills.map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    className="group p-3 md:p-4 bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-lg border border-gray-200/30 rounded-lg hover:border-white/60 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-center mb-2 md:mb-3">
                      <div
                        className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-lg mr-3 md:mr-4 group-hover:scale-110 transition-transform duration-300"
                        style={{ backgroundColor: `${skill.color}15` }}
                      >
                        <skill.icon
                          className="w-5 h-5 md:w-6 md:h-6"
                          style={{ color: skill.color }}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-medium text-gray-800 text-sm md:text-base">{skill.name}</span>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            skill.experience === 'Expert' ? 'bg-green-100 text-green-700' :
                            skill.experience === 'Advanced' ? 'bg-blue-100 text-blue-700' :
                            skill.experience === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {skill.experience}
                          </span>
                        </div>
                        <p className="text-xs md:text-sm text-gray-600 leading-relaxed">{skill.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Additional Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-8 text-center"
              >
                <p className="text-gray-600 text-sm">
                  {activeCategory === 'frontend' && "Building responsive and interactive user interfaces with modern frameworks and libraries."}
                  {activeCategory === 'backend' && "Developing robust server-side applications and APIs for scalable web solutions."}
                  {activeCategory === 'database' && "Managing and optimizing data storage solutions for various application needs."}
                  {activeCategory === 'tools' && "Utilizing essential development tools for version control, collaboration, and deployment."}
                </p>
              </motion.div>
            </motion.div>
          )}

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-2 gap-4 sm:gap-6 mt-8 sm:mt-12"
          >
            <div className="text-center bg-white/60 backdrop-blur-sm border border-gray-200/30 rounded-lg p-4 sm:p-6 shadow-md">
              <div className="text-2xl sm:text-3xl font-bold text-primary-color mb-2">19+</div>
              <div className="text-gray-600 text-sm sm:text-base">Technologies</div>
            </div>
            <div className="text-center bg-white/60 backdrop-blur-sm border border-gray-200/30 rounded-lg p-4 sm:p-6 shadow-md">
              <div className="text-2xl sm:text-3xl font-bold text-primary-color mb-2">15+</div>
              <div className="text-gray-600 text-sm sm:text-base">Projects Built</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Skills;