import { Injectable } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';

import { paramOutletId } from './legal-structure-routing-paths';

@Injectable({
  providedIn: 'root'
})
export class LegalStructureRoutingService {
  readonly outletIdChanges: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(private router: Router) {
    this.getOutletIdByRouterEvents();
  }

  private getOutletIdByRouterEvents(): void {
    this.router.events
      .pipe(
        filter(event =>
          event instanceof ActivationEnd &&
          event.snapshot.component !== undefined &&
          event.snapshot.paramMap.get(paramOutletId) !== null
        ),
        map((event: ActivationEnd) => event.snapshot.paramMap.get(paramOutletId) || ''),
        distinctUntilChanged()
      )
      .subscribe(outletId => {
        this.outletIdChanges.next(outletId);
      });
  }
}
