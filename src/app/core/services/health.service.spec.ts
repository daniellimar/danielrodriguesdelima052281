import {TestBed} from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import {HealthService, HealthStatus} from './health.service';
import {environment} from '../../../environments/environment';
import {firstValueFrom} from 'rxjs';

describe('HealthService', () => {
  let service: HealthService;
  let httpMock: HttpTestingController;

  const apiUrl = `${environment.apiUrl}/v1/pets?page=0&size=1`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HealthService]
    });

    service = TestBed.inject(HealthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should return UP status when api responds successfully', async () => {
    const promise = firstValueFrom(service.checkFullHealth());

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');

    req.flush({}, {status: 200, statusText: 'OK'});

    const result: HealthStatus = await promise;

    expect(result.liveness).toBe('UP');
    expect(result.readiness).toBe('UP');
    expect(result.endpoint).toBe(apiUrl);
    expect(result.details.status).toBe(200);
    expect(result.details.type).toBe('Success');
    expect(result.timestamp).toBeTruthy();
  });

  it('should return DOWN readiness when api responds with error status', async () => {
    const promise = firstValueFrom(service.checkFullHealth());

    const req = httpMock.expectOne(apiUrl);

    req.flush(
      {message: 'Internal error'},
      {status: 500, statusText: 'Server Error'}
    );

    const result: HealthStatus = await promise;

    expect(result.liveness).toBe('UP');
    expect(result.readiness).toBe('DOWN');
    expect(result.endpoint).toBe(apiUrl);
    expect(result.details.status).toBe(500);
    expect(result.details.error).toBeTruthy();
    expect(result.details.hint).toBe('Check API connection');
  });

  it('should return DOWN liveness when api is unreachable', async () => {
    const promise = firstValueFrom(service.checkFullHealth());

    const req = httpMock.expectOne(apiUrl);

    req.error(new ProgressEvent('Network error'));

    const result: HealthStatus = await promise;

    expect(result.liveness).toBe('DOWN');
    expect(result.readiness).toBe('DOWN');
    expect(result.endpoint).toBe(apiUrl);
    expect(result.details.hint).toBe('Check API connection');
  });
});
