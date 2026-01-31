import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthFacade {
  private readonly _token$ = new BehaviorSubject<string | null>(localStorage.getItem('token'));
  readonly token$ = this._token$.asObservable();

  setToken(token: string) {
    localStorage.setItem('token', token);
    this._token$.next(token);
  }

  logout() {
    localStorage.removeItem('token');
    this._token$.next(null);
  }

  get isAuthenticated(): boolean {
    return !!this._token$.value;
  }
}
