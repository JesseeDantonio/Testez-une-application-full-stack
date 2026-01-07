/// <reference types="cypress" />
describe('Teacher Service Integration', () => {
  const teachersMock = [
    {
      id: 1,
      lastName: 'Delahaye',
      firstName: 'Margot',
      createdAt: '',
      updatedAt: '',
    },
    {
      id: 2,
      lastName: 'Thiercelin',
      firstName: 'Hélène',
      createdAt: '',
      updatedAt: '',
    },
  ];

  // Cet objet sert uniquement pour l'authentification (localStorage)
  const userSessionMock = {
    id: 1,
    email: 'test@test.com',
    firstName: 'John',
    lastName: 'Doe',
    admin: true,
    token: 'fake-jwt-token',
  };

  // NOUVEAU : Cet objet simule une vraie séance de Yoga renvoyée par l'API
  const yogaSessionMock = {
    id: 1,
    name: 'Séance de test',
    description: 'Description de la séance',
    date: '2024-01-01',
    teacher_id: 1, // C'est cet ID qui déclenchera l'appel vers /api/teacher/1
    users: [], // Tableau vide pour éviter les erreurs si le front boucle dessus
    createdAt: '',
    updatedAt: '',
  };

  it('should fetch all teachers (via session create/detail page)', () => {
    cy.intercept('GET', '/api/teacher', {
      body: teachersMock,
    }).as('getTeachers');

    cy.visit('/');

    cy.window().then((win) => {
      win.localStorage.setItem(
        'sessionInformation',
        JSON.stringify(userSessionMock)
      );
    });

    cy.visit('/sessions');
    cy.get('button[routerLink="create"]').click();
    cy.wait('@getTeachers');
    cy.get('mat-select[formControlName="teacher_id"]').click();
    cy.contains('Margot Delahaye').should('exist');
  });

  it('should fetch teacher detail', () => {
    // On renvoie l'objet "Séance" et non l'objet "Utilisateur"
    cy.intercept('GET', '/api/session/1', {
      body: yogaSessionMock
    }).as('getSessionDetail');

    // On s'attend à ce que le front appelle le détail du prof correspondant au teacher_id de la séance
    cy.intercept('GET', '/api/teacher/1', {
      body: teachersMock[0],
    }).as('getTeacherDetail');

    cy.visit('/');

    cy.window().then((win) => {
      win.localStorage.setItem(
        'sessionInformation',
        JSON.stringify(userSessionMock)
      );
    });

    cy.visit('/sessions/detail/1');
    
    cy.wait('@getSessionDetail');
    cy.wait('@getTeacherDetail'); 
  });
});