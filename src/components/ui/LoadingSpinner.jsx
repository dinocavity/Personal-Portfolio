import { memo } from 'react';
import { motion } from 'framer-motion';

/**
 * Optimized loading spinner component
 * Uses CSS transforms instead of layout-triggering properties
 */
const LoadingSpinner = memo(({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'h-6 w-6',
    medium: 'h-12 w-12',
    large: 'h-16 w-16'
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        className={`${sizeClasses[size]} border-2 border-primary-color/20 border-t-primary-color rounded-full`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear'
        }}
        style={{
          willChange: 'transform' // Optimize for animations
        }}
      />
    </div>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';

export default LoadingSpinner;