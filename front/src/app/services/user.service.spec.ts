import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { expect } from '@jest/globals';
import { UserService } from './user.service'; // Assurez-vous que le chemin est correct
import { User } from './../interfaces/user.interface' // Assurez-vous que le chemin est correct

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });

    // Injection du service et du contrôleur HTTP Mock
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Vérifie qu'il n'y a pas de requêtes HTTP en attente
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve a user by ID', () => {
    const dummyUser: User = {
      id: 1,
      email: 'test@test.com',
      lastName: 'Doe',
      firstName: 'John',
      admin: false,
      password: 'pwd',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // 1. On appelle la méthode du service
    service.getById('1').subscribe(user => {
      expect(user).toEqual(dummyUser);
    });

    // 2. On s'attend à une requête HTTP GET sur cette URL
    const req = httpMock.expectOne('api/user/1');
    expect(req.request.method).toBe('GET');

    // 3. On simule la réponse du serveur (flush)
    req.flush(dummyUser);
  });

  it('should delete a user', () => {
    // 1. On appelle la méthode delete
    service.delete('1').subscribe(response => {
      // Note: selon ce que retourne votre API, cela peut être null, {}, ou un message.
      // toBeTruthy() passe si la réponse n'est pas null/undefined/false.
      expect(response).toBeTruthy(); 
    });

    // 2. On s'attend à une requête HTTP DELETE sur cette URL
    const req = httpMock.expectOne('api/user/1');
    expect(req.request.method).toBe('DELETE');

    // 3. On simule une réponse vide ou null (standard pour un delete)
    req.flush({});
  });
});