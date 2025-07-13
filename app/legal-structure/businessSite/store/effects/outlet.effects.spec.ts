import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jest-marbles';
import { Observable } from 'rxjs';

import { getOutletMock } from '../../../shared/models/outlet.mock';
import { OutletService } from '../../../shared/services/outlet.service';
import { OutletActions } from '../actions';
import { loadCountry } from '../actions/country.actions';

import { OutletEffects } from './outlet.effects';

describe('Outlet Effects Test Suite', () => {
  let effects: OutletEffects;
  let outletService: OutletService;
  let actions: Observable<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OutletEffects,
        provideMockActions(() => actions),
        {
          provide: OutletService,
          useValue: {
            clearBusinessSite: jest.fn(),
            getOrLoadBusinessSite: jest.fn(),
            update: jest.fn()
          }
        }
      ]
    });

    effects = TestBed.inject(OutletEffects);
    outletService = TestBed.inject(OutletService);
    actions = TestBed.inject(Actions);
  });

  describe('loadOutlet', () => {
    test('should return loadOutletSuccess and loadOutletCountry', () => {
      const outlet = getOutletMock();
      const loadOutletAction = OutletActions.loadOutlet({ outletId: outlet.id });
      actions = hot('               -a', { a: loadOutletAction });

      const outletResponse = cold(' -b|', { b: outlet });
      jest.spyOn(outletService, 'getOrLoadBusinessSite').mockReturnValue(outletResponse);

      const loadOutletCountryAction = loadCountry({
        countryId: outlet.countryId
      });
      const loadOutletSuccessAction = OutletActions.loadOutletSuccess({
        outlet: { ...outlet, hasAssignableLabels: true }
      });
      const expected = cold('       --(cd)', {
        c: loadOutletSuccessAction,
        d: loadOutletCountryAction
      });

      expect(effects.loadOutlet$).toBeObservable(expected);
    });

    test('should return a loadOutletFailure if loading outlet failed', () => {
      const error = new Error('some error') as any;
      const loadOutletFailureAction = OutletActions.loadOutletFailure({ error });
      const loadOutletAction = OutletActions.loadOutlet({ outletId: 'unknown' });

      actions = hot('               -a', { a: loadOutletAction });
      const outletResponse = cold(' -#|', {}, error);
      const expected = cold('       --(b|)', { b: loadOutletFailureAction });

      jest.spyOn(outletService, 'getOrLoadBusinessSite').mockReturnValue(outletResponse);

      expect(effects.loadOutlet$).toBeObservable(expected);
    });
  });

  describe('save Outlet', () => {
    test('should return loadOutletAction with outlet id from saved outlet', () => {
      const outlet = { ...getOutletMock(), hasAssignableLabels: true };
      const updateResult = { abc: 'doesnt care' };
      const toggleOutletAffiliateAction = OutletActions.toggleOutletAffiliate({ outlet: outlet });
      const loadOutletAction = OutletActions.loadOutlet({ outletId: outlet.id });

      actions = hot('                       -a', { a: toggleOutletAffiliateAction });
      const updateOutletApiResponse = cold('-a|', { a: updateResult });
      const expected = cold('               ---b', { b: loadOutletAction });

      jest.spyOn(outletService, 'update').mockReturnValue(updateOutletApiResponse);

      expect(effects.toggleOutletAffiliate).toBeObservable(expected);
    });
  });
});
