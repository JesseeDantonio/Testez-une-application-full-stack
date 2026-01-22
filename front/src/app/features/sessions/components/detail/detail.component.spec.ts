import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from '../../../../services/session.service';

import { DetailComponent } from './detail.component';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionApiService } from '../../services/session-api.service';
import { of } from 'rxjs';
import { TeacherService } from 'src/app/services/teacher.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Teacher } from 'src/app/interfaces/teacher.interface';

// --- MOCKS GLOBAUX ---

const mockSessionService = {
  sessionInformation: {
    admin: true,
    id: 1
  }
};

const mockTeacher: Teacher = {
  id: 7,
  firstName: 'John',
  lastName: 'Doe',
  createdAt: new Date(),
  updatedAt: new Date()
};

// --- SUITE DE TESTS UNITAIRES (SPY) ---
describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let service: SessionService;

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
    detail: jest.fn().mockReturnValue(of(mockTeacher))
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

  beforeEach(async () => {
    jest.clearAllMocks();

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
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: sessionApiService },
        { provide: TeacherService, useValue: teacherService },
        { provide: MatSnackBar, useValue: matSnackBar },
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ],
    }).compileComponents();

    service = TestBed.inject(SessionService);
    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch session and teacher on init', () => {
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

// --- SUITE DE TESTS D'INTÉGRATION (HTTP) ---
describe('DetailComponent Integration Test', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let httpMock: HttpTestingController;

  // On définit un ID spécifique pour le test d'intégration
  const sessionId = '123';

  const mockActivatedRouteIntegration = {
    snapshot: {
      paramMap: {
        get: jest.fn().mockReturnValue(sessionId)
      }
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailComponent],
      imports: [
        HttpClientTestingModule, // Simule les requêtes HTTP
        RouterTestingModule,
        MatSnackBarModule,
        ReactiveFormsModule,
        MatCardModule,
        MatIconModule
      ],
      providers: [
        // On fournit le Mock SessionService (pour l'admin/user info)
        { provide: SessionService, useValue: mockSessionService },
        // IMPORTANT : On fournit le Mock ActivatedRoute pour que ngOnInit récupère le bon ID
        { provide: ActivatedRoute, useValue: mockActivatedRouteIntegration }
        // Note : On NE mock PAS SessionApiService ni TeacherService ici, car on veut tester l'intégration HTTP
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch session details and teacher details from services and display them', () => {
    const mockSession = {
      id: 123,
      name: 'Yoga Session',
      description: 'Relaxing yoga',
      date: new Date(),
      teacher_id: 7,
      users: []
    };

    // 1. Déclenchement du ngOnInit
    fixture.detectChanges(); 

    // 2. Interception de la requête Session
    const reqSession = httpMock.expectOne(`api/session/${sessionId}`);
    expect(reqSession.request.method).toBe('GET');
    reqSession.flush(mockSession);

    // 3. Interception de la requête Teacher (déclenchée après la réception de la session)
    const reqTeacher = httpMock.expectOne(`api/teacher/${mockTeacher.id}`);
    expect(reqTeacher.request.method).toBe('GET');
    reqTeacher.flush(mockTeacher);

    // 4. Mise à jour du DOM
    fixture.detectChanges();

    // 5. Vérifications DOM
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Yoga Session');
    expect(compiled.querySelector('.description')?.textContent).toContain('Relaxing yoga');
    
    // Vérification plus souple pour le teacher (parfois dans mat-card-subtitle ou span)
    // On cherche si le texte "John Doe" est présent quelque part dans la card
    expect(compiled.textContent).toContain('John DOE');
  });

  it('should handle delete action fully through the service layer', () => {
    // Initialisation
    fixture.detectChanges();

    // On doit flusher les requêtes d'initialisation pour que le composant soit "prêt"
    // Sinon le verify() du afterEach va échouer car des requêtes ngOnInit seront en attente
    const reqSessionInit = httpMock.expectOne(`api/session/${sessionId}`);
    reqSessionInit.flush({ id: 123, teacher_id: 7, users: [] });
    const reqTeacherInit = httpMock.expectOne(`api/teacher/7`);
    reqTeacherInit.flush(mockTeacher);

    // Action Delete
    component.delete();

    // Interception de la requête DELETE
    const reqDelete = httpMock.expectOne(`api/session/${sessionId}`);
    expect(reqDelete.request.method).toBe('DELETE');
    reqDelete.flush({});
  });
});