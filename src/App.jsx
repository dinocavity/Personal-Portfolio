import { Routes, Route } from 'react-router-dom';
import { memo, Suspense, lazy } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProgressBar from './components/layout/ProgressBar';
import SocialSidebar from './components/layout/SocialSidebar';
import ParticleBackground from './components/ui/ParticleBackground';
import LoadingSpinner from './components/ui/LoadingSpinner';
import Home from './pages/Home';

// Lazy load BlogDetail for better code splitting
const BlogDetail = lazy(() => import('./pages/BlogDetail'));

const App = memo(() => {

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