import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {LoginRequest, LoginResponse, RefreshTokenResponse} from '../models/auth.model';
import {environment} from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/autenticacao`;

  constructor(private http: HttpClient) {
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials);
  }

  refreshToken(refreshToken: string): Observable<RefreshTokenResponse> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${refreshToken}`
    });
    return this.http.put<RefreshTokenResponse>(`${this.apiUrl}/refresh`, {}, {headers});
  }
}
