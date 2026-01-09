/// <reference types="cypress" />

describe('Login spec', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true,
      },
    }).as('loginApi');
  });

  it('The submit button is disabled if the form is empty.', () => {
    cy.get('button[type=submit]').should('be.disabled');
  });

  it('The submit button is disabled if a field is empty.', () => {
    cy.get('input[formcontrolname=email]').type('yoga@studio.com');
    cy.get('button[type=submit]').should('be.disabled');
    cy.get('input[formcontrolname=email]').clear();
    cy.get('input[formcontrolname=password]').type('test!1234');
    cy.get('button[type=submit]').should('be.disabled');
  });

  it('Login successfull', () => {

    cy.get('input[formcontrolname=email]').type('yoga@studio.com');
    cy.get('input[formcontrolname=password]').type('test!1234');
    cy.get('button[type=submit]').should('not.be.disabled').click();
    cy.url().should('include', '/sessions');
  });

  it('Display an error if the login fails', () => {
    cy.intercept('POST', '/api/auth/login', { statusCode: 401 }).as(
      'loginFail'
    );
    cy.get('input[formcontrolname=email]').type('fail@studio.com');
    cy.get('input[formcontrolname=password]').type('wrongpass');
    cy.get('button[type=submit]').should('not.be.disabled').click();
    cy.wait('@loginFail');
    cy.get('.error').should('contain', 'An error occurred');
  });

  it('The error disappears if a field is modified after an error.', () => {
    cy.intercept('POST', '/api/auth/login', { statusCode: 401 }).as(
      'loginFail'
    );
    cy.get('input[formcontrolname=email]').type('fail@studio.com');
    cy.get('input[formcontrolname=password]').type('wrongpass');
    cy.get('button[type=submit]').click();
    cy.wait('@loginFail');
    cy.get('.error').should('be.visible');
    cy.get('input[formcontrolname=email]').clear().type('yoga@studio.com');
  });

  it('The password is hidden by default and becomes visible when clicking the icon.', () => {
    cy.get('input[formcontrolname=password]').should(
      'have.attr',
      'type',
      'password'
    );
    cy.get('button[mat-icon-button][matSuffix]').click();
    cy.get('input[formcontrolname=password]').should(
      'have.attr',
      'type',
      'text'
    );
    cy.get('button[mat-icon-button][matSuffix]').click();
    cy.get('input[formcontrolname=password]').should(
      'have.attr',
      'type',
      'password'
    );
  });

  it('Verify that the correct data is sent to the API.', () => {
    cy.intercept('POST', '/api/auth/login').as('loginApi');
    cy.get('input[formcontrolname=email]').type('api@studio.com');
    cy.get('input[formcontrolname=password]').type('apiTest123');
    cy.get('button[type=submit]').should('not.be.disabled').click();
    cy.wait('@loginApi').its('request.body').should('deep.equal', {
      email: 'api@studio.com',
      password: 'apiTest123',
    });
  });

  it('Must validate the submit button, send the correct data, and redirect.', () => {
    cy.visit('/login');
    cy.intercept('GET', '/api/session', []).as('session');

    // 1. Le bouton doit être désactivé si le formulaire est vide
    cy.get('button[type=submit]').should('be.disabled');

    // 2. Remplir le formulaire avec des valeurs valides
    cy.get('input[formControlName="email"]').type('user@site.com');
    cy.get('input[formControlName="password"]').type('Test1234!');

    // 3. Le bouton doit être activé
    cy.get('button[type=submit]').should('not.be.disabled');

    // 4. Cliquer sur le bouton submit
    cy.get('button[type=submit]').click();

    // 5. Vérifier que le bon payload est envoyé
    cy.wait('@loginApi').its('request.body').should('deep.equal', {
      email: 'user@site.com',
      password: 'Test1234!',
    });

    // 6. Vérifier la redirection vers /sessions
    cy.url().should('include', '/sessions');
  });
});
