import {Component, OnInit, Input, inject, OnDestroy} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {RouterLink} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {PetFacade} from '../../../../core/facades/pet.facade';
import {DEFAULT_PET_IMAGE} from '../../../../shared/constants/default-images';
import {tap} from 'rxjs';

@Component({
  selector: 'app-pet-detail',
  standalone: true,
  imports: [AsyncPipe, RouterLink],
  templateUrl: './pet-detail.component.html',
  styleUrl: './pet-detail.component.scss'
})
export class PetDetailComponent implements OnInit, OnDestroy {
  @Input() id!: string;

  private readonly petFacade = inject(PetFacade);
  private readonly titleService = inject(Title);

  readonly pet$ = this.petFacade.selectedPet$.pipe(
    tap(pet => {
      if (pet) this.titleService.setTitle(`Pet: ${pet.nome}`);
    })
  );
  readonly loading$ = this.petFacade.loading$;
  readonly defaultPetImage = DEFAULT_PET_IMAGE;

  ngOnInit(): void {
    if (this.id) {
      this.petFacade.loadPetById(Number(this.id));
    }
  }

  ngOnDestroy(): void {
    this.petFacade.clearSelectedPet();
    this.titleService.setTitle('Pet Manager');
  }
}
