import {TestBed} from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import {PetService, CreatePetDto} from './pet.service';
import {environment} from '../../../environments/environment';
import {firstValueFrom} from 'rxjs';
import {Pet, PetListResponse} from '../models/pet.model';

describe('PetService', () => {
  let service: PetService;
  let httpMock: HttpTestingController;

  const apiUrl = `${environment.apiUrl}/v1/pets`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PetService]
    });

    service = TestBed.inject(PetService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should list pets with filters', async () => {
    const promise = firstValueFrom(service.list(1, 5, 'Rex', 'Labrador'));

    const req = httpMock.expectOne(req =>
      req.method === 'GET' &&
      req.url === apiUrl &&
      req.params.get('page') === '1' &&
      req.params.get('size') === '5' &&
      req.params.get('nome') === 'Rex' &&
      req.params.get('raca') === 'Labrador'
    );

    req.flush({content: [], total: 0, pageCount: 0});

    await promise;
  });

  it('should get pet by id', async () => {
    const mockPet: Pet = {id: 1, nome: 'Rex'} as Pet;

    const promise = firstValueFrom(service.getPetById(1));

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');

    req.flush(mockPet);

    const result = await promise;
    expect(result).toEqual(mockPet);
  });

  it('should create pet', async () => {
    const dto: CreatePetDto = {
      nome: 'Rex',
      raca: 'Labrador',
      idade: 3
    };

    const mockPet: Pet = {id: 1, ...dto} as Pet;

    const promise = firstValueFrom(service.createPet(dto));

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dto);

    req.flush(mockPet);

    const result = await promise;
    expect(result).toEqual(mockPet);
  });

  it('should update pet', async () => {
    const dto: CreatePetDto = {
      nome: 'Rex',
      raca: 'Labrador',
      idade: 4
    };

    const mockPet: Pet = {id: 1, ...dto} as Pet;

    const promise = firstValueFrom(service.updatePet(1, dto));

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(dto);

    req.flush(mockPet);

    const result = await promise;
    expect(result).toEqual(mockPet);
  });

  it('should delete pet', async () => {
    const promise = firstValueFrom(service.deletePet(1));

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');

    req.flush(null);

    await promise;
  });

  it('should upload pet photo', async () => {
    const file = new File(['image'], 'pet.png', {type: 'image/png'});

    const promise = firstValueFrom(service.uploadPhoto(1, file));

    const req = httpMock.expectOne(`${apiUrl}/1/fotos`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body instanceof FormData).toBe(true);

    req.flush({success: true});

    const result = await promise;
    expect(result).toEqual({success: true});
  });
});
