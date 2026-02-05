import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {Router} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {LoginRequest, LoginResponse, RefreshTokenResponse} from '../models/auth.model';

@Injectable({providedIn: 'root'})
export class AuthFacade {
  private readonly accessTokenSubject = new BehaviorSubject<string | null>(this.getStoredAccessToken());
  private readonly refreshTokenSubject = new BehaviorSubject<string | null>(this.getStoredRefreshToken());

  public readonly accessToken$ = this.accessTokenSubject.asObservable();

  private tokenExpirationTimer?: ReturnType<typeof setTimeout>;

  constructor(private authService: AuthService, private router: Router) {
  }

  /**
   * Método público para ser chamado no AppComponent.ngOnInit()
   * Isso garante que o ciclo de injeção já terminou
   */
  initializeOnAppStart(): void {
    if (!this.isAuthenticated) return;

    this.refreshToken().subscribe({
      next: () => {
        console.log('Token renovado com sucesso na inicialização');
      },
      error: (err) => {
        console.warn('Falha ao atualizar token na inicialização', err);
        // NÃO chama logout aqui para evitar loop
        // Deixe o guard ou interceptor de erro lidar com isso
      }
    });
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.authService.login(credentials).pipe(
      tap(response => {
        this.setTokens(response.access_token, response.refresh_token);
        this.scheduleTokenRefresh(response.expires_in);
        this.router.navigate(['/pets']);
      })
    );
  }

  logout(): void {
    this.clearTokens();
    this.clearTokenRefreshTimer();
    this.router.navigate(['/auth/login']);
  }

  refreshToken(): Observable<RefreshTokenResponse> {
    const refreshToken = this.refreshTokenSubject.value;
    if (!refreshToken) {
      this.logout();
      throw new Error('Refresh token não disponível');
    }

    return this.authService.refreshToken(refreshToken).pipe(
      tap(response => {
        this.setTokens(response.access_token, response.refresh_token);
        this.scheduleTokenRefresh(response.expires_in);
      })
    );
  }

  get isAuthenticated(): boolean {
    return !!this.accessTokenSubject.value;
  }

  get currentAccessToken(): string | null {
    return this.accessTokenSubject.value;
  }

  get currentRefreshToken(): string | null {
    return this.refreshTokenSubject.value;
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    this.accessTokenSubject.next(accessToken);
    this.refreshTokenSubject.next(refreshToken);
  }

  private clearTokens(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.accessTokenSubject.next(null);
    this.refreshTokenSubject.next(null);
  }

  private getStoredAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private getStoredRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  private scheduleTokenRefresh(expiresIn: number): void {
    this.clearTokenRefreshTimer();
    // Refresh 30s antes de expirar
    const refreshTime = (expiresIn - 30) * 1000;
    this.tokenExpirationTimer = setTimeout(() => {
      this.refreshToken().subscribe({
        error: () => this.logout()
      });
    }, refreshTime);
  }

  private clearTokenRefreshTimer(): void {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
  }
}
