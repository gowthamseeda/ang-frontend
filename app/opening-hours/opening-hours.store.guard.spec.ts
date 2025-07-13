import { TestBed } from '@angular/core/testing';
import { MemoizedSelectorWithProps } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jest-marbles';
import { of } from 'rxjs';

import { BrandService } from '../services/brand/brand.service';

import { OpeningHoursStoreInitializer } from './opening-hours.store.guard';
import { BrandProductGroupOpeningHoursActions } from './store/actions';
import * as fromOpeningHours from './store/reducers';
import { selectInitializedState } from './store/selectors';

describe('opening hours store guard Suite', () => {
  let guard: OpeningHoursStoreInitializer;
  let brandService: BrandService;
  let store: MockStore<fromOpeningHours.State>;
  let selectInitializedStateSelector: MemoizedSelectorWithProps<
    fromOpeningHours.State,
    {
      outletId: string;
      productCategoryId: number;
      serviceId: number;
    },
    boolean
  >;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideMockStore(),
        OpeningHoursStoreInitializer,
        {
          provide: BrandService,
          useValue: {
            getAllIds: jest.fn()
          }
        }
      ],
    });

    brandService = TestBed.inject(BrandService);
    jest.spyOn(brandService, 'getAllIds').mockReturnValue(of([]));
    guard = TestBed.inject<OpeningHoursStoreInitializer>(OpeningHoursStoreInitializer);
    store = TestBed.inject(MockStore);
    selectInitializedStateSelector = store.overrideSelector(selectInitializedState, false);
  });

  describe('canActivate', () => {
    const outletId = 'GS1234567';
    const productCategoryId = 1;
    const serviceId = 2;

    test('initStore emits true if store is initialized', () => {
      selectInitializedStateSelector.setResult(true);
      store.refreshState();

      const expected = cold('a', { a: true });

      expect(guard.initStore(outletId, productCategoryId, serviceId)).toBeObservable(expected);
    });

    test('initStore emits true if store is not initialized', () => {
      selectInitializedStateSelector.setResult(false);
      store.refreshState();

      const expected = cold('a', { a: true });

      expect(guard.initStore(outletId, productCategoryId, serviceId)).toBeObservable(expected);
    });

    test('initStore dispatches an action  if store is not initialized', done => {
      const expected = BrandProductGroupOpeningHoursActions.openingHoursLoad({
        outletId: outletId,
        productCategoryId: productCategoryId,
        serviceId: serviceId
      });
      const spy = jest.spyOn(store, 'dispatch');

      selectInitializedStateSelector.setResult(false);
      store.refreshState();

      guard.initStore(outletId, productCategoryId, serviceId).subscribe(() => {
        done();
      });
      expect(spy).toHaveBeenCalledWith(expected);
    });

    test('initStore does not dispatch an action  if store is already initialized', done => {
      const spy = jest.spyOn(store, 'dispatch');

      selectInitializedStateSelector.setResult(true);
      store.refreshState();

      guard.initStore(outletId, productCategoryId, serviceId).subscribe(() => {
        done();
      });
      expect(spy).toHaveBeenCalledTimes(0);
    });
  });
});
