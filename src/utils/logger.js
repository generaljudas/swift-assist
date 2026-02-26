/**
 * Logger utility - centralizes all logging with environment-aware behavior.
 * - In production: only errors are logged (no console.log/warn).
 * - In development: all levels are logged.
 * Replace all direct console.* calls throughout the codebase with this module.
 */

const isDevelopment = process.env.NODE_ENV === 'development';

const logger = {
  /**
   * Log informational messages (development only).
   * @param {...*} args
   */
  log: (...args) => {
    if (isDevelopment) {
      // eslint-disable-next-line no-console
      console.log(...args);
    }
  },

  /**
   * Log informational messages (development only).
   * @param {...*} args
   */
  info: (...args) => {
    if (isDevelopment) {
      // eslint-disable-next-line no-console
      console.info(...args);
    }
  },

  /**
   * Log warning messages (development only).
   * @param {...*} args
   */
  warn: (...args) => {
    if (isDevelopment) {
      // eslint-disable-next-line no-console
      console.warn(...args);
    }
  },

  /**
   * Log error messages (always logged regardless of environment).
   * @param {...*} args
   */
  error: (...args) => {
    // eslint-disable-next-line no-console
    console.error(...args);
  },
};

export default logger;
