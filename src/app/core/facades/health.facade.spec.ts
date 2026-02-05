import {TestBed} from '@angular/core/testing';
import {of, throwError} from 'rxjs';
import {vi} from 'vitest';

import {HealthFacade} from './health.facade';
import {HealthService, HealthStatus} from '../services/health.service';

describe('HealthFacade', () => {
  let facade: HealthFacade;

  let healthService: {
    checkFullHealth: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    healthService = {
      checkFullHealth: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        HealthFacade,
        {provide: HealthService, useValue: healthService}
      ]
    });

    facade = TestBed.inject(HealthFacade);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // =========================
  // INITIAL STATE
  // =========================

  it('should start with default state', () => {
    let healthValue: HealthStatus | null = null;
    let loadingValue = true;
    let historyValue: HealthStatus[] = [];

    facade.health$.subscribe(v => (healthValue = v));
    facade.loading$.subscribe(v => (loadingValue = v));
    facade.history$.subscribe(v => (historyValue = v));

    expect(healthValue).toBeNull();
    expect(loadingValue).toBeFalsy();
    expect(historyValue.length).toBe(0);
  });

  // =========================
  // SUCCESS FLOW
  // =========================

  it('should update health, history and loading on success', () => {
    const status: HealthStatus = {
      liveness: 'UP',
      readiness: 'UP',
      timestamp: new Date().toISOString(),
      endpoint: '/health',
      details: {}
    };

    healthService.checkFullHealth.mockReturnValue(of(status));

    let loadingStates: boolean[] = [];
    facade.loading$.subscribe(v => loadingStates.push(v));

    facade.checkHealth();

    expect(healthService.checkFullHealth).toHaveBeenCalled();

    facade.health$.subscribe(value => {
      expect(value).toEqual(status);
    });

    facade.history$.subscribe(history => {
      expect(history.length).toBe(1);
      expect(history[0]).toEqual(status);
    });

    expect(loadingStates).toEqual([false, true, false]);
  });

  it('should keep only last 10 health checks in history', () => {
    const makeStatus = (i: number): HealthStatus => ({
      liveness: 'UP',
      readiness: 'UP',
      timestamp: new Date().toISOString(),
      endpoint: `/health-${i}`,
      details: {}
    });

    healthService.checkFullHealth.mockImplementation(() =>
      of(makeStatus(Math.random()))
    );

    for (let i = 0; i < 12; i++) {
      facade.checkHealth();
    }

    facade.history$.subscribe(history => {
      expect(history.length).toBe(10);
    });
  });

  // =========================
  // ERROR FLOW
  // =========================

  it('should set DOWN status and stop loading on error', () => {
    const error = new Error('Service unavailable');

    healthService.checkFullHealth.mockReturnValue(
      throwError(() => error)
    );

    let healthValue: HealthStatus | null = null;
    let loadingStates: boolean[] = [];

    facade.health$.subscribe(v => (healthValue = v));
    facade.loading$.subscribe(v => loadingStates.push(v));

    facade.checkHealth();

    expect(healthService.checkFullHealth).toHaveBeenCalled();

    expect(healthValue).toEqual({
      liveness: 'DOWN',
      readiness: 'DOWN',
      timestamp: expect.any(String),
      endpoint: 'unknown',
      details: {error: 'Service unavailable'}
    });

    expect(loadingStates).toEqual([false, true, false]);
  });
});
