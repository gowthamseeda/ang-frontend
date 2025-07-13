import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { appConfigMock } from '../../../../app-config.mock';
import { AppConfigProvider } from '../../../../app-config.service';
import { UserAuthorizationService } from '../../../../iam/user/user-authorization.service';
import { getOutletMock } from '../../../../legal-structure/shared/models/outlet.mock';
import { OutletService } from '../../../../legal-structure/shared/services/outlet.service';
import { TranslatePipeMock } from '../../../../testing/pipe-mocks/translate';
import { DistributionLevelsService } from '../../../../traits/distribution-levels/distribution-levels.service';
import { UserSettingsService } from '../../../../user-settings/user-settings/services/user-settings.service';
import { OfferedServiceMock } from '../../../offered-service/offered-service.mock';
import { OfferedService } from '../../../offered-service/offered-service.model';
import { OfferedServiceService } from '../../../offered-service/offered-service.service';
import { ServiceMock } from '../../../service/models/service.mock';
import { MultiSelectDataService } from '../../../service/services/multi-select-service-data.service';
import { MultiSelectDataServiceMock } from '../../../service/services/multi-select-service-data.service.mock';
import { ServiceService } from '../../../service/services/service.service';
import { ValidityTableStatusService } from '../../services/validity-table-status.service';
import { ValidityTableService } from '../../services/validity-table.service';
import { ValidityMultiEditComponent } from './validity-multi-edit.component';
import { EMPTY, of } from 'rxjs';
import any = jasmine.any;

const appConfig = appConfigMock;

