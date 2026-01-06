/// <reference types="cypress" />

describe('Me Component (Profile)', () => {
  const userMock = {
    id: 1,
    email: 'test@test.com',
    lastName: 'Doe',
    firstName: 'John',
    admin: false,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
  };
  const sessionMock = {
    id: 1,
    email: 'test@test.com',
    firstName: 'John',
    lastName: 'Doe',
    admin: false,
    token: 'fake-jwt-token',
  };

  it('should display user information correctly', () => {
    cy.intercept('GET', '**/api/user/1*', { body: userMock }).as('getUser');
    // Ouvre une page blanche pour accéder au window
    cy.visit('/');
    cy.window().then((win) => {
      win.localStorage.setItem(
        'sessionInformation',
        JSON.stringify(sessionMock)
      );
    });
    // Maintenant seulement, visite /me
    cy.visit('/me');
    cy.wait('@getUser');
    cy.contains('John').should('be.visible');
    cy.contains('DOE').should('be.visible');
    cy.contains('test@test.com').should('be.visible');
  });
});
