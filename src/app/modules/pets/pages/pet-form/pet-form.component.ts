import {Component, OnInit, Input, inject, numberAttribute} from '@angular/core';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {AsyncPipe} from '@angular/common';
import {PetFacade} from '../../../../core/facades/pet.facade';
import {CreatePetDto} from '../../../../core/services/pet.service';
import {switchMap, of} from 'rxjs';

@Component({
  selector: 'app-pet-form',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe, RouterLink],
  templateUrl: './pet-form.component.html',
  styleUrl: './pet-form.component.scss'
})
export class PetFormComponent implements OnInit {
  @Input({transform: numberAttribute}) id?: number;

  private fb = inject(FormBuilder);
  private petFacade = inject(PetFacade);
  private router = inject(Router);

  loading$ = this.petFacade.loading$;
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  isEditMode = false;

  petForm: FormGroup = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(2)]],
    raca: ['', [Validators.required]],
    idade: ['', [Validators.required, Validators.min(0), Validators.max(30)]],
  });

  ngOnInit(): void {
    this.isEditMode = Number.isFinite(this.id);

    if (this.isEditMode && this.id != null) {
      this.loadPetData();
    } else {
      this.petFacade.clearSelectedPet();
    }
  }

  loadPetData(): void {
    if (!this.id) return;

    this.petFacade.loadPetById(this.id);
    this.petFacade.selectedPet$.subscribe(pet => {
      if (pet) {
        this.petForm.patchValue({
          nome: pet.nome,
          raca: pet.raca,
          idade: pet.idade,
        });
        this.previewUrl = pet.foto?.url || null;
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];

      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl = e.target?.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSubmit(): void {
    if (this.petForm.invalid) {
      this.petForm.markAllAsTouched();
      return;
    }

    const petDto: CreatePetDto = {
      nome: this.petForm.value.nome,
      raca: this.petForm.value.raca,
      idade: Number(this.petForm.value.idade)
    };

    const saveOperation = this.isEditMode && this.id
      ? this.petFacade.updatePet(this.id, petDto)
      : this.petFacade.createPet(petDto);

    saveOperation.pipe(
      switchMap((pet) => {
        if (this.selectedFile && pet.id) {
          return this.petFacade.uploadPhoto(pet.id, this.selectedFile);
        }
        return of(pet);
      })
    ).subscribe({
      next: () => {
        this.router.navigate(['/pets']);
      },
      error: (err) => {
        console.error('Erro ao salvar pet:', err);
        const errorMsg = err?.error?.message
          || err?.message
          || 'Erro ao salvar pet. Tente novamente.';
        alert(errorMsg);
      }
    });
  }

  get nomeControl() {
    return this.petForm.get('nome');
  }

  get racaControl() {
    return this.petForm.get('raca');
  }

  get idadeControl() {
    return this.petForm.get('idade');
  }
}
