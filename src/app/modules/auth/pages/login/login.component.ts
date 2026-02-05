import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import {AsyncPipe} from '@angular/common';
import {AuthFacade} from '../../../../core/facades/auth.facade';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class Login {
  private fb = inject(FormBuilder);
  private authFacade = inject(AuthFacade);

  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  private readonly errorSubject = new BehaviorSubject<string | null>(null);

  loading$ = this.loadingSubject.asObservable();
  error$ = this.errorSubject.asObservable();

  loginForm: FormGroup = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(5)]]
  });

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loadingSubject.next(true);
      this.errorSubject.next(null);

      this.authFacade.login(this.loginForm.value).subscribe({
        next: () => {
          this.loadingSubject.next(false);
        },
        error: (err) => {
          this.loadingSubject.next(false);
          const message = err.status === 401
            ? 'Usuário ou senha incorretos.'
            : 'Falha na conexão. Tente novamente mais tarde.';

          this.errorSubject.next(err.error?.message || message);
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  get usernameControl() {
    return this.loginForm.get('username');
  }

  get passwordControl() {
    return this.loginForm.get('password');
  }
}
