import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule, } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from '../../../../services/session.service';

import { DetailComponent } from './detail.component';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionApiService } from '../../services/session-api.service';
import { of } from 'rxjs';
import { TeacherService } from 'src/app/services/teacher.service';

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let service: SessionService;

  // 1. Define mocks
  const sessionApiService = {
    detail: jest.fn().mockReturnValue(of({
      id: 10,
      name: 'Session Test',
      date: new Date(),
      teacher_id: 7,
      description: 'desc',
      users: [1, 2]
    })),
    delete: jest.fn().mockReturnValue(of({})),
    participate: jest.fn().mockReturnValue(of({})),
    unParticipate: jest.fn().mockReturnValue(of({}))
  };

  const teacherService = {
    detail: jest.fn().mockReturnValue(of({
      id: 7,
      name: 'Teacher X',
      email: 't@t.fr'
    }))
  };

  const matSnackBar = { open: jest.fn() };
  
  const router = { navigate: jest.fn() };

  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: jest.fn().mockReturnValue('10')
      }
    }
  };

  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1
    }
  };

  beforeEach(async () => {
    jest.clearAllMocks(); // Good practice to clear mocks before each test
    
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatSnackBarModule,
        ReactiveFormsModule,
              MatCardModule,
      MatIconModule,
      ],
      declarations: [DetailComponent],
      providers: [
        // 2. You must provide the mocks here so the component uses them
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: sessionApiService },
        { provide: TeacherService, useValue: teacherService },
        { provide: MatSnackBar, useValue: matSnackBar },
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ],
    })
      .compileComponents();

    service = TestBed.inject(SessionService);
    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch session and teacher on init', () => {
    // Now these checks will pass because the component is using the injected mocks
    expect(sessionApiService.detail).toHaveBeenCalledWith('10');
    expect(component.session).toBeTruthy();
    expect(teacherService.detail).toHaveBeenCalledWith('7');
    expect(component.teacher).toBeTruthy();
  });

  it('should call router.navigate and show snackbar on delete', () => {
    component.delete();
    expect(sessionApiService.delete).toHaveBeenCalledWith('10');
    expect(matSnackBar.open).toHaveBeenCalledWith('Session deleted !', 'Close', { duration: 3000 });
    expect(router.navigate).toHaveBeenCalledWith(['sessions']);
  });

  it('should call participate and fetchSession', () => {
    // We spy on the private method 'fetchSession' to ensure it is called
    const fetchSpy = jest.spyOn(component as any, 'fetchSession');
    component.participate();
    expect(sessionApiService.participate).toHaveBeenCalledWith('10', '1');
    expect(fetchSpy).toHaveBeenCalled();
  });

  it('should call unParticipate and fetchSession', () => {
    const fetchSpy = jest.spyOn(component as any, 'fetchSession');
    component.unParticipate();
    expect(sessionApiService.unParticipate).toHaveBeenCalledWith('10', '1');
    expect(fetchSpy).toHaveBeenCalled();
  });

  it('should go back on back()', () => {
    const spy = jest.spyOn(window.history, 'back');
    component.back();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});