import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateService } from '@ngx-translate/core';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { of as observableOf } from 'rxjs';

import { UserAuthorizationService } from '../../../../iam/user/user-authorization.service';
import { DistributionLevelsService } from '../../../../traits/distribution-levels/distribution-levels.service';
import { OfferedServiceService } from '../../../offered-service/offered-service.service';

import { ServiceActionIconsComponent } from './service-action-icons.component';

describe('ServiceActionIconsComponent', () => {
  let component: ServiceActionIconsComponent;
  let fixture: ComponentFixture<ServiceActionIconsComponent>;
  let distributionLevelsServiceSpy: Spy<DistributionLevelsService>;
  let userAuthorizationServiceSpy: Spy<UserAuthorizationService>;
  let translateServiceSpy: Spy<TranslateService>;

  let offeredServiceServiceSpy: Spy<OfferedServiceService>;
  const iconAction = {
    icon: '',
    relativeTarget: '',
    permissions: observableOf(false),
    userIsAuthorized: observableOf(false)
  };

  beforeEach(waitForAsync(() => {
    offeredServiceServiceSpy = createSpyFromClass(OfferedServiceService);
    offeredServiceServiceSpy.isAtLeastOneOfferedForService.nextWith(true);
    offeredServiceServiceSpy.isOfferedServiceValidityMaintainedForService.nextWith(true);
    offeredServiceServiceSpy.isOfferedServiceOpeningHourMaintainedForService.nextWith(true);
    offeredServiceServiceSpy.isOfferedServiceContractsMaintainedForService.nextWith(true);
    offeredServiceServiceSpy.isOfferedServiceCommunicationsMaintainedForService.nextWith(true);

    distributionLevelsServiceSpy = createSpyFromClass(DistributionLevelsService);
    distributionLevelsServiceSpy.get.nextWith([]);

    userAuthorizationServiceSpy = createSpyFromClass(UserAuthorizationService);
    userAuthorizationServiceSpy.permissions.mockReturnThis();
    userAuthorizationServiceSpy.verify.nextWith(true);

    translateServiceSpy = createSpyFromClass(TranslateService);
    translateServiceSpy.get.nextWith('');

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      declarations: [ServiceActionIconsComponent],
      providers: [
        provideMockStore(),
        {
          provide: DistributionLevelsService,
          useValue: distributionLevelsServiceSpy
        },
        {
          provide: UserAuthorizationService,
          useValue: {
            isAuthorizedFor: userAuthorizationServiceSpy
          }
        },
        {
          provide: OfferedServiceService,
          useValue: offeredServiceServiceSpy
        },
        {
          provide: TranslateService,
          useValue: translateServiceSpy
        }
      ],
      imports: [RouterTestingModule.withRoutes([])],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceActionIconsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('iconClick()', () => {
    let router: jasmine.Spy;

    beforeEach(() => {
      router = spyOn(TestBed.inject(Router), 'navigate');
      component.productCategoryId = 1;
      component.serviceId = 71;
      fixture.detectChanges();
    });

    it('should route to validities with productCategoryId and serviceId', () => {
      component.iconClick({
        ...iconAction,
        icon: 'validity',
        relativeTarget: 'validities',
        tooltip: ''
      });
      expect(router).toHaveBeenCalledWith(
        ['validities'],
        expect.objectContaining({
          queryParams: {
            productCategoryId: 1,
            serviceId: 71
          }
        })
      );
    });

    it('should route to opening-hours with productCategoryId and serviceId if service supports it', () => {
      component.serviceSupportsClockAction = true;
      component.iconClick({
        ...iconAction,
        icon: 'clock',
        relativeTarget: 'opening-hours',
        tooltip: ''
      });
      expect(router).toHaveBeenCalledWith(
        ['opening-hours'],
        expect.objectContaining({
          queryParams: {
            productCategoryId: 1,
            serviceId: 71
          }
        })
      );
    });

    it('should not route to opening-hours if service does not support it', () => {
      component.iconClick({
        ...iconAction,
        icon: 'clock',
        relativeTarget: 'opening-hours',
        tooltip: ''
      });
      expect(router).not.toHaveBeenCalled();
    });

    it('should route to contracts with productCategoryId and serviceId', () => {
      component.iconClick({
        ...iconAction,
        icon: 'contract',
        relativeTarget: 'contracts',
        tooltip: ''
      });
      expect(router).toHaveBeenCalledWith(
        ['contracts'],
        expect.objectContaining({
          queryParams: {
            productCategoryId: 1,
            serviceId: 71
          }
        })
      );
    });

    it('should route to communication with productCategoryId and serviceId', () => {
      component.iconClick({
        ...iconAction,
        icon: 'contact',
        relativeTarget: 'communication',
        tooltip: ''
      });
      expect(router).toHaveBeenCalledWith(
        ['communication'],
        expect.objectContaining({
          queryParams: {
            productCategoryId: 1,
            serviceId: 71
          }
        })
      );
    });
  });
});

/*describe('ServiceActionIconsComponent', () => {
  it('should create', () => {
    // Test case code
    expect(true).toBe(true);
  });
});*/
