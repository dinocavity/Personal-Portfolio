import { forwardRef, memo, useMemo } from 'react';

/**
 * Button variant styles optimized for performance
 * Memoized to prevent recreation on every render
 */
const buttonVariants = {
  primary: 'bg-gradient-to-r from-blue-900 to-blue-700 text-white hover:opacity-90 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2',
  outline: 'border-2 border-blue-900 text-blue-900 bg-transparent hover:bg-blue-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  ghost: 'bg-transparent text-blue-900 hover:bg-blue-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
};

/**
 * Button size styles
 */
const buttonSizes = {
  sm: 'text-sm px-3 py-1.5',
  md: 'px-4 py-2',
  lg: 'text-lg px-6 py-3'
};

/**
 * Optimized Button component with advanced accessibility and performance features
 *
 * @typedef {Object} ButtonProps
 * @property {React.ReactNode} children - Button content
 * @property {string} [className=''] - Additional CSS classes
 * @property {'primary'|'secondary'|'outline'|'ghost'} [variant='primary'] - Button style variant
 * @property {'sm'|'md'|'lg'} [size='md'] - Button size
 * @property {boolean} [disabled=false] - Whether button is disabled
 * @property {boolean} [loading=false] - Whether button is in loading state
 * @property {string} [loadingText] - Text to show when loading
 * @property {'button'|'submit'|'reset'} [type='button'] - Button type
 * @property {function} [onClick] - Click handler
 *
 * @param {ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>} props
 * @param {React.Ref<HTMLButtonElement>} ref
 * @returns {JSX.Element}
 */
const Button = memo(forwardRef(({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  loadingText = 'Loading...',
  type = 'button',
  onClick,
  ...props
}, ref) => {
  // Memoize computed classes for performance
  const computedClassName = useMemo(() => {
    const baseClasses = 'rounded-md font-medium transition-all duration-300 focus:outline-none inline-flex items-center justify-center relative overflow-hidden';
    const variantClasses = buttonVariants[variant];
    const sizeClasses = buttonSizes[size];

    const stateClasses = disabled || loading
      ? 'opacity-50 cursor-not-allowed'
      : 'transform hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:shadow-md';

    return `${baseClasses} ${variantClasses} ${sizeClasses} ${stateClasses} ${className}`.trim();
  }, [variant, size, disabled, loading, className]);

  // Memoize click handler to prevent unnecessary re-renders
  const handleClick = useMemo(() => {
    if (disabled || loading || !onClick) return undefined;
    return onClick;
  }, [disabled, loading, onClick]);

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={computedClassName}
      onClick={handleClick}
      aria-disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      <span className={loading ? 'opacity-75' : ''}>
        {loading && loadingText ? loadingText : children}
      </span>
    </button>
  );
}));

Button.displayName = 'Button';

export default Button;