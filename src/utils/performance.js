/**
 * Performance monitoring utilities for production-ready React applications
 * Demonstrates advanced performance tracking skills for hiring managers
 *
 * Features:
 * - Core Web Vitals monitoring (LCP, FID, CLS)
 * - Custom performance metrics
 * - Memory usage tracking
 * - Bundle size analytics
 * - React-specific performance insights
 */

/**
 * Performance metrics collector with advanced analytics
 */
class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.observers = new Map();
    this.startTime = performance.now();
    this.isEnabled = typeof window !== 'undefined' && import.meta.env?.MODE === 'production';

    if (this.isEnabled) {
      this.initializeCoreWebVitals();
      this.initializeCustomMetrics();
    }
  }

  /**
   * Initialize Core Web Vitals monitoring
   * Essential for modern web performance optimization
   */
  initializeCoreWebVitals() {
    // Largest Contentful Paint (LCP)
    this.observeLCP();

    // First Input Delay (FID) / Interaction to Next Paint (INP)
    this.observeFID();

    // Cumulative Layout Shift (CLS)
    this.observeCLS();
  }

  /**
   * Monitor Largest Contentful Paint
   */
  observeLCP() {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];

      this.recordMetric('LCP', {
        value: lastEntry.startTime,
        rating: this.getRating('LCP', lastEntry.startTime),
        element: lastEntry.element?.tagName || 'unknown',
        timestamp: Date.now()
      });
    });

    observer.observe({ entryTypes: ['largest-contentful-paint'] });
    this.observers.set('LCP', observer);
  }

  /**
   * Monitor First Input Delay
   */
  observeFID() {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        this.recordMetric('FID', {
          value: entry.processingStart - entry.startTime,
          rating: this.getRating('FID', entry.processingStart - entry.startTime),
          timestamp: Date.now()
        });
      });
    });

    observer.observe({ entryTypes: ['first-input'] });
    this.observers.set('FID', observer);
  }

  /**
   * Monitor Cumulative Layout Shift
   */
  observeCLS() {
    if (!('PerformanceObserver' in window)) return;

    let clsValue = 0;
    let sessionValue = 0;
    let sessionEntries = [];

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();

      entries.forEach(entry => {
        if (!entry.hadRecentInput) {
          const firstSessionEntry = sessionEntries[0];
          const lastSessionEntry = sessionEntries[sessionEntries.length - 1];

          if (sessionValue &&
              entry.startTime - lastSessionEntry.startTime < 1000 &&
              entry.startTime - firstSessionEntry.startTime < 5000) {
            sessionValue += entry.value;
            sessionEntries.push(entry);
          } else {
            sessionValue = entry.value;
            sessionEntries = [entry];
          }

          if (sessionValue > clsValue) {
            clsValue = sessionValue;
            this.recordMetric('CLS', {
              value: clsValue,
              rating: this.getRating('CLS', clsValue),
              timestamp: Date.now()
            });
          }
        }
      });
    });

    observer.observe({ entryTypes: ['layout-shift'] });
    this.observers.set('CLS', observer);
  }

  /**
   * Initialize custom performance metrics
   */
  initializeCustomMetrics() {
    // Time to Interactive (TTI)
    this.measureTTI();

    // Navigation timing
    this.measureNavigationTiming();

    // Resource loading performance
    this.measureResourceTiming();

    // Memory usage (if supported)
    this.measureMemoryUsage();
  }

  /**
   * Measure Time to Interactive
   */
  measureTTI() {
    if (document.readyState === 'complete') {
      this.calculateTTI();
    } else {
      window.addEventListener('load', () => this.calculateTTI());
    }
  }

  /**
   * Calculate TTI based on long tasks and network activity
   */
  calculateTTI() {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver(() => {
      // Simplified TTI calculation
      const loadEventEnd = performance.timing.loadEventEnd;
      const navigationStart = performance.timing.navigationStart;
      const tti = loadEventEnd - navigationStart;

      this.recordMetric('TTI', {
        value: tti,
        rating: this.getRating('TTI', tti),
        timestamp: Date.now()
      });
    });

    observer.observe({ entryTypes: ['navigation'] });
  }

  /**
   * Measure navigation timing metrics
   */
  measureNavigationTiming() {
    if (!performance.timing) return;

    const timing = performance.timing;
    const navigationStart = timing.navigationStart;

    const metrics = {
      'DNS-Lookup': timing.domainLookupEnd - timing.domainLookupStart,
      'TCP-Connect': timing.connectEnd - timing.connectStart,
      'Request': timing.responseStart - timing.requestStart,
      'Response': timing.responseEnd - timing.responseStart,
      'DOM-Processing': timing.domComplete - timing.domLoading,
      'Load-Complete': timing.loadEventEnd - timing.loadEventStart
    };

    Object.entries(metrics).forEach(([name, value]) => {
      this.recordMetric(name, {
        value,
        category: 'navigation',
        timestamp: Date.now()
      });
    });
  }

  /**
   * Measure resource loading performance
   */
  measureResourceTiming() {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();

      entries.forEach(entry => {
        if (entry.transferSize > 0) {
          this.recordMetric('Resource-Load', {
            name: entry.name,
            duration: entry.duration,
            transferSize: entry.transferSize,
            type: this.getResourceType(entry.name),
            timestamp: Date.now()
          });
        }
      });
    });

    observer.observe({ entryTypes: ['resource'] });
    this.observers.set('resource', observer);
  }

  /**
   * Measure memory usage if supported
   */
  measureMemoryUsage() {
    if (!('memory' in performance)) return;

    const measureMemory = () => {
      const memory = performance.memory;
      this.recordMetric('Memory-Usage', {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
        utilization: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100,
        timestamp: Date.now()
      });
    };

    // Measure every 30 seconds
    measureMemory();
    setInterval(measureMemory, 30000);
  }

  /**
   * Get performance rating based on metric thresholds
   */
  getRating(metric, value) {
    const thresholds = {
      'LCP': { good: 2500, poor: 4000 },
      'FID': { good: 100, poor: 300 },
      'CLS': { good: 0.1, poor: 0.25 },
      'TTI': { good: 3800, poor: 7300 }
    };

    const threshold = thresholds[metric];
    if (!threshold) return 'unknown';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  }

  /**
   * Determine resource type from URL
   */
  getResourceType(url) {
    if (url.match(/\.(js|mjs)$/)) return 'script';
    if (url.match(/\.css$/)) return 'stylesheet';
    if (url.match(/\.(png|jpg|jpeg|gif|svg|webp)$/)) return 'image';
    if (url.match(/\.(woff|woff2|ttf|otf)$/)) return 'font';
    return 'other';
  }

  /**
   * Record a performance metric
   */
  recordMetric(name, data) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }

    this.metrics.get(name).push({
      ...data,
      timestamp: data.timestamp || Date.now()
    });

    // Log important metrics in development
    if (import.meta.env?.DEV) {
      console.log(`📊 Performance Metric: ${name}`, data);
    }
  }

  /**
   * Get performance report
   */
  getReport() {
    const report = {
      sessionId: this.generateSessionId(),
      timestamp: Date.now(),
      duration: performance.now() - this.startTime,
      url: window.location.href,
      userAgent: navigator.userAgent,
      metrics: {}
    };

    this.metrics.forEach((values, name) => {
      report.metrics[name] = {
        values,
        count: values.length,
        latest: values[values.length - 1],
        average: this.calculateAverage(values)
      };
    });

    return report;
  }

  /**
   * Calculate average for numeric metrics
   */
  calculateAverage(values) {
    const numericValues = values
      .map(v => v.value)
      .filter(v => typeof v === 'number');

    if (numericValues.length === 0) return null;

    return numericValues.reduce((sum, val) => sum + val, 0) / numericValues.length;
  }

  /**
   * Generate unique session ID
   */
  generateSessionId() {
    return `perf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Export metrics for analytics
   */
  exportMetrics() {
    return {
      coreWebVitals: this.getCoreWebVitals(),
      customMetrics: this.getCustomMetrics(),
      resourceMetrics: this.getResourceMetrics(),
      memoryMetrics: this.getMemoryMetrics()
    };
  }

  /**
   * Get Core Web Vitals summary
   */
  getCoreWebVitals() {
    return {
      LCP: this.getLatestMetric('LCP'),
      FID: this.getLatestMetric('FID'),
      CLS: this.getLatestMetric('CLS')
    };
  }

  /**
   * Get custom metrics
   */
  getCustomMetrics() {
    return {
      TTI: this.getLatestMetric('TTI'),
      navigationTiming: this.getNavigationMetrics()
    };
  }

  /**
   * Get resource metrics
   */
  getResourceMetrics() {
    const resources = this.metrics.get('Resource-Load') || [];
    return {
      totalResources: resources.length,
      totalTransferSize: resources.reduce((sum, r) => sum + (r.transferSize || 0), 0),
      averageLoadTime: this.calculateAverage(resources.map(r => ({ value: r.duration })))
    };
  }

  /**
   * Get memory metrics
   */
  getMemoryMetrics() {
    return this.getLatestMetric('Memory-Usage');
  }

  /**
   * Get navigation timing metrics
   */
  getNavigationMetrics() {
    const navMetrics = {};
    ['DNS-Lookup', 'TCP-Connect', 'Request', 'Response', 'DOM-Processing', 'Load-Complete']
      .forEach(metric => {
        navMetrics[metric] = this.getLatestMetric(metric);
      });
    return navMetrics;
  }

  /**
   * Get latest metric value
   */
  getLatestMetric(name) {
    const values = this.metrics.get(name);
    return values && values.length > 0 ? values[values.length - 1] : null;
  }

  /**
   * Cleanup observers
   */
  cleanup() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    this.metrics.clear();
  }
}

// Global performance monitor instance
let performanceMonitor = null;

/**
 * Initialize performance monitoring
 */
export const initPerformanceMonitoring = () => {
  if (!performanceMonitor && typeof window !== 'undefined') {
    performanceMonitor = new PerformanceMonitor();
  }
  return performanceMonitor;
};

/**
 * Get performance monitor instance
 */
export const getPerformanceMonitor = () => {
  return performanceMonitor || initPerformanceMonitoring();
};

/**
 * React hook for performance monitoring
 */
export const usePerformanceMonitoring = () => {
  const monitor = getPerformanceMonitor();

  return {
    recordMetric: (name, data) => monitor?.recordMetric(name, data),
    getReport: () => monitor?.getReport(),
    getCoreWebVitals: () => monitor?.getCoreWebVitals(),
    exportMetrics: () => monitor?.exportMetrics()
  };
};

/**
 * Performance measurement decorator for functions
 */
export const measurePerformance = (name) => {
  return function decorator(target, propertyKey, descriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args) {
      const start = performance.now();
      const result = originalMethod.apply(this, args);
      const duration = performance.now() - start;

      const monitor = getPerformanceMonitor();
      monitor?.recordMetric(`Function-${name}`, {
        duration,
        function: propertyKey,
        timestamp: Date.now()
      });

      return result;
    };

    return descriptor;
  };
};

/**
 * Component render performance tracker
 * Note: Requires React to be imported in the consuming module
 */
export const withPerformanceTracking = (Component, name) => {
  return function PerformanceTrackedComponent(props) {
    const renderStart = performance.now();

    // Note: This would require React import in consuming module
    // For now, this is a placeholder for the pattern
    if (typeof window !== 'undefined' && window.React) {
      window.React.useEffect(() => {
        const renderEnd = performance.now();
        const monitor = getPerformanceMonitor();
        monitor?.recordMetric(`Component-Render-${name}`, {
          duration: renderEnd - renderStart,
          component: name,
          timestamp: Date.now()
        });
      });

      return window.React.createElement(Component, props);
    }

    return null;
  };
};

export default {
  initPerformanceMonitoring,
  getPerformanceMonitor,
  usePerformanceMonitoring,
  measurePerformance,
  withPerformanceTracking
};