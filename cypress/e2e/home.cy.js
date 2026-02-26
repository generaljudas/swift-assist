/**
 * E2E tests for the home page
 */
describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('displays the application title', () => {
    cy.contains('AI-Powered Customer Support').should('be.visible');
  });

  it('displays the Get Started button', () => {
    cy.contains('Get Started').should('be.visible');
  });

  it('Get Started button links to login when not authenticated', () => {
    cy.contains('Get Started').should('have.attr', 'href', '/login');
  });

  it('displays the Contact navigation link', () => {
    cy.contains('Contact').should('be.visible');
  });

  it('displays Login link in navigation when not authenticated', () => {
    cy.contains('Login').should('be.visible');
  });

  it('navigates to contact page when Contact is clicked', () => {
    cy.contains('Contact').click();
    cy.url().should('include', '/contact');
  });

  it('navigates to login page when Login is clicked', () => {
    cy.contains('Login').click();
    cy.url().should('include', '/login');
  });

  it('navigates to login when Get Started is clicked', () => {
    cy.contains('Get Started').click();
    cy.url().should('include', '/login');
  });
});
