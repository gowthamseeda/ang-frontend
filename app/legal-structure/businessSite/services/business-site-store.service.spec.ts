import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import * as fromOutlet from '../../../outlet/store/reducers';
import { selectInitializedState } from '../../../outlet/store/selectors';
import { getOutletMock } from '../../shared/models/outlet.mock';
import { selectDistributionLevelsState, selectOutletState } from '../store/selectors';

import { BusinessSiteStoreService } from './business-site-store.service';

describe('BusinessSiteStoreService', () => {
  let service: BusinessSiteStoreService;
  let store: MockStore<fromOutlet.State>;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        BusinessSiteStoreService,
        provideMockStore(),
      ]
    });
    store = TestBed.inject(MockStore);
    store.overrideSelector(selectInitializedState, false);
    service = TestBed.inject(BusinessSiteStoreService);
  });

  it('service - should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getOutlet - should get outlet from store', done => {
    const expected = getOutletMock();
    store.overrideSelector(selectOutletState, expected);
    service.getOutlet().subscribe(outlet => {
      expect(outlet).toBe(expected);
      done();
    });
  });

  it('getDistributionLevels - should get distribution levels from store', done => {
    const expected = ['RETAILER', 'WHOLESALER'];
    store.overrideSelector(selectDistributionLevelsState, expected);
    service.getDistributionLevels().subscribe(distLevels => {
      expect(distLevels).toBe(expected);
      done();
    });
  });
});
