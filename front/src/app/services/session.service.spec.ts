import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { SessionInformation } from '../interfaces/sessionInformation.interface';

import { SessionService } from './session.service';

describe('SessionService', () => {
  let service: SessionService;

  // On prépare une fausse donnée utilisateur pour les tests
  const mockSessionInfo: SessionInformation = {
    token: 'token_secret',
    type: 'Bearer',
    id: 1,
    username: 'testUser',
    firstName: 'John',
    lastName: 'Doe',
    admin: true,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    // ⚠️ IMPORTANT : On ne fait PAS l'injection ici.
    // On veut contrôler le moment exact de la création du service dans chaque test.
  });

  it('should be created', () => {
    service = TestBed.inject(SessionService);
    expect(service).toBeTruthy();
  });

  it('should start with isLogged as false', () => {
    service = TestBed.inject(SessionService); // Initialisation manuelle
    // Vérifie l'état initial
    expect(service.isLogged).toBe(false);
    expect(service.sessionInformation).toBeUndefined();
  });

  it('should log in user correctly', () => {
    service = TestBed.inject(SessionService); // Initialisation manuelle
    // Action : Connexion
    service.logIn(mockSessionInfo);

    // Vérification : Les variables sont mises à jour
    expect(service.isLogged).toBe(true);
    expect(service.sessionInformation).toEqual(mockSessionInfo);
  });

  it('should log out user correctly', () => {
    service = TestBed.inject(SessionService); // Initialisation manuelle
    // Pré-requis : On connecte d'abord l'utilisateur
    service.logIn(mockSessionInfo);
    expect(service.isLogged).toBe(true);

    // Action : Déconnexion
    service.logOut();

    // Vérification : Retour à l'état initial
    expect(service.isLogged).toBe(false);
    expect(service.sessionInformation).toBeUndefined();
  });

  it('should keep data consistent in observable', (done) => {
    service = TestBed.inject(SessionService); // Initialisation manuelle
    
    // Ce test vérifie que l'observable $isLogged() émet bien les changements
    let emissionCount = 0;

    service.$isLogged().subscribe((status) => {
      emissionCount++;

      if (emissionCount === 1) {
        // 1ère émission : valeur par défaut (false)
        expect(status).toBe(false);
      }
      else if (emissionCount === 2) {
        // 2ème émission : après le logIn
        expect(status).toBe(true);
      }
      else if (emissionCount === 3) {
        // 3ème émission : après le logOut
        expect(status).toBe(false);
        done(); // On signale à Jest que le test asynchrone est fini
      }
    });

    // Déclenche les émissions 2 et 3
    service.logIn(mockSessionInfo);
    service.logOut();
  });

  it('should automatically log in if session information is in localStorage', () => {
    // 1. On espionne le localStorage AVANT de créer le service
    const getItemSpy = jest.spyOn(window.localStorage, 'getItem').mockReturnValue(JSON.stringify(mockSessionInfo));

    // 2. On injecte le service MAINTENANT. 
    // Le constructeur se lance, appelle localStorage.getItem, et notre espion intercepte l'appel.
    service = TestBed.inject(SessionService);

    // 3. Vérifications
    expect(getItemSpy).toHaveBeenCalledWith('sessionInformation');
    expect(service.isLogged).toBe(true);
    expect(service.sessionInformation).toEqual(mockSessionInfo);

    // On vérifie aussi que l'observable a bien émis "true"
    service.$isLogged().subscribe((isLogged) => {
      expect(isLogged).toBe(true);
    });
  });
});