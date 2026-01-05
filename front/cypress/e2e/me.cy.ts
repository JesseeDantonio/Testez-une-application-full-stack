/// <reference types="cypress" />
describe('Me Component (Profile)', () => {
  
  // Mock des données utilisateur
  const userMock = {
    id: 1,
    email: 'test@test.com',
    lastName: 'Doe',
    firstName: 'John',
    admin: false,
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
  };

  beforeEach(() => {
    // 1. On intercepte la demande de connexion pour simuler un login réussi
    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: false
      },
    }).as('login');

    // 2. On intercepte la récupération des infos utilisateur (UserService.getById)
    cy.intercept('GET', '/api/user/1', {
      body: userMock
    }).as('getUser');

    // 3. On simule le processus de login pour arriver sur l'app
    cy.visit('/login');
    cy.get('input[formControlName=email]').type('test@test.com');
    cy.get('input[formControlName=password]').type('test!1234{enter}');
    
    // Attendre que le login soit passé
    cy.wait('@login');
  });

  it('should display user information correctly', () => {
    // Action : Cliquer sur le bouton "Account" ou aller sur l'URL
    cy.get('span[routerLink=me]').click(); // Adaptez le sélecteur selon votre navbar

    // Vérification : L'appel API a bien été fait
    cy.wait('@getUser');

    // Vérification : Les infos sont affichées (MeComponent.ngOnInit)
    cy.contains('Name: John DOE').should('be.visible');
    cy.contains('Email: test@test.com').should('be.visible');
  });

  it('should go back when back button is clicked', () => {
    cy.visit('/sessions'); // On part d'une autre page
    cy.get('span[routerLink=me]').click();
    
    // Action : Cliquer sur le bouton retour (MeComponent.back)
    cy.get('button[mat-icon-button]').first().click(); // Suppose que c'est le bouton flèche retour

    // Vérification : On est revenu en arrière
    cy.url().should('include', '/sessions');
  });

  it('should delete the account and logout', () => {
    cy.visit('/me');
    cy.wait('@getUser');

    // Intercepter la suppression (UserService.delete)
    cy.intercept('DELETE', '/api/user/1', {
      statusCode: 200
    }).as('deleteUser');

    // Action : Cliquer sur le bouton delete (MeComponent.delete)
    cy.contains('button', 'Detail').click(); // Si le bouton s'appelle Detail ou Delete, adaptez le texte
    // Note: Dans votre code HTML (non fourni), cherchez le bouton qui lance delete()

    // Si c'est un bouton "Delete my account":
    cy.get('button[color="warn"]').click(); 

    // Vérification : Appel API DELETE
    cy.wait('@deleteUser');

    // Vérification : Message SnackBar (MatSnackBar)
    cy.contains('Your account has been deleted !').should('be.visible');

    // Vérification : Redirection vers la home et Logout (SessionService.logOut)
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });
});