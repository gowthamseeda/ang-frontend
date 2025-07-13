import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService
} from '@ngx-translate/core';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { NgxPermissionsAllowStubDirective } from 'ngx-permissions';
import { of } from 'rxjs';

import { UserAuthorizationService } from '../../../iam/user/user-authorization.service';
import { getOutletMock } from '../../../legal-structure/shared/models/outlet.mock';
import { OutletService } from '../../../legal-structure/shared/services/outlet.service';
import { DistributionLevelsService } from '../../distribution-levels/distribution-levels.service';

import { EditLabelsComponent } from './edit-labels.component';

class ActivatedRouteStub {
  paramMap = of({
    get: (value: any) => {
      return value === 'outletId' ? 'GS0000001' : null;
    }
  });

  fragment = of('myFragment');
}

describe('EditLabelsComponent', () => {
  let component: EditLabelsComponent;
  let fixture: ComponentFixture<EditLabelsComponent>;

  let outletServiceSpy: Spy<OutletService>;
  let userAuthorizationServiceSpy: Spy<UserAuthorizationService>;
  let distributionLevelsServiceSpy: Spy<DistributionLevelsService>;

  beforeEach(
    waitForAsync(() => {
      outletServiceSpy = createSpyFromClass(OutletService);
      userAuthorizationServiceSpy = createSpyFromClass(UserAuthorizationService);
      distributionLevelsServiceSpy = createSpyFromClass(DistributionLevelsService);

      TestBed.configureTestingModule({
        declarations: [EditLabelsComponent, NgxPermissionsAllowStubDirective],
        imports: [
          TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useClass: TranslateFakeLoader
            }
          })
        ],
        providers: [
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
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    outletServiceSpy.getOrLoadBusinessSite.nextWith(getOutletMock());

    userAuthorizationServiceSpy.permissions.mockReturnValue(userAuthorizationServiceSpy);
    userAuthorizationServiceSpy.businessSite.mockReturnValue(userAuthorizationServiceSpy);
    userAuthorizationServiceSpy.observableCountry.mockReturnValue(userAuthorizationServiceSpy);
    userAuthorizationServiceSpy.observableDistributionLevels.mockReturnValue(
      userAuthorizationServiceSpy
    );
    userAuthorizationServiceSpy.verify.nextWith(true);

    fixture = TestBed.createComponent(EditLabelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the outlet id', () => {
    expect(component.outletId).toEqual('GS0000001');
  });

  it('should set the country id', done => {
    component.countryId.subscribe(countryId => {
      expect(countryId).toEqual('CH');
      done();
    });
  });
});
