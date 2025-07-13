import { TestBed } from '@angular/core/testing';

import { TestingModule } from '../../../testing/testing.module';
import { ApiService } from '../../services/api/api.service';
import { LoggingService } from '../../services/logging/logging.service';

import { FeatureToggleService } from './feature-toggle.service';
import { FEATURE_NAMES } from '../../model/constants';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

describe('FeatureToggleService', () => {
  let featureToggleService: FeatureToggleService;
  let apiServiceSpy: Spy<ApiService>;

  beforeEach(() => {
    apiServiceSpy = createSpyFromClass(ApiService);

    TestBed.configureTestingModule({
      imports: [TestingModule],
      providers: [
        { provide: ApiService, useValue: apiServiceSpy },
        LoggingService,
        FeatureToggleService
      ]
    });
    featureToggleService = TestBed.inject(FeatureToggleService);
  });

  it('should create', () => {
    expect(featureToggleService).toBeTruthy();
  });

  it('should get false for feature DOWNTIME_ADVANCE_NOTIFICATION', done => {
    apiServiceSpy.get.nextWith({ enabled: false })

    featureToggleService
      .isFeatureEnabled(FEATURE_NAMES.DOWNTIME_ADVANCE_NOTIFICATION)
      .subscribe(enabled => {
        expect(enabled).toBeFalsy();
        done();
      });
  });

  it('should get true for feature FOCUS', done => {
    apiServiceSpy.get.nextWith({ enabled: true })

    featureToggleService.isFocusFeatureEnabled().subscribe(enabled => {
      expect(enabled).toBeTruthy();
      done();
    });
  });
});
