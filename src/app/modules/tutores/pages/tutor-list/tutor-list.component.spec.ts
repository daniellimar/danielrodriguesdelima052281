import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TutorListComponent} from './tutor-list.component';
import {TutorFacade} from '../../../../core/facades/tutor.facade';
import {Router, ActivatedRoute} from '@angular/router';
import {of} from 'rxjs';
import {describe, it, expect, beforeEach, vi, afterEach} from 'vitest';

describe('TutorListComponent', () => {
  let component: TutorListComponent;
  let fixture: ComponentFixture<TutorListComponent>;
  let tutorFacadeMock: any;
  let routerMock: any;

  beforeEach(async () => {
    tutorFacadeMock = {
      loadTutores: vi.fn(),
      deleteTutor: vi.fn(),
      tutores$: of([]),
      loading$: of(false),
      currentPage$: of(0),
      totalPages$: of(1),
      totalElements$: of(0)
    };

    routerMock = {
      navigate: vi.fn()
    };

    // Clear localStorage before each test
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [TutorListComponent],
      providers: [
        {provide: TutorFacade, useValue: tutorFacadeMock},
        {provide: Router, useValue: routerMock},
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {paramMap: {get: () => null}}
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TutorListComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load tutores on init', () => {
    component.ngOnInit();

    expect(tutorFacadeMock.loadTutores).toHaveBeenCalled();
  });

  it('should restore view mode from localStorage on init', () => {
    localStorage.setItem('tutorViewMode', 'list');
    localStorage.setItem('tutorCardsPerRow', '4');

    component.ngOnInit();

    expect(component.viewMode).toBe('list');
    expect(component.cardsPerRow).toBe(4);
  });

  it('should use default view mode when localStorage is empty', () => {
    component.ngOnInit();

    expect(component.viewMode).toBe('grid');
    expect(component.cardsPerRow).toBe(3);
  });

  it('should change page and load tutores', () => {
    component.searchTerm = 'test';

    component.onPageChange(2);

    expect(tutorFacadeMock.loadTutores).toHaveBeenCalledWith(2, 'test');
  });

  it('should navigate to tutor details', () => {
    component.onViewDetails(5);

    expect(routerMock.navigate).toHaveBeenCalledWith(['/tutores', 5]);
  });

  it('should navigate to edit tutor', () => {
    component.onEdit(10);

    expect(routerMock.navigate).toHaveBeenCalledWith(['/tutores', 'edit', 10]);
  });

  it('should delete tutor and clear deletingTutorId after timeout', (context) => {
    component.onDelete(7);

    expect(component.deletingTutorId).toBe(7);
    expect(tutorFacadeMock.deleteTutor).toHaveBeenCalledWith(7);

    setTimeout(() => {
      expect(component.deletingTutorId).toBeNull();
      context.onTestFinished(() => {
      });
    }, 2100);
  });

  it('should set view mode and save to localStorage', () => {
    component.setViewMode('compact');

    expect(component.viewMode).toBe('compact');
    expect(localStorage.getItem('tutorViewMode')).toBe('compact');
  });

  it('should set cards per row and save to localStorage', () => {
    component.setCardsPerRow(5);

    expect(component.cardsPerRow).toBe(5);
    expect(localStorage.getItem('tutorCardsPerRow')).toBe('5');
  });

  it('should return correct grid classes for list view', () => {
    component.viewMode = 'list';

    const classes = component.getGridClasses();

    expect(classes).toBe('grid grid-cols-1 gap-3');
  });

  it('should return correct grid classes for compact view', () => {
    component.viewMode = 'compact';

    const classes = component.getGridClasses();

    expect(classes).toBe('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3');
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
    expect(component.tutores$).toBe(tutorFacadeMock.tutores$);
    expect(component.loading$).toBe(tutorFacadeMock.loading$);
    expect(component.currentPage$).toBe(tutorFacadeMock.currentPage$);
    expect(component.totalPages$).toBe(tutorFacadeMock.totalPages$);
    expect(component.totalElements$).toBe(tutorFacadeMock.totalElements$);
  });

  it('should initialize searchTerm as empty string', () => {
    expect(component.searchTerm).toBe('');
  });

  it('should initialize deletingTutorId as null', () => {
    expect(component.deletingTutorId).toBeNull();
  });

  it('should update searchTerm when onSearch is called', () => {
    component.onSearch('Alice');

    expect(component.searchTerm).toBe('Alice');
  });

  it('should handle multiple view mode changes', () => {
    component.setViewMode('list');
    expect(component.viewMode).toBe('list');
    expect(localStorage.getItem('tutorViewMode')).toBe('list');

    component.setViewMode('grid');
    expect(component.viewMode).toBe('grid');
    expect(localStorage.getItem('tutorViewMode')).toBe('grid');

    component.setViewMode('compact');
    expect(component.viewMode).toBe('compact');
    expect(localStorage.getItem('tutorViewMode')).toBe('compact');
  });

  it('should handle multiple cards per row changes', () => {
    component.setCardsPerRow(2);
    expect(component.cardsPerRow).toBe(2);

    component.setCardsPerRow(5);
    expect(component.cardsPerRow).toBe(5);

    component.setCardsPerRow(3);
    expect(component.cardsPerRow).toBe(3);
  });
});
