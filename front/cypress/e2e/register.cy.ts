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
        admin: true
      },
    }).as('register');

    cy.intercept('GET', '/api/session', []).as('session');

    cy.get('input[formControlName="firstName"]').type('firstName');
    cy.get('input[formControlName="lastName"]').type('lastName');
    cy.get('input[formControlName="email"]').type('yoga@studio.com');
    cy.get('input[formControlName="password"]').type('test!1234');

    cy.get('button[type="submit"]').should('not.be.disabled').click();

    cy.wait('@register');

    cy.url().should('include', '/login')
  });
});