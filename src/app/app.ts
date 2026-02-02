import {Component, inject, signal} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {AuthFacade} from './core/facades/auth.facade';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('pet-manager-frontend');

  authFacade = inject(AuthFacade);

  onLogout(): void {
    this.authFacade.logout();
  }
}
