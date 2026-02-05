import {ComponentFixture, TestBed} from '@angular/core/testing';
import {PetListComponent} from './pet-list.component';
import {PetFacade} from '../../../../core/facades/pet.facade';
import {Router} from '@angular/router';
import {of} from 'rxjs';
import {beforeEach, describe, expect, it, vi} from 'vitest';

describe('PetListComponent', () => {
  let component: PetListComponent;
  let fixture: ComponentFixture<PetListComponent>;
  let petFacadeMock: any;
  let routerMock: any;

  beforeEach(async () => {
    petFacadeMock = {
      loadPets: vi.fn(),
      deletePet: vi.fn(),
      pets$: of([]),
      loading$: of(false),
      error$: of(null),
      currentPage$: of(0),
      totalPages$: of(1),
      totalElements$: of(0),
      currentPage: 0,
      searchTerm: ''
    };

    routerMock = {
      navigate: vi.fn()
    };

    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [PetListComponent],
      providers: [
        {provide: PetFacade, useValue: petFacadeMock},
        {provide: Router, useValue: routerMock}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PetListComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load pets on init', () => {
    component.ngOnInit();

    expect(petFacadeMock.loadPets).toHaveBeenCalledWith(0, '');
  });

  it('should restore view mode from localStorage on init', () => {
    localStorage.setItem('petViewMode', 'list');
    localStorage.setItem('petCardsPerRow', '3');

    component.ngOnInit();

    expect(component.viewMode).toBe('list');
    expect(component.cardsPerRow).toBe(3);
  });

  it('should use default view mode when localStorage is empty', () => {
    component.ngOnInit();

    expect(component.viewMode).toBe('grid');
    expect(component.cardsPerRow).toBe(4);
  });

  it('should change page and scroll to top', () => {
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {
    });
    petFacadeMock.currentPage = 0;

    component.onPageChange(2);

    expect(petFacadeMock.loadPets).toHaveBeenCalledWith(2, '');
    expect(scrollToSpy).toHaveBeenCalledWith({top: 0, behavior: 'smooth'});
  });

  it('should not reload when changing to the same page', () => {
    petFacadeMock.currentPage = 2;

    component.onPageChange(2);

    expect(petFacadeMock.loadPets).not.toHaveBeenCalled();
  });

  it('should retry loading pets on error', () => {
    petFacadeMock.currentPage = 1;
    component.searchTerm = 'test';

    component.onRetry();

    expect(petFacadeMock.loadPets).toHaveBeenCalledWith(1, 'test');
  });

  it('should navigate to pet details', () => {
    component.onViewPetDetails(5);

    expect(routerMock.navigate).toHaveBeenCalledWith(['/pets', 5]);
  });

  it('should navigate to edit pet', () => {
    component.onEditPet(10);

    expect(routerMock.navigate).toHaveBeenCalledWith(['/pets', 10, 'editar']);
  });

  it('should set view mode and save to localStorage', () => {
    component.setViewMode('list');

    expect(component.viewMode).toBe('list');
    expect(localStorage.getItem('petViewMode')).toBe('list');
  });

  it('should set cards per row and save to localStorage', () => {
    component.setCardsPerRow(3);

    expect(component.cardsPerRow).toBe(3);
    expect(localStorage.getItem('petCardsPerRow')).toBe('3');
  });

  it('should return correct grid classes for list view', () => {
    component.viewMode = 'list';

    const classes = component.getGridClasses();

    expect(classes).toBe('grid grid-cols-1 gap-3');
  });

  it('should return correct grid classes for compact view', () => {
    component.viewMode = 'compact';

    const classes = component.getGridClasses();

    expect(classes).toBe('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-3');
  });

  it('should return correct grid classes for grid view with 2 cards per row', () => {
    component.viewMode = 'grid';
    component.cardsPerRow = 2;

    const classes = component.getGridClasses();

    expect(classes).toBe('grid grid-cols-1 sm:grid-cols-2 gap-6');
  });

  it('should return correct grid classes for grid view with 3 cards per row', () => {
    component.viewMode = 'grid';
    component.cardsPerRow = 3;

    const classes = component.getGridClasses();

    expect(classes).toBe('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5');
  });

  it('should return correct grid classes for grid view with 4 cards per row', () => {
    component.viewMode = 'grid';
    component.cardsPerRow = 4;

    const classes = component.getGridClasses();

    expect(classes).toBe('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5');
  });

  it('should return correct grid classes for grid view with 5 cards per row', () => {
    component.viewMode = 'grid';
    component.cardsPerRow = 5;

    const classes = component.getGridClasses();

    expect(classes).toBe('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4');
  });

  it('should expose facade observables', () => {
    expect(component.pets$).toBe(petFacadeMock.pets$);
    expect(component.loading$).toBe(petFacadeMock.loading$);
    expect(component.error$).toBe(petFacadeMock.error$);
    expect(component.currentPage$).toBe(petFacadeMock.currentPage$);
    expect(component.totalPages$).toBe(petFacadeMock.totalPages$);
    expect(component.totalElements$).toBe(petFacadeMock.totalElements$);
  });

  it('should initialize search term from facade', () => {
    petFacadeMock.searchTerm = 'initial search';

    component.ngOnInit();

    expect(component.searchTerm).toBe('initial search');
  });
});
