import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jest-marbles';
import { Observable } from 'rxjs';

import { DistributionLevelsService } from '../../../../traits/distribution-levels/distribution-levels.service';
import { DistributionLevelActions } from '../actions';

import { DistributionLevelEffects } from './distribution-level.effects';

describe('Distribution Level Effects Test Suite', () => {
  let effects: DistributionLevelEffects;
  let actions: Observable<any>;
  let distributionLevelsService: DistributionLevelsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DistributionLevelEffects,
        provideMockActions(() => actions),
        {
          provide: DistributionLevelsService,
          useValue: {
            get: jest.fn()
          }
        }
      ]
    });

    actions = TestBed.inject(Actions);
    effects = TestBed.inject(DistributionLevelEffects);
    distributionLevelsService = TestBed.inject(DistributionLevelsService);
  });

  describe('loadDistributionLevels action should', () => {
    const distributionLevel = 'dLevel';
    const distributionLevels: string[] = [distributionLevel];

    test('dispatch loadDistributionLevelsSuccess action', () => {
      const triggerAction = DistributionLevelActions.loadDistributionLevels({ outletId: 'any_Id' });
      actions = hot('-a', { a: triggerAction });

      const distributionLevelResponse = cold('-b|', { b: distributionLevels });
      jest.spyOn(distributionLevelsService, 'get').mockReturnValue(distributionLevelResponse);

      const loadDistributionLevelsSuccess = DistributionLevelActions.loadDistributionLevelsSuccess({
        distributionLevels: distributionLevels
      });
      const expected = cold('--c', { c: loadDistributionLevelsSuccess });

      expect(effects.loadDistributionLevels).toBeObservable(expected);
    });

    test('dispatch loadDistributionLevelsFailure action if load failed', () => {
      const triggerAction = DistributionLevelActions.loadDistributionLevels({ outletId: 'any_Id' });
      actions = hot('-a', { a: triggerAction });

      const error = new Error('some error') as any;
      const distributionLevelResponse = cold('-#|', {}, error);
      jest.spyOn(distributionLevelsService, 'get').mockReturnValue(distributionLevelResponse);

      const loadDistributionLevelsFailure = DistributionLevelActions.loadDistributionLevelsFailure({
        error: error
      });
      const expected = cold('--b', { b: loadDistributionLevelsFailure });

      expect(effects.loadDistributionLevels).toBeObservable(expected);
    });
  });
});
