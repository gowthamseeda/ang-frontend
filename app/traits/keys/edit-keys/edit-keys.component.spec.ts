import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService
} from '@ngx-translate/core';
import { createSpyFromClass, provideAutoSpy, Spy } from 'jest-auto-spies';
import { of } from 'rxjs';

import { UserAuthorizationService } from '../../../iam/user/user-authorization.service';
import { getOutletMock } from '../../../legal-structure/shared/models/outlet.mock';
import { OutletService } from '../../../legal-structure/shared/services/outlet.service';
import { FeatureToggleService } from '../../../shared/directives/feature-toggle/feature-toggle.service';
import { TestingModule } from '../../../testing/testing.module';
import { DistributionLevelsService } from '../../distribution-levels/distribution-levels.service';

import { EditKeysComponent } from './edit-keys.component';

class ActivatedRouteStub {
  paramMap = of({
    get: (value: any) => {
      return value === 'outletId' ? 'GS0000001' : null;
    }
  });

  fragment = of('myFragment');
}

describe('EditKeysComponent', () => {
  let component: EditKeysComponent;
  let fixture: ComponentFixture<EditKeysComponent>;
  let outletServiceSpy: Spy<OutletService>;
  let userAuthorizationServiceSpy: Spy<UserAuthorizationService>;
  let distributionLevelsServiceSpy: Spy<DistributionLevelsService>;
  let featureToggleService: Spy<FeatureToggleService>;

  beforeEach(
    waitForAsync(() => {
      outletServiceSpy = createSpyFromClass(OutletService);
      userAuthorizationServiceSpy = createSpyFromClass(UserAuthorizationService);
      userAuthorizationServiceSpy.permissions.mockReturnValue(userAuthorizationServiceSpy);
      userAuthorizationServiceSpy.businessSite.mockReturnValue(userAuthorizationServiceSpy);
      userAuthorizationServiceSpy.country.mockReturnValue(userAuthorizationServiceSpy);
      userAuthorizationServiceSpy.distributionLevels.mockReturnValue(userAuthorizationServiceSpy);
      distributionLevelsServiceSpy = createSpyFromClass(DistributionLevelsService);
      distributionLevelsServiceSpy.getDistributionLevelsOfOutlet.nextWith([]);

      TestBed.configureTestingModule({
        declarations: [EditKeysComponent],
        imports: [
          TestingModule,
          TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useClass: TranslateFakeLoader
            }
          })
        ],
        providers: [
          provideAutoSpy(FeatureToggleService),
          TranslateService,
          { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
          { provide: OutletService, useValue: outletServiceSpy },
          {
            provide: UserAuthorizationService,
            useValue: {
              isAuthorizedFor: userAuthorizationServiceSpy
            }
          },
          { provide: DistributionLevelsService, useValue: distributionLevelsServiceSpy }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();

      outletServiceSpy.getOrLoadBusinessSite.nextWith(getOutletMock());
      distributionLevelsServiceSpy.getDistributionLevelsOfOutlet.nextWith([]);
      userAuthorizationServiceSpy.verify.nextWith(true);
      featureToggleService = TestBed.inject<any>(FeatureToggleService);
      featureToggleService.isFocusFeatureEnabled.nextWith(true);
      fixture = TestBed.createComponent(EditKeysComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set outlet id', done => {
    component.outlet.subscribe(outlet => {
      expect(outlet.id).toEqual('7654321');
      done();
    });
  });

  it('should set country id', done => {
    component.outlet.subscribe(outlet => {
      expect(outlet.countryId).toEqual('CH');
      done();
    });
  });

  describe('isNotAuthorizedForBusinessSite', () => {
    test('should be false if user has permissions', done => {
      component.isNotAuthorizedForBusinessSite.subscribe(isNotAuthorizedForBusinessSite => {
        expect(isNotAuthorizedForBusinessSite).toBeFalsy();
        done();
      });
    });
    test('should be true if user has no permissions', done => {
      userAuthorizationServiceSpy.verify.nextWith(false);
      component.isNotAuthorizedForBusinessSite.subscribe(isNotAuthorizedForBusinessSite => {
        expect(isNotAuthorizedForBusinessSite).toBeTruthy();
        done();
      });
    });
  });
});
