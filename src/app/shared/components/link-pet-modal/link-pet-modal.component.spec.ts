import {ComponentFixture, TestBed} from '@angular/core/testing';
import {LinkPetModalComponent} from './link-pet-modal.component';
import {PetFacade} from '../../../core/facades/pet.facade';
import {BehaviorSubject} from 'rxjs';
import {describe, it, expect, vi, beforeEach} from 'vitest';
import {ElementRef} from '@angular/core';

describe('LinkPetModalComponent', () => {
  let component: LinkPetModalComponent;
  let fixture: ComponentFixture<LinkPetModalComponent>;

  let pets$: BehaviorSubject<any[]>;
  let loading$: BehaviorSubject<boolean>;
  let totalPages$: BehaviorSubject<number>;
  let currentPage$: BehaviorSubject<number>;

  let petFacadeMock: {
    pets$: any;
    loading$: any;
    totalPages$: any;
    currentPage$: any;
    loadPets: any;
  };

  beforeEach(async () => {
    pets$ = new BehaviorSubject<any[]>([]);
    loading$ = new BehaviorSubject<boolean>(false);
    totalPages$ = new BehaviorSubject<number>(1);
    currentPage$ = new BehaviorSubject<number>(0);

    petFacadeMock = {
      pets$: pets$.asObservable(),
      loading$: loading$.asObservable(),
      totalPages$: totalPages$.asObservable(),
      currentPage$: currentPage$.asObservable(),
      loadPets: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [LinkPetModalComponent],
      providers: [
        {provide: PetFacade, useValue: petFacadeMock}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LinkPetModalComponent);
    component = fixture.componentInstance;

    // Mock scroll container
    component.scrollContainerRef = new ElementRef(document.createElement('div'));

    component.linkedPetIds = [1, 2];
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize selected pets from linkedPetIds', () => {
    expect(component.selectedPetIds.has(1)).toBe(true);
    expect(component.selectedPetIds.has(2)).toBe(true);
  });

  it('should load pets on init', () => {
    expect(petFacadeMock.loadPets).toHaveBeenCalledWith(0, '', false);
  });

  it('should update currentPage when facade emits', () => {
    currentPage$.next(2);
    expect(component.currentPage).toBe(2);
  });

  it('should update totalPages when facade emits', () => {
    totalPages$.next(5);
    expect(component.totalPages).toBe(5);
  });

  it('should reset isLoadingMore when pets change', () => {
    component.isLoadingMore = true;
    pets$.next([]);
    expect(component.isLoadingMore).toBe(false);
  });

  it('should toggle pet selection', () => {
    component.onTogglePet(3);
    expect(component.isPetSelected(3)).toBe(true);

    component.onTogglePet(3);
    expect(component.isPetSelected(3)).toBe(false);
  });

  it('should detect already linked pets', () => {
    expect(component.isPetAlreadyLinked(1)).toBe(true);
    expect(component.isPetAlreadyLinked(99)).toBe(false);
  });

  it('should calculate selectedCount correctly', () => {
    expect(component.selectedCount).toBe(2);
  });

  it('should calculate addedCount correctly', () => {
    component.onTogglePet(3);
    expect(component.addedCount).toBe(1);
  });

  it('should calculate removedCount correctly', () => {
    component.onTogglePet(1);
    expect(component.removedCount).toBe(1);
  });

  it('should detect changes correctly', () => {
    expect(component.hasChanges).toBe(false);

    component.onTogglePet(3);
    expect(component.hasChanges).toBe(true);
  });

  it('should emit linkPets with added and removed ids on confirm', () => {
    const spy = vi.fn();
    component.linkPets.subscribe(spy);

    component.onTogglePet(3); // add
    component.onTogglePet(1); // remove

    component.onConfirm();

    expect(spy).toHaveBeenCalledWith([3, -1]);
  });

  it('should emit close on confirm', () => {
    const spy = vi.fn();
    component.close.subscribe(spy);

    component.onConfirm();

    expect(spy).toHaveBeenCalled();
  });

  it('should emit close when onClose is called', () => {
    const spy = vi.fn();
    component.close.subscribe(spy);

    component.onClose();

    expect(spy).toHaveBeenCalled();
  });

  it('should not close when backdrop click target is different', () => {
    const spy = vi.fn();
    component.close.subscribe(spy);

    const event = {
      target: {},
      currentTarget: { other: true }
    } as unknown as MouseEvent;

    component.onBackdropClick(event);

    expect(spy).not.toHaveBeenCalled();
  });

  it('should indicate when more pages are available', () => {
    component.currentPage = 0;
    component.totalPages = 2;

    expect(component.hasMorePages).toBe(true);
  });
});
