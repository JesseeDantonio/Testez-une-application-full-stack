/// <reference types="cypress" />

describe('Session Form - Create', () => {
  it('should create a new session successfully', () => {
    const sessionMock = {
      id: 1,
      email: 'test@test.com',
      firstName: 'John',
      lastName: 'Doe',
      admin: true,
      token: 'fake-jwt-token',
    };
    // 1. On mock la liste des profs (nécessaire pour le dropdown)
    cy.intercept('GET', '/api/teacher', {
      body: [
        { id: 1, firstName: 'Margot', lastName: 'Delahaye' },
        { id: 2, firstName: 'Hélène', lastName: 'Thurieux' },
      ],
    }).as('getTeachers');

    // 2. On mock la création de session
    cy.intercept('POST', '/api/session', {
      body: {
        id: 1,
        name: 'New Session',
        date: '2024-01-01',
        teacher_id: 1,
        description: 'Description',
      },
    }).as('createSession');

    cy.visit('/');
    
    cy.window().then((win) => {
      win.localStorage.setItem(
        'sessionInformation',
        JSON.stringify(sessionMock)
      );
    });

    // 4. On va sur la page de création
    cy.visit('/sessions/create');
    cy.url().should('include', '/sessions/create');
    cy.wait('@getTeachers');

    // 5. On remplit le formulaire
    cy.get('input[formControlName="name"]').type('Yoga Class');
    cy.get('input[formControlName="date"]').type('2024-05-20');
    cy.get('mat-select[formControlName="teacher_id"]')
      .click()
      .get('mat-option')
      .contains('Margot')
      .click();
    cy.get('textarea[formControlName="description"]').type(
      'A great yoga session.'
    );

    // 6. On soumet
    cy.get('button[type="submit"]').click();

    // 7. Vérifications
    cy.wait('@createSession');
    cy.url().should('include', '/sessions');
    cy.get('.mat-snack-bar-container').should('contain', 'Session created !'); // Vérifie le message
  });
});
