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
    cy.visit('/');
    cy.window().then((win) => {
      win.localStorage.setItem(
        'sessionInformation',
        JSON.stringify(sessionMock)
      );
    });
    cy.intercept('GET', '**/api/user/1*', { body: userMock }).as('getUser');
    cy.visit('/me');
    cy.wait('@getUser');
  });

  it('should display user information correctly', () => {
    cy.contains('John').should('be.visible');
    cy.contains('DOE').should('be.visible');
    cy.contains('test@test.com').should('be.visible');
  });

  it('Go back when the Back button is clicked', () => {
    cy.get('[data-cy=back]').click();
    cy.url().then(url => {
      cy.log('Redirected to:', url);
    });
    cy.url().should('match', /localhost:4200/);
  });

  it('Delete the account and display a snackbar.', () => {
    cy.visit('/me');

    cy.intercept('DELETE', '**/api/user/1*', { statusCode: 200 }).as(
      'deleteUser'
    );
    cy.get('[data-cy=delete]').click();
    cy.wait('@deleteUser');
    cy.contains('Your account has been deleted').should('be.visible');
    cy.url().should('match', new RegExp(`^${Cypress.config().baseUrl}/?$`));
  });

  it('Display an error if the deletion fails.', () => {
    cy.intercept('DELETE', '**/api/user/1*', { statusCode: 500 }).as(
      'deleteUserFail'
    );
    cy.get('[data-cy=delete]').click();
    cy.wait('@deleteUserFail');
  });
});
