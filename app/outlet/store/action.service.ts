import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { OutletActions } from './actions';
import * as fromOutlet from './reducers';

@Injectable({ providedIn: 'root' })
export class OutletActionService {
  constructor(private store: Store<fromOutlet.State>) {}

  dispatchLoadOutlet(outletId: string): void {
    this.store.dispatch(OutletActions.loadOutletProfile({ outletId: outletId }));
  }
}
