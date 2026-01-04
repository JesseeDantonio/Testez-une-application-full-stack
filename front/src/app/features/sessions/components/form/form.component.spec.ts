import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';
import { SessionApiService } from '../../services/session-api.service';

import { FormComponent } from './form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { TeacherService } from 'src/app/services/teacher.service';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let router: jest.Mocked<Router>;
  let matSnackBar: jest.Mocked<MatSnackBar>;
  let sessionApiService: jest.Mocked<SessionApiService>;
  let sessionService: jest.Mocked<SessionService>;
  let teacherService: jest.Mocked<TeacherService>;
  let activatedRoute: any;

  const mockSessionService = {
    sessionInformation: {
      admin: true
    }
  }

  activatedRoute = {
  snapshot: {
    paramMap: {
      get: jest.fn((key: string) => {
        if (key === 'id') return '123';
        return null;
      }),
    },
  },
};

  beforeEach(async () => {
    sessionApiService = { create: jest.fn() } as any;
        router = { navigate: jest.fn(), url: '/sessions/create' } as any;
    matSnackBar = { open: jest.fn() } as any;
    sessionApiService = {
      detail: jest.fn(),
      create: jest.fn(),
      update: jest.fn()
    } as any;
    sessionService = {
      sessionInformation: { admin: true }
    } as any;
    teacherService = {
      all: jest.fn().mockReturnValue(of([]))
    } as any;
    await TestBed.configureTestingModule({

      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatSelectModule,
        BrowserAnimationsModule
      ],
      providers: [
        FormBuilder,
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: Router, useValue: router },
        { provide: MatSnackBar, useValue: matSnackBar },
        { provide: SessionApiService, useValue: sessionApiService },
        { provide: SessionService, useValue: sessionService },
        { provide: TeacherService, useValue: teacherService }
      ],
      declarations: [FormComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();


  });

   it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

it('should redirect if not admin', () => {
  sessionService.sessionInformation!.admin = false;
  fixture = TestBed.createComponent(FormComponent);
  component = fixture.componentInstance;
  fixture.detectChanges();
  expect(router.navigate).toHaveBeenCalledWith(['/sessions']);
});

it('should call initForm for create', () => {
  const spy = jest.spyOn(FormComponent.prototype as any, 'initForm');
  fixture = TestBed.createComponent(FormComponent);
  component = fixture.componentInstance;
  fixture.detectChanges();
  expect(spy).toHaveBeenCalled();
  spy.mockRestore();
});

it('should call initForm with session for update', () => {
  Object.defineProperty(router, 'url', { get: () => '/sessions/update/123' });
  sessionApiService.detail.mockReturnValue(of({
    id: 1, name: 'Session 1', date: new Date(), teacher_id: 1, description: 'desc', users: []
  }));
  const spy = jest.spyOn(FormComponent.prototype as any, 'initForm');
  fixture = TestBed.createComponent(FormComponent);
  component = fixture.componentInstance;
  fixture.detectChanges();
  expect(sessionApiService.detail).toHaveBeenCalledWith('123');
  expect(spy).toHaveBeenCalled();
  spy.mockRestore();
});

it('should submit and update session', () => {
  Object.defineProperty(router, 'url', { get: () => '/sessions/update/123' });
  sessionApiService.detail.mockReturnValue(of({
    id: 1, name: 'Session 1', date: new Date(), teacher_id: 1, description: 'desc', users: []
  }));
  fixture.detectChanges();
  component.sessionForm!.setValue({
    name: 'Session 1', date: new Date(), teacher_id: 1, description: 'desc'
  });
  (component as any).onUpdate = true;
  (component as any).id = '123';
  sessionApiService.update.mockReturnValue(of({
    id: 1, name: 'Session 1', date: new Date(), teacher_id: 1, description: 'desc', users: []
  }));
  component.submit();
  expect(sessionApiService.update).toHaveBeenCalledWith('123', expect.any(Object));
  expect(matSnackBar.open).toHaveBeenCalledWith('Session updated !', 'Close', { duration: 3000 });
  expect(router.navigate).toHaveBeenCalledWith(['sessions']);
});
});
