import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Login} from './login.component';
import {AuthFacade} from '../../../../core/facades/auth.facade';
import {of, throwError} from 'rxjs';
import {ReactiveFormsModule} from '@angular/forms';

class AuthFacadeMock {
  login = (_: any) => of(true);
}

describe('Login Component', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let authFacade: AuthFacadeMock;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login, ReactiveFormsModule],
      providers: [
        {provide: AuthFacade, useClass: AuthFacadeMock}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    authFacade = TestBed.inject(AuthFacade) as unknown as AuthFacadeMock;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the login form with empty values', () => {
    expect(component.loginForm.value).toEqual({
      username: '',
      password: ''
    });
  });

  it('should set error message when login fails', () => {
    authFacade.login = () =>
      throwError(() => ({
        error: {message: 'Invalid credentials'}
      }));

    let errorValue: string | null = null;
    component.error$.subscribe(err => errorValue = err);

    component.loginForm.setValue({
      username: 'admin',
      password: '12345'
    });

    component.onSubmit();

    expect(errorValue).toBe('Invalid credentials');
  });

  it('should show default error message when backend error has no message', () => {
    authFacade.login = () =>
      throwError(() => ({}));

    let errorValue: string | null = null;
    component.error$.subscribe(err => errorValue = err);

    component.loginForm.setValue({
      username: 'admin',
      password: '12345'
    });

    component.onSubmit();

    expect(errorValue).toBe('Invalid credentials. Please try again.');
  });
});
