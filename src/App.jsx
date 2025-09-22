import { Routes, Route } from 'react-router-dom';
import { memo, Suspense, lazy, useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProgressBar from './components/layout/ProgressBar';
import SocialSidebar from './components/layout/SocialSidebar';
import ParticleBackground from './components/ui/ParticleBackground';
import LoadingSpinner from './components/ui/LoadingSpinner';
import useScrollManager from './hooks/useScrollManager';
import Home from './pages/Home';

// Lazy load BlogDetail for better code splitting
const BlogDetail = lazy(() => import('./pages/BlogDetail'));

const App = memo(() => {
  const { activeSection } = useScrollManager();

  // Update global CSS custom properties based on active section
  useEffect(() => {
    const getGradientColors = (activeSection) => {
      const colors = {
        hero: { primary: '#1e3a8a', light: '#3b82f6', accent: '#60a5fa' },      // blue: dark → medium → light
        about: { primary: '#581c87', light: '#9333ea', accent: '#a855f7' },     // purple: dark → medium → light
        experience: { primary: '#0f766e', light: '#14b8a6', accent: '#5eead4' }, // teal: dark → medium → light
        projects: { primary: '#92400e', light: '#f59e0b', accent: '#fbbf24' },  // amber: dark → medium → light
        blog: { primary: '#991b1b', light: '#ef4444', accent: '#f87171' },      // red: dark → medium → light
        footer: { primary: '#065f46', light: '#10b981', accent: '#34d399' }     // emerald: dark → medium → light
      };
      return colors[activeSection] || colors.hero;
    };

    const colors = getGradientColors(activeSection);

    // Update CSS custom properties globally
    document.documentElement.style.setProperty('--primary-color', colors.primary);
    document.documentElement.style.setProperty('--primary-light', colors.light);
    document.documentElement.style.setProperty('--accent-color', colors.accent);
  }, [activeSection]);

  return (
    <div className="relative bg-gray-50 min-h-screen">
      <ParticleBackground />
      <Navbar />
      <ProgressBar />
      <SocialSidebar />

      <main className="pt-16 pb-24 relative z-10">
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <LoadingSpinner size="large" />
          </div>
        }>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
          </Routes>
        </Suspense>
      </main>
      
      <Footer />
    </div>
  )
});

App.displayName = 'App';

export default App;