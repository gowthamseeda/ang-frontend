import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { UserAuthorizationService } from '../../../../iam/user/user-authorization.service';
import { DistributionLevelsService } from '../../../../traits/distribution-levels/distribution-levels.service';
import { OfferedServiceService } from '../../../offered-service/offered-service.service';
import { ServiceVariantMock } from '../../../service-variant/service-variant.mock';
import { ServiceVariantService } from '../../../service-variant/service-variant.service';
import { MultiSelectDataService } from '../../services/multi-select-service-data.service';

import { CopyOfferedServiceComponent } from './copy-offered-service.component';

describe('CopyOfferedServiceComponent', () => {
  let component: CopyOfferedServiceComponent;
  let offeredServiceServiceSpy: Spy<OfferedServiceService>;
  let userAuthorizationServiceSpy: Spy<UserAuthorizationService>;
  let serviceVariantServiceSpy: Spy<ServiceVariantService>;
  let distributionLevelsServiceSpy: Spy<DistributionLevelsService>;
  let fixture: ComponentFixture<CopyOfferedServiceComponent>;

  beforeEach(async () => {
    userAuthorizationServiceSpy = createSpyFromClass(UserAuthorizationService);

    offeredServiceServiceSpy = createSpyFromClass(OfferedServiceService);
    offeredServiceServiceSpy.getId.nextWith(undefined);

    serviceVariantServiceSpy = createSpyFromClass(ServiceVariantService);
    serviceVariantServiceSpy.getBy.nextWith(ServiceVariantMock.asList()[4]);

    distributionLevelsServiceSpy = createSpyFromClass(DistributionLevelsService);
    distributionLevelsServiceSpy.getDistributionLevelsOfOutlet.nextWith([]);

    await TestBed.configureTestingModule({
      declarations: [CopyOfferedServiceComponent],
      providers: [
        { provide: OfferedServiceService, useValue: offeredServiceServiceSpy },
        { provide: UserAuthorizationService, useValue: userAuthorizationServiceSpy },
        { provide: ServiceVariantService, useValue: serviceVariantServiceSpy },
        { provide: DistributionLevelsService, useValue: distributionLevelsServiceSpy },
        MultiSelectDataService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyOfferedServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
