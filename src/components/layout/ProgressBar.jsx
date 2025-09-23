import { memo, useMemo } from 'react';
import { useScroll } from '../../contexts/ScrollContext';

const ProgressBar = memo(() => {
  const { progress, activeSection } = useScroll();

  // Get gradient colors to match navbar - same color system
  const getGradientColors = useMemo(() => {
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
  }, [activeSection]);

  return (
    <div className="progress-container">
      <div
        className="progress-bar"
        style={{
          width: `${progress}%`,
          background: `linear-gradient(90deg, ${getGradientColors.primary}, ${getGradientColors.light})`,
          transition: 'background 0.5s ease-in-out'
        }}
      ></div>
    </div>
  );
});

ProgressBar.displayName = 'ProgressBar';

export default ProgressBar;