describe('ValidityMultiEditComponent', () => {
  const outlet = getOutletMock();
  const service = ServiceMock.asList[1];
  const offeredService: OfferedService[] = OfferedServiceMock.asList();

  let outletServiceSpy: Spy<OutletService>;
  let serviceServiceSpy: Spy<ServiceService>;
  let offeredServiceServiceSpy: Spy<OfferedServiceService>;
  let distributionLevelsServiceSpy: Spy<DistributionLevelsService>;
  const validityTableStatusService = new ValidityTableStatusService();
  let validityTableServiceSpy: Spy<ValidityTableService>;
  let userAuthorizationServiceSpy: Spy<UserAuthorizationService>;
  let userSettingsServiceSpy: Spy<UserSettingsService>;
  let appConfigProviderSpy: Spy<AppConfigProvider>;
  let matDialogSpy: Spy<MatDialog>;

  let component: ValidityMultiEditComponent;
  let fixture: ComponentFixture<ValidityMultiEditComponent>;

  beforeEach(() => {
    outletServiceSpy = createSpyFromClass(OutletService);
    outletServiceSpy.getOrLoadBusinessSite.nextWith(outlet);
    serviceServiceSpy = createSpyFromClass(ServiceService);
    serviceServiceSpy.selectBy.nextWith(service);
    serviceServiceSpy.selectAllBy.nextWith(service);

    serviceServiceSpy.isLoading.mockReturnValue(of(false));

    offeredServiceServiceSpy = createSpyFromClass(OfferedServiceService);
    offeredServiceServiceSpy.getAll.nextWith(offeredService);
    validityTableServiceSpy = createSpyFromClass(ValidityTableService);
    validityTableServiceSpy.getValidityTableRows.nextWith([
      {
        offeredServicesMap: {
          'GS0000001-1': {
            id: 'GS0000001-1',
            serviceId: 1,
            productCategoryId: 1,
            brandId: 'MB',
            productGroupId: 'PC',
            businessSite: { id: 'GS0000001' },
            validity: { validFrom: '2024-01-01', validUntil: '2024-12-31', valid: true }            
          }
        }
      }
    ]);
    distributionLevelsServiceSpy = createSpyFromClass(DistributionLevelsService);
    distributionLevelsServiceSpy.getDistributionLevelsOfOutlet.nextWith([]);

    userAuthorizationServiceSpy = createSpyFromClass(UserAuthorizationService);
    userAuthorizationServiceSpy.verify.nextWith(true);
    userSettingsServiceSpy = createSpyFromClass(UserSettingsService);
    userSettingsServiceSpy.get.nextWith({ languageId: 'en', doNotShowMultiSelectConfirmationDialog: false });
    Object.defineProperty(userAuthorizationServiceSpy, 'isAuthorizedFor', {
      get: () => () => ({
        permissions: () => ({
          businessSite: () => ({
            country: () => ({
              distributionLevels: () => of(true)
            })
          })
        })
      })
    });

    appConfigProviderSpy = createSpyFromClass(AppConfigProvider);
    appConfigProviderSpy.getAppConfig.mockReturnValue(appConfig);
    matDialogSpy = createSpyFromClass(MatDialog);
    matDialogSpy.open.mockReturnValue({
      afterClosed: () => of(undefined)
    })

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
        },
        {
          provide: MultiSelectDataService,
          useClass: MultiSelectDataServiceMock
        },
        {
          provide: MatDialog,
          useValue: matDialogSpy
        }
      ],
      declarations: [ValidityMultiEditComponent, TranslatePipeMock],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidityMultiEditComponent);
    component = fixture.componentInstance;

    component.serviceIds = [1];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('save()', () => {
    it('should open and pass data to confirmation dialog', () => {
      jest.spyOn(component, 'promptMultiEditComfirmationDialog');
      component.save();
      expect(component.promptMultiEditComfirmationDialog).toHaveBeenCalled();
    });

    it('should call saveValidities to save the data', done => {
      component.doNotShowMultiSelectConfirmationDialog = true;
      validityTableStatusService.pristine.subscribe(pristine => {
        expect(pristine).toBeTruthy();
        done();
      });
      jest.spyOn(component, 'saveValidities');
      component.save();
      expect(component.saveValidities).toHaveBeenCalled();
    });
  });

  describe('saveValidities', () => {
    let validityTableRow: any;

    beforeEach(() => {
      validityTableRow = {
        offeredServicesMap: {
          'GS0000001-3': {
            id: 'GS0000001-3',
            serviceId: 3,
            productCategoryId: 1,
            brandId: 'MB',
            productGroupId: 'PC',
            businessSite: { id: 'GS0000001' },
            validity: { validFrom: '2024-01-01', validUntil: '2024-12-31', valid: true }
          },
          'GS0000002-3': {
            id: 'GS0000002-3',
            serviceId: 3,
            productCategoryId: 1,
            brandId: 'MB',
            productGroupId: 'PC',
            businessSite: { id: 'GS0000002' },
            validity: { validFrom: '2024-01-01', validUntil: '2024-12-31', valid: true }
          }
        }
      };
      component.outletId = 'GS0000001';
    });

    it('should call saveValiditiesInBatch if selectedOutletIdsToCopy is undefined', () => {
      component.selectedOutletIdsToCopy = undefined as any;
      const spy = spyOn(component, 'resetPristine');
      component.saveValidities(validityTableRow);
      expect(offeredServiceServiceSpy.saveValiditiesInBatch).toHaveBeenCalled();
      expect(offeredServiceServiceSpy.saveValiditiesInBatchForMultipleOutlets).not.toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(true);
    });

    it('should call saveValiditiesInBatch if selectedOutletIdsToCopy is empty array', () => {
      component.selectedOutletIdsToCopy = [];
      const spy = spyOn(component, 'resetPristine');
      component.saveValidities(validityTableRow);
      expect(offeredServiceServiceSpy.saveValiditiesInBatch).toHaveBeenCalled();
      expect(offeredServiceServiceSpy.saveValiditiesInBatchForMultipleOutlets).not.toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(true);
    });

    it('should call saveValiditiesInBatchForMultipleOutlets if selectedOutletIdsToCopy has values', () => {
      component.selectedOutletIdsToCopy = ['GS0000002'];
      component.outletId = 'GS0000001';
      const spy = spyOn(component, 'resetPristine');
      component.saveValidities(validityTableRow);
      expect(offeredServiceServiceSpy.saveValiditiesInBatchForMultipleOutlets).toHaveBeenCalled();
      expect(offeredServiceServiceSpy.saveValiditiesInBatch).not.toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(true);
    });

    it('should build correct MultiOfferedService list for multiple outlets', () => {
      component.selectedOutletIdsToCopy = ['GS0000002'];
      component.outletId = 'GS0000001';
      const spy = spyOn(component, 'resetPristine');
      component.saveValidities(validityTableRow);
      const callArg = offeredServiceServiceSpy.saveValiditiesInBatchForMultipleOutlets.mock.calls[0][0];
      expect(Array.isArray(callArg)).toBe(true);
      expect(callArg.length).toBe(2); 
      expect(callArg[0].businessSiteId).toBe('GS0000002');
      expect(callArg[1].businessSiteId).toBe('GS0000001');
      expect(spy).toHaveBeenCalledWith(true);
    });

    it('should build correct OfferedServiceValidity list for single outlet', () => {
      component.selectedOutletIdsToCopy = undefined as any;
      component.outletId = 'GS0000001';
      const spy = spyOn(component, 'resetPristine');
      component.saveValidities(validityTableRow);
      const callArg = offeredServiceServiceSpy.saveValiditiesInBatch.mock.calls[0][1];
      expect(Array.isArray(callArg)).toBe(true);
      expect(callArg.length).toBe(2); 
      expect(callArg[0].id).toBe('GS0000001-3');
      expect(callArg[1].id).toBe('GS0000002-3');
      expect(spy).toHaveBeenCalledWith(true);
    });
  });

  describe('promptMultiEditComfirmationDialog', () => {
    it('should call prompt comfirmation dialog', done => {
      const validityTableRow = {
        offeredServicesMap: {
          'GS0000001-3': OfferedServiceMock.asMap()['GS0000001-3']
        }
      };
      const mockData = any;
      validityTableStatusService.pristine.subscribe(pristine => {
        expect(pristine).toBeTruthy();
        done();
      });
      const openDialogSpy = spyOn(matDialogSpy, 'open')
        .and
        .returnValue({ afterClosed: () => EMPTY });

      component.promptMultiEditComfirmationDialog(validityTableRow, mockData);
      expect(openDialogSpy).toHaveBeenCalled();
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
      expect(validityTableServiceSpy.initValidityMultiEditTableRows).toHaveBeenCalled();
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

  describe('promptCopyToCompanyDialog', () => {
    it('should call prompt copy to company dialog', done => {
      component.selectedOutletIdsToCopy = []
      const openDialogSpy = spyOn(matDialogSpy, 'open')
        .and
        .returnValue({ afterClosed: () => of(['GS007']) });

      component.openCopyToCompanyDialog();
      expect(openDialogSpy).toHaveBeenCalled();
      done()
    });
  });

  describe('initializeForSelectedOutlets', () => {
    it('should fetch offered services and update validityTableRow.offeredServicesMap', (done) => {
      const offeredServices = [
        {
          id: 'GS01-1',
          businessSite: { id: 'GS01' },
          validity: { valid: true, validFrom: '2024-01-01', validUntil: '2024-12-31' },
          productCategoryId: 0,
          serviceId: 0,
          brandId: '',
          productGroupId: ''
        }
      ];
      offeredServiceServiceSpy.getAll.mockReturnValue(of(offeredServices));
      validityTableServiceSpy.getValidityTableRows.mockReturnValue(of([
        { offeredServicesMap: {} }
      ]));
      
      component.outletId = 'GS01';
      component.editComponents = {
        _saveButtonDisabled: false,
        cancelButtonDisabled: false,
        saveButtonTranslationKey: '',
        cancelButtonTranslationKey: '',
        saveButtonIcon: '',
        cancelButtonIcon: '',
        saveButtonColor: '',
        cancelButtonColor: '',
        save: () => {},
        cancel: () => {},
        saveButtonDisabled: false
      } as any;

      component.initializeForSelectedOutlets();

      setTimeout(() => {
        expect(offeredServiceServiceSpy.fetchAllForOutlet).toHaveBeenCalledWith('GS01');
        expect(validityTableServiceSpy.getValidityTableRows).toHaveBeenCalled();
        done();
      }, 0);
    }); 
  }); 
});
