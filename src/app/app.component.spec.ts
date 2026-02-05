import {ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {App} from './app';
import {AuthFacade} from './core/facades/auth.facade';

describe('AppComponent', () => {
  let fixture: ComponentFixture<App>;
  let component: App;

  const authFacadeMock = {
    logout: vi.fn(),
    currentAccessToken: null
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        App
      ],
      providers: [
        {provide: AuthFacade, useValue: authFacadeMock}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app component', () => {
    expect(component).toBeTruthy();
  });

  it('should have default title signal value', () => {
    expect(component['title']()).toBe('pet-manager-frontend');
  });

  it('should call logout on AuthFacade when onLogout is called', () => {
    component.onLogout();
    expect(authFacadeMock.logout).toHaveBeenCalledTimes(1);
  });
});
