import { TestBed } from '@angular/core/testing';
import { MemoizedSelectorWithProps } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jest-marbles';

import { OutletStoreInitializer } from './outlet-store.guard';
import { OutletActions } from './store/actions';
import * as fromOutlet from './store/reducers';
import { selectInitializedState } from './store/selectors';

describe('structures store guard Suite', () => {
  let guard: OutletStoreInitializer;
  let store: MockStore<fromOutlet.State>;
  let selectInitializedStateSelector: MemoizedSelectorWithProps<
    fromOutlet.State,
    { outletId: string },
    boolean
  >;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideMockStore(), OutletStoreInitializer],
    });

    guard = TestBed.inject<OutletStoreInitializer>(OutletStoreInitializer);
    store = TestBed.inject(MockStore);
    selectInitializedStateSelector = store.overrideSelector(selectInitializedState, false);
  });

  describe('canActivate', () => {
    test('initStore emits true if store is initialized', () => {
      selectInitializedStateSelector.setResult(true);
      store.refreshState();

      const expected = cold('a', { a: true });

      expect(guard.initStore('GS1234567')).toBeObservable(expected);
    });

    test('initStore emits true if store is not initialized', () => {
      selectInitializedStateSelector.setResult(false);
      store.refreshState();

      const expected = cold('a', { a: true });

      expect(guard.initStore('GS1234567')).toBeObservable(expected);
    });

    test('initStore dispatches an action  if store is not initialized', done => {
      const expected = OutletActions.loadOutletProfile({ outletId: 'GS1234567' });
      const spy = jest.spyOn(store, 'dispatch');

      selectInitializedStateSelector.setResult(false);
      store.refreshState();

      guard.initStore('GS1234567').subscribe(() => {
        done();
      });
      expect(spy).toHaveBeenCalledWith(expected);
    });

    test('initStore does not dispatch an action  if store is already initialized', done => {
      const spy = jest.spyOn(store, 'dispatch');

      selectInitializedStateSelector.setResult(true);
      store.refreshState();

      guard.initStore('GS1234567').subscribe(() => {
        done();
      });
      expect(spy).toHaveBeenCalledTimes(0);
    });
  });
});
