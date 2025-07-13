import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { UserAuthorizationService } from '../../../../iam/user/user-authorization.service';
import { DistributionLevelsService } from '../../../../traits/distribution-levels/distribution-levels.service';
import { OfferedServiceMock } from '../../../offered-service/offered-service.mock';
import { OfferedServiceService } from '../../../offered-service/offered-service.service';
import { ServiceVariantMock } from '../../../service-variant/service-variant.mock';
import { ServiceVariantService } from '../../../service-variant/service-variant.service';

import { OfferedServiceComponent } from './offered-service.component';

describe('OfferedServiceComponent', () => {
  const offeredServices = OfferedServiceMock.asList();
  let component: OfferedServiceComponent;
  let fixture: ComponentFixture<OfferedServiceComponent>;

  let userAuthorizationServiceSpy: Spy<UserAuthorizationService>;
  let offeredServiceServiceSpy: Spy<OfferedServiceService>;
  let serviceVariantServiceSpy: Spy<ServiceVariantService>;
  let distributionLevelServiceSpy: Spy<DistributionLevelsService>;

  beforeEach(() => {
    userAuthorizationServiceSpy = createSpyFromClass(UserAuthorizationService);

    offeredServiceServiceSpy = createSpyFromClass(OfferedServiceService);
    offeredServiceServiceSpy.getId.nextWith(undefined);

    serviceVariantServiceSpy = createSpyFromClass(ServiceVariantService);
    serviceVariantServiceSpy.getBy.nextWith(ServiceVariantMock.asList()[4]);

    distributionLevelServiceSpy = createSpyFromClass(DistributionLevelsService);
    distributionLevelServiceSpy.getDistributionLevelsOfOutlet.nextWith([]);

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      declarations: [OfferedServiceComponent],
      providers: [
        { provide: UserAuthorizationService, useValue: userAuthorizationServiceSpy },
        { provide: OfferedServiceService, useValue: offeredServiceServiceSpy },
        { provide: ServiceVariantService, useValue: serviceVariantServiceSpy },
        { provide: DistributionLevelsService, useValue: distributionLevelServiceSpy },
        provideMockStore()
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferedServiceComponent);
    component = fixture.componentInstance;

    component.productCategoryId = 2;
    component.serviceId = offeredServices[4].serviceId;
    component.brandId = offeredServices[4].brandId;
    component.productGroupId = offeredServices[4].productGroupId;
    component.countryId = 'CH';
    component.outletId = 'GS001';
    component.showAddIcon = true;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('should init the service variant', done => {
      component.serviceVariant.subscribe(serviceVariant => {
        expect(serviceVariant).toEqual(ServiceVariantMock.asList()[4]);
        done();
      });
    });

    it('should init the offered service ID by combining the outlet ID and service variant ID', done => {
      component.offeredServiceId.subscribe(offeredServiceId => {
        expect(offeredServiceId).toEqual('GS001-5');
        done();
      });
    });

    it('should init isAssignable as true if service variant is active', done => {
      component.isAssignable.subscribe(isAssignable => {
        expect(isAssignable).toBeTruthy();
        done();
      });
    });
  });
});
