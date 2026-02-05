import {TestBed} from '@angular/core/testing';
import {of, throwError} from 'rxjs';
import {vi} from 'vitest';

import {PetFacade} from './pet.facade';
import {PetService, CreatePetDto} from '../services/pet.service';
import {Pet, PetListResponse} from '../models/pet.model';

describe('PetFacade', () => {
  let facade: PetFacade;

  let petService: {
    list: ReturnType<typeof vi.fn>;
    getPetById: ReturnType<typeof vi.fn>;
    createPet: ReturnType<typeof vi.fn>;
    updatePet: ReturnType<typeof vi.fn>;
    uploadPhoto: ReturnType<typeof vi.fn>;
    deletePet: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    petService = {
      list: vi.fn(),
      getPetById: vi.fn(),
      createPet: vi.fn(),
      updatePet: vi.fn(),
      uploadPhoto: vi.fn(),
      deletePet: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        PetFacade,
        {provide: PetService, useValue: petService}
      ]
    });

    facade = TestBed.inject(PetFacade);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // =========================
  // INITIAL STATE
  // =========================

  it('should start with default state', () => {
    let pets: Pet[] = [];
    let selected: Pet | null = {} as any;
    let loading = true;
    let error = true;

    facade.pets$.subscribe(v => (pets = v));
    facade.selectedPet$.subscribe(v => (selected = v));
    facade.loading$.subscribe(v => (loading = v));
    facade.error$.subscribe(v => (error = v));

    expect(pets.length).toBe(0);
    expect(selected).toBeNull();
    expect(loading).toBeFalsy();
    expect(error).toBeFalsy();
  });

  // =========================
  // LOAD PETS
  // =========================

  it('should append pets when append is true', () => {
    petService.list
      .mockReturnValueOnce(
        of({
          content: [{id: 1} as Pet],
          total: 2,
          pageCount: 2
        })
      )
      .mockReturnValueOnce(
        of({
          content: [{id: 2} as Pet],
          total: 2,
          pageCount: 2
        })
      );

    facade.loadPets(0);
    facade.loadPets(1, '', true);

    facade.pets$.subscribe(pets => {
      expect(pets.length).toBe(2);
    });
  });

  it('should set error on loadPets failure', () => {
    petService.list.mockReturnValue(throwError(() => new Error()));

    facade.loadPets();

    facade.error$.subscribe(err => {
      expect(err).toBeTruthy();
    });
  });

  // =========================
  // LOAD PET BY ID
  // =========================

  it('should clear selected pet when id is invalid', () => {
    facade.loadPetById(NaN);

    facade.selectedPet$.subscribe(pet => {
      expect(pet).toBeNull();
    });
  });

  it('should load pet by id', () => {
    const pet = {id: 1} as Pet;
    petService.getPetById.mockReturnValue(of(pet));

    facade.loadPetById(1);

    facade.selectedPet$.subscribe(value => {
      expect(value).toEqual(pet);
    });
  });

  it('should clear selected pet on error when loading by id', () => {
    petService.getPetById.mockReturnValue(throwError(() => new Error()));

    facade.loadPetById(1);

    facade.selectedPet$.subscribe(pet => {
      expect(pet).toBeNull();
    });
  });

  // =========================
  // CREATE / UPDATE
  // =========================

  it('should create pet successfully', () => {
    const pet = {id: 1} as Pet;
    petService.createPet.mockReturnValue(of(pet));

    facade.createPet({} as CreatePetDto).subscribe(result => {
      expect(result).toEqual(pet);
    });
  });

  it('should propagate error on createPet', () => {
    petService.createPet.mockReturnValue(
      throwError(() => new Error('fail'))
    );

    facade.createPet({} as CreatePetDto).subscribe({
      error: err => {
        expect(err).toBeTruthy();
      }
    });
  });

  it('should update pet successfully', () => {
    const pet = {id: 1} as Pet;
    petService.updatePet.mockReturnValue(of(pet));

    facade.updatePet(1, {} as CreatePetDto).subscribe(result => {
      expect(result).toEqual(pet);
    });
  });

  // =========================
  // UPLOAD PHOTO
  // =========================

  it('should upload photo', () => {
    const file = new File([''], 'photo.png');
    petService.uploadPhoto.mockReturnValue(of({}));

    facade.uploadPhoto(1, file).subscribe();

    expect(petService.uploadPhoto).toHaveBeenCalledWith(1, file);
  });

  // =========================
  // CLEAR SELECTED
  // =========================

  it('should clear selected pet', () => {
    facade.clearSelectedPet();

    facade.selectedPet$.subscribe(pet => {
      expect(pet).toBeNull();
    });
  });

  // =========================
  // DELETE PET
  // =========================

  it('should reload pets after delete success', () => {
    petService.deletePet.mockReturnValue(of(null));
    petService.list.mockReturnValue(
      of({content: [], total: 0, pageCount: 0})
    );

    const spy = vi.spyOn(facade, 'loadPets');

    facade.deletePet(1);

    expect(petService.deletePet).toHaveBeenCalledWith(1);
    expect(spy).toHaveBeenCalled();
  });

  it('should set error on delete failure', () => {
    vi.spyOn(window, 'alert').mockImplementation(() => {
    });

    petService.deletePet.mockReturnValue(
      throwError(() => ({status: 500}))
    );

    facade.deletePet(1);

    facade.error$.subscribe(err => {
      expect(err).toBeTruthy();
    });
  });
});
