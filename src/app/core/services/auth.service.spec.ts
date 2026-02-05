import {TestBed} from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import {AuthService} from './auth.service';
import {
  LoginRequest,
  RefreshTokenResponse
} from '../models/auth.model';
import {environment} from '../../../environments/environment';
import {firstValueFrom} from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const apiUrl = `${environment.apiUrl}/autenticacao`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should propagate error on login failure', async () => {
    const credentials: LoginRequest = {
      username: 'user',
      password: 'wrong'
    } as LoginRequest;

    const resultPromise = firstValueFrom(
      service.login(credentials)
    );

    const req = httpMock.expectOne(`${apiUrl}/login`);
    req.flush(
      {message: 'Unauthorized'},
      {status: 401, statusText: 'Unauthorized'}
    );

    await expect(resultPromise).rejects.toBeTruthy();
  });

  it('should propagate error on refresh token failure', async () => {
    const resultPromise = firstValueFrom(
      service.refreshToken('invalid-token')
    );

    const req = httpMock.expectOne(`${apiUrl}/refresh`);
    req.flush(
      {message: 'Invalid token'},
      {status: 401, statusText: 'Unauthorized'}
    );

    await expect(resultPromise).rejects.toBeTruthy();
  });
});
