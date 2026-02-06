import {Component, inject} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {AuthFacade} from '../../facades/auth.facade';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  public authFacade = inject(AuthFacade);

  onLogout(): void {
    this.authFacade.logout();
  }
}
