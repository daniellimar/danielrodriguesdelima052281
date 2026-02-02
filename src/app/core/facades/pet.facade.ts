import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, finalize} from 'rxjs';
import {Pet} from '../models/pet.model';
import {PetService} from '../services/pet.service';

@Injectable({providedIn: 'root'})
export class PetFacade {
  private readonly _pets$ = new BehaviorSubject<Pet[]>([]);
  private readonly _loading$ = new BehaviorSubject<boolean>(false);
  private readonly _totalElements$ = new BehaviorSubject<number>(0);
  private readonly _totalPages$ = new BehaviorSubject<number>(0);
  private readonly _currentPage$ = new BehaviorSubject<number>(0);

  readonly pets$: Observable<Pet[]> = this._pets$.asObservable();
  readonly loading$: Observable<boolean> = this._loading$.asObservable();
  readonly totalElements$: Observable<number> = this._totalElements$.asObservable();
  readonly totalPages$: Observable<number> = this._totalPages$.asObservable();
  readonly currentPage$: Observable<number> = this._currentPage$.asObservable();

  private readonly _selectedPet$ = new BehaviorSubject<Pet | null>(null);
  readonly selectedPet$ = this._selectedPet$.asObservable();

  constructor(private petService: PetService) {
  }

  loadPets(page: number = 0, nome?: string): void {
    this._loading$.next(true);
    this._currentPage$.next(page);

    this.petService.list(page, 10, nome)
      .pipe(finalize(() => this._loading$.next(false)))
      .subscribe({
        next: (response) => {
          this._pets$.next(response.content);
          this._totalElements$.next(response.total);
          this._totalPages$.next(response.pageCount);
        },
        error: (err) => {
          console.error('Error loading pets:', err);
          this._pets$.next([]);
          this._totalElements$.next(0);
          this._totalPages$.next(0);
        }
      });
  }

  get currentPets(): Pet[] {
    return this._pets$.value;
  }

  get isLoading(): boolean {
    return this._loading$.value;
  }

  get currentPage(): number {
    return this._currentPage$.value;
  }

  loadPetById(id: number): void {
    this._loading$.next(true);
    this.petService.getPetById(id).subscribe({
      next: (pet) => {
        this._selectedPet$.next(pet);
        this._loading$.next(false);
      },
      error: () => {
        this._loading$.next(false);
        this._selectedPet$.next(null);
      }
    });
  }
}
