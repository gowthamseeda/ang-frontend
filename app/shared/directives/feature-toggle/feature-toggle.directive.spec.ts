import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { FeatureToggleDirective } from './feature-toggle.directive';
import { FeatureToggleService } from './feature-toggle.service';
import { FEATURE_NAMES } from "../../model/constants";

@Component({
  template: '<div id="test-id" *gpFeatureToggle="featureName; reverse: reverse"></div>'
})
class TestFeatureToggleContainerComponent {
  featureName: string;
  reverse = false;
}

describe('Feature Toggle', () => {
  let fixture: ComponentFixture<TestFeatureToggleContainerComponent>;
  let featureToggleServiceSpy: Spy<FeatureToggleService>;

  beforeEach(
    waitForAsync(() => {
      featureToggleServiceSpy = createSpyFromClass(FeatureToggleService);

      TestBed.configureTestingModule({
        declarations: [TestFeatureToggleContainerComponent, FeatureToggleDirective],
        providers: [
          {
            provide: FeatureToggleService,
            useValue: featureToggleServiceSpy
          }
        ]
      }).compileComponents();
      fixture = TestBed.createComponent(TestFeatureToggleContainerComponent);
    })
  );

  describe('feature name set', () => {
    it('div should be included in DOM', () => {
      featureToggleServiceSpy.isFeatureEnabled.nextWith(true);
      fixture.componentInstance.featureName = FEATURE_NAMES.DOWNTIME_ADVANCE_NOTIFICATION;
      fixture.detectChanges();
      expect(fixture.debugElement.queryAll(By.css('#test-id')).length).toEqual(1);
    });

    it('div should not be included in DOM', () => {
      featureToggleServiceSpy.isFeatureEnabled.nextWith(true);
      fixture.componentInstance.featureName = FEATURE_NAMES.DOWNTIME_ADVANCE_NOTIFICATION;
      fixture.componentInstance.reverse = true;
      expect(fixture.debugElement.queryAll(By.css('#test-id')).length).toEqual(0);
    });
  });

  describe('feature name not set', () => {
    it('div should not be included in DOM', () => {
      fixture.componentInstance.featureName = '';
      expect(fixture.debugElement.queryAll(By.css('#test-id')).length).toEqual(0);
    });
  });

  describe('feature is disabled', () => {
    it('div should not be included in DOM', () => {
      featureToggleServiceSpy.isFeatureEnabled.nextWith(false);
      fixture.componentInstance.featureName = FEATURE_NAMES.DOWNTIME_ADVANCE_NOTIFICATION;
      expect(fixture.debugElement.queryAll(By.css('#test-id')).length).toEqual(0);
    });
  });
});
