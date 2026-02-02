import {Component, OnInit, Input, inject, numberAttribute} from '@angular/core';
import {RouterLink} from '@angular/router';
import {AsyncPipe, DatePipe} from '@angular/common';
import {TutorFacade} from '../../../../core/facades/tutor.facade';
import {LinkPetModalComponent} from '../../../../shared/components/link-pet-modal/link-pet-modal.component';

@Component({
  selector: 'app-tutor-detail',
  standalone: true,
  imports: [AsyncPipe, RouterLink, LinkPetModalComponent],
  templateUrl: './tutor-detail.component.html',
  styleUrl: './tutor-detail.component.scss'
})
export class TutorDetailComponent implements OnInit {
  @Input({transform: numberAttribute}) id!: number;

  private tutorFacade = inject(TutorFacade);

  tutor$ = this.tutorFacade.selectedTutor$;
  pets$ = this.tutorFacade.tutorPets$;
  loading$ = this.tutorFacade.loading$;

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

  onLinkPet(petId: number): void {
    this.tutorFacade.linkPet(this.id, petId).subscribe({
      next: () => {
        alert('Pet vinculado com sucesso!');
        this.showLinkPetModal = false;
      },
      error: (err) => {
        console.error('Erro ao vincular pet:', err);
        alert('Erro ao vincular pet. Verifique se o pet já não está vinculado.');
      }
    });
  }

  onUnlinkPet(petId: number): void {
    if (confirm('Deseja realmente remover o vínculo deste pet com o tutor?')) {
      this.tutorFacade.unlinkPet(this.id, petId).subscribe({
        next: () => alert('Vínculo removido com sucesso!'),
        error: () => alert('Erro ao remover vínculo.')
      });
    }
  }
}
