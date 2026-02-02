import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HealthService, HealthStatus } from '../services/health.service';

@Injectable({ providedIn: 'root' })
export class HealthFacade {
  private healthService = inject(HealthService);

  private readonly _health$ = new BehaviorSubject<HealthStatus | null>(null);
  private readonly _loading$ = new BehaviorSubject<boolean>(false);
  private readonly _history$ = new BehaviorSubject<HealthStatus[]>([]);

  readonly health$ = this._health$.asObservable();
  readonly loading$ = this._loading$.asObservable();
  readonly history$ = this._history$.asObservable();

  checkHealth(): void {
    this._loading$.next(true);

    this.healthService.checkFullHealth().subscribe({
      next: (status) => {
        this._health$.next(status);

        const currentHistory = this._history$.value;
        const newHistory = [status, ...currentHistory].slice(0, 10);
        this._history$.next(newHistory);

        this._loading$.next(false);
      },
      error: (err) => {
        this._health$.next({
          liveness: 'DOWN',
          readiness: 'DOWN',
          timestamp: new Date().toISOString(),
          endpoint: 'unknown',
          details: { error: err.message }
        });
        this._loading$.next(false);
      }
    });
  }
}
