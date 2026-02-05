import {Component, OnInit, inject, DestroyRef} from '@angular/core';
import {PaginationComponent} from '../../../../shared/components/pagination/pagination.component';
import {AsyncPipe} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {TutorFacade} from '../../../../core/facades/tutor.facade';
import {TutorCardComponent} from '../../components/tutor-card.component';
import {
  ViewControlsComponent,
  ViewMode,
  CardsPerRow
} from '../../../../shared/components/view-controls/view-controls.component';
import {PageHeaderComponent} from '../../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-tutor-list',
  standalone: true,
  imports: [
    TutorCardComponent,
    PaginationComponent,
    AsyncPipe,
    RouterLink,
    ViewControlsComponent,
    PageHeaderComponent
  ],
  templateUrl: './tutor-list.component.html'
})
export class TutorListComponent implements OnInit {
  private tutorFacade = inject(TutorFacade);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  tutores$ = this.tutorFacade.tutores$;
  loading$ = this.tutorFacade.loading$;
  currentPage$ = this.tutorFacade.currentPage$;
  totalPages$ = this.tutorFacade.totalPages$;
  totalElements$ = this.tutorFacade.totalElements$;

  searchTerm = '';
  searchSubject = new Subject<string>();
  deletingTutorId: number | null = null;

  viewMode: ViewMode = 'grid';
  cardsPerRow: CardsPerRow = 3;

  ngOnInit(): void {
    const savedViewMode = localStorage.getItem('tutorViewMode') as ViewMode;
    const savedCardsPerRow = localStorage.getItem('tutorCardsPerRow');

    if (savedViewMode) this.viewMode = savedViewMode;
    if (savedCardsPerRow) this.cardsPerRow = parseInt(savedCardsPerRow) as CardsPerRow;

    this.tutorFacade.loadTutores();

    this.searchSubject
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(term => {
        this.tutorFacade.loadTutores(0, term);
      });
  }

  setViewMode(mode: ViewMode): void {
    this.viewMode = mode;
    localStorage.setItem('tutorViewMode', mode);
  }

  setCardsPerRow(count: CardsPerRow): void {
    this.cardsPerRow = count;
    localStorage.setItem('tutorCardsPerRow', count.toString());
  }

  getGridClasses(): string {
    if (this.viewMode === 'list') {
      return 'grid grid-cols-1 gap-3';
    }
    if (this.viewMode === 'compact') {
      return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3';
    }
    const gridMap = {
      2: 'grid grid-cols-1 sm:grid-cols-2 gap-6',
      3: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5',
      4: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5',
      5: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4'
    };
    return gridMap[this.cardsPerRow];
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.searchSubject.next(term);
  }

  onPageChange(page: number): void {
    this.tutorFacade.loadTutores(page, this.searchTerm);
  }

  onViewDetails(id: number): void {
    this.router.navigate(['/tutores', id]);
  }

  onEdit(id: number): void {
    this.router.navigate(['/tutores', 'edit', id]);
  }

  onDelete(id: number): void {
    this.deletingTutorId = id;
    this.tutorFacade.deleteTutor(id);

    setTimeout(() => {
      this.deletingTutorId = null;
    }, 2000);
  }
}
