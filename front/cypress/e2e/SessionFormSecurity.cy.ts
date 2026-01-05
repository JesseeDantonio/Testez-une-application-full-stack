/// <reference types="cypress" />
describe('Session Form - Security', () => {
  it('should redirect non-admin users to sessions list', () => {
    cy.visit('/login');

    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: false,
      },
    });

    // 2. forcer l'accès à la création
    cy.visit('/sessions/create');

    // 3. Le composant doit rediriger immédiatement
    cy.url().should('include', '/sessions');
    // Vérifier qu'on n'est PAS sur /create
    cy.url().should('not.include', '/create');
  });
});