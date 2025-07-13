import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jest-marbles';
import { Observable } from 'rxjs';

import { StructuresState } from '../../store';
import { CountryStructureDescriptionActions } from '../store/actions';
import { selectAllCountryStructureDescriptions } from '../store/selectors/country-structure-description.selectors';

import { CountryStructureDescriptionService } from './country-structure-description.service';

describe('CountryStructureDescriptionService Suite', () => {
  let countryStructureDescriptionService: CountryStructureDescriptionService;
  let store: MockStore<StructuresState>;
  let actions: Observable<any>;

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        CountryStructureDescriptionService,
        provideMockStore(),
        provideMockActions(() => actions)
      ]
    });

    countryStructureDescriptionService = TestBed.inject(CountryStructureDescriptionService);
    store = TestBed.inject(MockStore);
  });

  test('should be created', () => {
    expect(countryStructureDescriptionService).toBeTruthy();
  });

  describe('fetchAllForCountry should', () => {
    beforeEach(() => {
      actions = TestBed.inject(Actions);
      jest.spyOn(store, 'dispatch');
    });

    test('should dispatch loadCountryStructureDescription with correct parameter', () => {
      const expectedAction = CountryStructureDescriptionActions.loadCountryStructureDescription({
        countryId: 'US'
      });
      countryStructureDescriptionService.fetchAllForCountry('US');

      expect(store.dispatch).toHaveBeenCalledWith(expectedAction);
    });

    test('should not dispatch loadCountryStructureDescription', () => {
      countryStructureDescriptionService.fetchAllForCountry('');

      expect(store.dispatch).toHaveBeenCalledTimes(0);
    });
  });

  describe('getAll should', () => {
    beforeEach(() => {
      store.overrideSelector(selectAllCountryStructureDescriptions, []);
    });

    test('return country structure descriptions from store unchanged', () => {
      const expected = cold('a', { a: [] });
      expect(countryStructureDescriptionService.getAll()).toBeObservable(expected);
    });
  });
});
