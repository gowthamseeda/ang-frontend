import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { Outlet } from '../../shared/models/outlet.model';
import * as fromLegalStructure from '../../store';
import {
  BrandsActions,
  BusinessNamesActions,
  DistributionLevelActions,
  OutletActions
} from '../store/actions';

@Injectable({ providedIn: 'root' })
export class BusinessSiteActionService {
  constructor(private store: Store<fromLegalStructure.State>) {}

  dispatchLoadOutlet(outletId: string): void {
    this.store.dispatch(OutletActions.loadOutlet({ outletId: outletId }));
  }

  dispatchLoadBrandCodesFor(outletId: string): void {
    this.store.dispatch(BrandsActions.loadBrands({ outletId: outletId }));
  }

  dispatchLoadBusinessNamesFor(outletId: string): void {
    this.store.dispatch(BusinessNamesActions.loadBusinessNames({ outletId: outletId }));
  }

  dispatchLoadDistributionLevelsFor(outletId: string): void {
    this.store.dispatch(DistributionLevelActions.loadDistributionLevels({ outletId: outletId }));
  }

  dispatchToggleAffiliateForOutlet(outlet: Outlet): void {
    this.store.dispatch(OutletActions.toggleOutletAffiliate({ outlet: outlet }));
  }

  dispatchResetOutlet(): void {
    this.store.dispatch(OutletActions.resetBusinessSite());
  }
}
