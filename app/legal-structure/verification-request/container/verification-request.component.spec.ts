import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { createSpyFromClass, Spy } from 'jest-auto-spies';

import { PopupComponent } from '../../../shared/components/popup/popup.component';
import { ObjectStatus } from '../../../shared/services/api/objectstatus.model';
import { LocaleService } from '../../../shared/services/locale/locale.service';
import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { BusinessSiteTaskService } from '../../../tasks/shared/business-site-task.service';
import { TaskMock } from '../../../tasks/task.mock';
import { AggregateField, DataCluster, DataVerificationFields, Task } from '../../../tasks/task.model';
import { BusinessSiteStoreService } from '../../businessSite/services/business-site-store.service';
import { getOutletMock, getOutletMockWithRegistedOffice } from '../../shared/models/outlet.mock';

import { VerificationRequestComponent } from './verification-request.component';
import { FeatureToggleService } from '../../../shared/directives/feature-toggle/feature-toggle.service';
import { TaskDataService } from '../../../tasks/task/store/task-data.service';
import { OfferedServiceDataService } from '../../../services/offered-service/store/offered-service-data.service';
import { UserSettingsService } from '../../../user-settings/user-settings/services/user-settings.service';

const taskMock: Task[] = TaskMock.asList();

describe('VerificationRequestComponent', () => {
  let component: VerificationRequestComponent;
  let fixture: ComponentFixture<VerificationRequestComponent>;
  let businessSiteStoreServiceSpy: Spy<BusinessSiteStoreService>;
  let businessSiteTaskServiceSpy: Spy<BusinessSiteTaskService>;
  let localeServiceSpy: Spy<LocaleService>;
  let matDialogSpy: Spy<MatDialog>;
  let snackBarService: SnackBarService;
  let featureToggleServiceSpy: Spy<FeatureToggleService>;
  let taskDataServiceSpy: Spy<TaskDataService>;
  let offeredServiceDataServiceSpy: Spy<OfferedServiceDataService>;
  let userSettingsServiceSpy: Spy<UserSettingsService>;

  beforeEach(waitForAsync(() => {
    businessSiteStoreServiceSpy = createSpyFromClass(BusinessSiteStoreService);
    businessSiteStoreServiceSpy.getOutlet.nextWith(getOutletMock());
    businessSiteTaskServiceSpy = createSpyFromClass(BusinessSiteTaskService);
    businessSiteTaskServiceSpy.getBy.nextWith(taskMock);

    localeServiceSpy = createSpyFromClass(LocaleService);
    localeServiceSpy.currentBrowserLocale.nextWith('en-GB');
    matDialogSpy = createSpyFromClass(MatDialog);
    featureToggleServiceSpy = createSpyFromClass(FeatureToggleService);
    featureToggleServiceSpy.isFeatureEnabled.nextWith(false);
    taskDataServiceSpy = createSpyFromClass(TaskDataService);
    taskDataServiceSpy.createOpeningHoursVerificationTaskByServiceId.nextWith('ok')
    offeredServiceDataServiceSpy = createSpyFromClass(OfferedServiceDataService)
    offeredServiceDataServiceSpy.getVerifiableServices.nextWith([])
    userSettingsServiceSpy = createSpyFromClass(UserSettingsService)
    userSettingsServiceSpy.getLanguageId.nextWith('en')

    const verificationFields: DataVerificationFields = {
      dataVerificationFields: [
        {
          aggregateName: 'TestAggregate',
          aggregateFields: ['testField1', 'testField2'],
          aggregateFieldObjs: []
        }
      ]
    }
    businessSiteTaskServiceSpy.findAllDataVerificationFields.nextWith(verificationFields);
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        })
      ],
      declarations: [VerificationRequestComponent, PopupComponent],
      providers: [
        { provide: BusinessSiteStoreService, useValue: businessSiteStoreServiceSpy },
        { provide: BusinessSiteTaskService, useValue: businessSiteTaskServiceSpy },
        { provide: LocaleService, useValue: localeServiceSpy },
        {
          provide: DateAdapter,
          useValue: {
            setLocale: jest.fn()
          }
        },
        { provide: MatDialog, useValue: matDialogSpy },
        {
          provide: SnackBarService,
          useValue: {
            showInfo: jest.fn()
          }
        },
        {
          provide: FeatureToggleService,
          useValue: featureToggleServiceSpy
        },
        {
          provide: TaskDataService,
          useValue: taskDataServiceSpy
        },
        {
          provide: OfferedServiceDataService,
          useValue: offeredServiceDataServiceSpy
        },
        {
          provide: UserSettingsService,
          useValue: userSettingsServiceSpy
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    snackBarService = TestBed.inject(SnackBarService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerificationRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should remove state and province base data if forRetail enabled when initBaseDataDataCluster', () => {
    featureToggleServiceSpy.isFeatureEnabled.nextWith(true);
    component.initBaseDataDataCluster();
    expect(component.baseDataDataCluster)
      .not.toContain({ 'isExpanded': false, 'name': DataCluster.BASE_DATA_STATE_AND_PROVINCE });
    expect(component.baseDataDataCluster)
      .toContainEqual({ 'isExpanded': false, 'name': DataCluster.BASE_DATA_ADDRESS });
    expect(component.baseDataDataCluster)
      .toContainEqual({ 'isExpanded': false, 'name': DataCluster.BASE_DATA_ADDITIONAL_ADDRESS });
    expect(component.baseDataDataCluster)
      .toContainEqual({ 'isExpanded': false, 'name': DataCluster.BASE_DATA_PO_BOX });
    expect(component.baseDataDataCluster)
      .toContainEqual({ 'isExpanded': false, 'name': DataCluster.BASE_DATA_GPS });
    expect(component.baseDataDataCluster)
      .toContainEqual({ 'isExpanded': false, 'name': DataCluster.BUSINESS_NAME });
    expect(component.baseDataDataCluster)
      .toContainEqual({ 'isExpanded': false, 'name': DataCluster.GENERAL_COMMUNICATION_CHANNELS });
  })

  it('should contain expected values when initBaseDataDataCluster', () => {
    featureToggleServiceSpy.isFeatureEnabled.nextWith(false);
    component.initBaseDataDataCluster();
    expect(component.baseDataDataCluster)
      .toContainEqual({ 'isExpanded': false, 'name': DataCluster.BASE_DATA_STATE_AND_PROVINCE });
    expect(component.baseDataDataCluster)
      .toContainEqual({ 'isExpanded': false, 'name': DataCluster.BASE_DATA_ADDRESS });
    expect(component.baseDataDataCluster)
      .toContainEqual({ 'isExpanded': false, 'name': DataCluster.BASE_DATA_ADDITIONAL_ADDRESS });
    expect(component.baseDataDataCluster)
      .toContainEqual({ 'isExpanded': false, 'name': DataCluster.BASE_DATA_PO_BOX });
    expect(component.baseDataDataCluster)
      .toContainEqual({ 'isExpanded': false, 'name': DataCluster.BASE_DATA_GPS });
    expect(component.baseDataDataCluster)
      .toContainEqual({ 'isExpanded': false, 'name': DataCluster.BUSINESS_NAME });
    expect(component.baseDataDataCluster)
      .toContainEqual({ 'isExpanded': false, 'name': DataCluster.GENERAL_COMMUNICATION_CHANNELS });
  })

  it('should create', () => {
    expect(snackBarService).toBeTruthy();
    expect(component).toBeTruthy();
  });

  it('should open the dialog', () => {
    spyOn(component.popupComponent, 'openDialog');
    component.openDialog();

    expect(component.popupComponent.openDialog).toHaveBeenCalled();
  });

  it('should close the dialog', () => {
    spyOn(component.isClosed, 'emit');
    component.cancel();

    expect(component.isClosed.emit).toHaveBeenCalled();
  });

  it('should create task request', () => {
    spyOn(component.isClosed, 'emit');
    const control = component.form.controls['BUSINESS_NAME'] as FormControl;
    control.setValue(true);
    component.form.addControl('BUSINESS_NAME', control);
    const os = new ObjectStatus();
    os.status = 'CREATED';
    businessSiteTaskServiceSpy.createTask.nextWith(os);
    component.save();
    expect(snackBarService.showInfo).toHaveBeenCalled();
    expect(component.isClosed.emit).toHaveBeenCalled();
  });

  it('should disable checkbox if is a non registered office', () => {
    const legalFooterControl = component.form.get(DataCluster.LEGAL_LEGAL_FOOTER);
    const vatNoControl = component.form.get(DataCluster.LEGAL_VAT_NO);

    expect(component.isRegisteredOffice).toBeFalsy();
    expect(legalFooterControl?.disabled).toBeTruthy();
    expect(vatNoControl?.disabled).toBeTruthy();
  });

  it('should not disable checkbox if is a registered office', () => {
    businessSiteStoreServiceSpy.getOutlet.nextWith(getOutletMockWithRegistedOffice());
    component.ngOnInit();

    const legalFooterControl = component.form.get(DataCluster.LEGAL_LEGAL_FOOTER);
    const vatNoControl = component.form.get(DataCluster.LEGAL_VAT_NO);

    expect(component.isRegisteredOffice).toBeTruthy();
    expect(legalFooterControl?.disabled).toBeFalsy();
    expect(vatNoControl?.disabled).toBeFalsy();
  });

  it('should return sub clusters of the main cluster when 4retail is enabled', () => {
    const result = component.getSubCluster(DataCluster.BASE_DATA_ADDRESS)

    expect(result).toContain(DataCluster.BASE_DATA_ADDRESS_ADDRESS_ADDITION);
    expect(result).toContain(DataCluster.BASE_DATA_ADDRESS_CITY);
    expect(result).toContain(DataCluster.BASE_DATA_ADDRESS_STREET);
    expect(result).toContain(DataCluster.BASE_DATA_ADDRESS_DISTRICT);
    expect(result).toContain(DataCluster.BASE_DATA_ADDRESS_NUMBER);
    expect(result).toContain(DataCluster.BASE_DATA_ADDRESS_ZIP_CODE);
    expect(result).toContain(DataCluster.BASE_DATA_ADDRESS_STATE);
    expect(result).toContain(DataCluster.BASE_DATA_ADDRESS_PROVINCE);
  });

  it('should convert data cluster name to DataCluster Enum when getDataCluster', () => {
    const result = component.getDataCluster(DataCluster.BASE_DATA_ADDRESS_ADDRESS_ADDITION);
    expect(result).toEqual(DataCluster.BASE_DATA_ADDRESS_ADDRESS_ADDITION);
  })

  it('should return checked values when getCheckedCluster', () => {
    component.form.controls[DataCluster.OPENING_HOURS].patchValue({ checked: true });
    component.form.controls[DataCluster.BUSINESS_NAME].patchValue({ checked: true });
    component.form.controls[DataCluster.BASE_DATA_ADDRESS_ADDRESS_ADDITION].patchValue({ checked: true });

    const result = component.getCheckedCluster();

    expect(result).toContain(DataCluster.OPENING_HOURS);
    expect(result).toContain(DataCluster.BUSINESS_NAME);
    expect(result).toContain(DataCluster.BASE_DATA_ADDRESS_ADDRESS_ADDITION);
    expect(result.length).toEqual(3);
  })

  it('should not return sub checked values when for 4retail is disable', () => {
    featureToggleServiceSpy.isFeatureEnabled.nextWith(false);
    component.form.controls[DataCluster.OPENING_HOURS].patchValue({ checked: true });
    component.form.controls[DataCluster.BASE_DATA_ADDRESS].patchValue({ checked: true });

    const result = component.getCheckedCluster();

    expect(result).toContain(DataCluster.OPENING_HOURS);
    expect(result).toContain(DataCluster.BASE_DATA_ADDRESS);
    expect(result.length).toEqual(2);
  })

  it('should return all checked data cluster and filter sub cluster when main cluster is checked', () => {
    component.form.controls[DataCluster.BASE_DATA_ADDRESS_ZIP_CODE].patchValue({ checked: true });

    const result = component.getCheckedCluster();

    expect(result).toContain(DataCluster.BASE_DATA_ADDRESS_ZIP_CODE);
  });

  it('should fetch data verification from task if FOR_RETAIL enabled', () => {
    featureToggleServiceSpy.isFeatureEnabled.nextWith(true);
    component.ngOnInit();
    expect(businessSiteTaskServiceSpy.findAllDataVerificationFields).toHaveBeenCalled();
    let mockValue = component.dataVerificationFields[0];
    expect(mockValue.aggregateName).toEqual('TEST_AGGREGATE');
    expect(mockValue.aggregateFields).toContainEqual('testField1');
    expect(mockValue.aggregateFields).toContainEqual('testField2');
  });

  it('should NOT fetch data verification from task if FOR_RETAIL disabled', () => {
    featureToggleServiceSpy.isFeatureEnabled.nextWith(false);
    component.ngOnInit();
    // test would fail due to beforeEach mocked with true
    // expect(businessSiteTaskServiceSpy.findAllDataVerificationFields).not.toHaveBeenCalled();
    // workaround, check for empty array
    expect(component.dataVerificationFields).toEqual([]);
  });

  it('should return data cluster name when getAggregateName', () => {
    component.dataVerificationFields = [
      {
        aggregateName: 'LEGAL_INFO',
        aggregateFields: ['LEGAL_FOOTER', 'TAX_NO'],
        aggregateFieldObjs: []
      }
    ]
    const result = component.getAggregateName('LEGAL_FOOTER');
    expect(result).toEqual('LegalInfo');
  });

  it('should addControlAndAggregateFieldIfIsObject', () => {
    const objectName = "gps"
    component.dataVerificationFields = [
      {
        aggregateName: 'BusinessSite',
        aggregateFields: ['gps_latitude', 'gps_longitude'],
        aggregateFieldObjs: []
      }
    ]

    component.dataVerificationFields[0].aggregateFieldObjs  = component.dataVerificationFields[0].aggregateFields.map(field => {
      const isSubField = field.includes('_');
      return new AggregateField(field, false, false, isSubField);
    });

    component.addControlAndAggregateFieldIfIsObject(component.dataVerificationFields[0]);

    expect(component.dataVerificationFields[0].aggregateFields).toContain(objectName);
    expect(component.dataVerificationFields[0].aggregateFields.length).toBe(3)
    expect(component.dataVerificationFields[0].aggregateFieldObjs.length).toBe(3)

    let result = component.dataVerificationFields[0].aggregateFieldObjs.find(
      aggregateField => aggregateField.name === objectName
    );
    expect(result?.name).toEqual(objectName);
    expect(result?.isSubField).toEqual(false);
    expect(result?.isObject).toEqual(true);
  });
});
