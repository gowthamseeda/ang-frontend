import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import {
  BrandsActions,
  BusinessNamesActions,
  DistributionLevelActions,
  OutletActions
} from './businessSite/store/actions';
import { LegalStructureStoreInitializer } from './legal-structure-store.guard';
import * as fromOutlet from './store';

describe('legal-structure store guard Suite', () => {
  let guard: LegalStructureStoreInitializer;
  let store: MockStore<fromOutlet.State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore(), LegalStructureStoreInitializer]
    });

    guard = TestBed.inject<LegalStructureStoreInitializer>(LegalStructureStoreInitializer);
    store = TestBed.inject(MockStore);
  });

  describe('canActivate', () => {
    const outletId = 'GS1234567';

    test('dispatchActions dispatches four actions in correct order', done => {
      const expectedResetBusinessSite = OutletActions.resetBusinessSite();
      const expectedLoadOutlet = OutletActions.loadOutlet({ outletId: outletId });
      const expectedLoadBrands = BrandsActions.loadBrands({ outletId: outletId });
      const expectedLoadBusinessNames = BusinessNamesActions.loadBusinessNames({
        outletId: outletId
      });
      const expectedLoadDistributionLevels = DistributionLevelActions.loadDistributionLevels({
        outletId: outletId
      });
      const spy = jest.spyOn(store, 'dispatch');

      store.refreshState();

      guard.dispatchActions(outletId).subscribe(() => {
        done();
      });
      expect(spy).toHaveBeenNthCalledWith(1, expectedResetBusinessSite);
      expect(spy).toHaveBeenNthCalledWith(2, expectedLoadOutlet);
      expect(spy).toHaveBeenNthCalledWith(3, expectedLoadBrands);
      expect(spy).toHaveBeenNthCalledWith(4, expectedLoadBusinessNames);
      expect(spy).toHaveBeenNthCalledWith(5, expectedLoadDistributionLevels);
    });
  });
});
