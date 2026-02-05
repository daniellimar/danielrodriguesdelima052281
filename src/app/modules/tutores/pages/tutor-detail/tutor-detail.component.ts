import {Component, OnInit, Input, inject, numberAttribute} from '@angular/core';
import {RouterLink} from '@angular/router';
import {AsyncPipe} from '@angular/common';
import {map} from 'rxjs/operators';

import {TutorFacade} from '../../../../core/facades/tutor.facade';
import {LinkPetModalComponent} from '../../../../shared/components/link-pet-modal/link-pet-modal.component';
import {forkJoin} from 'rxjs';

@Component({
  selector: 'app-tutor-detail',
  standalone: true,
  imports: [
    AsyncPipe,
    RouterLink,
    LinkPetModalComponent
  ],
  templateUrl: './tutor-detail.component.html',
  styleUrl: './tutor-detail.component.scss'
})
export class TutorDetailComponent implements OnInit {
  @Input({transform: numberAttribute}) id!: number;

  private readonly tutorFacade = inject(TutorFacade);

  tutor$ = this.tutorFacade.selectedTutor$;
  loading$ = this.tutorFacade.loading$;

  // pets do tutor → sempre array
  pets$ = this.tutor$.pipe(
    map(tutor => tutor?.pets ?? [])
  );

  // apenas IDs dos pets vinculados → sempre array
  linkedPetIds$ = this.tutor$.pipe(
    map(tutor => tutor?.pets?.map(p => p.id) ?? [])
  );

  showLinkPetModal = false;

  ngOnInit(): void {
    if (this.id) {
      this.tutorFacade.loadTutorById(this.id);
    }
  }

  onOpenLinkPetModal(): void {
    this.showLinkPetModal = true;
  }

  onCloseLinkPetModal(): void {
    this.showLinkPetModal = false;
  }

  onLinkPets(events: number[]): void {
    const added = events.filter(x => x > 0).map(id => this.tutorFacade.linkPet(this.id, id));
    const removed = events.filter(x => x < 0).map(id => this.tutorFacade.unlinkPet(this.id, Math.abs(id)));

    const operations = [...added, ...removed];

    if (operations.length === 0) return;

    forkJoin(operations).subscribe({
      next: () => this.tutorFacade.loadTutorById(this.id),
      error: err => console.error(err)
    });
  }

  onUnlinkPet(petId: number): void {
    if (!confirm('Deseja realmente remover o vínculo deste pet?')) return;

    this.tutorFacade.unlinkPet(this.id, petId).subscribe({
      next: () => this.tutorFacade.loadTutorById(this.id),
      error: err => console.error(err)
    });
  }
}
