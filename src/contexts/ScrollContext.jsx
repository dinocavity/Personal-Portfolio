import { createContext, useContext } from 'react';
import useScrollManager from '../hooks/useScrollManager';

// Create the context
const ScrollContext = createContext(null);

// Provider component
export const ScrollProvider = ({ children }) => {
  const scrollData = useScrollManager();

  return (
    <ScrollContext.Provider value={scrollData}>
      {children}
    </ScrollContext.Provider>
  );
};

// Custom hook to use the scroll context
export const useScroll = () => {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error('useScroll must be used within a ScrollProvider');
  }
  return context;
};

export default ScrollContext;