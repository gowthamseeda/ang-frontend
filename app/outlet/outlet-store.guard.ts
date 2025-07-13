import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { paramOutletId } from './outlet-routing-paths';
import { OutletActionService } from './store/action.service';
import * as fromOutlet from './store/reducers';
import { selectInitializedState } from './store/selectors/loading-status.selectors';

@Injectable()
export class OutletStoreInitializer implements CanActivate {
  constructor(
    private store: Store<fromOutlet.State>,
    private outletActionService: OutletActionService
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const outletId = next.paramMap.get(paramOutletId);

    return this.initStore(outletId ? outletId : '');
  }

  initStore(outletId: string): Observable<boolean> {
    return this.store.pipe(
      select(selectInitializedState, { outletId: outletId }),
      tap(initialized => {
        if (!initialized) {
          this.outletActionService.dispatchLoadOutlet(outletId);
        }
      }),
      map(initialized => true)
    );
  }
}
