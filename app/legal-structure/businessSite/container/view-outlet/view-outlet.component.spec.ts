import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TranslateService } from '@ngx-translate/core';
import { createSpyFromClass, provideAutoSpy, Spy } from 'jest-auto-spies';
import {BehaviorSubject} from 'rxjs';

import { UserAuthorizationService } from '../../../../iam/user/user-authorization.service';
import { OfferedServiceService } from '../../../../services/offered-service/offered-service.service';
import { ServiceVariantService } from '../../../../services/service-variant/service-variant.service';
import { FeatureToggleService } from '../../../../shared/directives/feature-toggle/feature-toggle.service';
import { getSubOutlet_GS000100 } from '../../../../structures/outlet-structure/model/outlet-structure.mock';
import { OutletStructureService } from '../../../../structures/outlet-structure/services/outlet-structure.service';
import { TestingModule } from '../../../../testing/testing.module';
import { LabelService } from '../../../../traits/label/label.service';
import { LegalStructureRoutingService } from '../../../legal-structure-routing.service';
import { getAddressFormMock } from '../../../shared/components/address/address.mock';
import { getOutletMock } from '../../../shared/models/outlet.mock';
import { LegalStructureState } from '../../../store';
import { getInitialState } from '../../../store/legal-structure-state.mock';
import { getCountryMock } from '../../models/country.mock';
import { BusinessSiteStoreService } from '../../services/business-site-store.service';
import { NavigationPermissionsService } from '../../services/navigation-permission.service';
import { NavigationPermissions } from '../../services/navigation-permissions.model';
import {
  selectAddressState,
  selectBrandIdsState,
  selectBusinessNamesState,
  selectCountryState,
  selectDistributionLevelsState,
  selectIsOutletLoadingState
} from '../../store/selectors';

import { ViewOutletComponent } from './view-outlet.component';
import { ExternalKeyTypeService } from "../../../../traits/keys/external-key-type-selection/external-key-type.service";
import {BusinessSiteTaskService} from "../../../../tasks/shared/business-site-task.service";

class LegalStructureRoutingServiceStub {
  outletIdChanges = new BehaviorSubject<string>('');
}

