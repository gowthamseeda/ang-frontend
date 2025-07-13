import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromLegalStructure from '../../store';
import { RegionalCenterActions } from '../store/actions';

@Injectable()
export class RegionalCenterActionService {
  constructor(private store: Store<fromLegalStructure.State>) {}

  dispatchLoadRegionalCenters(): void {
    this.store.dispatch(RegionalCenterActions.loadRegionalCenters());
  }
}
