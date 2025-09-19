import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import experience from '../../data/experience';

const Experience = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
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
  
  return (
    <section id="experience" className="py-20">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="section-title text-center mx-auto after:left-1/2 after:-translate-x-1/2">Experience</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">My professional journey</p>
        </div>
        
        <div className="max-w-4xl mx-auto" ref={ref}>
          <div className="relative border-l-2 border-blue-900 pl-8 ml-4">
            {experience.map((exp, index) => (
              <div 
                key={index} 
                className="mb-12 relative"
              >
                {isInView && (
                  <motion.div
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    className="bg-white p-6 rounded-lg shadow-md hover-lift"
                  >
                    <div className="absolute w-4 h-4 bg-blue-900 rounded-full -left-[41px] top-8"></div>
                    <span className="absolute -left-28 top-8 text-gray-500 font-medium">{exp.period}</span>
                    
                    <h3 className="text-xl font-bold mb-1">{exp.title}</h3>
                    <div className="flex flex-wrap items-center text-gray-600 mb-4">
                      <span className="font-medium text-blue-900">{exp.company}</span>
                      <span className="mx-2">•</span>
                      <span>{exp.location}</span>
                    </div>
                    
                    <p className="text-gray-700 mb-4">{exp.description}</p>
                    
                    {exp.responsibilities && (
                      <ul className="list-disc pl-5 mb-4 text-gray-700">
                        {exp.responsibilities.map((responsibility, i) => (
                          <li key={i}>{responsibility}</li>
                        ))}
                      </ul>
                    )}
                    
                    <div className="flex flex-wrap gap-2">
                      {exp.skills.map((skill, i) => (
                        <span 
                          key={i}
                          className="bg-blue-100 text-blue-900 px-3 py-1 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
