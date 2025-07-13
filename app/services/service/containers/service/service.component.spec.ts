import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormBuilder} from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { of } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

import { appConfigMock } from '../../../../app-config.mock';
import { AppConfigProvider } from '../../../../app-config.service';
import { UserAuthorizationService } from '../../../../iam/user/user-authorization.service';
import { getOutletMock } from '../../../../legal-structure/shared/models/outlet.mock';
import { OutletService } from '../../../../legal-structure/shared/services/outlet.service';
import { FeatureToggleService } from '../../../../shared/directives/feature-toggle/feature-toggle.service';
import { TranslatePipeMock } from '../../../../testing/pipe-mocks/translate';
import { DistributionLevelsService } from '../../../../traits/distribution-levels/distribution-levels.service';
import { OfferedServiceService } from '../../../offered-service/offered-service.service';
import { ServiceVariantService } from '../../../service-variant/service-variant.service';
import { MultiSelectDataService } from '../../services/multi-select-service-data.service';
import { ServiceTableFilterService } from '../../services/service-table-filter.service';
import { ServiceTableService } from '../../services/service-table.service';
import { ServiceService } from '../../services/service.service';

import { ServiceComponent } from './service.component';

const appConfig = appConfigMock;

describe('ServiceComponent', () => {
  const outlet = getOutletMock();

  let outletServiceSpy: Spy<OutletService>;
  let offeredServiceServiceSpy: Spy<OfferedServiceService>;
  let serviceServiceSpy: Spy<ServiceService>;
  let serviceVariantServiceSpy: Spy<ServiceVariantService>;
  let serviceTableServiceSpy: Spy<ServiceTableService>;
  let distributionLevelsServiceSpy: Spy<DistributionLevelsService>;
  let userAuthorizationServiceSpy: Spy<UserAuthorizationService>;
  let featureToggleServiceSpy: Spy<FeatureToggleService>;
  let serviceTableFilterServiceSpy: Spy<ServiceTableFilterService>;
  let appConfigProviderSpy: Spy<AppConfigProvider>;
  let component: ServiceComponent;
  let fixture: ComponentFixture<ServiceComponent>;

  beforeEach(() => {
    outletServiceSpy = createSpyFromClass(OutletService);
    outletServiceSpy.getOrLoadBusinessSite.nextWith(outlet);
    serviceServiceSpy = createSpyFromClass(ServiceService);
    offeredServiceServiceSpy = createSpyFromClass(OfferedServiceService);
    offeredServiceServiceSpy.getAll.nextWith([]);
    serviceVariantServiceSpy = createSpyFromClass(ServiceVariantService);
    serviceTableServiceSpy = createSpyFromClass(ServiceTableService);
    serviceTableServiceSpy.isDataLoading.nextWith(false);
    distributionLevelsServiceSpy = createSpyFromClass(DistributionLevelsService);
    userAuthorizationServiceSpy = createSpyFromClass(UserAuthorizationService);
    userAuthorizationServiceSpy.permissions.mockReturnValue(userAuthorizationServiceSpy);

    featureToggleServiceSpy = createSpyFromClass(FeatureToggleService);
    featureToggleServiceSpy.isFeatureEnabled.nextWith(true);

    serviceTableFilterServiceSpy = createSpyFromClass(ServiceTableFilterService);

    appConfigProviderSpy = createSpyFromClass(AppConfigProvider);
    appConfigProviderSpy.getAppConfig.mockReturnValue(appConfig);

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      declarations: [ServiceComponent, TranslatePipeMock],
      imports: [MatDialogModule],
      providers: [
        provideMockStore(),
        UntypedFormBuilder,
        {
          provide: ActivatedRoute,
          useValue: { params: new BehaviorSubject({}) }
        },
        {
          provide: OutletService,
          useValue: outletServiceSpy
        },
        {
          provide: OfferedServiceService,
          useValue: offeredServiceServiceSpy
        },
        {
          provide: ServiceService,
          useValue: serviceServiceSpy
        },
        {
          provide: ServiceVariantService,
          useValue: serviceVariantServiceSpy
        },
        {
          provide: ServiceTableService,
          useValue: serviceTableServiceSpy
        },
        {
          provide: DistributionLevelsService,
          useValue: distributionLevelsServiceSpy
        },
        {
          provide: UserAuthorizationService,
          useValue: userAuthorizationServiceSpy
        },
        {
          provide: FeatureToggleService,
          useValue: featureToggleServiceSpy
        },
        {
          provide: ServiceTableFilterService,
          useValue: serviceTableFilterServiceSpy
        },
        {
          provide: MultiSelectDataService,
          useValue: {
            copyStatus: of(false),
            sourceAndTargets: () =>
              of({
                source: 'GS0000003-1',
                targets: ['GS0000003-69', 'GS0000003-76', 'GS0000003-25']
              }),
            flushTargetBy: () => {}
          }
        },
        {
          provide: MatDialog,
          useValue: {
            open: jest.fn()
          }
        },
        {
          provide: AppConfigProvider,
          useValue: appConfigProviderSpy
        },
        TranslatePipeMock
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('canDeactivate', () => {
    it('should return true if pristine change in service table', () => {
      component.isTableStatusPristine = true;

      const canDeactivate = component.canDeactivate();
      expect(canDeactivate).toBeTruthy();
    });
  });
});
