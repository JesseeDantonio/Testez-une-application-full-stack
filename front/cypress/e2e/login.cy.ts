/// <reference types="cypress" />

describe('Login spec', () => {
  it('Login successfull', () => {
    cy.visit('/login');

    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true,
      },
    });

    cy.intercept(
      {
        method: 'GET',
        url: '/api/session',
      },
      []
    ).as('session');

    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type(
      `${'test!1234'}{enter}{enter}`
    );

    cy.url().should('include', '/sessions');
  });

  it('Do nothing if the form is invali', () => {
    cy.visit('/login');
    cy.get('button[type=submit]').should('be.disabled');
    cy.url().should('include', '/login');
  });

it('Display an error if the login fail', () => {
  cy.visit('/login');
  cy.intercept('POST', '/api/auth/login', { statusCode: 401 }).as('loginFail');

  cy.get('input[formControlName=email]').type('bad@user.com');
  cy.get('input[formControlName=password]').type('wrongpass');
  cy.get('button[type=submit]').should('not.be.disabled').click();

  cy.wait('@loginFail');
  cy.contains('An error occurred').should('be.visible');
});
});
