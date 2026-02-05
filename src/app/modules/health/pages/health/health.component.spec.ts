import {ComponentFixture, TestBed} from '@angular/core/testing';
import {of} from 'rxjs';
import {HealthComponent} from './health.component';
import {HealthFacade} from '../../../../core/facades/health.facade';

describe('HealthComponent', () => {
  let component: HealthComponent;
  let fixture: ComponentFixture<HealthComponent>;
  let healthFacadeMock: {
    health$: any;
    loading$: any;
    history$: any;
    checkHealth: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    healthFacadeMock = {
      health$: of({status: 'UP'}),
      loading$: of(false),
      history$: of([]),
      checkHealth: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [HealthComponent],
      providers: [
        {provide: HealthFacade, useValue: healthFacadeMock}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HealthComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should expose health$, loading$ and history$ from facade', () => {
    expect(component.health$).toBe(healthFacadeMock.health$);
    expect(component.loading$).toBe(healthFacadeMock.loading$);
    expect(component.history$).toBe(healthFacadeMock.history$);
  });

  it('should call checkHealth on ngOnInit', () => {
    component.ngOnInit();
    expect(healthFacadeMock.checkHealth).toHaveBeenCalledTimes(1);
  });

  it('should call checkHealth when reload is called', () => {
    component.reload();
    expect(healthFacadeMock.checkHealth).toHaveBeenCalledTimes(1);
  });

  it('should call checkHealth again when reload is called after init', () => {
    component.ngOnInit();
    component.reload();

    expect(healthFacadeMock.checkHealth).toHaveBeenCalledTimes(2);
  });
});
