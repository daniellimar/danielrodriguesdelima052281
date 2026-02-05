import {TestBed} from '@angular/core/testing';
import {TutorFacade} from './tutor.facade';
import {TutorService} from '../services/tutor.service';
import {Tutor, TutorListResponse, CreateTutorDto} from '../models/tutor.model';
import {Pet} from '../models/pet.model';
import {of, throwError, firstValueFrom} from 'rxjs';
import {vi} from 'vitest';

describe('TutorFacade', () => {
  let facade: TutorFacade;
  let tutorService: {
    getTutores: ReturnType<typeof vi.fn>;
    getTutorById: ReturnType<typeof vi.fn>;
    createTutor: ReturnType<typeof vi.fn>;
    updateTutor: ReturnType<typeof vi.fn>;
    uploadPhoto: ReturnType<typeof vi.fn>;
    linkPet: ReturnType<typeof vi.fn>;
    unlinkPet: ReturnType<typeof vi.fn>;
    deleteTutor: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    tutorService = {
      getTutores: vi.fn(),
      getTutorById: vi.fn(),
      createTutor: vi.fn(),
      updateTutor: vi.fn(),
      uploadPhoto: vi.fn(),
      linkPet: vi.fn(),
      unlinkPet: vi.fn(),
      deleteTutor: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        TutorFacade,
        {provide: TutorService, useValue: tutorService}
      ]
    });

    facade = TestBed.inject(TutorFacade);
  });

  it('should handle error when loading tutors', async () => {
    tutorService.getTutores.mockReturnValue(
      throwError(() => new Error('error'))
    );

    facade.loadTutores();

    const total = await firstValueFrom(facade.totalElements$);
    const loading = await firstValueFrom(facade.loading$);

    expect(total).toBe(0);
    expect(loading).toBe(false);
  });

  it('should load tutor by id successfully', async () => {
    const tutor: Tutor = {
      id: 1,
      pets: [{id: 10} as Pet]
    } as Tutor;

    tutorService.getTutorById.mockReturnValue(of(tutor));

    facade.loadTutorById(1);

    const selected = await firstValueFrom(facade.selectedTutor$);
    const pets = await firstValueFrom(facade.tutorPets$);

    expect(selected?.id).toBe(1);
    expect(pets.length).toBe(1);
  });

  it('should clear selected tutor when id is invalid', async () => {
    facade.loadTutorById(NaN);

    const selected = await firstValueFrom(facade.selectedTutor$);

    expect(selected).toBe(null);
  });

  it('should handle error when loading tutor by id', async () => {
    tutorService.getTutorById.mockReturnValue(
      throwError(() => new Error('error'))
    );

    facade.loadTutorById(1);

    const selected = await firstValueFrom(facade.selectedTutor$);
    const pets = await firstValueFrom(facade.tutorPets$);

    expect(selected).toBe(null);
    expect(pets.length).toBe(0);
  });

  it('should create tutor successfully', async () => {
    tutorService.createTutor.mockReturnValue(
      of({id: 1} as Tutor)
    );

    await firstValueFrom(
      facade.createTutor({} as CreateTutorDto)
    );

    const loading = await firstValueFrom(facade.loading$);
    expect(loading).toBe(false);
  });

  it('should handle error when creating tutor', async () => {
    tutorService.createTutor.mockReturnValue(
      throwError(() => new Error('error'))
    );

    try {
      await firstValueFrom(
        facade.createTutor({} as CreateTutorDto)
      );
    } catch {
    }

    const loading = await firstValueFrom(facade.loading$);
    expect(loading).toBe(false);
  });

  it('should update tutor successfully', async () => {
    tutorService.updateTutor.mockReturnValue(
      of({id: 1} as Tutor)
    );

    await firstValueFrom(
      facade.updateTutor(1, {} as CreateTutorDto)
    );

    const loading = await firstValueFrom(facade.loading$);
    expect(loading).toBe(false);
  });

  it('should link pet successfully', async () => {
    tutorService.linkPet.mockReturnValue(of(void 0));

    await firstValueFrom(facade.linkPet(1, 2));

    const loading = await firstValueFrom(facade.loading$);
    expect(loading).toBe(false);
  });

  it('should unlink pet successfully', async () => {
    tutorService.unlinkPet.mockReturnValue(of(void 0));

    await firstValueFrom(facade.unlinkPet(1, 2));

    const loading = await firstValueFrom(facade.loading$);
    expect(loading).toBe(false);
  });

  it('should clear selected tutor', async () => {
    facade.clearSelectedTutor();

    const selected = await firstValueFrom(facade.selectedTutor$);
    const pets = await firstValueFrom(facade.tutorPets$);

    expect(selected).toBe(null);
    expect(pets.length).toBe(0);
  });

  it('should delete tutor and reload list', async () => {
    tutorService.deleteTutor.mockReturnValue(of(void 0));
    tutorService.getTutores.mockReturnValue(
      of({content: [], pageCount: 0, total: 0})
    );

    facade.deleteTutor(1);

    expect(tutorService.deleteTutor).toHaveBeenCalledWith(1);
    expect(tutorService.getTutores).toHaveBeenCalled();
  });
});
