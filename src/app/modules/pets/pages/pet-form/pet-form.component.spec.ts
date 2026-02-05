import {ComponentFixture, TestBed} from '@angular/core/testing';
import {PetFormComponent} from './pet-form.component';
import {PetFacade} from '../../../../core/facades/pet.facade';
import {Router, ActivatedRoute} from '@angular/router';
import {of, Subject, throwError} from 'rxjs';
import {ReactiveFormsModule} from '@angular/forms';
import {describe, it, expect, beforeEach, afterEach, vi} from 'vitest';

describe('PetFormComponent', () => {
  let component: PetFormComponent;
  let fixture: ComponentFixture<PetFormComponent>;
  let petFacadeMock: any;
  let routerMock: any;
  let activatedRouteMock: any;

  const selectedPet$ = new Subject<any>();

  beforeEach(async () => {
    petFacadeMock = {
      loadPetById: vi.fn(),
      clearSelectedPet: vi.fn(),
      createPet: vi.fn(),
      updatePet: vi.fn(),
      uploadPhoto: vi.fn(),
      loading$: of(false),
      selectedPet$: selectedPet$.asObservable()
    };

    routerMock = {
      navigate: vi.fn()
    };

    activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: vi.fn().mockReturnValue(null)
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [PetFormComponent, ReactiveFormsModule],
      providers: [
        {provide: PetFacade, useValue: petFacadeMock},
        {provide: Router, useValue: routerMock},
        {provide: ActivatedRoute, useValue: activatedRouteMock}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PetFormComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    selectedPet$.complete();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should start in creation mode when there is no id', () => {
    activatedRouteMock.snapshot.paramMap.get.mockReturnValue(null);
    component.id = undefined;

    component.ngOnInit();

    expect(component.isEditMode).toBeFalsy();
    expect(petFacadeMock.clearSelectedPet).toHaveBeenCalled();
  });

  it('should start in edit mode when there is an id', () => {
    activatedRouteMock.snapshot.paramMap.get.mockReturnValue('1');
    component.id = 1;

    component.ngOnInit();

    expect(component.isEditMode).toBeTruthy();
    expect(petFacadeMock.loadPetById).toHaveBeenCalledWith(1);
  });

  it('should not submit invalid form', () => {
    component.onSubmit();

    expect(component.petForm.invalid).toBeTruthy();
    expect(petFacadeMock.createPet).not.toHaveBeenCalled();
  });

  it('should create pet when form is valid', () => {
    const petResponse = {id: 1};
    petFacadeMock.createPet.mockReturnValue(of(petResponse));

    component.petForm.setValue({
      nome: 'Bob',
      raca: 'Poodle',
      idade: 3
    });

    component.onSubmit();

    expect(petFacadeMock.createPet).toHaveBeenCalledWith({
      nome: 'Bob',
      raca: 'Poodle',
      idade: 3
    });

    expect(routerMock.navigate).toHaveBeenCalledWith(['/pets']);
  });

  it('should update pet when in edit mode', () => {
    component.id = 2;
    component.isEditMode = true;

    petFacadeMock.updatePet.mockReturnValue(of({id: 2}));

    component.petForm.setValue({
      nome: 'Max',
      raca: 'Labrador',
      idade: 6
    });

    component.onSubmit();

    expect(petFacadeMock.updatePet).toHaveBeenCalledWith(2, {
      nome: 'Max',
      raca: 'Labrador',
      idade: 6
    });
  });

  it('should upload photo after saving pet', () => {
    const file = new File(['photo'], 'photo.png');
    component.selectedFile = file;

    petFacadeMock.createPet.mockReturnValue(of({id: 5}));
    petFacadeMock.uploadPhoto.mockReturnValue(of({}));

    component.petForm.setValue({
      nome: 'Luna',
      raca: 'Mixed',
      idade: 2
    });

    component.onSubmit();

    expect(petFacadeMock.uploadPhoto).toHaveBeenCalledWith(5, file);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/pets']);
  });

  it('should handle error when saving pet', () => {
    petFacadeMock.createPet.mockReturnValue(
      throwError(() => ({
        error: {message: 'API Error'}
      }))
    );

    component.petForm.setValue({
      nome: 'Thor',
      raca: 'Pitbull',
      idade: 4
    });

    component.onSubmit();

    expect(component.errorMessage).toBe('API Error');
  });

  it('should update preview when selecting file', () => {
    const file = new File(['img'], 'photo.jpg');

    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:url');

    component.handleFileSelected(file);

    expect(component.selectedFile).toBe(file);
    expect(component.previewUrl).toBe('blob:url');
  });
});
