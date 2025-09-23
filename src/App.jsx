import { Routes, Route, useLocation } from 'react-router-dom';
import { memo, Suspense, lazy, useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProgressBar from './components/layout/ProgressBar';
import SocialSidebar from './components/layout/SocialSidebar';
import ParticleBackground from './components/ui/ParticleBackground';
import LoadingSpinner from './components/ui/LoadingSpinner';
import { ScrollProvider, useScroll } from './contexts/ScrollContext';
import Home from './pages/Home';

// Lazy load BlogDetail for better code splitting
const BlogDetail = lazy(() => import('./pages/BlogDetail'));

// Inner App component that uses the scroll context
const AppContent = memo(() => {
  const { activeSection } = useScroll();
  const location = useLocation();

  // Check if we're on a blog detail page
  const isBlogDetailPage = location.pathname.startsWith('/blog/');

  // Update global CSS custom properties based on active section
  useEffect(() => {
    const getGradientColors = (activeSection) => {
      const colors = {
        hero: { primary: '#1e3a8a', light: '#3b82f6', accent: '#60a5fa' },      // blue: dark → medium → light
        skills: { primary: '#0f766e', light: '#14b8a6', accent: '#5eead4' },    // teal: dark → medium → light
        projects: { primary: '#92400e', light: '#f59e0b', accent: '#fbbf24' },  // amber: dark → medium → light
        certifications: { primary: '#c2410c', light: '#f97316', accent: '#fb923c' }, // orange: dark → medium → light
        personal: { primary: '#581c87', light: '#9333ea', accent: '#a855f7' },  // purple: dark → medium → light
        blog: { primary: '#991b1b', light: '#ef4444', accent: '#f87171' },      // red: dark → medium → light
        footer: { primary: '#991b1b', light: '#ef4444', accent: '#f87171' }     // red: dark → medium → light
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
      {!isBlogDetailPage && <SocialSidebar />}

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

AppContent.displayName = 'AppContent';

// Main App component that provides the scroll context
const App = memo(() => {
  return (
    <ScrollProvider>
      <AppContent />
    </ScrollProvider>
  );
});

App.displayName = 'App';

export default App;