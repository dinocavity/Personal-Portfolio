import { memo, useMemo } from 'react';
import useScrollManager from '../../hooks/useScrollManager';

const ProgressBar = memo(() => {
  const { progress, activeSection } = useScrollManager();

  // Get gradient colors to match navbar - same color system
  const getGradientColors = useMemo(() => {
    const colors = {
      hero: { primary: '#1e3a8a', light: '#3b82f6', accent: '#60a5fa' },      // blue: dark → medium → light
      about: { primary: '#581c87', light: '#9333ea', accent: '#a855f7' },     // purple: dark → medium → light
      projects: { primary: '#92400e', light: '#f59e0b', accent: '#fbbf24' },  // amber: dark → medium → light
      blog: { primary: '#991b1b', light: '#ef4444', accent: '#f87171' },      // red: dark → medium → light
      footer: { primary: '#065f46', light: '#10b981', accent: '#34d399' }     // emerald: dark → medium → light
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