/**
 * E2E tests for the contact page
 */
describe('Contact Page', () => {
  beforeEach(() => {
    cy.visit('/contact');
  });

  it('displays the contact page heading', () => {
    cy.contains('Contact SwiftAssist').should('be.visible');
  });

  it('displays email contact information', () => {
    cy.contains('support@swiftassist.com').should('be.visible');
  });

  it('displays phone contact information', () => {
    cy.contains('+1 (800) 456-7890').should('be.visible');
  });

  it('displays office address', () => {
    cy.contains('123 Innovation Drive').should('be.visible');
    cy.contains('San Francisco').should('be.visible');
  });

  it('displays business hours', () => {
    cy.contains('Business Hours').should('be.visible');
  });

  it('has working email link', () => {
    cy.get('a[href="mailto:support@swiftassist.com"]').should('exist');
  });

  it('has working phone link', () => {
    cy.get('a[href="tel:+18004567890"]').should('exist');
  });

  it('has home navigation link', () => {
    cy.get('a[aria-label="Back to home page"]').should('be.visible');
  });

  it('navigates back to home when Home link is clicked', () => {
    cy.get('a[aria-label="Back to home page"]').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });
});
