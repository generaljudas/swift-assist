// Import @testing-library/cypress commands
import '@testing-library/cypress/add-commands';

// Custom Cypress commands for Swift Assist

/**
 * Login command - fills and submits the login form
 * @param {string} username - Username to log in with
 * @param {string} password - Password to use
 */
Cypress.Commands.add('login', (username, password) => {
  cy.visit('/login');
  cy.get('input[name="username"]').type(username);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
});

/**
 * Logout command - clicks the logout button
 */
Cypress.Commands.add('logout', () => {
  cy.get('button').contains(/logout/i).click();
});
