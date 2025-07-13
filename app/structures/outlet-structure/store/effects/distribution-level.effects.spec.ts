import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jest-marbles';
import { Observable } from 'rxjs';

import { DistributionLevelsService } from '../../../../traits/distribution-levels/distribution-levels.service';
import { DistributionLevelActions, OutletStructureActions } from '../actions';

import { DistributionLevelEffects } from './distribution-level.effects';

describe('Outlet structure distribution level effects test suite', () => {
  let effects: DistributionLevelEffects;
  let actions: Observable<any>;
  let distributionLevelService: DistributionLevelsService;

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

    effects = TestBed.inject(DistributionLevelEffects);
    actions = TestBed.inject(Actions);
    distributionLevelService = TestBed.inject(DistributionLevelsService);
  });

  describe('loadOutletStructure', () => {
    const distributionLevelsMock: string[] = [];

    test('should return loadDistributionLevelSuccess on success', () => {
      const triggerAction = OutletStructureActions.loadOutletStructures({
        outletId: 'any_outletId'
      });

      actions = hot('a', { a: triggerAction });

      const distributionLvlSrvResponse = cold('-b|', { b: distributionLevelsMock });
      jest.spyOn(distributionLevelService, 'get').mockReturnValue(distributionLvlSrvResponse);

      const successAction = DistributionLevelActions.loadDistributionLevelSuccess({
        distributionLevels: distributionLevelsMock
      });
      const expected = cold('-c', { c: successAction });

      expect(effects.loadDistributionLevels).toBeObservable(expected);
    });

    test('should return loadDistributionLevelFailure on error', () => {
      const triggerAction = OutletStructureActions.loadOutletStructures({
        outletId: 'any_outletId'
      });

      actions = hot('a', { a: triggerAction });

      const error = new Error('some error');
      const distributionLvlSrvResponse = cold('-#|', {}, error);
      jest.spyOn(distributionLevelService, 'get').mockReturnValue(distributionLvlSrvResponse);

      const failureAction = DistributionLevelActions.loadDistributionLevelFailure({
        error: error
      });
      const expected = cold('-c', { c: failureAction });

      expect(effects.loadDistributionLevels).toBeObservable(expected);
    });
  });
});
