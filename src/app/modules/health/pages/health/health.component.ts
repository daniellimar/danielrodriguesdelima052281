import { Component, OnInit, inject } from '@angular/core';
import { AsyncPipe, JsonPipe, DatePipe } from '@angular/common';
import { HealthFacade } from '../../../../core/facades/health.facade';

@Component({
  selector: 'app-health',
  standalone: true,
  imports: [AsyncPipe, JsonPipe, DatePipe],
  templateUrl: './health.component.html'
})
export class HealthComponent implements OnInit {
  private healthFacade = inject(HealthFacade);

  health$ = this.healthFacade.health$;
  loading$ = this.healthFacade.loading$;
  history$ = this.healthFacade.history$;

  ngOnInit(): void {
    this.healthFacade.checkHealth();
  }

  reload(): void {
    this.healthFacade.checkHealth();
  }
}
