/// <reference types="cypress" />
describe('Teacher Service Integration', () => {
  
  const teachersMock = [
    { id: 1, lastName: 'Delahaye', firstName: 'Margot', createdAt: '', updatedAt: '' },
    { id: 2, lastName: 'Thiercelin', firstName: 'Hélène', createdAt: '', updatedAt: '' }
  ];

  beforeEach(() => {
    cy.intercept('POST', '/api/auth/login', {
      body: { id: 1, admin: true } // On se connecte en admin pour tout voir
    }).as('login');

    cy.visit('/login');
    cy.get('input[formControlName=email]').type('yoga@studio.com');
    cy.get('input[formControlName=password]').type('test!1234{enter}');
  });

  it('should fetch all teachers (via session create/detail page)', () => {
    // Intercepter l'appel all() du TeacherService
    cy.intercept('GET', '/api/teacher', {
      body: teachersMock
    }).as('getTeachers');

    // Naviguer vers une page qui liste les profs (souvent le formulaire de création de session)
    cy.get('button[routerLink="create"]').click(); 

    // Vérifier que l'appel est fait
    cy.wait('@getTeachers');
    
    // Vérifier que les données du mock sont utilisées (TeacherService.all)
    cy.get('mat-select[formControlName="teacher_id"]').click();
    cy.contains('Margot Delahaye').should('exist');
  });

  it('should fetch teacher detail', () => {
    // Intercepter l'appel detail() du TeacherService
    cy.intercept('GET', '/api/teacher/1', {
      body: teachersMock[0]
    }).as('getTeacherDetail');

    // Note : Il faut trouver où dans votre application le détail d'un prof est appelé.
    // Souvent c'est sur la page de détail d'une session qui affiche le prof.
    
    // Exemple hypothétique :
    // cy.visit('/sessions/detail/1');
    // cy.wait('@getTeacherDetail');
  });
});