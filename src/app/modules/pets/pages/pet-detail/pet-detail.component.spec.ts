import {ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {of} from 'rxjs';

import {PetDetailComponent} from './pet-detail.component';
import {PetFacade} from '../../../../core/facades/pet.facade';
import {DEFAULT_PET_IMAGE} from '../../../../shared/constants/default-images';

describe('PetDetailComponent', () => {
  let component: PetDetailComponent;
  let fixture: ComponentFixture<PetDetailComponent>;

  let petFacade: {
    loadPetById: ReturnType<typeof vi.fn>;
    selectedPet$: any;
    loading$: any;
  };

  beforeEach(async () => {
    petFacade = {
      loadPetById: vi.fn(),
      selectedPet$: of(null),
      loading$: of(false)
    };

    await TestBed.configureTestingModule({
      imports: [
        PetDetailComponent,
        RouterTestingModule // ✅ resolve ActivatedRoute / RouterLink
      ],
      providers: [
        {provide: PetFacade, useValue: petFacade}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PetDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should expose pet$ from PetFacade', () => {
    expect(component.pet$).toBe(petFacade.selectedPet$);
  });

  it('should expose loading$ from PetFacade', () => {
    expect(component.loading$).toBe(petFacade.loading$);
  });

  it('should call loadPetById on init when id is provided', () => {
    component.id = '10';

    component.ngOnInit();

    expect(petFacade.loadPetById).toHaveBeenCalledOnce();
    expect(petFacade.loadPetById).toHaveBeenCalledWith(10);
  });

  it('should not call loadPetById when id is empty', () => {
    component.id = '';

    component.ngOnInit();

    expect(petFacade.loadPetById).not.toHaveBeenCalled();
  });

  it('should not call loadPetById when id is undefined', () => {
    component.id = undefined as any;

    component.ngOnInit();

    expect(petFacade.loadPetById).not.toHaveBeenCalled();
  });

  it('should expose defaultPetImage constant', () => {
    expect(component.defaultPetImage).toBe(DEFAULT_PET_IMAGE);
  });
});
