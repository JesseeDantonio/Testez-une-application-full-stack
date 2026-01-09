/// <reference types="cypress" />

describe('Session Detail Spec', () => {
  const userSession = {
    id: 1,
    email: 'user@test.com',
    firstName: 'User',
    lastName: 'Test',
    admin: false,
    token: 'fake-jwt-token',
  };

  const adminSession = {
    ...userSession,
    admin: true,
  };

  const teacherMock = {
    id: 1,
    lastName: 'Delahaye',
    firstName: 'Margot',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const sessionMock = {
    id: 1,
    name: 'Session Yoga',
    description: 'Une super session',
    date: '2025-01-01',
    teacher_id: 1,
    users: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  it('should display session details and allow back navigation', () => {
    // 1. Définir les intercepts AVANT de charger la page
    cy.intercept('GET', '/api/session/1', sessionMock).as('getSession');
    cy.intercept('GET', '/api/teacher/1', teacherMock).as('getTeacher');

    // 2. Setup du token (on passe par une page neutre ou login pour éviter de charger le composant cible trop tôt)
    cy.visit('/');
    cy.window().then((win) => {
      win.localStorage.setItem(
        'sessionInformation',
        JSON.stringify(userSession)
      );
    });

    // 3. Maintenant on visite la page de détail. Les intercepts sont prêts à "attraper" les requêtes.
    cy.visit('/sessions/detail/1');

    // 4. On attend que la requête interceptée se produise
    cy.wait('@getSession');
    cy.wait('@getTeacher');

    // 5. Vérifications
    cy.contains('Session').should('be.visible');
    cy.contains('Yoga').should('be.visible');
    cy.contains('Margot').should('be.visible');
    cy.contains('DELAHAYE').should('be.visible');
    cy.contains('Delete').should('not.exist');

    cy.get('[data-cy=back]').click();
    // cy.url().should('include', '/sessions');
  });

  it('should allow admin to delete a session', () => {
    // 1. Intercepts
    cy.intercept('GET', '/api/session/1', sessionMock).as('getSession');
    cy.intercept('GET', '/api/teacher/1', teacherMock).as('getTeacher');
    cy.intercept('DELETE', '/api/session/1', { statusCode: 200 }).as(
      'deleteSession'
    );

    // 2. Setup Admin
    cy.visit('/');
    cy.window().then((win) => {
      win.localStorage.setItem(
        'sessionInformation',
        JSON.stringify(adminSession)
      );
    });

    // 3. Visit
    cy.visit('/sessions/detail/1');
    cy.wait('@getSession');
    cy.wait('@getTeacher');

    // 4. Action
    cy.contains('Delete').should('be.visible').click();
    cy.wait('@deleteSession');

    cy.url().should('include', '/sessions');
    cy.contains('Session deleted !').should('be.visible');
  });

  it('should handle participate and unParticipate actions', () => {
    // 1. Intercepts initiaux
    cy.intercept('GET', '/api/session/1', sessionMock).as('getSession');
    cy.intercept('GET', '/api/teacher/1', teacherMock).as('getTeacher');
    const userId = userSession.id;
    cy.intercept('POST', `/api/session/1/participate/${userId}`, {
      statusCode: 200,
    }).as('participate');
    cy.intercept('DELETE', `/api/session/1/participate/${userId}`, {
      statusCode: 200,
    }).as('unParticipate');

    // 2. Setup User
    cy.visit('/');
    cy.window().then((win) => {
      win.localStorage.setItem(
        'sessionInformation',
        JSON.stringify(userSession)
      );
    });

    // 3. Visit
    cy.visit('/sessions/detail/1');
    cy.wait('@getSession');
    cy.wait('@getTeacher');

    // --- PARTICIPER ---

    // On prépare la prochaine réponse du GET pour simuler l'ajout de l'user
    const sessionWithParticipant = { ...sessionMock, users: [userSession.id] };
    cy.intercept('GET', '/api/session/1', sessionWithParticipant).as(
      'getSessionWithUser'
    );

    cy.contains('Participate').click();
    cy.wait('@participate');
    cy.wait('@getSessionWithUser');

    // --- NE PLUS PARTICIPER ---

    cy.contains('Do not participate').should('be.visible');

    // On prépare la prochaine réponse du GET pour simuler le retrait de l'user
    cy.intercept('GET', '/api/session/1', sessionMock).as('getSessionEmpty');

    cy.contains('Do not participate').click();
    cy.wait('@unParticipate');
    cy.wait('@getSessionEmpty');

    cy.contains('Participate').should('be.visible');
  });
});
