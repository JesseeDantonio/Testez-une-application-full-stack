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
  const sessionMock = {
    id: 1,
    email: 'test@test.com',
    firstName: 'John',
    lastName: 'Doe',
    teacher_id: 1,
    description: "",
    admin: true,
    token: 'fake-jwt-token',
  };
  it('should fetch all teachers (via session create/detail page)', () => {
    // Intercepter l'appel all() du TeacherService
    cy.intercept('GET', '/api/teacher', {
      body: teachersMock,
    }).as('getTeachers');

    cy.visit('/');

    cy.window().then((win) => {
      win.localStorage.setItem(
        'sessionInformation',
        JSON.stringify(sessionMock)
      );
    });

    // 4. On va sur la page de création
    cy.visit('/sessions');

    // Naviguer vers une page qui liste les profs (souvent le formulaire de création de session)
    cy.get('button[routerLink="create"]').click();

    // Vérifier que l'appel est fait
    cy.wait('@getTeachers');

    // Vérifier que les données du mock sont utilisées (TeacherService.all)
    cy.get('mat-select[formControlName="teacher_id"]').click();
    cy.contains('Margot Delahaye').should('exist');
  });

  it('should fetch teacher detail', () => {
    // Mock session detail
    cy.intercept('GET', '/api/session/1', {
      body: sessionMock
    }).as('getSessionDetail');

    // Mock teacher detail
    cy.intercept('GET', '/api/teacher/1', {
      body: teachersMock[0],
    }).as('getTeacherDetail');

    cy.visit('/');

    cy.window().then((win) => {
      win.localStorage.setItem(
        'sessionInformation',
        JSON.stringify(sessionMock)
      );
    });

    cy.visit('/sessions/detail/1');
    cy.wait('@getSessionDetail');
    cy.wait('@getTeacherDetail');
  });
});
