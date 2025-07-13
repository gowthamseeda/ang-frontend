import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {UntypedFormBuilder, UntypedFormGroup} from '@angular/forms';
import {provideAutoSpy, Spy} from 'jest-auto-spies';

import {
  getLanguageEnglishPure,
  getLanguageGermanPure,
  getLanguageUS
} from '../../../../geography/language/language.mock';
import {Language} from '../../../../geography/language/language.model';
import {LanguageService} from '../../../../geography/language/language.service';
import {FeatureToggleService} from '../../../../shared/directives/feature-toggle/feature-toggle.service';
import {BusinessSiteTaskService} from '../../../../tasks/shared/business-site-task.service';
import {TestingModule} from '../../../../testing/testing.module';
import {BusinessSiteStoreService} from '../../../businessSite/services/business-site-store.service';
import {
  ActiveLanguage,
  ActiveLanguageService
} from '../../../shared/components/language-toggle/active-language.service';
import {getOutletMock} from '../../../shared/models/outlet.mock';
import {
  getOutletLegalInformation_RO,
  getOutletLegalInformationNoRestrictionPermissions,
  getOutletLegalInformationPermissions
} from '../../model/legal-information.mock';
import {
  LegalContractSelection
} from '../../presentational/edit-legal/legal-contract-state-table/legal-contract-state-table.component';
import {LegalInformationActionService} from '../../services/legal-information-action.service';

import {EditLegalComponentService} from './edit-legal-component.service';
import {EditLegalComponent} from './edit-legal.component';
import {UserService} from 'app/iam/user/user.service';
import {DataChangedNotificationService} from '../../../../notifications/services/data-changed-notification.service';
import {Status, Task, TaskUpdateResponse, Type, VerificationTaskFormStatus} from '../../../../tasks/task.model';
import {TaskMock} from '../../../../tasks/task.mock';
import {DataNotification} from '../../../../notifications/models/notifications.model';
import {TaskWebSocketService} from '../../../../tasks/service/task-websocket.service';
import {LegalInformationDisplayService} from '../../services/legal-information-display.service';

