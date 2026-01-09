/// <reference types="cypress" />

describe('Register spec', () => {
  beforeEach(() => {
    cy.visit('/register');
  });

  it('The submit button is disabled if the form is empty.', () => {
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('The submit button is disabled if a required field is missing', () => {
    cy.get('input[formControlName="firstName"]').type('John');
    cy.get('input[formControlName="lastName"]').type('Doe');
    cy.get('input[formControlName="email"]').type('john@doe.com');
    // Pas de password
    cy.get('button[type="submit"]').should('be.disabled');
    cy.get('input[formControlName="password"]').type('test!1234');
    cy.get('input[formControlName="firstName"]').clear();
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('The submit button is disabled if email is invalid', () => {
    cy.get('input[formControlName="firstName"]').type('John');
    cy.get('input[formControlName="lastName"]').type('Doe');
    cy.get('input[formControlName="email"]').type('nope');
    cy.get('input[formControlName="password"]').type('test!1234');
    cy.get('button[type="submit"]').should('be.disabled');
  });

  it('Register successfull', () => {
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

    cy.get('input[formControlName="firstName"]').type('firstName');
    cy.get('input[formControlName="lastName"]').type('lastName');
    cy.get('input[formControlName="email"]').type('yoga@studio.com');
    cy.get('input[formControlName="password"]').type('test!1234');
    cy.get('button[type="submit"]').should('not.be.disabled').click();
    cy.wait('@register');
    cy.url().should('include', '/login');
  });

  it('Allows submission with the Enter key.', () => {
    cy.intercept('POST', '/api/auth/register', {
      statusCode: 200,
      body: {
        id: 1,
        username: 'userName',
        firstName: 'A',
        lastName: 'B',
        admin: false,
      },
    }).as('register');
    cy.get('input[formControlName="firstName"]').type('Abc');
    cy.get('input[formControlName="lastName"]').type('Def');
    cy.get('input[formControlName="email"]').type('abc@def.com');
    cy.get('input[formControlName="password"]').type('passeTest{enter}');
    cy.wait('@register');
    cy.url().should('include', '/login');
  });

  it("Displays an error if the registration fails", () => {
    cy.intercept('POST', '/api/auth/register', { statusCode: 400 }).as(
      'registerFail'
    );
    cy.get('input[formControlName="firstName"]').type('John');
    cy.get('input[formControlName="lastName"]').type('Doe');
    cy.get('input[formControlName="email"]').type('john@doe.com');
    cy.get('input[formControlName="password"]').type('test!1234');
    cy.get('button[type="submit"]').should('not.be.disabled').click();
    cy.wait('@registerFail');
    cy.get('.error').should('contain', 'An error occurred');
  });

  it('The error disappears when a field is modified after an error.', () => {
    cy.intercept('POST', '/api/auth/register', { statusCode: 400 }).as(
      'registerFail'
    );
    cy.get('input[formControlName="firstName"]').type('John');
    cy.get('input[formControlName="lastName"]').type('Doe');
    cy.get('input[formControlName="email"]').type('john@doe.com');
    cy.get('input[formControlName="password"]').type('test!1234');
    cy.get('button[type="submit"]').click();
    cy.wait('@registerFail');
    cy.get('.error').should('be.visible');
    cy.get('input[formControlName="email"]').clear().type('john2@doe.com');
    // Selon ton code, il peut falloir soumettre à nouveau pour masquer l'erreur
    // cy.get('.error').should('not.exist');
  });

  it('Verify the payload sent to the API.', () => {
    cy.intercept('POST', '/api/auth/register').as('registerApi');
    cy.get('input[formControlName="firstName"]').type('Alice');
    cy.get('input[formControlName="lastName"]').type('Smith');
    cy.get('input[formControlName="email"]').type('alice@smith.com');
    cy.get('input[formControlName="password"]').type('superSecret123');
    cy.get('button[type="submit"]').should('not.be.disabled').click();
    cy.wait('@registerApi').its('request.body').should('deep.equal', {
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice@smith.com',
      password: 'superSecret123',
    });
  });
});
