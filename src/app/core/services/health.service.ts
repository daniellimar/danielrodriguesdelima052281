import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, map, catchError, of} from 'rxjs';
import {environment} from '../../../environments/environment';

export interface HealthStatus {
  liveness: 'UP' | 'DOWN';
  readiness: 'UP' | 'DOWN';
  timestamp: string;
  endpoint: string;
  details?: any;
}

@Injectable({providedIn: 'root'})
export class HealthService {
  private readonly apiUrl = `${environment.apiUrl}/v1/pets?page=0&size=1`;

  constructor(private http: HttpClient) {
  }

  checkFullHealth(): Observable<HealthStatus> {
    const timestamp = new Date().toISOString();
    return this.http.get<any>(this.apiUrl, {observe: 'response'}).pipe(
      map(res => ({
        liveness: 'UP' as const,
        readiness: 'UP' as const,
        timestamp,
        endpoint: this.apiUrl,
        details: {status: res.status, type: 'Success'}
      })),
      catchError(err => {
        const isServerAlive = err.status > 0;
        return of({
          liveness: isServerAlive ? 'UP' as const : 'DOWN' as const,
          readiness: 'DOWN' as const,
          timestamp,
          endpoint: this.apiUrl,
          details: {error: err.message, status: err.status, hint: 'Check API connection'}
        });
      })
    );
  }
}
