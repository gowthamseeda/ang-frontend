import { TestBed, waitForAsync } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { cold, hot } from 'jest-marbles';
import { Observable } from 'rxjs';

import { Country } from '../../../geography/country/country.model';
import { CountryService } from '../../../geography/country/country.service';
import { ApiService } from '../../../shared/services/api/api.service';
import { UserSettingsService } from '../../../user-settings/user-settings/services/user-settings.service';
import { getProfile } from '../../models/outlet-profile.mock';
import { OutletResponse } from '../../models/outlet-response.model';
import { outletApiResponse_GET } from '../../models/outlet-response.mock';
import { OutletActions } from '../actions';
import { CountryState } from '../reducers/country.reducers';
import { OutletProfileState } from '../reducers/outlet.reducers';

import { OutletEffects } from './outlet.effects';
import { provideMockActions } from '@ngrx/effects/testing';

describe('OutletEffects', () => {
  let effects: OutletEffects;
  let apiService: ApiService;
  let countryService: CountryService;
  let userSettingsService: UserSettingsService;
  let actions: Observable<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OutletEffects,
        provideMockActions(() => actions),
        {
          provide: CountryService,
          useValue: {
            get: jest.fn()
          }
        },
        {
          provide: UserSettingsService,
          useValue: {
            getLanguageId: jest.fn()
          }
        },
        {
          provide: ApiService,
          useValue: {
            get: jest.fn()
          }
        }
      ]
    });
    effects = TestBed.inject(OutletEffects);
    apiService = TestBed.inject(ApiService);
    countryService = TestBed.inject(CountryService);
    userSettingsService = TestBed.inject(UserSettingsService);
    actions = TestBed.inject(Actions);
  });

  test('should be created', waitForAsync(() => {
    expect(effects).toBeTruthy();
  }));

  describe('loadOutletProfile action', () => {
    const outletId = 'GS1234567';

    test('should return loadOutletProfileSuccess if all requests do respond', () => {
      const outletApiResponse: OutletResponse = outletApiResponse_GET();
      const countryServiceResponse: Country = getCountry();
      const userSettingsServiceResponse: string | undefined = 'de-DE';

      const outletProfile: OutletProfileState = getProfile();
      const country: CountryState = {
        translations: {
          'it-IT': {
            name: 'Italy'
          }
        }
      };
      const languageId = 'de-DE';

      const loadOutletProfileAction = OutletActions.loadOutletProfile({ outletId: outletId });
      const loadOutletProfileSuccessAction = OutletActions.loadOutletProfileSuccess({
        profile: outletProfile,
        languageId: languageId,
        country: country
      });
      actions = hot('-a', { a: loadOutletProfileAction });
      const responseGetOutletProfile = cold('-b|', { b: outletApiResponse });
      const responseGetCountry = cold('-c|', { c: countryServiceResponse });
      const responseGetLanguageId = cold('-d|', { d: userSettingsServiceResponse });
      const expected = cold('----e', { e: loadOutletProfileSuccessAction });

      jest.spyOn(apiService, 'get').mockReturnValue(responseGetOutletProfile);
      jest.spyOn(countryService, 'get').mockReturnValue(responseGetCountry);
      jest.spyOn(userSettingsService, 'getLanguageId').mockReturnValue(responseGetLanguageId);
      expect(effects.loadOutletProfile).toBeObservable(expected);
    });

    test('should return loadOutletProfileFailure action if outlet api responses with an error', () => {
      const loadOutletProfileAction = OutletActions.loadOutletProfile({ outletId });
      const error = new Error('error');
      const loadOutletProfileFailureAction = OutletActions.loadOutletProfileFailure({
        error
      });
      actions = hot('         -a', { a: loadOutletProfileAction });
      const responseGetOutletProfile = cold(' -#|', {}, error);
      const expected = cold(' --(b|)', { b: loadOutletProfileFailureAction });

      jest.spyOn(apiService, 'get').mockReturnValue(responseGetOutletProfile);
      expect(effects.loadOutletProfile).toBeObservable(expected);
    });
  });
});

function getCountry(): Country {
  return {
    id: 'it',
    name: 'Italy',
    timeZone: 'UTC',
    languages: ['it_IT'],
    defaultLanguageId: 'it_IT',
    translations: {
      'it-IT': {
        name: 'Italy'
      }
    }
  };
}
