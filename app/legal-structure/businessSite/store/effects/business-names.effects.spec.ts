import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jest-marbles';
import { Observable } from 'rxjs';

import { GroupedBusinessName } from '../../../../traits/business-names/business-names.model';
import { BusinessNamesService } from '../../../../traits/business-names/business-names.service';
import { BusinessNamesActions } from '../actions';

import { BusinessNamesEffects } from './business-names.effects';

describe('Business Names Effects Test Suite', () => {
  let effects: BusinessNamesEffects;
  let actions: Observable<any>;
  let businessNamesService: BusinessNamesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BusinessNamesEffects,
        provideMockActions(() => actions),
        {
          provide: BusinessNamesService,
          useValue: {
            get: jest.fn()
          }
        }
      ]
    });

    actions = TestBed.inject(Actions);
    effects = TestBed.inject(BusinessNamesEffects);
    businessNamesService = TestBed.inject(BusinessNamesService);
  });

  describe('loadBusinessNames action should', () => {
    const businessName = 'bName';
    const groupedBusinessNames: GroupedBusinessName[] = [
      {
        name: businessName,
        brands: [],
        deleted: false,
        readonly: false
      }
    ];
    const businessNames: string[] = [businessName];

    test('dispatch loadBusinessNamesSuccess action', () => {
      const triggerAction = BusinessNamesActions.loadBusinessNames({ outletId: 'any_Id' });
      actions = hot('-a', { a: triggerAction });

      const businessNamesResponse = cold('-b|', { b: groupedBusinessNames });
      jest.spyOn(businessNamesService, 'get').mockReturnValue(businessNamesResponse);

      const loadBusinessNamesSuccess = BusinessNamesActions.loadBusinessNamesSuccess({
        businessNames: businessNames
      });
      const expected = cold('--c', { c: loadBusinessNamesSuccess });

      expect(effects.loadBusinessNames).toBeObservable(expected);
    });

    test('dispatch loadBusinessNamesFailure action if load failed', () => {
      const triggerAction = BusinessNamesActions.loadBusinessNames({ outletId: 'any_Id' });
      actions = hot('-a', { a: triggerAction });

      const error = new Error('some error') as any;
      const businessNamesResponse = cold('-#|', {}, error);
      jest.spyOn(businessNamesService, 'get').mockReturnValue(businessNamesResponse);

      const loadBusinessNamesFailure = BusinessNamesActions.loadBusinessNamesFailure({
        error: error
      });
      const expected = cold('--b', { b: loadBusinessNamesFailure });

      expect(effects.loadBusinessNames).toBeObservable(expected);
    });
  });
});
