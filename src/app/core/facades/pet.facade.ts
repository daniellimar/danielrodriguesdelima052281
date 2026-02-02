import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, finalize, Observable, throwError} from 'rxjs';
import {tap, catchError} from 'rxjs/operators';
import {Pet, PetListResponse} from '../models/pet.model';
import {PetService, CreatePetDto} from '../services/pet.service';

@Injectable({
  providedIn: 'root'
})
export class PetFacade {
  private petService = inject(PetService);

  private readonly _pets$ = new BehaviorSubject<Pet[]>([]);
  readonly pets$ = this._pets$.asObservable();

  private readonly _selectedPet$ = new BehaviorSubject<Pet | null>(null);
  readonly selectedPet$ = this._selectedPet$.asObservable();

  private readonly _loading$ = new BehaviorSubject<boolean>(false);
  readonly loading$ = this._loading$.asObservable();

  private readonly _totalElements$ = new BehaviorSubject<number>(0);
  readonly totalElements$ = this._totalElements$.asObservable();

  private readonly _totalPages$ = new BehaviorSubject<number>(0);
  readonly totalPages$ = this._totalPages$.asObservable();

  private readonly _currentPage$ = new BehaviorSubject<number>(0);
  readonly currentPage$ = this._currentPage$.asObservable();

  loadPets(page = 0, nome = ''): void {
    this._loading$.next(true);
    this._currentPage$.next(page);

    this.petService.list(page, 10, nome)
      .pipe(finalize(() => this._loading$.next(false)))
      .subscribe({
        next: (response: PetListResponse) => {
          this._pets$.next(response.content);
          this._totalElements$.next(response.total);
          this._totalPages$.next(response.pageCount);
          this._loading$.next(false);
        },
        error: () => {
          this._loading$.next(false);
        }
      });
  }

  loadPetById(id: number): void {
    if (!Number.isFinite(id)) {
      this._selectedPet$.next(null);
      return;
    }

    this._loading$.next(true);
    this.petService.getPetById(id).subscribe({
      next: (pet) => {
        this._selectedPet$.next(pet);
        this._loading$.next(false);
      },
      error: () => {
        this._selectedPet$.next(null);
        this._loading$.next(false);
      }
    });
  }

  createPet(pet: CreatePetDto): Observable<Pet> {
    this._loading$.next(true);
    return this.petService.createPet(pet).pipe(
      tap(() => this._loading$.next(false)),
      catchError((error) => {
        this._loading$.next(false);
        return throwError(() => error);
      })
    );
  }

  updatePet(id: number, pet: CreatePetDto): Observable<Pet> {
    this._loading$.next(true);
    return this.petService.updatePet(id, pet).pipe(
      tap(() => this._loading$.next(false)),
      catchError((error) => {
        this._loading$.next(false);
        return throwError(() => error);
      })
    );
  }

  uploadPhoto(petId: number, file: File): Observable<any> {
    return this.petService.uploadPhoto(petId, file);
  }

  clearSelectedPet(): void {
    this._selectedPet$.next(null);
  }

  get currentPage(): number {
    return this._currentPage$.value;
  }

  get totalPages(): number {
    return this._totalPages$.value;
  }
}
