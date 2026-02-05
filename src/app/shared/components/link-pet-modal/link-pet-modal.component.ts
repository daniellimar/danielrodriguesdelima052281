import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  inject,
  DestroyRef,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {Subject, fromEvent} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, map, throttleTime} from 'rxjs/operators';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

import {PetFacade} from '../../../core/facades/pet.facade';

@Component({
  selector: 'app-link-pet-modal',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './link-pet-modal.component.html',
  styleUrl: './link-pet-modal.component.scss'
})
export class LinkPetModalComponent implements OnInit, AfterViewInit {
  @Input() linkedPetIds: number[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() linkPets = new EventEmitter<number[]>();

  @ViewChild('scrollContainer') scrollContainerRef!: ElementRef<HTMLDivElement>;

  private initialPetIds = new Set<number>();
  private readonly petFacade = inject(PetFacade);
  private readonly destroyRef = inject(DestroyRef);
  private readonly searchSubject = new Subject<string>();

  readonly pets$ = this.petFacade.pets$;
  readonly loading$ = this.petFacade.loading$;
  readonly totalPages$ = this.petFacade.totalPages$;
  readonly currentPage$ = this.petFacade.currentPage$;

  searchTerm = '';
  selectedPetIds = new Set<number>();
  currentPage = 0;
  totalPages = 1;
  isLoadingMore = false;


  constructor() {
    this.initSearchDebounce();
  }

  ngOnInit(): void {
    this.initialPetIds = new Set(this.linkedPetIds);
    this.selectedPetIds = new Set(this.linkedPetIds);
    this.petFacade.loadPets(0, '', false);

    this.currentPage$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(page => {
      this.currentPage = page ?? 0;
    });

    this.totalPages$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(tp => {
      this.totalPages = tp ?? 1;
    });

    this.pets$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
      this.isLoadingMore = false;
    });
  }

  ngAfterViewInit(): void {
    fromEvent(this.scrollContainerRef.nativeElement, 'scroll')
      .pipe(
        throttleTime(200),
        map(() => {
          const el = this.scrollContainerRef.nativeElement;
          const threshold = 150;
          const position = el.scrollTop + el.clientHeight;
          const height = el.scrollHeight;
          return height - position < threshold;
        }),
        filter(nearBottom => nearBottom && !this.isLoadingMore),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.loadMore());
  }

  private initSearchDebounce(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(term => {
      this.currentPage = 0;
      this.petFacade.loadPets(0, term, false);
    });
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value;
    this.searchSubject.next(this.searchTerm);
  }

  private loadMore(): void {

    if (this.isLoadingMore || this.currentPage + 1 >= this.totalPages) return;

    this.isLoadingMore = true;
    const nextPage = this.currentPage + 1;
    this.petFacade.loadPets(nextPage, this.searchTerm, true);
  }

  onTogglePet(petId: number): void {
    if (this.selectedPetIds.has(petId)) {
      this.selectedPetIds.delete(petId);
    } else {
      this.selectedPetIds.add(petId);
    }
  }

  isPetSelected(petId: number): boolean {
    return this.selectedPetIds.has(petId);
  }

  isPetAlreadyLinked(petId: number): boolean {
    return this.linkedPetIds.includes(petId);
  }

  onConfirm(): void {
    const added = Array.from(this.selectedPetIds).filter(id => !this.initialPetIds.has(id));
    const removed = Array.from(this.initialPetIds).filter(id => !this.selectedPetIds.has(id));

    const payload = [...added, ...removed.map(id => -id)];

    if (payload.length > 0) {
      this.linkPets.emit(payload);
    }
    this.onClose();
  }

  onClose(): void {
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  get selectedCount(): number {
    return this.selectedPetIds.size;
  }

  get newSelectionCount(): number {
    return Array.from(this.selectedPetIds).filter(
      id => !this.linkedPetIds.includes(id)
    ).length;
  }

  get hasMorePages(): boolean {
    return this.currentPage + 1 < this.totalPages;
  }

  get hasChanges(): boolean {
    if (this.initialPetIds.size !== this.selectedPetIds.size) return true;
    for (let id of this.selectedPetIds) {
      if (!this.initialPetIds.has(id)) return true;
    }
    return false;
  }

  get addedCount(): number {
    return Array.from(this.selectedPetIds).filter(id => !this.initialPetIds.has(id)).length;
  }

  get removedCount(): number {
    return Array.from(this.initialPetIds).filter(id => !this.selectedPetIds.has(id)).length;
  }
}
