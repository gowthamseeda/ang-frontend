import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jest-marbles';
import { Observable } from 'rxjs';

import { UserSettingsService } from '../../../../user-settings/user-settings/services/user-settings.service';
import { OutletActions, UserSettingsActions } from '../actions';

import { UserSettingsEffects } from './user-settings.effects';

describe('UserSettings Effects Test Suite', () => {
  let effects: UserSettingsEffects;
  let actions: Observable<any>;
  let userSettingsService: UserSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserSettingsEffects,
        provideMockActions(() => actions),
        {
          provide: UserSettingsService,
          useValue: {
            getLanguageId: jest.fn()
          }
        }
      ]
    });

    actions = TestBed.inject(Actions);
    effects = TestBed.inject(UserSettingsEffects);
    userSettingsService = TestBed.inject(UserSettingsService);
  });

  describe('loadOutlet action should', () => {
    const outletId = 'GS0001';
    const languageId = 'de-DE';

    test('return loadUserSettingsSuccess action', () => {
      const loadOutlet = OutletActions.loadOutlet({ outletId: outletId });
      actions = hot('-a', { a: loadOutlet });

      const userSettingsResponse = cold('-b|', { b: languageId });
      jest.spyOn(userSettingsService, 'getLanguageId').mockReturnValue(userSettingsResponse);

      const loadUserSettingsSuccess = UserSettingsActions.loadUserSettingsSuccess({
        languageId: languageId
      });
      const expected = cold('--c', { c: loadUserSettingsSuccess });

      expect(effects.loadUserSettings).toBeObservable(expected);
    });

    test('return a loadUserSettingsFailure if load user-settings failed', () => {
      const loadOutlet = OutletActions.loadOutlet({ outletId: outletId });
      actions = hot('-a', { a: loadOutlet });

      const error = new Error('some error') as any;
      const userSettingsResponse = cold(' -#|', {}, error);
      jest.spyOn(userSettingsService, 'getLanguageId').mockReturnValue(userSettingsResponse);

      const loadUserSettingsFailureAction = UserSettingsActions.loadUserSettingsFailure({ error });
      const expected = cold('       --(b|)', { b: loadUserSettingsFailureAction });

      expect(effects.loadUserSettings).toBeObservable(expected);
    });
  });
});
