import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { of } from 'rxjs';

import { FeatureToggleService } from '../../shared/directives/feature-toggle/feature-toggle.service';
import { TranslatePipeMock } from '../../testing/pipe-mocks/translate';

import { UserDataRestrictionsComponent } from './user-data-restrictions.component';

describe('UserDataRestrictionsComponent', () => {
  let component: UserDataRestrictionsComponent;
  let fixture: ComponentFixture<UserDataRestrictionsComponent>;
  let featureToggleServiceSpy: Spy<FeatureToggleService>;

  beforeEach(
    waitForAsync(() => {
      featureToggleServiceSpy = createSpyFromClass(FeatureToggleService);
      featureToggleServiceSpy.isFeatureEnabled.nextWith(true);

      TestBed.configureTestingModule({
        declarations: [UserDataRestrictionsComponent, TranslatePipeMock],
        imports: [NoopAnimationsModule, RouterTestingModule.withRoutes([])],
        providers: [
          UntypedFormBuilder,
          {
            provide: ActivatedRoute,
            useValue: {
              paramMap: of(convertToParamMap({ id: '' }))
            }
          },
          { provide: FeatureToggleService, useValue: featureToggleServiceSpy }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDataRestrictionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize userId and focus feature toggle', () => {
      component.focusFeatureToggleFlag.subscribe(isToggled => {
        expect(isToggled).toEqual(true);
      });

      expect(component.userId).toEqual('');
    });
  });
});
