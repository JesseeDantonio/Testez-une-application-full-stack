import {
  HttpTestingController,
  HttpClientTestingModule,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { Session } from '../interfaces/session.interface';
import { SessionApiService } from './session-api.service';

describe('SessionsService', () => {
  let service: SessionApiService;
  let httpMock: HttpTestingController;

  // Données factices pour les tests
  const mockSession: Session = {
    id: 1,
    name: 'Test Session',
    description: 'Description',
    date: new Date(),
    teacher_id: 1,
    users: [1, 2],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SessionApiService],
    });
    service = TestBed.inject(SessionApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve all sessions via GET', () => {
    const mockSessions: Session[] = [mockSession];

    service.all().subscribe((sessions) => {
      expect(sessions.length).toBe(1);
      expect(sessions).toEqual(mockSessions);
    });

    // On s'attend à une requête GET sur 'api/session'
    const req = httpMock.expectOne('api/session');
    expect(req.request.method).toBe('GET');

    // On simule la réponse du serveur
    req.flush(mockSessions);
  });

  it('should retrieve session detail via GET', () => {
    service.detail('1').subscribe((session) => {
      expect(session).toEqual(mockSession);
    });

    const req = httpMock.expectOne('api/session/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockSession);
  });

  it('should delete a session via DELETE', () => {
    service.delete('1').subscribe();
    const req = httpMock.expectOne('api/session/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should create a session via POST', () => {
    service.create(mockSession).subscribe((session) => {
      expect(session).toEqual(mockSession);
    });
    const req = httpMock.expectOne('api/session');
    expect(req.request.method).toBe('POST');
    req.flush(mockSession);
  });

  it('should update a session via PUT', () => {
    service.update('1', mockSession).subscribe((session) => {
      expect(session).toEqual(mockSession);
    });
    const req = httpMock.expectOne('api/session/1');
    expect(req.request.method).toBe('PUT');
    req.flush(mockSession);
  });

  it('should participate via POST', () => {
    service.participate('1', 'user1').subscribe();
    const req = httpMock.expectOne('api/session/1/participate/user1');
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  it('should unParticipate via DELETE', () => {
    service.unParticipate('1', 'user1').subscribe();
    const req = httpMock.expectOne('api/session/1/participate/user1');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
