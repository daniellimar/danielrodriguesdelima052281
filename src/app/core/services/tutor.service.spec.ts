import {TestBed} from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import {TutorService} from './tutor.service';
import {environment} from '../../../environments/environment';
import {firstValueFrom} from 'rxjs';
import {Tutor, TutorListResponse, CreateTutorDto} from '../models/tutor.model';

describe('TutorService', () => {
  let service: TutorService;
  let httpMock: HttpTestingController;

  const apiUrl = `${environment.apiUrl}/v1/tutores`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TutorService]
    });

    service = TestBed.inject(TutorService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should list tutors with name filter', async () => {
    const promise = firstValueFrom(service.getTutores(1, 'John'));

    const req = httpMock.expectOne(req =>
      req.method === 'GET' &&
      req.url === apiUrl &&
      req.params.get('page') === '1' &&
      req.params.get('nome') === 'John'
    );

    req.flush({content: [], pageCount: 0, total: 0});

    await promise;
  });

  it('should get tutor by id', async () => {
    const mockTutor: Tutor = {id: 1, nome: 'John'} as Tutor;

    const promise = firstValueFrom(service.getTutorById(1));

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');

    req.flush(mockTutor);

    const result = await promise;
    expect(result).toEqual(mockTutor);
  });

  it('should create tutor', async () => {
    const dto: CreateTutorDto = {nome: 'John'} as CreateTutorDto;
    const mockTutor: Tutor = {id: 1, ...dto} as Tutor;

    const promise = firstValueFrom(service.createTutor(dto));

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dto);

    req.flush(mockTutor);

    const result = await promise;
    expect(result).toEqual(mockTutor);
  });

  it('should update tutor', async () => {
    const dto: CreateTutorDto = {nome: 'John Updated'} as CreateTutorDto;
    const mockTutor: Tutor = {id: 1, ...dto} as Tutor;

    const promise = firstValueFrom(service.updateTutor(1, dto));

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(dto);

    req.flush(mockTutor);

    const result = await promise;
    expect(result).toEqual(mockTutor);
  });

  it('should delete tutor', async () => {
    const promise = firstValueFrom(service.deleteTutor(1));

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');

    req.flush(null);

    await promise;
  });

  it('should upload tutor photo', async () => {
    const file = new File(['photo'], 'photo.png', {type: 'image/png'});

    const promise = firstValueFrom(service.uploadPhoto(1, file));

    const req = httpMock.expectOne(`${apiUrl}/1/fotos`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body instanceof FormData).toBe(true);

    req.flush({success: true});

    const result = await promise;
    expect(result).toEqual({success: true});
  });

  it('should link pet to tutor', async () => {
    const promise = firstValueFrom(service.linkPet(1, 2));

    const req = httpMock.expectOne(`${apiUrl}/1/pets/2`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});

    req.flush(null);

    await promise;
  });

  it('should unlink pet from tutor', async () => {
    const promise = firstValueFrom(service.unlinkPet(1, 2));

    const req = httpMock.expectOne(`${apiUrl}/1/pets/2`);
    expect(req.request.method).toBe('DELETE');

    req.flush(null);

    await promise;
  });
});
