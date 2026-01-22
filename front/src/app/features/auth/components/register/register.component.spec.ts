import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { expect } from '@jest/globals';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { RegisterComponent } from './register.component';
import { AuthService } from '../../services/auth.service';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  
  // On type nos mocks
  let authService: any; 
  let router: any;

  beforeEach(async () => {
    // 1. On définit les mocks AVEC la méthode 'register'
    const authServiceMock = {
      register: jest.fn() // C'est ici qu'était l'erreur : il manquait cette méthode
    };

    const routerMock = {
      navigate: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    
    // On récupère les instances injectées pour les contrôler dans les tests
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not submit if the form is invalid', () => {
    // Formulaire invalide
    component.form.setValue({ email: '', password: '', firstName: '', lastName: '' });
    
    component.submit();
    
    // On vérifie que register n'a PAS été appelé
    expect(authService.register).not.toHaveBeenCalled();
  });

  it('should call authService.register and navigate to /login on success', () => {
    // A. Formulaire valide
    component.form.setValue({
      email: 'test@test.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password123'
    });

    // B. Simulation succès
    authService.register.mockReturnValue(of(void 0));

    // C. Appel
    component.submit();

    // D. Vérifications
    expect(authService.register).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should set onError to true if registration fails', () => {
    // A. Formulaire valide
    component.form.setValue({
      email: 'test@test.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password123'
    });

    // B. Simulation erreur
    authService.register.mockReturnValue(throwError(() => new Error('Error')));

    // C. Appel
    component.submit();

    // D. Vérification
    expect(component.onError).toBe(true);
  });
});