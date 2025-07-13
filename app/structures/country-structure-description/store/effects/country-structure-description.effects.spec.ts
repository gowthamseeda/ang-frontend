import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jest-marbles';
import { Observable } from 'rxjs';

import { getCountryStructureDescription_DE_Regions_Areas_Markets } from '../../model/country-structure-description.mock';
import { CountryStructureDescriptionApiService } from '../../service/country-structure-description-api.service';
import { CountryStructureDescriptionActions } from '../actions';

import { CountryStructureDescriptionEffects } from './country-structure-description.effects';

describe('CountryStructureDescriptionEffects Test Suite', () => {
  let effects: CountryStructureDescriptionEffects;
  let actions: Observable<any>;
  let countryStructureDescriptionApiService: CountryStructureDescriptionApiService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CountryStructureDescriptionEffects,
        provideMockActions(() => actions),
        {
          provide: CountryStructureDescriptionApiService,
          useValue: {
            getCountryStructureDescriptions: jest.fn()
          }
        }
      ]
    });

    effects = TestBed.inject(CountryStructureDescriptionEffects);
    countryStructureDescriptionApiService = TestBed.inject(CountryStructureDescriptionApiService);
    actions = TestBed.inject(Actions);
  });

  test('should create effect', () => {
    expect(effects).toBeTruthy();
  });

  test('should create service', () => {
    expect(countryStructureDescriptionApiService).toBeTruthy();
  });

  describe('loadCountryStructureDescriptions', () => {
    test('should return loadCountryStructureDescriptionSuccess', () => {
      const countryStructureDescription_DE =
        getCountryStructureDescription_DE_Regions_Areas_Markets();
      const loadCountryStructureDescriptionAction =
        CountryStructureDescriptionActions.loadCountryStructureDescription({
          countryId: 'DE'
        });
      const loadCountryStructureDescriptionSuccessAction =
        CountryStructureDescriptionActions.loadCountryStructureDescriptionSuccess({
          countryStructureDescriptions: countryStructureDescription_DE
        });

      actions = hot('               -a', { a: loadCountryStructureDescriptionAction });
      const response = cold(' -a|', { a: countryStructureDescription_DE });
      const expected = cold('       --b', { b: loadCountryStructureDescriptionSuccessAction });

      jest
        .spyOn(countryStructureDescriptionApiService, 'getCountryStructureDescriptions')
        .mockReturnValue(response);

      expect(effects.loadCountryStructureDescriptions).toBeObservable(expected);
    });

    test('should return a countryStructureDescriptionFailure if loading country structure failed', () => {
      const error = new Error('some error') as any;
      const loadCountryStructureDescriptionFailureAction =
        CountryStructureDescriptionActions.countryStructureDescriptionFailure({ error });
      const loadOutletAction = CountryStructureDescriptionActions.loadCountryStructureDescription({
        countryId: ''
      });

      actions = hot('               -a', { a: loadOutletAction });
      const response = cold(' -#|', {}, error);
      const expected = cold('       --(b|)', { b: loadCountryStructureDescriptionFailureAction });

      jest
        .spyOn(countryStructureDescriptionApiService, 'getCountryStructureDescriptions')
        .mockReturnValue(response);

      expect(effects.loadCountryStructureDescriptions).toBeObservable(expected);
    });
  });
});
