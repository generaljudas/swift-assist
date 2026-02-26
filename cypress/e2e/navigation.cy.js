/**
 * E2E tests for navigation flow between pages
 */
describe('Navigation Flow', () => {
  it('can navigate from home to contact and back', () => {
    cy.visit('/');
    cy.contains('Contact').click();
    cy.url().should('include', '/contact');
    cy.contains('Contact SwiftAssist').should('be.visible');
    cy.get('a[aria-label="Back to home page"]').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  it('can navigate from home to login page', () => {
    cy.visit('/');
    cy.contains('Login').click();
    cy.url().should('include', '/login');
    cy.contains('Login').should('be.visible');
  });

  it('can navigate from login to register page', () => {
    cy.visit('/login');
    cy.contains(/sign up/i).click();
    cy.url().should('include', '/register');
  });

  it('redirects unauthenticated users from /chat to /login', () => {
    cy.visit('/chat');
    cy.url().should('include', '/login');
  });

  it('redirects unauthenticated users from /admin to /login', () => {
    cy.visit('/admin');
    cy.url().should('include', '/login');
  });

  it('redirects unauthenticated users from /dashboard to /login', () => {
    cy.visit('/dashboard');
    cy.url().should('include', '/login');
  });
});
