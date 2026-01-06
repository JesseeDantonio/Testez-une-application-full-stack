/// <reference types="cypress" />
describe('Session Form - Security', () => {
  it('should redirect non-admin users to sessions list', () => {
    const sessionMock = {
      id: 1,
      email: 'test@test.com',
      firstName: 'John',
      lastName: 'Doe',
      admin: false,
      token: 'fake-jwt-token',
    };

        cy.visit('/');
    
    cy.window().then((win) => {
      win.localStorage.setItem(
        'sessionInformation',
        JSON.stringify(sessionMock)
      );
    });

    // 2. forcer l'accès à la création
    cy.visit('/sessions/create');

    // 3. Le composant doit rediriger immédiatement
    cy.url().should('include', '/sessions');
    // Vérifier qu'on n'est PAS sur /create
    cy.url().should('not.include', '/create');
  });
});