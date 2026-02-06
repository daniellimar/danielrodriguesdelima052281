import {TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {NavbarComponent} from './navbar.component';
import {AuthFacade} from '../../facades/auth.facade';

class MockAuthFacade {
  isAuthenticated = true;
  logoutCalled = false;

  logout() {
    this.logoutCalled = true;
  }
}

describe('NavbarComponent', () => {
  let mockAuthFacade: MockAuthFacade;

  beforeEach(async () => {
    mockAuthFacade = new MockAuthFacade();

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, NavbarComponent],
      providers: [{provide: AuthFacade, useValue: mockAuthFacade}],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(NavbarComponent);
    const comp = fixture.componentInstance;
    expect(comp).toBeTruthy();
  });

  it('should call logout when onLogout is invoked', () => {
    const fixture = TestBed.createComponent(NavbarComponent);
    const comp = fixture.componentInstance;
    comp.onLogout();
    expect(mockAuthFacade.logoutCalled).toBe(true);
  });
});
