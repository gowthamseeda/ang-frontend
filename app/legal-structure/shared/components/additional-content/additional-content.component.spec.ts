import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { FeatureToggleDirective } from '../../../../shared/directives/feature-toggle/feature-toggle.directive';
import { FeatureToggleService } from '../../../../shared/directives/feature-toggle/feature-toggle.service';

import { AdditionalContentComponent } from './additional-content.component';
import {BaseData4rService} from "../../../outlet/base-data-4r.service";
import {createSpyFromClass, Spy} from "jest-auto-spies";

describe('AdditionalContentComponent', () => {
  let component: AdditionalContentComponent;
  let featureToggleService: FeatureToggleService;
  let baseData4rServiceSpy: Spy<BaseData4rService>;

  beforeEach(() => {
    baseData4rServiceSpy = createSpyFromClass(BaseData4rService);
    baseData4rServiceSpy.isOpenVerificationTaskByAggregateField.mockReturnValue(of(true));
    TestBed.configureTestingModule({
      declarations: [FeatureToggleDirective],
      providers: [
        AdditionalContentComponent,
        { provide: FeatureToggleService, useValue: { isFeatureEnabled: jest.fn() }},
        { provide: BaseData4rService, useValue: baseData4rServiceSpy}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    component = TestBed.inject(AdditionalContentComponent);
    featureToggleService = TestBed.inject(FeatureToggleService);
    jest.spyOn(featureToggleService, 'isFeatureEnabled').mockReturnValue(of(false));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
