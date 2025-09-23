import Hero from '../components/sections/Hero';
import Skills from '../components/sections/Skills';
import Projects from '../components/sections/Projects';
import Certifications from '../components/sections/Certifications';
import Personal from '../components/sections/Personal';

const Home = () => {
  return (
    <>
      <Hero />
      <Skills />
      <Projects />
      <Certifications />
      <Personal />
    </>
  );
};

export default Home;