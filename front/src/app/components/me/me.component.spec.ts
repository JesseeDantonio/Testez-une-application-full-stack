import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SessionService } from 'src/app/services/session.service';
import { expect } from '@jest/globals';
import { MeComponent } from './me.component';
import { of } from 'rxjs';
import { User } from 'src/app/interfaces/user.interface';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

describe('MeComponent', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;
  let sessionService: jest.Mocked<SessionService>;
  let matSnackBar: jest.Mocked<MatSnackBar>;
  let userService: jest.Mocked<UserService>;
  let mockUser: User;
  let router: jest.Mocked<Router>;

  beforeEach(async () => {
    router = { navigate: jest.fn() } as any;
    sessionService = {
      sessionInformation: { id: 42 },
      logOut: jest.fn()
    } as any;
    matSnackBar = { open: jest.fn() } as any;
    userService = {
      getById: jest.fn(),
      delete: jest.fn()
    } as any;
    mockUser = {
      id: 42,
      email: 'foo@bar.com',
      firstName: 'Foo',
      lastName: 'Bar',
      password: '',
      admin: false,
      createdAt: new Date()
    };

    // MOCK getById AVANT la création du composant !
    (userService.getById as jest.Mock).mockReturnValue(of(mockUser));

    await TestBed.configureTestingModule({
      declarations: [MeComponent],
      imports: [
        MatCardModule,
        MatIconModule
      ],
      providers: [
        { provide: Router, useValue: router },
        { provide: SessionService, useValue: sessionService },
        { provide: MatSnackBar, useValue: matSnackBar },
        { provide: UserService, useValue: userService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // ngOnInit appelé ici, getById déjà mocké
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load the user on ngOnInit', () => {
    expect(userService.getById).toHaveBeenCalledWith('42');
    expect(component.user).toEqual(mockUser);
  });

  it('should go back when back() is called', () => {
    const spy = jest.spyOn(window.history, 'back').mockImplementation(() => {});
    component.back();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should delete the user and log out', () => {
    (userService.delete as jest.Mock).mockReturnValue(of({}));
    component.delete();
    expect(userService.delete).toHaveBeenCalledWith('42');
    expect(matSnackBar.open).toHaveBeenCalledWith(
      "Your account has been deleted !",
      'Close',
      { duration: 3000 }
    );
    expect(sessionService.logOut).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });
});
