import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { expect } from '@jest/globals';

import { RegisterComponent } from './register.component';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/services/session.service';
import { AuthService } from '../../services/auth.service';
import { LoginComponent } from '../login/login.component';
import { of } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: jest.Mocked<AuthService>;
  let router: jest.Mocked<Router>;
  let sessionService: jest.Mocked<SessionService>;

  beforeEach(async () => {
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
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    // Crée des mocks pour les services
    authService = { login: jest.fn() } as any;
    router = { navigate: jest.fn() } as any;
    sessionService = { logIn: jest.fn() } as any;

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
        { provide: SessionService, useValue: sessionService },
      ]
    });

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not submit if the form is invalid', () => {
    component.form.setValue({ email: '', password: '', firstName: '', lastName: '' });
    component.submit();
    expect(authService.login).not.toHaveBeenCalled();
  });

});
