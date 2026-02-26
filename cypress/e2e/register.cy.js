/**
 * E2E tests for the registration flow
 */
describe('Register Page', () => {
  beforeEach(() => {
    cy.visit('/register');
  });

  it('displays the sign up form', () => {
    cy.contains('Sign Up').should('be.visible');
  });

  it('displays all required form fields', () => {
    cy.get('input[name="username"]').should('be.visible');
    cy.get('input[name="email"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('input[name="confirmEmail"]').should('be.visible');
  });

  it('shows error when emails do not match', () => {
    cy.get('input[name="username"]').type('testuser');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="confirmEmail"]').type('different@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.get('[role="alert"]').should('contain', 'Emails do not match');
  });

  it('has accessible labels for all form fields', () => {
    cy.get('label[for="username"]').should('be.visible');
    cy.get('label[for="email"]').should('be.visible');
    cy.get('label[for="password"]').should('be.visible');
    cy.get('label[for="confirmEmail"]').should('be.visible');
  });

  it('displays Google sign up option', () => {
    cy.contains(/sign in with google/i).should('be.visible');
  });
});
