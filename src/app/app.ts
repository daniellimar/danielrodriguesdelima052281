import {Component, inject, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {AuthFacade} from './core/facades/auth.facade';
import {NavbarComponent} from './core/components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent],
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
