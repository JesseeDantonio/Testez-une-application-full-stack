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

  beforeEach(() => {
    cy.intercept('GET', '**/api/user/1*', { body: userMock }).as('getUser');
    cy.visit('/');
    cy.window().then((win) => {
      win.localStorage.setItem(
        'sessionInformation',
        JSON.stringify(sessionMock)
      );
    });
    cy.visit('/me');
    cy.wait('@getUser');
  });

  it('should display user information correctly', () => {
    cy.intercept('GET', '**/api/user/1*', { body: userMock }).as('getUser');
    cy.visit('/me');
    cy.wait('@getUser');
    cy.contains('John').should('be.visible');
    cy.contains('DOE').should('be.visible');
    cy.contains('test@test.com').should('be.visible');
  });

  it('Go back when the Back button is clicked', () => {
    // suppose que le bouton retour possède un sélecteur type [data-cy=back] ou autre
    cy.go('back'); // Simule le bouton "retour" si pas de bouton dédié
    // ou, si tu as un bouton :
    // cy.get('[data-cy=back]').click();
    // cy.url()... Vérifie que tu es revenu à la page précédente
  });

  it('Delete the account and display a snackbar.', () => {
    cy.intercept('DELETE', '**/api/user/1*', { statusCode: 200 }).as(
      'deleteUser'
    );
    // suppose que tu as un bouton "Supprimer" avec un id ou data-cy
    cy.get('[data-cy=delete]').click();
    cy.wait('@deleteUser');
    cy.contains('Your account has been deleted').should('be.visible');
    // Vérifie la redirection
    cy.url().should('eq', Cypress.config().baseUrl + "/");
  });

  it('Display an error if the deletion fails.', () => {
    cy.intercept('DELETE', '**/api/user/1*', { statusCode: 500 }).as(
      'deleteUserFail'
    );
    cy.get('[data-cy=delete]').click();
    cy.wait('@deleteUserFail');
  });
});
