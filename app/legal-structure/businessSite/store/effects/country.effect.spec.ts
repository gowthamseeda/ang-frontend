import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jest-marbles';
import { Observable } from 'rxjs';

import { CountryService } from '../../../../geography/country/country.service';
import { getCountryMock } from '../../models/country.mock';
import { OutletCountryActions } from '../actions';

import { CountryEffects } from './country.effects';

describe('Country Effects Test Suite', () => {
  let effects: CountryEffects;
  let actions: Observable<any>;
  let countryService: CountryService;

  const country = getCountryMock();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CountryEffects,
        provideMockActions(() => actions),
        {
          provide: CountryService,
          useValue: {
            get: jest.fn()
          }
        }
      ]
    });

    actions = TestBed.inject(Actions);
    effects = TestBed.inject(CountryEffects);
    countryService = TestBed.inject(CountryService);
  });

  describe('loadCountry action should', () => {
    test('return loadCountrySuccess action', () => {
      const loadCountry = OutletCountryActions.loadCountry({ countryId: country.id });
      actions = hot('-a', { a: loadCountry });

      const countryResponse = cold('-b|', { b: country });
      jest.spyOn(countryService, 'get').mockReturnValue(countryResponse);

      const loadCountrySuccess = OutletCountryActions.loadCountrySuccess({ country: country });
      const expected = cold('--c', { c: loadCountrySuccess });

      expect(effects.loadCountry).toBeObservable(expected);
    });

    test('return a loadCountryFailure if load country failed', () => {
      const loadOutletCountry = OutletCountryActions.loadCountry({ countryId: country.id });
      actions = hot('-a', { a: loadOutletCountry });

      const error = new Error('some error') as any;
      const countryResponse = cold(' -#|', {}, error);

      jest.spyOn(countryService, 'get').mockReturnValue(countryResponse);

      const loadCountryFailureAction = OutletCountryActions.loadCountryFailure({ error });
      const expected = cold('       --(b|)', { b: loadCountryFailureAction });

      expect(effects.loadCountry).toBeObservable(expected);
    });
  });
});
