/// <reference types="cypress" />

describe('Register spec', () => {
  it('Register successfull', () => {
    cy.visit('/register');

    cy.intercept('POST', '/api/auth/register', {
      statusCode: 200,
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true,
      },
    }).as('register');

    cy.intercept('GET', '/api/session', []).as('session');

    cy.get('input[formControlName="firstName"]').type('firstName');
    cy.get('input[formControlName="lastName"]').type('lastName');
    cy.get('input[formControlName="email"]').type('yoga@studio.com');
    cy.get('input[formControlName="password"]').type('test!1234');

    cy.get('button[type="submit"]').should('not.be.disabled').click();

    cy.wait('@register');

    cy.url().should('include', '/login');
  });

  it('The submit button is disabled if the form is invalid', () => {
    cy.visit('/register');
    // Ne remplis rien
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('Display an error if the save fails', () => {
    cy.visit('/register');
    cy.intercept('POST', '/api/auth/register', { statusCode: 400 }).as(
      'registerFail'
    );

    cy.get('input[formControlName="firstName"]').type('firstName');
    cy.get('input[formControlName="lastName"]').type('lastName');
    cy.get('input[formControlName="email"]').type('yoga@studio.com');
    cy.get('input[formControlName="password"]').type('test!1234');

    cy.get('button[type="submit"]').should('not.be.disabled').click();

    cy.wait('@registerFail');
    cy.contains('An error occurred').should('be.visible'); // adapte au message réel affiché
  });
});
