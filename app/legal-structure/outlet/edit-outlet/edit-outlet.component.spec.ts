import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { NgxPermissionsAllowStubDirective } from 'ngx-permissions';
import { BehaviorSubject, of } from 'rxjs';

import { getCountryChMock } from '../../../geography/country/country.mock';
import { CountryService } from '../../../geography/country/country.service';
import { UserAuthorizationService } from '../../../iam/user/user-authorization.service';
import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { CountryStructureService } from '../../../structures/country-structure/service/country-structure.service';
import { BusinessSiteTaskService } from '../../../tasks/shared/business-site-task.service';
import { Task, TaskData } from '../../../tasks/task.model';
import { TranslatePipeMock } from '../../../testing/pipe-mocks/translate';
import {
  BusinessNameTableStubComponent
} from '../../../traits/business-names/business-name-table/business-name-table-stub.component';
import {
  BusinessNameTableComponent
} from '../../../traits/business-names/business-name-table/business-name-table.component';
import { DistributionLevelsService } from '../../../traits/distribution-levels/distribution-levels.service';
import { BusinessSiteActionService } from '../../businessSite/services/business-site-action.service';
import { LegalStructureRoutingService } from '../../legal-structure-routing.service';
import { PredecessorService } from '../../predecessor/predecessor/predecessor.service';
import { ActiveLanguageService } from '../../shared/components/language-toggle/active-language.service';
import { getOutletMock, outletTranslationMock } from '../../shared/models/outlet.mock';
import { MessageService } from '../../shared/services/message.service';
import { OutletService } from '../../shared/services/outlet.service';

import { EditOutletComponent } from './edit-outlet.component';
import { UserService } from '../../../iam/user/user.service';
import { TasksService } from '../../shared/services/tasks.service';
// @ts-ignore
import moment = require('moment');
import { FeatureToggleService } from '../../../shared/directives/feature-toggle/feature-toggle.service';

class ActivatedRouteStub {
  paramMap = of({
    get: (value: any) => {
      return value === 'id' ? '2' : null;
    }
  });

  fragment = of();
}

class LegalStructureRoutingServiceStub {
  outletIdChanges = new BehaviorSubject<string>('');
}

export function getOutletFormMock(): UntypedFormGroup {
  return new UntypedFormBuilder().group({
    active: true,
    legalName: 'Outlet Name',
    nameAddition: 'Name addition',
    countryId: 'CH',
    countryName: 'Switzerland (CH)',
    address: new UntypedFormBuilder().group({
      street: 'Street',
      streetNumber: '1',
      zipCode: 'ZIP123',
      city: 'City',
      district: 'District',
      addressAddition: 'Address Addition'
    }),
    gps: new UntypedFormBuilder().group({
      latitude: '',
      longitude: ''
    }),
    poBox: new UntypedFormBuilder().group({
      number: '',
      city: '',
      zipCode: ''
    }),
    state: '',
    province: '',
    additionalTranslations: { 'fr-CH': outletTranslationMock },
    affiliate: false,
    startOperationDate: '',
    closeDownDate: '',
    closeDownReasonId: '',
    distributionLevels: ['RETAILER'],
    defaultLanguageId: 'de-CH'
  });
}

