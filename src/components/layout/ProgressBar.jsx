import { memo } from 'react';
import useScrollManager from '../../hooks/useScrollManager';

const ProgressBar = memo(() => {
  const { progress } = useScrollManager();

  return (
    <div className="progress-container">
      <div className="progress-bar" style={{ width: `${progress}%` }}></div>
    </div>
  );
});

ProgressBar.displayName = 'ProgressBar';

export default ProgressBar;