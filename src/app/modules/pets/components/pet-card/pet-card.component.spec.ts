import {ComponentFixture, TestBed} from '@angular/core/testing';
import {PetCardComponent} from './pet-card.component';
import {Pet} from '../../../../core/models/pet.model';
import {DEFAULT_PET_IMAGE} from '../../../../shared/constants/default-images';

describe('PetCardComponent', () => {
  let component: PetCardComponent;
  let fixture: ComponentFixture<PetCardComponent>;

  const mockPet: Pet = {
    id: 1,
    nome: 'Rex',
    raca: 'Labrador',
    idade: 3,
    especie: 'Cachorro',
    foto: {
      id: 1,
      nome: 'rex.jpg',
      contentType: 'image/jpeg',
      url: 'http://example.com/rex.jpg'
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PetCardComponent);
    component = fixture.componentInstance;
    component.pet = mockPet;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should receive pet input', () => {
    expect(component.pet).toEqual(mockPet);
  });

  it('should have default isDeleting as false', () => {
    expect(component.isDeleting).toBe(false);
  });

  it('should expose default pet image constant', () => {
    expect(component.defaultPetImage).toBe(DEFAULT_PET_IMAGE);
  });

  it('should emit viewDetails with pet id', () => {
    const spy = vi.spyOn(component.viewDetails, 'emit');

    component.onViewDetails();

    expect(spy).toHaveBeenCalledWith(mockPet.id);
  });

  it('should emit edit event with pet id and stop propagation', () => {
    const spy = vi.spyOn(component.edit, 'emit');
    const stopPropagation = vi.fn();

    const event = {stopPropagation} as unknown as MouseEvent;

    component.onEdit(event);

    expect(stopPropagation).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(mockPet.id);
  });

  it('should emit delete event when confirmation is accepted', () => {
    const spy = vi.spyOn(component.delete, 'emit');
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    const stopPropagation = vi.fn();
    const event = {stopPropagation} as unknown as MouseEvent;

    component.onDelete(event);

    expect(stopPropagation).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(mockPet.id);
  });

  it('should not emit delete event when confirmation is cancelled', () => {
    const spy = vi.spyOn(component.delete, 'emit');
    vi.spyOn(window, 'confirm').mockReturnValue(false);

    const stopPropagation = vi.fn();
    const event = {stopPropagation} as unknown as MouseEvent;

    component.onDelete(event);

    expect(stopPropagation).toHaveBeenCalled();
    expect(spy).not.toHaveBeenCalled();
  });
});
