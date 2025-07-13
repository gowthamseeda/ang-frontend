import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService
} from '@ngx-translate/core';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { appConfigMock } from '../../../../app-config.mock';
import { AppConfigProvider } from '../../../../app-config.service';
import { UserAuthorizationService } from '../../../../iam/user/user-authorization.service';
import { getOutletMock } from '../../../../legal-structure/shared/models/outlet.mock';
import { OutletService } from '../../../../legal-structure/shared/services/outlet.service';
import { TranslatePipeMock } from '../../../../testing/pipe-mocks/translate';
import { DistributionLevelsService } from '../../../../traits/distribution-levels/distribution-levels.service';
import { UserSettingsService } from '../../../../user-settings/user-settings/services/user-settings.service';
import { OfferedServiceService } from '../../../offered-service/offered-service.service';
import { ServiceMock } from '../../../service/models/service.mock';
import { ServiceService } from '../../../service/services/service.service';
import { ValidityTableStatusService } from '../../services/validity-table-status.service';
import { ValidityTableService } from '../../services/validity-table.service';

import { ValidityComponent } from './validity.component';


const appConfig = appConfigMock;

describe('ValidityComponent', () => {
  const outlet = getOutletMock();
  const service = ServiceMock.asList[1];

  let outletServiceSpy: Spy<OutletService>;
  let serviceServiceSpy: Spy<ServiceService>;
  let offeredServiceServiceSpy: Spy<OfferedServiceService>;
  let distributionLevelsServiceSpy: Spy<DistributionLevelsService>;
  const validityTableStatusService = new ValidityTableStatusService();
  let validityTableServiceSpy: Spy<ValidityTableService>;
  let userAuthorizationServiceSpy: Spy<UserAuthorizationService>;
  let userSettingsServiceSpy: Spy<UserSettingsService>;
  let appConfigProviderSpy: Spy<AppConfigProvider>;

  let component: ValidityComponent;
  let fixture: ComponentFixture<ValidityComponent>;

  beforeEach(() => {
    outletServiceSpy = createSpyFromClass(OutletService);
    outletServiceSpy.getOrLoadBusinessSite.nextWith(outlet);
    serviceServiceSpy = createSpyFromClass(ServiceService);
    serviceServiceSpy.selectBy.nextWith(service);

    offeredServiceServiceSpy = createSpyFromClass(OfferedServiceService);
    validityTableServiceSpy = createSpyFromClass(ValidityTableService);
    distributionLevelsServiceSpy = createSpyFromClass(DistributionLevelsService);
    distributionLevelsServiceSpy.getDistributionLevelsOfOutlet.nextWith([]);

    userAuthorizationServiceSpy = createSpyFromClass(UserAuthorizationService);
    userAuthorizationServiceSpy.verify.nextWith(true);
    userSettingsServiceSpy = createSpyFromClass(UserSettingsService);
    userSettingsServiceSpy.getLanguageId.nextWith('en');

    appConfigProviderSpy = createSpyFromClass(AppConfigProvider);
    appConfigProviderSpy.getAppConfig.mockReturnValue(appConfig);

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        })
      ],
      providers: [
        TranslateService,
        {
          provide: OutletService,
          useValue: outletServiceSpy
        },
        {
          provide: ServiceService,
          useValue: serviceServiceSpy
        },
        {
          provide: OfferedServiceService,
          useValue: offeredServiceServiceSpy
        },
        {
          provide: DistributionLevelsService,
          useValue: distributionLevelsServiceSpy
        },
        {
          provide: ValidityTableService,
          useValue: validityTableServiceSpy
        },
        {
          provide: ValidityTableStatusService,
          useValue: validityTableStatusService
        },
        {
          provide: UserAuthorizationService,
          useValue: userAuthorizationServiceSpy
        },
        {
          provide: UserSettingsService,
          useValue: userSettingsServiceSpy
        },
        {
          provide: AppConfigProvider,
          useValue: appConfigProviderSpy
        }
      ],
      declarations: [ValidityComponent, TranslatePipeMock],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidityComponent);
    component = fixture.componentInstance;

    component.serviceId = 1;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('save()', () => {
    it('should save validities and set validity table to pristine ', done => {
      validityTableStatusService.pristine.subscribe(pristine => {
        expect(pristine).toBeTruthy();
        done();
      });

      component.save();
      expect(offeredServiceServiceSpy.saveValidities).toHaveBeenCalled();
    });
  });

  describe('cancel', () => {
    it('should reset all changes in the validity table and set it to pristine', done => {
      validityTableStatusService.pristine.subscribe(pristine => {
        expect(pristine).toBeTruthy();
        done();
      });

      component.cancel();
      expect(offeredServiceServiceSpy.fetchAllForOutlet).toHaveBeenCalled();
      expect(validityTableServiceSpy.initValidityTableRows).toHaveBeenCalled();
    });
  });

  describe('canDeactivate', () => {
    it('should return true if form has changed', () => {
      component.isFormChanged = true;

      const canDeactivate = component.canDeactivate();
      expect(canDeactivate).toBeTruthy();
    });

    it('should return false if form not changed', () => {
      component.isFormChanged = false;

      const canDeactivate = component.canDeactivate();
      expect(canDeactivate).toBeFalsy();
    });
  });
});