describe('EditLegalComponent', () => {
  let component: EditLegalComponent;
  let fixture: ComponentFixture<EditLegalComponent>;
  let legalInformationService: Spy<EditLegalComponentService>;
  let outletService: Spy<BusinessSiteStoreService>;
  let activeLanguageService: Spy<ActiveLanguageService>;
  let languageService: Spy<LanguageService>;
  let businessSiteTaskService: Spy<BusinessSiteTaskService>;
  let featureToggleService: Spy<FeatureToggleService>;
  let userService: Spy<UserService>;
  let dataChangedNotificationService: Spy<DataChangedNotificationService>;
  let taskWebSocketService: Spy<TaskWebSocketService>;

  const formBuilder: UntypedFormBuilder = new UntypedFormBuilder();
  const outlet = getOutletMock();
  const legalInformation = getOutletLegalInformation_RO(outlet.id);
  const legalInformationPermissions = getOutletLegalInformationPermissions();
  const legalInformationNoPermissions = getOutletLegalInformationNoRestrictionPermissions();
  const pureLanguageDE = getLanguageGermanPure();
  const pureLanguageEN = getLanguageEnglishPure();
  const languages: Language[] = [getLanguageUS(), pureLanguageDE];
  const activeLanguage: ActiveLanguage = { isDefaultLanguage: false, languageId: 'DE' };
  const taskMock: Task[] = TaskMock.asList();
  const liveTaskMock: TaskUpdateResponse = {
    countryId: "",
    created: "",
    dataCluster: undefined,
    lastChanged: "",
    locked: false,
    payload: {name: "", payload: "", version: 0},
    status: Status.APPROVED,
    type: Type.DATA_CHANGE,
    id: 1234,
    businessSiteId: "GS001"
  }

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [EditLegalComponent],
        imports: [TestingModule],
        providers: [
          provideAutoSpy(EditLegalComponentService),
          provideAutoSpy(BusinessSiteStoreService),
          provideAutoSpy(ActiveLanguageService),
          provideAutoSpy(LanguageService),
          provideAutoSpy(LegalInformationActionService),
          provideAutoSpy(BusinessSiteTaskService),
          provideAutoSpy(FeatureToggleService),
          provideAutoSpy(UserService),
          provideAutoSpy(DataChangedNotificationService),
          provideAutoSpy(TaskWebSocketService),
          LegalInformationDisplayService,
          {
            provide: UntypedFormBuilder,
            useValue: formBuilder
          }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();

      legalInformationService = TestBed.inject<any>(EditLegalComponentService);
      outletService = TestBed.inject<any>(BusinessSiteStoreService);
      activeLanguageService = TestBed.inject<any>(ActiveLanguageService);
      languageService = TestBed.inject<any>(LanguageService);
      businessSiteTaskService = TestBed.inject<any>(BusinessSiteTaskService);
      featureToggleService = TestBed.inject<any>(FeatureToggleService);
      userService = TestBed.inject<any>(UserService);
      dataChangedNotificationService = TestBed.inject<any>(DataChangedNotificationService);
      taskWebSocketService = TestBed.inject<any>(TaskWebSocketService);

      activeLanguageService.get.nextWith(activeLanguage);
      legalInformationService.getLegalInformation.nextWith(legalInformation);
      legalInformationService.getPermissions.nextWith(legalInformationPermissions);
      outletService.getOutlet.nextWith(outlet);
      outletService.getDistributionLevels.nextWith(['RETAILER']);
      languageService.getAll.nextWith(languages);
      businessSiteTaskService.existsOpenDataChangeFor.nextWith(false);
      businessSiteTaskService.existsOpenVerificationTaskFor.nextWith(false);
      businessSiteTaskService.getByOutletId.nextWith(taskMock);
      businessSiteTaskService.getOpenStatusForDataChangeTask.nextWith(taskMock);
      featureToggleService.isFocusFeatureEnabled.nextWith(true);
      featureToggleService.isFeatureEnabled.nextWith(true);
      userService.getRoles.nextWith([]);
      dataChangedNotificationService.get.nextWith([]);
      dataChangedNotificationService.read.nextWith();
      taskWebSocketService.getLiveTask.nextWith(liveTaskMock);
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLegalComponent);
    component = fixture.componentInstance;
  });

  test('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('ngOnInit should', () => {
    test('return only languages having no region code.', () => {
      fixture.detectChanges();
      const expected: LegalContractSelection[] = [{ text: 'German', value: 'de' }];
      expect(component.contractLanguageAllowedOptions).toStrictEqual(expected);
    });

    test('return languages sorted alphabetically', () => {
      const nonSortedLanguages: Language[] = [pureLanguageEN, pureLanguageDE];
      languageService.getAll.nextWith(nonSortedLanguages);
      fixture.detectChanges();

      const expected: LegalContractSelection[] = [
        {
          text: pureLanguageEN.name,
          value: pureLanguageEN.id
        },
        {
          text: pureLanguageDE.name,
          value: pureLanguageDE.id
        }
      ];
      expect(component.contractLanguageAllowedOptions).toStrictEqual(expected);
    });

    test('evaluate task status again if business site id is different from view state.', () => {
      spyOn(component, 'evaluateTaskStatus').and.callThrough();
      fixture.detectChanges();

      expect(component.viewState.businessSiteId).toEqual('7654321');
      expect(component.evaluateTaskStatus).toHaveBeenCalledTimes(1);

      const newLegalInfo = getOutletLegalInformation_RO('GS0000005');
      legalInformationService.getLegalInformation.nextWith(newLegalInfo);

      expect(component.viewState.businessSiteId).toEqual('GS0000005');
      expect(component.evaluateTaskStatus).toHaveBeenCalledTimes(2);
    });

    test('evaluate task status once if business site id is same from view state.', () => {
      spyOn(component, 'evaluateTaskStatus').and.callThrough();
      fixture.detectChanges();

      expect(component.viewState.businessSiteId).toEqual('7654321');
      expect(component.evaluateTaskStatus).toHaveBeenCalledTimes(1);

      legalInformation.company.vatNumber = '123456';
      legalInformationService.getLegalInformation.nextWith(legalInformation);

      expect(component.viewState.businessSiteId).toEqual('7654321');
      expect(component.evaluateTaskStatus).toHaveBeenCalledTimes(1);
    });

    test('evaluate task status once if is not restricted business site.', () => {
      spyOn(component, 'evaluateTaskStatus').and.callThrough();
      fixture.detectChanges();

      expect(component.viewState.businessSiteId).toEqual('7654321');
      expect(component.evaluateTaskStatus).toHaveBeenCalledTimes(1);

      legalInformation.company.vatNumber = '123456';
      const newLegalInfo = getOutletLegalInformation_RO('GS0000005');
      legalInformationService.getPermissions.nextWith(legalInformationNoPermissions);
      legalInformationService.getLegalInformation.nextWith(newLegalInfo);

      expect(component.evaluateTaskStatus).toHaveBeenCalledTimes(1);
    });

    test('call evaluateDataChangeTasks', () => {
      spyOn(component, 'evaluateDataChangeTasks').and.callThrough();
      fixture.detectChanges();

      expect(component.evaluateDataChangeTasks).toHaveBeenCalledTimes(1);
    });

  });

  describe('isOutletDataReadOnly should', () => {
    test('return true as default', () => {
      const readOnly = component.outletDataReadOnly;
      expect(readOnly).toBeTruthy();
    });

    test('return true if there is a pending task for the outlet', () => {
      component.isTaskPresent = true;

      const readOnly = component.outletDataReadOnly;
      expect(readOnly).toBeTruthy();
    });

    test('return true if user is not restricted (BS) to the outlet but update legal info is allowed', () => {
      component.authorizedForBusinessSite = false;
      component.editLegalInfoIsAllowed = true;

      const readOnly = component.outletDataReadOnly;
      expect(readOnly).toBeTruthy();
    });

    test('return true if user is not restricted (Country) to the outlet but update legal info is allowed', () => {
      component.authorizedForCountry = false;
      component.editLegalInfoIsAllowed = true;

      const readOnly = component.outletDataReadOnly;
      expect(readOnly).toBeTruthy();
    });

    test('return true if user is not restricted (DL) to the outlet but update legal info is allowed', () => {
      component.authorizedForDistributionLevel = false;
      component.editLegalInfoIsAllowed = true;

      const readOnly = component.outletDataReadOnly;
      expect(readOnly).toBeTruthy();
    });

    test('return true if user is restricted to the outlet but update legal info is not allowed', () => {
      component.authorizedForBusinessSite = true;
      component.editLegalInfoIsAllowed = false;

      const readOnly = component.outletDataReadOnly;
      expect(readOnly).toBeTruthy();
    });

    test('return false if user is restricted to the outlet and update legal info is allowed', () => {
      component.authorizedForBusinessSite = true;
      component.editLegalInfoIsAllowed = true;
      component.authorizedForDistributionLevel = true;
      component.authorizedForCountry = true;

      const readOnly = component.outletDataReadOnly;
      expect(readOnly).toBeFalsy();
    });
  });

  describe('isCompanyDataReadOnly should', () => {
    test('return true if user is not restricted (BS) to the outlet and outlet is registered office', () => {
      component.authorizedForBusinessSite = false;
      component.hasRequiredDistributionLevel = true;

      const readOnly = component.companyDataReadOnly;
      expect(readOnly).toBeTruthy();
    });

    test('return true if user is not restricted (Country) to the outlet and outlet is registered office', () => {
      component.authorizedForCountry = false;
      component.hasRequiredDistributionLevel = true;

      const readOnly = component.companyDataReadOnly;
      expect(readOnly).toBeTruthy();
    });

    test('return true if user is not restricted (DL) to the outlet and outlet is registered office', () => {
      component.authorizedForDistributionLevel = false;
      component.hasRequiredDistributionLevel = true;

      const readOnly = component.companyDataReadOnly;
      expect(readOnly).toBeTruthy();
    });

    test('return true if user is restricted to the outlet but outlet is no registered office', () => {
      component.editLegalInfoIsAllowed = true;
      component.hasRequiredDistributionLevel = false;

      const readOnly = component.companyDataReadOnly;
      expect(readOnly).toBeTruthy();
    });

    test('return true if user has update legal info permission, outlet is registered office but user is not restricted for the outlet', () => {
      component.editLegalInfoIsAllowed = true;
      component.hasRequiredDistributionLevel = true;
      component.authorizedForBusinessSite = false;

      const readOnly = component.companyDataReadOnly;
      expect(readOnly).toBeTruthy();
    });

    test('return false if user has edit legal info permission, outlet is registered office and user is restricted for the outlet', () => {
      component.editLegalInfoIsAllowed = true;
      component.hasRequiredDistributionLevel = true;
      component.authorizedForBusinessSite = true;

      const readOnly = component.companyDataReadOnly;
      expect(readOnly).toBeTruthy();
    });

    test('return false if user has edit legal info permission and outlet is registered office', () => {
      component.viewState.legalInformation.businessSite.registeredOffice = true;
      component.editLegalInfoIsAllowed = true;
      fixture.detectChanges();

      const readOnly = component.companyDataReadOnly;
      expect(readOnly).toBeFalsy();
    });
  });

  describe('saveButtonDisabled should', () => {
    test('return true initially because form is unchanged and valid', () => {
      expect(component.saveButtonDisabled).toBe(true);
    });

    test('return false if new contract state entry is added', () => {
      fixture.detectChanges();
      component.contractStateAddButtonClicked();
      expect(component.saveButtonDisabled).toBe(false);
    });

    test('return false if a contract state entry was removed', done => {
      fixture.detectChanges();
      component.contractStateRemoveButtonClicked(legalInformation.legalContracts[0]);
      expect(component.saveButtonDisabled).toBe(false);
      done();
    });
  });

  describe('cancelButtonDisabled should', () => {
    test('return true initially because form is unchanged', () => {
      expect(component.cancelButtonDisabled).toBe(true);
    });

    test('return false if form is changed', () => {
      fixture.detectChanges();
      component.contractStateRemoveButtonClicked(legalInformation.legalContracts[0]);
      expect(component.cancelButtonDisabled).toBe(false);
    });
  });

  describe('gp-language-toggle should', () => {
    test('be present after view init', () => {
      fixture.detectChanges();
      expect(fixture.debugElement.nativeElement.querySelector('gp-language-toggle')).toBeTruthy();
    });
  });

  describe('ngOnInit should', () => {
    test('should set permissions correctly', () => {
      fixture.detectChanges();
      expect(component.editLegalInfoIsAllowed).toBe(
        legalInformationPermissions.editLegalInfoIsAllowed
      );
      expect(component.authorizedForBusinessSite).toBe(
        legalInformationPermissions.restrictedToBusinessSite
      );
      expect(component.contractBrandAllowedOptions).toStrictEqual(
        legalInformationPermissions.restrictedToBrands
      );
    });

    test('should set selectable languages filtered for only 2 letter languages (pure language)', () => {
      fixture.detectChanges();
      expect(component.contractLanguageAllowedOptions).toHaveLength(1);
      expect(component.contractLanguageAllowedOptions[0].value).toBe(pureLanguageDE.id);
    });

    test('should set active languages correctly', () => {
      fixture.detectChanges();
      expect(component.viewState.activeLanguage).toStrictEqual(activeLanguage.languageId);
    });

    test(`should be read only mode for contract status form when contract status downtime is enabled`, () => {
      fixture.detectChanges();

      expect(component.contractStatusDowntimeEnabled).toBeTruthy();

      component.viewState.legalContractsControl.controls.forEach((contractFormGroup: UntypedFormGroup) => {
        Object.keys(contractFormGroup.controls).forEach(key => {
          const control = contractFormGroup.controls[key];
          expect(control.disabled).toBeTruthy;
        });
      });
    });
    test(`should be call retrieve direct changed notification`, () => {
      spyOn(component, 'retrieveDataChangedNotification').and.callThrough();
      fixture.detectChanges();
      expect(component.retrieveDataChangedNotification).toHaveBeenCalledTimes(1);
    });
    test(`should be call retrieve subscribe Data Change Tasks `, () => {
      spyOn(component, 'subscribeDataChangeTasks').and.callThrough();
      fixture.detectChanges();
      expect(component.subscribeDataChangeTasks).toHaveBeenCalledTimes(1);
    });
  });

  describe('retrieveDirectChangedNotification should', () => {
    test('should call dataChangedNotificationService.get', () => {
      userService.getRoles.nextWith(['GSSNPLUS.BusinessSiteResponsible']);
      fixture.detectChanges();
      expect(dataChangedNotificationService.get).toHaveBeenCalledTimes(1);
    });

    test('should call dataChangedNotificationService.read', () => {
      userService.getRoles.nextWith(['GSSNPLUS.BusinessSiteResponsible']);
      const mockNotification: DataNotification[] = [
        {
          businessSiteId: '123',
          changedField: 'VAT_NO',
          date: new Date('2021-01-01'),
          taskStatus: 'DIRECT_CHANGE',
          readStatus: false
        },
        {
          businessSiteId: '124',
          changedField: 'TAX_NO',
          date: new Date('2021-01-01'),
          taskStatus: 'APPROVED',
          readStatus: false
        },
        {
          businessSiteId: '124',
          changedField: 'LEGAL_FOOTER',
          taskId: 1,
          date: new Date('2021-01-01'),
          taskStatus: 'DECLINED',
          readStatus: false
        }
      ];
      dataChangedNotificationService.get.nextWith(mockNotification);
      fixture.detectChanges();
      expect(component.dataDirectChangeNotificationsMap['VAT_NO']).toBeTruthy();
      expect(component.dataDirectChangeNotificationsMap['TAX_NO']).toBeFalsy();
      expect(component.dataDirectChangeNotificationsMap['LEGAL_FOOTER']).toBeFalsy();
      expect(component.dataDeclinedNotificationsMap['VAT_NO']).toBeUndefined();
      expect(component.dataDeclinedNotificationsMap['TAX_NO']).toBeUndefined();
      expect(component.dataDeclinedNotificationsMap['LEGAL_FOOTER']).toStrictEqual(1);
    });
  });

  describe('evaluateVerificationTasks should', () => {
    test(`should set VerificationTaskStatus tax no to PENDING if verification task is present`, () => {
      fixture.detectChanges();
      expect(component.verificationTasksStatusMap['TAX_NO']).toStrictEqual(VerificationTaskFormStatus.PENDING);
    });
    test(`should set VerificationTaskStatus vat no to PENDING if verification task is present`, () => {
      fixture.detectChanges();
      expect(component.verificationTasksStatusMap['VAT_NO']).toStrictEqual(VerificationTaskFormStatus.PENDING);
    });
    test(`should set VerificationTaskStatus legal footer to PENDING if verification task is present`, () => {
      fixture.detectChanges();
      expect(component.verificationTasksStatusMap['LEGAL_FOOTER'])
        .toStrictEqual(VerificationTaskFormStatus.PENDING);
    });
  });

  describe('evaluateDataChangeTasks should', () => {
    test(`have dataChange task if dataChange task is present`, () => {
      fixture.detectChanges();
      expect(component.activeTasks.length).toBeGreaterThan(0);
    });
    test(`have openDataChange task if dataChange task status is OPEN`, () => {
      fixture.detectChanges();
      expect(component.openTasks.length).toBeGreaterThan(0);
    });
  });

  describe(`legalInfoOnRemain should`, () => {
    test(`should set verificationTaskStatus legal footer to REMAIN`, () => {
      userService.getRoles.nextWith(['GSSNPLUS.BusinessSiteResponsible']);
      fixture.detectChanges();
      component.legalInfoOnRemain('LEGAL_FOOTER');
      expect(component.verificationTasksStatusMap['LEGAL_FOOTER']).toStrictEqual(VerificationTaskFormStatus.REMAIN);
    });
  });
});
