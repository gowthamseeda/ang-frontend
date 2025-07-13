import { TestBed } from '@angular/core/testing';
import { cold } from 'jest-marbles';
import { of } from 'rxjs';

import { OutletStructureActionService } from './outlet-structure/services/outlet-structure-action.service';
import { OutletStructureService } from './outlet-structure/services/outlet-structure.service';
import { StructuresStoreInitializer } from './structures-store.guard';

describe('structures store guard Suite', () => {
  let guard: StructuresStoreInitializer;
  let outletStructureService: OutletStructureService;
  let structuresActionService: OutletStructureActionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StructuresStoreInitializer,
        {
          provide: OutletStructureService,
          useValue: {
            isInitializedFor: jest.fn()
          }
        },
        {
          provide: OutletStructureActionService,
          useValue: {
            dispatchLoadOutletStructures: jest.fn()
          }
        }
      ]
    });

    outletStructureService = TestBed.inject(OutletStructureService);
    structuresActionService = TestBed.inject(OutletStructureActionService);
    guard = TestBed.inject<StructuresStoreInitializer>(StructuresStoreInitializer);
  });

  describe('canActivate', () => {
    test('initStore emits true if store is initialized', () => {
      jest.spyOn(outletStructureService, 'isInitializedFor').mockReturnValue(of(true));
      jest.spyOn(structuresActionService, 'dispatchLoadOutletStructures');

      const expected = cold('(a|)', { a: true });

      expect(guard.initStore('GS1234567')).toBeObservable(expected);
    });

    test('initStore emits true if store is not initialized', () => {
      jest.spyOn(outletStructureService, 'isInitializedFor').mockReturnValue(of(false));
      jest.spyOn(structuresActionService, 'dispatchLoadOutletStructures');

      const expected = cold('(a|)', { a: true });

      expect(guard.initStore('GS1234567')).toBeObservable(expected);
    });

    test('initStore dispatches an action  if store is not initialized', done => {
      const spy = jest.spyOn(structuresActionService, 'dispatchLoadOutletStructures');

      jest.spyOn(outletStructureService, 'isInitializedFor').mockReturnValue(of(false));

      guard.initStore('GS1234567').subscribe(() => {
        done();
      });
      expect(spy).toHaveBeenCalledTimes(1);
    });

    test('initStore does not dispatch an action  if store is already initialized', done => {
      const spy = jest.spyOn(structuresActionService, 'dispatchLoadOutletStructures');

      jest.spyOn(outletStructureService, 'isInitializedFor').mockReturnValue(of(true));

      guard.initStore('GS1234567').subscribe(() => {
        done();
      });
      expect(spy).toHaveBeenCalledTimes(0);
    });
  });
});
