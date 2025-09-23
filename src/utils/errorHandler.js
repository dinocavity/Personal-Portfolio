/**
 * Global error handler for browser extension errors and other external issues
 */

// Suppress common browser extension errors that we can't control
const EXTENSION_ERROR_PATTERNS = [
  /Extension context invalidated/i,
  /chrome-extension:/i,
  /moz-extension:/i,
  /extension\//i,
  /Script error/i
];

/**
 * Check if an error is from a browser extension
 */
export const isExtensionError = (error) => {
  if (!error) return false;

  const errorMessage = error.message || error.toString();
  const errorStack = error.stack || '';

  return EXTENSION_ERROR_PATTERNS.some(pattern =>
    pattern.test(errorMessage) || pattern.test(errorStack)
  );
};

/**
 * Global error handler to filter out extension errors
 */
export const setupGlobalErrorHandler = () => {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason;

    if (isExtensionError(error)) {
      event.preventDefault(); // Suppress the error
      console.debug('Suppressed browser extension error:', error.message);
      return;
    }

    // Log other errors for debugging
    if (import.meta.env.DEV) {
      console.error('Unhandled promise rejection:', error);
    }
  });

  // Handle general JavaScript errors
  window.addEventListener('error', (event) => {
    const { error, message, filename } = event;

    if (isExtensionError(error) || isExtensionError({ message, filename })) {
      event.preventDefault(); // Suppress the error
      console.debug('Suppressed browser extension error:', message);
      return;
    }

    // Log other errors for debugging
    if (import.meta.env.DEV) {
      console.error('JavaScript error:', { message, filename, error });
    }
  });
};

// Error boundary would be implemented separately as a React component if needed

export default {
  setupGlobalErrorHandler,
  isExtensionError
};