import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Spy, createSpyFromClass } from 'jest-auto-spies';

import { RetailRolloutService } from '../../../iam/shared/services/retail-rollout/retail-rollout.service';
import { UserAuthorizationService } from '../../../iam/user/user-authorization.service';
import { OfferedServiceService } from '../../../services/offered-service/offered-service.service';
import { ServiceVariantService } from '../../../services/service-variant/service-variant.service';
import { FeatureToggleService } from '../../../shared/directives/feature-toggle/feature-toggle.service';
import { DistributionLevelsService } from '../../../traits/distribution-levels/distribution-levels.service';

import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { BehaviorSubject } from 'rxjs';
import { LabelService } from '../../../traits/label/label.service';
import { LegalStructureRoutingService } from '../../legal-structure-routing.service';
import { LegalStructureState } from '../../store';
import { getInitialState } from '../../store/legal-structure-state.mock';
import { getCountryMock } from '../models/country.mock';
import { selectCountryState, selectDistributionLevelsState } from '../store/selectors';
import { BusinessSiteStoreService } from './business-site-store.service';
import { NavigationPermissionsService } from './navigation-permission.service';

describe('NavigationPermissionsService', () => {
  let navigationPermissionsService: NavigationPermissionsService;

  let businessSiteStoreServiceSpy: Spy<BusinessSiteStoreService>;
  let featureToggleServiceSpy: Spy<FeatureToggleService>;
  let userAuthorizationServiceSpy: Spy<UserAuthorizationService>;
  let retailRolloutServiceSpy: Spy<RetailRolloutService>;
  let offeredServiceServiceSpy: Spy<OfferedServiceService>;
  let serviceVariantServiceSpy: Spy<ServiceVariantService>;
  let distributionLevelsServiceSpy: Spy<DistributionLevelsService>;
  let store: MockStore<LegalStructureState>;
  let labelServiceSpy: Spy<LabelService>;

  const initialState = getInitialState();

  beforeEach(() => {
    businessSiteStoreServiceSpy = createSpyFromClass(BusinessSiteStoreService);
    businessSiteStoreServiceSpy.getOutlet.nextWith({
      legalName: 'test',
      companyLegalName: 'test legal Name',
      companyId: 'GC1',
      countryId: 'DE',
      address: {
        street: 'Mount Road',
        streetNumber: '111',
        zipCode: '2121',
        city: 'Ulm',
        district: 'Ermingen',
        addressAddition: 'No. 9'
      },
      id: 'GS1',
      affiliate: true
    });

    featureToggleServiceSpy = createSpyFromClass(FeatureToggleService);
    featureToggleServiceSpy.isFeatureEnabled.nextWith(true);

    userAuthorizationServiceSpy = createSpyFromClass(UserAuthorizationService);
    userAuthorizationServiceSpy.verify.nextWith(true);

    retailRolloutServiceSpy = createSpyFromClass(RetailRolloutService);
    offeredServiceServiceSpy = createSpyFromClass(OfferedServiceService);
    serviceVariantServiceSpy = createSpyFromClass(ServiceVariantService);
    distributionLevelsServiceSpy = createSpyFromClass(DistributionLevelsService);
    labelServiceSpy = createSpyFromClass(LabelService);
    labelServiceSpy.getAllAssignable.nextWith([]);

    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        NavigationPermissionsService,
        {
          provide: UserAuthorizationService,
          useValue: {
            isAuthorizedFor: {
              permissions: () => userAuthorizationServiceSpy,
              businessSite: () => userAuthorizationServiceSpy,
              country: () => userAuthorizationServiceSpy,
              observableDistributionLevels: () => userAuthorizationServiceSpy
            }
          }
        },
        { provide: RetailRolloutService, useValue: retailRolloutServiceSpy },
        { provide: FeatureToggleService, useValue: featureToggleServiceSpy },
        { provide: BusinessSiteStoreService, useValue: businessSiteStoreServiceSpy },
        { provide: OfferedServiceService, useValue: offeredServiceServiceSpy },
        { provide: ServiceVariantService, useValue: serviceVariantServiceSpy },
        { provide: DistributionLevelsService, useValue: distributionLevelsServiceSpy },
        { provide: LabelService, useValue: labelServiceSpy },
        provideMockStore({ initialState }),
        {
          provide: LegalStructureRoutingService,
          useValue: new LegalStructureRoutingServiceStub()
        }
      ]
    });

    navigationPermissionsService = TestBed.inject(NavigationPermissionsService);
  });

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    store.overrideSelector(selectDistributionLevelsState, []);
    store.overrideSelector(selectCountryState, getCountryMock());
  });

  class LegalStructureRoutingServiceStub {
    outletIdChanges = new BehaviorSubject<string>('');
  }

  test('should be created', () => {
    expect(navigationPermissionsService).toBeTruthy();
  });
});
