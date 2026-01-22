import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AppComponent } from './app.component';
import { AuthService } from './features/auth/services/auth.service';
import { SessionService } from './services/session.service';
import { expect } from '@jest/globals';


describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  // 1. On prépare les mocks (les fausses dépendances)
  // On utilise jest.fn() pour pouvoir espionner les appels de méthodes
  const mockAuthService = {
    // Ajoutez ici des méthodes si nécessaire, mais dans votre code actuel
    // AuthService est injecté mais pas utilisé directement dans les méthodes publiques.
  };

  const mockRouter = {
    navigate: jest.fn() // On veut vérifier si navigate est appelé
  };

  const mockSessionService = {
    $isLogged: jest.fn().mockReturnValue(of(true)), // Simule un utilisateur connecté par défaut
    logOut: jest.fn() // On veut vérifier si logOut est appelé
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [
        // On remplace les vrais services par nos mocks
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: SessionService, useValue: mockSessionService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  // Test de la méthode $isLogged()
  it('should return the login status observable from SessionService', (done) => {
    // On s'assure que le mock retourne bien un observable
    mockSessionService.$isLogged.mockReturnValue(of(true));

    component.$isLogged().subscribe((isLogged) => {
      expect(isLogged).toBe(true);
      expect(mockSessionService.$isLogged).toHaveBeenCalled();
      done(); // Important pour les tests asynchrones (Observables)
    });
  });

  // Test de la méthode logout()
  it('should call logOut on SessionService and navigate to root', () => {
    // Action
    component.logout();

    // Vérification 1 : Est-ce que la méthode logOut du service a été appelée ?
    expect(mockSessionService.logOut).toHaveBeenCalled();

    // Vérification 2 : Est-ce que le routeur a navigué vers [''] ?
    expect(mockRouter.navigate).toHaveBeenCalledWith(['']);
  });
});