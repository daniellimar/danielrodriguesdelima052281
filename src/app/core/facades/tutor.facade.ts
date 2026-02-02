import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {tap, catchError} from 'rxjs/operators';
import {Tutor, TutorListResponse, CreateTutorDto} from '../models/tutor.model';
import {Pet} from '../models/pet.model';
import {TutorService} from '../services/tutor.service';

@Injectable({providedIn: 'root'})
export class TutorFacade {
  private tutorService = inject(TutorService);

  private readonly _tutores$ = new BehaviorSubject<Tutor[]>([]);
  readonly tutores$ = this._tutores$.asObservable();

  private readonly _selectedTutor$ = new BehaviorSubject<Tutor | null>(null);
  readonly selectedTutor$ = this._selectedTutor$.asObservable();

  private readonly _tutorPets$ = new BehaviorSubject<Pet[]>([]);
  readonly tutorPets$ = this._tutorPets$.asObservable();

  private readonly _loading$ = new BehaviorSubject<boolean>(false);
  readonly loading$ = this._loading$.asObservable();

  private readonly _totalPages$ = new BehaviorSubject<number>(0);
  readonly totalPages$ = this._totalPages$.asObservable();

  private readonly _currentPage$ = new BehaviorSubject<number>(0);
  readonly currentPage$ = this._currentPage$.asObservable();

  loadTutores(page = 0, nome = ''): void {
    this._loading$.next(true);
    this._currentPage$.next(page);

    this.tutorService.getTutores(page, nome).subscribe({
      next: (res: TutorListResponse) => {
        this._tutores$.next(res.content);
        this._totalPages$.next(res.pageCount);
        this._loading$.next(false);
      },
      error: () => this._loading$.next(false)
    });
  }

  loadTutorById(id: number): void {
    if (!Number.isFinite(id)) {
      this._selectedTutor$.next(null);
      return;
    }

    this._loading$.next(true);
    this.tutorService.getTutorById(id).subscribe({
      next: (tutor) => {
        this._selectedTutor$.next(tutor);

        this._tutorPets$.next(tutor.pets ?? []);

        this._loading$.next(false);
      },
      error: () => {
        this._selectedTutor$.next(null);
        this._tutorPets$.next([]);
        this._loading$.next(false);
      }
    });
  }

  createTutor(tutor: CreateTutorDto): Observable<Tutor> {
    this._loading$.next(true);
    return this.tutorService.createTutor(tutor).pipe(
      tap(() => this._loading$.next(false)),
      catchError((error) => {
        this._loading$.next(false);
        return throwError(() => error);
      })
    );
  }

  updateTutor(id: number, tutor: CreateTutorDto): Observable<Tutor> {
    this._loading$.next(true);
    return this.tutorService.updateTutor(id, tutor).pipe(
      tap(() => this._loading$.next(false)),
      catchError((error) => {
        this._loading$.next(false);
        return throwError(() => error);
      })
    );
  }

  uploadPhoto(tutorId: number, file: File): Observable<any> {
    return this.tutorService.uploadPhoto(tutorId, file);
  }

  linkPet(tutorId: number, petId: number): Observable<void> {
    this._loading$.next(true);
    return this.tutorService.linkPet(tutorId, petId).pipe(
      tap(() => {
        this.loadTutorById(tutorId);
        this._loading$.next(false);
      }),
      catchError((error) => {
        this._loading$.next(false);
        return throwError(() => error);
      })
    );
  }

  unlinkPet(tutorId: number, petId: number): Observable<void> {
    this._loading$.next(true);
    return this.tutorService.unlinkPet(tutorId, petId).pipe(
      tap(() => {
        this.loadTutorById(tutorId);
        this._loading$.next(false);
      }),
      catchError((error) => {
        this._loading$.next(false);
        return throwError(() => error);
      })
    );
  }

  clearSelectedTutor(): void {
    this._selectedTutor$.next(null);
    this._tutorPets$.next([]);
  }

  get currentPage(): number {
    return this._currentPage$.value;
  }

  get totalPages(): number {
    return this._totalPages$.value;
  }
}
