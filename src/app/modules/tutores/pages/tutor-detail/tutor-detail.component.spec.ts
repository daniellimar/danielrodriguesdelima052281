import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TutorDetailComponent} from './tutor-detail.component';
import {TutorFacade} from '../../../../core/facades/tutor.facade';
import {ActivatedRoute} from '@angular/router';
import {of, throwError, firstValueFrom} from 'rxjs';
import {describe, it, expect, beforeEach, vi} from 'vitest';

describe('TutorDetailComponent', () => {
  let component: TutorDetailComponent;
  let fixture: ComponentFixture<TutorDetailComponent>;
  let tutorFacadeMock: any;

  const tutorMock = {
    id: 1,
    nome: 'John Doe',
    pets: [
      {id: 10, nome: 'Rex'},
      {id: 20, nome: 'Max'}
    ]
  };

  beforeEach(async () => {
    tutorFacadeMock = {
      loadTutorById: vi.fn(),
      linkPet: vi.fn(),
      unlinkPet: vi.fn(),
      selectedTutor$: of(tutorMock),
      loading$: of(false)
    };

    await TestBed.configureTestingModule({
      imports: [TutorDetailComponent],
      providers: [
        {provide: TutorFacade, useValue: tutorFacadeMock},
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {paramMap: {get: () => '1'}}
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TutorDetailComponent);
    component = fixture.componentInstance;
    component.id = 1;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load tutor by id on init', () => {
    component.ngOnInit();
    expect(tutorFacadeMock.loadTutorById).toHaveBeenCalledWith(1);
  });

  it('should not load tutor if id is missing', () => {
    component.id = undefined as any;
    component.ngOnInit();
    expect(tutorFacadeMock.loadTutorById).not.toHaveBeenCalled();
  });

  it('should expose tutor observable', async () => {
    const tutor = await firstValueFrom(component.tutor$);
    expect(tutor).toEqual(tutorMock);
  });

  it('should expose loading observable', async () => {
    const loading = await firstValueFrom(component.loading$);
    expect(loading).toBe(false);
  });

  it('should map pets correctly', async () => {
    const pets = await firstValueFrom(component.pets$);
    expect(pets).toEqual(tutorMock.pets);
  });

  it('should map linked pet ids correctly', async () => {
    const ids = await firstValueFrom(component.linkedPetIds$);
    expect(ids).toEqual([10, 20]);
  });

  it('should return empty pets array when tutor is null', async () => {
    tutorFacadeMock.selectedTutor$ = of(null);
    // Re-instantiate to pick up the new mock value
    fixture = TestBed.createComponent(TutorDetailComponent);
    component = fixture.componentInstance;

    const pets = await firstValueFrom(component.pets$);
    expect(pets).toEqual([]);
  });

  it('should open link pet modal', () => {
    component.onOpenLinkPetModal();
    expect(component.showLinkPetModal).toBe(true);
  });

  it('should close link pet modal', () => {
    component.showLinkPetModal = true;
    component.onCloseLinkPetModal();
    expect(component.showLinkPetModal).toBe(false);
  });

  it('should link and unlink pets and reload tutor', () => {
    tutorFacadeMock.linkPet.mockReturnValue(of({}));
    tutorFacadeMock.unlinkPet.mockReturnValue(of({}));

    component.onLinkPets([5, -10]);

    expect(tutorFacadeMock.linkPet).toHaveBeenCalledWith(1, 5);
    expect(tutorFacadeMock.unlinkPet).toHaveBeenCalledWith(1, 10);
    expect(tutorFacadeMock.loadTutorById).toHaveBeenCalledWith(1);
  });

  it('should do nothing when no operations are provided', () => {
    component.onLinkPets([]);

    expect(tutorFacadeMock.linkPet).not.toHaveBeenCalled();
    expect(tutorFacadeMock.unlinkPet).not.toHaveBeenCalled();
    expect(tutorFacadeMock.loadTutorById).not.toHaveBeenCalled();
  });

  it('should handle error during link/unlink', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {
    });
    tutorFacadeMock.linkPet.mockReturnValue(
      throwError(() => new Error('Link error'))
    );

    component.onLinkPets([5]);

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('should unlink pet when confirm is true', () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    tutorFacadeMock.unlinkPet.mockReturnValue(of({}));

    component.onUnlinkPet(10);

    expect(confirmSpy).toHaveBeenCalled();
    expect(tutorFacadeMock.unlinkPet).toHaveBeenCalledWith(1, 10);
    expect(tutorFacadeMock.loadTutorById).toHaveBeenCalledWith(1);

    confirmSpy.mockRestore();
  });

  it('should not unlink pet when confirm is false', () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);

    component.onUnlinkPet(10);

    expect(tutorFacadeMock.unlinkPet).not.toHaveBeenCalled();
    confirmSpy.mockRestore();
  });

  it('should handle error when unlinking pet', () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {
    });
    tutorFacadeMock.unlinkPet.mockReturnValue(
      throwError(() => new Error('Unlink error'))
    );

    component.onUnlinkPet(10);

    expect(consoleSpy).toHaveBeenCalled();

    confirmSpy.mockRestore();
    consoleSpy.mockRestore();
  });
});
