describe('Session Form - Validation', () => {
  it('should verify submit button is disabled if form is invalid', () => {
    cy.intercept('GET', '/api/teacher', { body: [] });
    cy.visit('/login');

    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: false,
      },
    });
    cy.visit('/sessions/create');

    // Le formulaire est vide au départ, donc invalide.
    // Si ton bouton HTML a [disabled]="sessionForm.invalid" :
    cy.get('button[type="submit"]').should('be.disabled');
  });
});
