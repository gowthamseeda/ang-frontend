import { of } from 'rxjs';
import { cold } from 'jest-marbles';
import { TestBed } from '@angular/core/testing';
import { FeatureToggleService } from './../directives/feature-toggle/feature-toggle.service';
import { FeatureToggleGuard } from './feature-toggle-guard.model';

describe('FeatureToggleGuard', () => {
  let featureToggleGuard: FeatureToggleGuard;
  let featureToggleService: FeatureToggleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FeatureToggleGuard,
        {
          provide: FeatureToggleService,
          useValue: {
            isFeatureEnabled: jest.fn()
          }
        }
      ]
    });

    featureToggleGuard = TestBed.inject(FeatureToggleGuard);
    featureToggleService = TestBed.inject(FeatureToggleService);
  });

  test('should be created', () => {
    expect(featureToggleGuard).toBeTruthy();
  });

  test('should allow navigation if the feature is enabled', () => {
    jest.spyOn(featureToggleService, 'isFeatureEnabled').mockReturnValue(of(true));
    const result = featureToggleGuard.canAccess('enabled feature');
    const expected = cold('(a|)', { a: true });
    expect(result).toBeObservable(expected);
  });

  test('should not allow navigation if the feature is disabled', () => {
    jest.spyOn(featureToggleService, 'isFeatureEnabled').mockReturnValue(of(false));
    const result = featureToggleGuard.canAccess('disabled feature');
    const expected = cold('(a|)', { a: false });
    expect(result).toBeObservable(expected);
  });
});
