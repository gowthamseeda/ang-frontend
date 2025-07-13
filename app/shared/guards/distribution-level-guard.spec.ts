import {TestBed} from '@angular/core/testing';
import {cold} from 'jest-marbles';
import { of } from 'rxjs';

import { DistributionLevelsService } from '../../traits/distribution-levels/distribution-levels.service';
import { FeatureToggleService } from '../directives/feature-toggle/feature-toggle.service';

import { DistributionLevelGuard } from './distribution-level-guard.model';

describe('DistributionLevelGuard', () => {
  let distributionLevelGuard: DistributionLevelGuard;
  let distributionLevelsService: DistributionLevelsService;
  let featureToggleService: FeatureToggleService;
  const allowedDistributionLevels = ['RETAILER', 'APPLICANT'];
  const outletId = 'some id';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DistributionLevelGuard,
        {
          provide: DistributionLevelsService,
          useValue: {
            get: jest.fn()
          }
        },
        {
          provide: FeatureToggleService,
          useValue: {
            isFeatureEnabled: jest.fn()
          }
        }
      ]
    });

    distributionLevelGuard = TestBed.inject(DistributionLevelGuard);
    distributionLevelsService = TestBed.inject(DistributionLevelsService);
    featureToggleService = TestBed.inject(FeatureToggleService);
  });

  test('should be created', () => {
    expect(distributionLevelGuard).toBeTruthy();
  });

  describe('should allow navigation', () => {
    test('if outlet is a retailer', () => {
      jest.spyOn(featureToggleService, 'isFeatureEnabled').mockReturnValue(of(false));
      jest.spyOn(distributionLevelsService, 'get').mockReturnValue(of(['RETAILER']));
      const result = distributionLevelGuard.canAccess(outletId, allowedDistributionLevels);
      const expected = cold('(a|)', { a: true });
      expect(result).toBeObservable(expected);
    });

    test('if outlet is an applicant', () => {
      jest.spyOn(featureToggleService, 'isFeatureEnabled').mockReturnValue(of(false));
      jest.spyOn(distributionLevelsService, 'get').mockReturnValue(of(['APPLICANT']));
      const result = distributionLevelGuard.canAccess(outletId, allowedDistributionLevels);
      const expected = cold('(a|)', { a: true });
      expect(result).toBeObservable(expected);
    });

    test('if outlet is an retailer and also a wholesaler', () => {
      jest.spyOn(featureToggleService, 'isFeatureEnabled').mockReturnValue(of(false));
      jest.spyOn(distributionLevelsService, 'get').mockReturnValue(of(['RETAILER', 'WHOLESALER']));
      const result = distributionLevelGuard.canAccess(outletId, allowedDistributionLevels);
      const expected = cold('(a|)', { a: true });
      expect(result).toBeObservable(expected);
    });
  });

  describe('should not allow navigation', () => {
    test('if allowed distribution levels are not known', () => {
      jest.spyOn(featureToggleService, 'isFeatureEnabled').mockReturnValue(of(false));
      jest.spyOn(distributionLevelsService, 'get').mockReturnValue(of(['WHOLESALER']));
      const result = distributionLevelGuard.canAccess(outletId, []);
      const expected = cold('(a|)', { a: false });
      expect(result).toBeObservable(expected);
    });

    test('if allowed distribution levels of the outlet are not known', () => {
      jest.spyOn(featureToggleService, 'isFeatureEnabled').mockReturnValue(of(false));
      jest.spyOn(distributionLevelsService, 'get').mockReturnValue(of([]));
      const result = distributionLevelGuard.canAccess(outletId, allowedDistributionLevels);
      const expected = cold('(a|)', { a: false });
      expect(result).toBeObservable(expected);
    });

    test('if outlet is neither a retailer nor an applicant', () => {
      jest.spyOn(featureToggleService, 'isFeatureEnabled').mockReturnValue(of(false));
      jest
        .spyOn(distributionLevelsService, 'get')
        .mockReturnValue(of(['WHOLESALER', 'MANUFACTURER']));
      const result = distributionLevelGuard.canAccess(outletId, allowedDistributionLevels);
      const expected = cold('(a|)', { a: false });
      expect(result).toBeObservable(expected);
    });
  });

  describe('should allow navigation if service distribution level toggle is on', () => {
    test('if outlet is a WHOLESALER nor MANUFACTURER', () => {
      jest.spyOn(featureToggleService, 'isFeatureEnabled').mockReturnValue(of(true));
      jest.spyOn(distributionLevelsService, 'get').mockReturnValue(of(['WHOLESALER', 'MANUFACTURER']));
      const result = distributionLevelGuard.canAccess(outletId, allowedDistributionLevels);
      const expected = cold('(a|)', { a: true });
      expect(result).toBeObservable(expected);
    });
  });
});
