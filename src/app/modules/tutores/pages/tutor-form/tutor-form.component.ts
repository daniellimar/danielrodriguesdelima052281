import {Component, OnInit, Input, inject, numberAttribute, DestroyRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {TutorFacade} from '../../../../core/facades/tutor.facade';
import {CreateTutorDto} from '../../../../core/models/tutor.model';
import {switchMap, of} from 'rxjs';
import {FormActionsComponent} from '../../../../shared/components/form-actions/form-actions.component';
import {ImageUploadComponent} from '../../../../shared/components/image-upload/image-upload.component';
import {FormHeaderComponent} from '../../../../shared/components/form-header/form-header.component';
import {CpfMaskDirective} from '../../../../shared/directives/cpf-mask.component';
import {PhoneMaskDirective} from '../../../../shared/directives/phone-mask.component';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-tutor-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormActionsComponent, ImageUploadComponent, FormHeaderComponent, CpfMaskDirective, PhoneMaskDirective],
  templateUrl: './tutor-form.component.html',
  styleUrl: './tutor-form.component.scss'
})
export class TutorFormComponent implements OnInit {
  @Input({transform: numberAttribute}) id?: number;

  private router = inject(Router);
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  private tutorFacade = inject(TutorFacade);

  loading$ = this.tutorFacade.loading$;
  isEditMode = false;
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  errorMessage: string | null = null;

  tutorForm: FormGroup = this.fb.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    telefone: ['', [Validators.required]],
    endereco: ['', [Validators.required]],
    cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]]
  });

  ngOnInit(): void {
    this.isEditMode = Number.isFinite(this.id);

    if (this.isEditMode && this.id != null) {
      this.loadTutorData();
    } else {
      this.tutorFacade.clearSelectedTutor();
    }
  }

  loadTutorData(): void {
    if (!this.id) return;

    this.tutorFacade.loadTutorById(this.id);
    this.tutorFacade.selectedTutor$
      .pipe(takeUntilDestroyed(this.destroyRef))// Evita Memory Leak
      .subscribe(tutor => {
        if (tutor) {
          this.tutorForm.patchValue({
            nome: tutor.nome,
            email: tutor.email,
            telefone: tutor.telefone,
            endereco: tutor.endereco,
            cpf: tutor.cpf
          });
          this.previewUrl = tutor.foto?.url || null;
        }
      });
  }

  handleFileSelected(file: File): void {
    this.selectedFile = file;

    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
    }

    this.previewUrl = URL.createObjectURL(file);
  }

  onSubmit(): void {
    if (this.tutorForm.invalid) {
      this.tutorForm.markAllAsTouched();
      return;
    }

    const tutorDto: CreateTutorDto = {
      ...this.tutorForm.value,
      cpf: String(this.tutorForm.value.cpf).replace(/\D/g, '')
    };

    const saveOperation = this.isEditMode && this.id
      ? this.tutorFacade.updateTutor(this.id, tutorDto)
      : this.tutorFacade.createTutor(tutorDto);

    saveOperation.pipe(
      switchMap((tutor) => {
        if (this.selectedFile && tutor.id) {
          return this.tutorFacade.uploadPhoto(tutor.id, this.selectedFile);
        }
        return of(tutor);
      })
    ).subscribe({
      next: () => {
        this.router.navigate(['/tutores']);
      },
      error: (err) => {
        console.error('Erro ao salvar tutor:', err);
        const errorMsg = err?.error?.message || 'Erro ao salvar tutor. Tente novamente.';
        alert(errorMsg);
      }
    });
  }

  get nomeControl() {
    return this.tutorForm.get('nome');
  }

  get emailControl() {
    return this.tutorForm.get('email');
  }

  get telefoneControl() {
    return this.tutorForm.get('telefone');
  }

  get enderecoControl() {
    return this.tutorForm.get('endereco');
  }

  get cpfControl() {
    return this.tutorForm.get('cpf');
  }
}
