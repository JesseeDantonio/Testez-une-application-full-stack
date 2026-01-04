import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';

import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jest.Mocked<AuthService>;
  let router: jest.Mocked<Router>;
  let sessionService: jest.Mocked<SessionService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [SessionService],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule]
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

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not submit if the form is invalid', () => {
    component.form.setValue({ email: '', password: '' });
    component.submit();
    expect(authService.login).not.toHaveBeenCalled();
  });

  it('should login and navigate on success', () => {
    const fakeResponse = { token: 'abc' };
    authService.login.mockReturnValue(of(fakeResponse) as any);

    component.form.setValue({ email: 'test@test.com', password: '1234' });
    component.submit();

    expect(authService.login).toHaveBeenCalledWith({ email: 'test@test.com', password: '1234' });
    expect(sessionService.logIn).toHaveBeenCalledWith(fakeResponse);
    expect(router.navigate).toHaveBeenCalledWith(['/sessions']);
    expect(component.onError).toBe(false);
  });

  it('should set onError to true in case of error', () => {
    authService.login.mockReturnValue(throwError(() => new Error('fail')) as any);

    component.form.setValue({ email: 'test@test.com', password: 'wrong' });
    component.submit();

    expect(authService.login).toHaveBeenCalled();
    expect(component.onError).toBe(true);
  });
});
