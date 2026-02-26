/**
 * E2E tests for the login flow
 */
describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('displays the login form', () => {
    cy.contains('Login').should('be.visible');
  });

  it('displays username and password fields', () => {
    cy.get('input[name="username"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
  });

  it('displays sign in button', () => {
    cy.get('button[type="submit"]').should('be.visible');
  });

  it('displays Google sign in option', () => {
    cy.contains(/sign in with google/i).should('be.visible');
  });

  it('shows error message on invalid login attempt', () => {
    cy.get('input[name="username"]').type('invaliduser');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();
    // Should display an error message
    cy.get('[role="alert"]').should('be.visible');
  });

  it('navigates to register page from login', () => {
    cy.contains(/sign up/i).click();
    cy.url().should('include', '/register');
  });

  it('has accessible form labels', () => {
    cy.get('label[for="username"]').should('be.visible');
    cy.get('label[for="password"]').should('be.visible');
  });
});