describe('ViewOutletComponents', () => {
  let component: ViewOutletComponent;
  let fixture: ComponentFixture<ViewOutletComponent>;

  let outletServiceSpy: Spy<BusinessSiteStoreService>;
  let labelServiceSpy: Spy<LabelService>;
  let structureStoreServiceSpy: Spy<OutletStructureService>;
  let translateServiceSpy: Spy<TranslateService>;
  let store: MockStore<LegalStructureState>;
  let navigationPermissionServiceSpy: Spy<NavigationPermissionsService>;
  let userAuthorizationServiceSpy: Spy<UserAuthorizationService>;
  let offeredServiceServiceSpy: Spy<OfferedServiceService>;
  let serviceVariantServiceSpy: Spy<ServiceVariantService>;
  let featureToggleServiceSpy: Spy<FeatureToggleService>;
  let externalKeyTypeServiceSpy: Spy<ExternalKeyTypeService>;
  let businessSiteTaskServiceSpy: Spy<BusinessSiteTaskService>;

  const initialState = getInitialState();

  const navigationInfoMock: NavigationPermissions = {
    servicesEnabled: true,
    shareHolderEnabled: true,
    assignedBrandLabelsEnabled: true,
    outletRelationshipsEnabled: true,
    historizationEnabled: true
  };

  beforeEach(waitForAsync(() => {
    navigationPermissionServiceSpy = createSpyFromClass(NavigationPermissionsService);
    navigationPermissionServiceSpy.getPermissions.nextWith(navigationInfoMock);

    labelServiceSpy = createSpyFromClass(LabelService);
    labelServiceSpy.getAllAssignable.nextWith([]);

    structureStoreServiceSpy = createSpyFromClass(OutletStructureService);
    structureStoreServiceSpy.getSelectedOutlet.nextWith(getSubOutlet_GS000100());
    structureStoreServiceSpy.getSelectedOutletMarketStructureTags.nextWith([]);
    structureStoreServiceSpy.getAvailableActionsOfSelectedOutlet.nextWith([]);

    translateServiceSpy = createSpyFromClass(TranslateService);

    userAuthorizationServiceSpy = createSpyFromClass(UserAuthorizationService);
    userAuthorizationServiceSpy.permissions.mockReturnValue(userAuthorizationServiceSpy);
    userAuthorizationServiceSpy.businessSite.mockReturnValue(userAuthorizationServiceSpy);
    userAuthorizationServiceSpy.country.mockReturnValue(userAuthorizationServiceSpy);
    userAuthorizationServiceSpy.distributionLevels.mockReturnValue(userAuthorizationServiceSpy);
    userAuthorizationServiceSpy.verify.nextWith(false);

    offeredServiceServiceSpy = createSpyFromClass(OfferedServiceService);
    offeredServiceServiceSpy.isEmpty.nextWith(true);

    serviceVariantServiceSpy = createSpyFromClass(ServiceVariantService);
    serviceVariantServiceSpy.isEmpty.nextWith(true);

    featureToggleServiceSpy = createSpyFromClass(FeatureToggleService);
    featureToggleServiceSpy.isFeatureEnabled.nextWith(true);

    externalKeyTypeServiceSpy = createSpyFromClass(ExternalKeyTypeService)
    externalKeyTypeServiceSpy.getAll.nextWith([]);

    businessSiteTaskServiceSpy = createSpyFromClass(BusinessSiteTaskService);
    businessSiteTaskServiceSpy.findAllDataVerificationFields.nextWith();

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      declarations: [ViewOutletComponent],
      imports: [RouterTestingModule.withRoutes([]), TestingModule],
      providers: [
        provideMockStore({ initialState }),
        {
          provide: LegalStructureRoutingService,
          useValue: new LegalStructureRoutingServiceStub()
        },
        provideAutoSpy(BusinessSiteStoreService),
        { provide: LabelService, useValue: labelServiceSpy },
        { provide: OutletStructureService, useValue: structureStoreServiceSpy },
        { provide: NavigationPermissionsService, useValue: navigationPermissionServiceSpy },
        { provide: TranslateService, useValue: translateServiceSpy },
        {
          provide: UserAuthorizationService,
          useValue: { isAuthorizedFor: userAuthorizationServiceSpy }
        },
        { provide: ServiceVariantService, useValue: serviceVariantServiceSpy },
        { provide: OfferedServiceService, useValue: offeredServiceServiceSpy },
        { provide: FeatureToggleService, useValue: featureToggleServiceSpy },
        { provide: ExternalKeyTypeService, useValue: externalKeyTypeServiceSpy },
        { provide: BusinessSiteTaskService, useValue: businessSiteTaskServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    store.overrideSelector(selectIsOutletLoadingState, false);
    store.overrideSelector(selectDistributionLevelsState, []);
    store.overrideSelector(selectAddressState, {
      ...getAddressFormMock().addresses[0],
      countryName: ''
    });
    store.overrideSelector(selectCountryState, getCountryMock());
    store.overrideSelector(selectBusinessNamesState, []);
    store.overrideSelector(selectBrandIdsState, []);

    outletServiceSpy = TestBed.inject<any>(BusinessSiteStoreService);
    outletServiceSpy.getOutlet.nextWith(getOutletMock());
    outletServiceSpy.getDistributionLevels.nextWith(['RETAILER']);

    fixture = TestBed.createComponent(ViewOutletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test('should load the outlet with the ID from the route parameter', done => {
      component.outlet.subscribe(outlet => {
        expect(outlet).toEqual(getOutletMock());
        done();
      });
    });
  });
  describe('hasUserUpdatePermissions', () => {
    test('should return false', () => {
      expect(component.hasUserUpdatePermission).toBeFalsy();
    });
    test('should return true', () => {
      userAuthorizationServiceSpy.verify.nextWith(true);
      expect(component.hasUserUpdatePermission).toBeTruthy();
    });
  });

  describe('hasUserTasksUpdatePermissions', () => {
    test('should return false', () => {
      expect(component.hasUserTasksUpdatePermission).toBeFalsy();
    });
    test('should return true', () => {
      userAuthorizationServiceSpy.verify.nextWith(true);
      expect(component.hasUserTasksUpdatePermission).toBeTruthy();
    });
  });

  describe('featureToggleForOpenTask', () => {
    test('should return true', () => {
      expect(component.tasksFeatureToggleFlag).toBeTruthy();
    });
  });
});
