import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TeacherService } from './teacher.service';
import { Teacher } from '../interfaces/teacher.interface';
import { expect } from '@jest/globals';

describe('TeacherService', () => {
  let service: TeacherService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TeacherService]
    });
    service = TestBed.inject(TeacherService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return all teachers', () => {
    const mockTeachers: Teacher[] = [
      { id: 1, lastName: 'M. Dupont', firstName: "Jean", createdAt: new Date(), updatedAt: new Date() },
      { id: 2, lastName: 'Mme Martin', firstName: "Marie", createdAt: new Date(), updatedAt: new Date() }
    ];

    service.all().subscribe(teachers => {
      expect(teachers).toEqual(mockTeachers);
    });

    const req = httpMock.expectOne('api/teacher');
    expect(req.request.method).toBe('GET');
    req.flush(mockTeachers);
  });

  it('should return teacher detail by id', () => {
    const mockTeacher: Teacher = { id: 1, lastName: 'M. Dupont', firstName: "Jean", createdAt: new Date(), updatedAt: new Date() };
    const teacherId = '1';

    service.detail(teacherId).subscribe(teacher => {
      expect(teacher).toEqual(mockTeacher);
    });

    const req = httpMock.expectOne(`api/teacher/${teacherId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTeacher);
  });
});