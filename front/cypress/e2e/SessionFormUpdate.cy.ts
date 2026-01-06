/// <reference types="cypress" />

describe('Session Form - Update', () => {
  it('should update an existing session', () => {
    const sessionMock = {
      id: 1,
      email: 'test@test.com',
      firstName: 'John',
      lastName: 'Doe',
      admin: true,
      token: 'fake-jwt-token',
    };
    cy.intercept('GET', '/api/teacher', {
      body: [{ id: 1, firstName: 'Margot', lastName: 'Delahaye' }],
    }).as('getTeachers');

    cy.intercept('GET', '/api/session/1', {
      body: {
        id: 1,
        name: 'Old Name',
        date: '2023-01-01',
        teacher_id: 1,
        description: 'Old Description',
        users: [],
      },
    }).as('getSession');

    cy.intercept('PUT', '/api/session/1', {
      body: { id: 1 },
    }).as('updateSession');

    cy.visit('/');

    cy.window().then((win) => {
      win.localStorage.setItem(
        'sessionInformation',
        JSON.stringify(sessionMock)
      );
    });

    cy.visit('/sessions/update/1');
    cy.wait('@getSession');

    cy.get('input[formControlName="name"]').should('have.value', 'Old Name');
    cy.get('input[formControlName="name"]').clear().type('Updated Name');

    cy.get('button[type="submit"]').click();

    cy.wait('@updateSession');
    cy.get('.mat-snack-bar-container').should('contain', 'Session updated !');
  });
});