describe('EditOutletComponent', () => {
  const translationKey = 'EDIT_OUTLET_UPDATE_SUCCESS';
  const taskTranslationKey = 'TASK_UPDATE_OUTLET_REQUEST_SUCCESS';
  const error: Error = new Error('specific error message');

  let component: EditOutletComponent;
  let fixture: ComponentFixture<EditOutletComponent>;

  let outletServiceSpy: Spy<OutletService>;
  let distributionLevelsServiceSpy: Spy<DistributionLevelsService>;
  let snackbarServiceSpy: Spy<SnackBarService>;
  let countryServiceSpy: Spy<CountryService>;
  let userAuthorizationServiceSpy: Spy<UserAuthorizationService>;
  let activeLanguageServiceSpy: Spy<ActiveLanguageService>;
  let businessSiteTaskServiceSpy: Spy<BusinessSiteTaskService>;
  let predecessorServiceSpy: Spy<PredecessorService>;
  let countryStructureServiceSpy: Spy<CountryStructureService>;
  let businessSiteActionServiceSpy: Spy<BusinessSiteActionService>;
  let messageServiceSpy: Spy<MessageService>;
  let userServiceSpy: Spy<UserService>;
  let tasksServiceSpy: Spy<TasksService>;
  let featureToggleServiceSpy: Spy<FeatureToggleService>;

  beforeEach(waitForAsync(() => {
    outletServiceSpy = createSpyFromClass(OutletService);

    outletServiceSpy.getOrLoadBusinessSite.nextWith(getOutletMock());
    distributionLevelsServiceSpy = createSpyFromClass(DistributionLevelsService);
    distributionLevelsServiceSpy.update.nextOneTimeWith('OK');
    distributionLevelsServiceSpy.getDistributionLevelsOfOutlet.nextWith([]);
    snackbarServiceSpy = createSpyFromClass(SnackBarService);
    countryServiceSpy = createSpyFromClass(CountryService);
    countryServiceSpy.get.nextWith(getCountryChMock());
    userAuthorizationServiceSpy = createSpyFromClass(UserAuthorizationService);
    userAuthorizationServiceSpy.permissions.mockReturnValue(userAuthorizationServiceSpy);
    userAuthorizationServiceSpy.businessSite.mockReturnValue(userAuthorizationServiceSpy);
    userAuthorizationServiceSpy.country.mockReturnValue(userAuthorizationServiceSpy);
    userAuthorizationServiceSpy.observableDistributionLevels.mockReturnValue(
      userAuthorizationServiceSpy
    );
    userAuthorizationServiceSpy.verify.nextWith(true);
    businessSiteTaskServiceSpy = createSpyFromClass(BusinessSiteTaskService);
    businessSiteTaskServiceSpy.existsOpenDataChangeFor.nextWith(false);
    businessSiteTaskServiceSpy.existsOpenVerificationTaskFor.nextWith(false);
    businessSiteTaskServiceSpy.getOpenStatusForDataChangeTask.nextWith([]);
    predecessorServiceSpy = createSpyFromClass(PredecessorService);
    predecessorServiceSpy.isLoaded.nextWith(true);
    predecessorServiceSpy.getBy.nextOneTimeWith(undefined);
    predecessorServiceSpy.save.nextOneTimeWith('OK');
    predecessorServiceSpy.isChanged.nextOneTimeWith(true);
    countryStructureServiceSpy = createSpyFromClass(CountryStructureService);
    countryStructureServiceSpy.getCountryStructureIdBy.nextOneTimeWith(undefined);

    businessSiteActionServiceSpy = createSpyFromClass(BusinessSiteActionService);

    activeLanguageServiceSpy = createSpyFromClass(ActiveLanguageService);
    activeLanguageServiceSpy.get.nextWith({ isDefaultLanguage: true });
    messageServiceSpy = createSpyFromClass(MessageService);
    userServiceSpy = createSpyFromClass(UserService);
    userServiceSpy.getRoles.nextOneTimeWith([]);
    tasksServiceSpy = createSpyFromClass(TasksService);
    tasksServiceSpy.getDataChangeTasks.nextOneTimeWith([]);
    featureToggleServiceSpy = createSpyFromClass(FeatureToggleService);
    featureToggleServiceSpy.isFeatureEnabled.nextWith(true);

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      declarations: [
        EditOutletComponent,
        NgxPermissionsAllowStubDirective,
        TranslatePipeMock,
        BusinessNameTableStubComponent
      ],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        })
      ],
      providers: [
        UntypedFormBuilder,
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: OutletService, useValue: outletServiceSpy },
        { provide: DistributionLevelsService, useValue: distributionLevelsServiceSpy },
        { provide: SnackBarService, useValue: snackbarServiceSpy },
        { provide: CountryService, useValue: countryServiceSpy },
        {
          provide: UserAuthorizationService,
          useValue: { isAuthorizedFor: userAuthorizationServiceSpy }
        },
        {
          provide: LegalStructureRoutingService,
          useValue: new LegalStructureRoutingServiceStub()
        },
        { provide: ActiveLanguageService, useValue: activeLanguageServiceSpy },
        { provide: BusinessSiteTaskService, useValue: businessSiteTaskServiceSpy },
        { provide: PredecessorService, useValue: predecessorServiceSpy },
        { provide: CountryStructureService, useValue: countryStructureServiceSpy },
        { provide: BusinessSiteActionService, useValue: businessSiteActionServiceSpy },
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: TasksService, useValue: tasksServiceSpy },
        { provide: FeatureToggleService, useValue: featureToggleServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditOutletComponent);
    component = fixture.componentInstance;
    outletServiceSpy.getOrLoadBusinessSite.nextWith(getOutletFormMock().value);
    outletServiceSpy.outletChanges.nextOneTimeWith('OK');
    distributionLevelsServiceSpy.get.nextWith(getOutletFormMock().value.distributionLevels);
    businessSiteTaskServiceSpy.findAllDataVerificationFields.nextOneTimeWith({ dataVerificationFields: [] });
  });

  it('should create', () => {
    distributionLevelsServiceSpy.update.nextOneTimeWith('OK');
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('initOutlet() should find business-site', () => {
    fixture.detectChanges();
    expect(component.outlet.active).toBeTruthy();
    expect(snackbarServiceSpy.showInfo).not.toHaveBeenCalled();
  });

  it('should set all fields disabled if user is not authorized', () => {
    userAuthorizationServiceSpy.verify.nextWith(false);
    fixture.detectChanges();
    expect(component.outletForm.disabled).toBeTruthy();
  });

  it('should set all fields enabled if user is authorized', () => {
    userAuthorizationServiceSpy.verify.nextWith(true);
    fixture.detectChanges();
    expect(component.outletForm.enabled).toBeTruthy();
  });

  it('should set all fields disabled if a task exists', () => {
    businessSiteTaskServiceSpy.getOpenStatusForDataChangeTask.nextWith([new Task()]);
    fixture.detectChanges();
    expect(component.outletForm.disabled).toBeTruthy();
  });

  it('should set all fields enabled if no task exists', () => {
    fixture.detectChanges();
    expect(component.outletForm.disabled).toBeFalsy();
  });

  describe('should submit outlet', () => {
    beforeEach(() => {
      component.outlet = getOutletMock();
      component.outletForm = getOutletFormMock();
      spyOn(distributionLevelsServiceSpy, 'getDistributionLevelsOfOutlet').and.returnValue(
        of(['RETAILER'])
      );
    });

    it('should show success message', () => {
      countryStructureServiceSpy.setCountryStructureIdFor.nextOneTimeWith('OK');
      outletServiceSpy.update.nextOneTimeWith('OK');
      fixture.detectChanges();
      component.submitOutlet();
      expect(snackbarServiceSpy.showInfo).toHaveBeenCalledWith(translationKey);
    });

    it('should trigger an error message when an error is thrown', () => {
      outletServiceSpy.update.throwWith(error);
      fixture.detectChanges();
      component.submitOutlet();
      expect(snackbarServiceSpy.showError).toHaveBeenCalledWith(error);
    });
  });

  describe('requestOutletApproval()', () => {
    beforeEach(() => {
      component.outlet = getOutletMock();
      component.outletForm = getOutletFormMock();
    });

    it('should show task request approval success message', () => {
      const dueDate = moment().format('YYYY-MM-DD');
      const payload: TaskData = { dueDate, comment: 'Test Comment' };
      outletServiceSpy.update.nextOneTimeWith('OK');
      component.requestOutletApproval(payload);
      fixture.detectChanges();
      expect(snackbarServiceSpy.showInfo).toHaveBeenCalledWith(taskTranslationKey);
    });

    it('should trigger an error message when an error is thrown', () => {
      outletServiceSpy.update.throwWith(error);
      fixture.detectChanges();
      component.requestOutletApproval();
      expect(snackbarServiceSpy.showError).toHaveBeenCalledWith(error);
    });
  });

  describe('saveButtonClicked()', () => {
    beforeEach(() => {
      component.outletForm = getOutletFormMock();
      component.businessNameTableComponent = TestBed.createComponent(BusinessNameTableStubComponent)
        .componentInstance as BusinessNameTableComponent;
    });
    it('should disable cancel and save buttons', () => {
      component.saveButtonClicked();
      expect(component.cancelButtonDisabled).toBeTruthy();
      expect(component.saveButtonDisabled).toBeTruthy();
    });

    it('should call businessNameTableComponent.save if form changed', () => {
      spyOn(component.businessNameTableComponent, 'isInvalidOrPristine').and.callFake(() => false);
      const saveSpy = spyOn(component.businessNameTableComponent, 'save');
      component.saveButtonClicked();

      expect(component.businessNameTableComponent.isInvalidOrPristine()).toEqual(false);
      expect(saveSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('confirmButtonClicked()', () => {
    beforeEach(() => {
      component.outletForm = getOutletFormMock();
      component.businessNameTableComponent = TestBed.createComponent(BusinessNameTableStubComponent)
        .componentInstance as BusinessNameTableComponent;

      spyOn(component.businessNameTableComponent, 'isInvalid').and.callFake(() => false);
      spyOn(component.businessNameTableComponent, 'confirmSave').and.callFake(() => of(true));
      component.outletForm.setErrors({ notUnique: true });
      component.confirmButtonClicked({ taskId: 1 });
    });
    it('should disable cancel and save buttons', () => {
      expect(component.cancelButtonDisabled).toBeTruthy();
      expect(component.saveButtonDisabled).toBeTruthy();
    });

    it('should set isTaskPresent on success confirmSave', () => {
      expect(component.isTaskPresent).toBeTruthy();
    });
  });

  describe('showDataChangeNotification', () => {
    it('should set showDataChangeMessage to true if passed true', () => {
      component.showDataChangeNotification(true)
      expect(component.showDataChangeMessage).toBeTruthy()
    })

    it('should set showDataChangeMessage to false if passed false', () => {
      component.showDataChangeNotification(false)
      expect(component.showDataChangeMessage).toBeFalsy()
    })
  })

  it('should emit dataChangeViewClicked onActionClick', () => {
    spyOn(component.dataChangeViewClicked, 'emit')
    component.onActionClick()
    expect(component.dataChangeViewClicked.emit).toBeCalled()
  })
});
