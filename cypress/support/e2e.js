// Import custom commands
import './commands';

// Global Cypress configuration
Cypress.on('uncaught:exception', (err, runnable) => {
  // Prevent Cypress from failing on uncaught exceptions from the app
  // that are not related to our tests
  if (err.message.includes('ResizeObserver loop')) {
    return false;
  }
  return true;
});
