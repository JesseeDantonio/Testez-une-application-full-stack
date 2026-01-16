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
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

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

describe('DetailComponent Integration Test', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let httpMock: HttpTestingController; // Permet de contrôler les requêtes HTTP réelles

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailComponent],
      imports: [
        // On importe les modules nécessaires pour que les VRAIS services fonctionnent
        HttpClientTestingModule, 
        RouterTestingModule,
        MatSnackBarModule,
        ReactiveFormsModule,
        MatCardModule,
        MatIconModule
      ],
      providers: [
        // NOTE IMPORTANTE : On ne met PAS de mocks ici (useValue: mock...).
        // On laisse Angular injecter les vraies instances de SessionApiService et TeacherService.
        SessionApiService,
        TeacherService
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Vérifie qu'il n'y a pas de requêtes HTTP en attente à la fin du test
    httpMock.verify();
  });

  it('should fetch session details and teacher details from services and display them', () => {
    // On simule l'ID dans l'URL (via le composant ou une navigation simulée)
    // Composant ↔ Vrai Service ↔ Module HTTP (simulé) ↔ Template HTML.
    // Pour ce test d'intégration, on force l'ID manuellement car ActivatedRoute est difficile à ne pas mocker du tout sans E2E.
    // Mais ici, on teste l'intégration [Composant -> Service -> HTTP].
    const sessionId = '123';
    
    // Données de réponse simulées venant du "Back-end"
    const mockSession = {
      id: 123,
      name: 'Yoga Session',
      description: 'Relaxing yoga',
      date: new Date(),
      teacher_id: 999,
      users: []
    };

    const mockTeacher = {
      id: 999,
      firstName: 'John',
      lastName: 'Doe'
    };

    // 2. On déclenche ngOnInit (qui appelle detail() dans le service)
    // Note: Dans un vrai scénario, il faudrait mocker ActivatedRoute pour qu'il retourne '123'. 
    // Supposons que le composant récupère l'ID.
    
    // Appel manuel pour simuler la récupération de l'ID par la route
    component.sessionId = sessionId; 
    component.ngOnInit(); 

    // 3. INTERCEPTION DES REQUÊTES RÉELLES
    // Le composant a appelé le VRAI SessionApiService.
    // Le VRAI service a lancé une requête HTTP GET. Nous l'attrapons ici :
    const reqSession = httpMock.expectOne(`api/session/${sessionId}`);
    expect(reqSession.request.method).toBe('GET');
    
    // On "répond" à la requête réseau comme le ferait le vrai serveur
    reqSession.flush(mockSession);

    // Une fois la session reçue, le composant appelle le VRAI TeacherService
    // Le VRAI TeacherService lance une requête HTTP. Nous l'attrapons :
    const reqTeacher = httpMock.expectOne(`api/teacher/${mockTeacher.id}`);
    expect(reqTeacher.request.method).toBe('GET');
    reqTeacher.flush(mockTeacher);

    // Mise à jour de la vue
    fixture.detectChanges();

    // Vérifications sur le DOM (HTML)
    // On vérifie que les données ont traversé : Service -> Component -> HTML
    const compiled = fixture.nativeElement as HTMLElement;
    
    expect(compiled.querySelector('h1')?.textContent).toContain('Yoga Session');
    expect(compiled.querySelector('.description')?.textContent).toContain('Relaxing yoga');
    expect(compiled.querySelector('.teacher-name')?.textContent).toContain('John Doe');
  });

  it('should handle delete action fully through the service layer', () => {
    const sessionId = '123';
    component.sessionId = sessionId;
    
    // Simulation de l'appel delete
    component.delete();

    // Le composant appelle le vrai service, qui fait un DELETE HTTP
    const req = httpMock.expectOne(`api/session/${sessionId}`);
    expect(req.request.method).toBe('DELETE');
    
    req.flush({}); // Réponse vide (succès)
  });
});