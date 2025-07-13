import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UntypedFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Spy, createSpyFromClass } from 'jest-auto-spies';
import moment from 'moment';
import { BusinessSiteStoreService } from '../../../legal-structure/businessSite/services/business-site-store.service';
import { getOutletMock } from '../../../legal-structure/shared/models/outlet.mock';
import { FeatureToggleService } from '../../../shared/directives/feature-toggle/feature-toggle.service';
import { AGGREGATE_FIELDS, AGGREGATE_NAMES } from '../../../shared/model/constants';
import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { TranslatePipeMock } from '../../../testing/pipe-mocks/translate';
import { TaskMock } from '../../task.mock';
import { DataCluster, Status, Type } from '../../task.model';
import { BusinessSiteTaskService } from '../business-site-task.service';
// import { DataFieldVerificationDialogComponent } from './data-field-verification-dialog.component';
import { of } from 'rxjs';
import { Service } from '../../../opening-hours/store/reducers';
import { AggregateDataField } from '../../task.model';
import { DataFieldVerificationDialogComponent } from './data-field-verification-dialog.component';
import { OfferedServiceDataService } from 'app/services/offered-service/store/offered-service-data.service';
import { UserSettingsService } from 'app/user-settings/user-settings/services/user-settings.service';
import { TaskDataService } from 'app/tasks/task/store/task-data.service';


const mock4RVerificationTaskCreationData = {
  businessSiteId: getOutletMock().id,
  status: Status.OPEN,
  type: Type.DATA_VERIFICATION,
  comment: 'TESTING',
  dueDate: moment(new Date('2024-08-30')).toDate().toISOString(),
  aggregateName: AGGREGATE_NAMES.BUSINESS_SITE_LEGAL_INFO,
  aggregateField: AGGREGATE_FIELDS.LEGAL_INFO_TAX_NUMBER,
}

const mockNon4RVerificationTaskCreationData = {
  businessSiteId: getOutletMock().id,
  status: Status.OPEN,
  type: Type.DATA_VERIFICATION,
  comment: 'TESTING',
  dueDate: moment(new Date('2024-08-30')).toDate().toISOString(),
  dataCluster: DataCluster.LEGAL_TAX_NO,
  
}

const mockService: Service = {
        serviceId: 1,
        serviceName: 'Test Service',
        serviceCharacteristicName: 'test name',
        serviceCharacteristicsId: '200',
        productCategoryId: "3",
        name: "service_name",
        translations:[]
        
};


describe('DataFieldVerificationDialogComponent', () => {
  let component: DataFieldVerificationDialogComponent;
  let fixture: ComponentFixture<DataFieldVerificationDialogComponent>;

  let matDialogRefSpy: Spy<MatDialogRef<DataFieldVerificationDialogComponent>>
  let businessSiteStoreServiceSpy: Spy<BusinessSiteStoreService>
  let businessSiteTaskServiceSpy: Spy<BusinessSiteTaskService>
  let snackBarServiceSpy: Spy<SnackBarService>
  let featureToggleServiceSpy: Spy<FeatureToggleService>
  let offeredServiceDataService: Spy<OfferedServiceDataService>
  let userSettingsService: Spy<UserSettingsService>
  let taskDataService: Spy<TaskDataService>

  beforeEach(async () => {
    matDialogRefSpy = createSpyFromClass(MatDialogRef<DataFieldVerificationDialogComponent>)
    businessSiteStoreServiceSpy = createSpyFromClass(BusinessSiteStoreService)
    offeredServiceDataService = createSpyFromClass(OfferedServiceDataService)
    userSettingsService = createSpyFromClass(UserSettingsService)
    businessSiteStoreServiceSpy.getOutlet.nextWith(getOutletMock())
    businessSiteTaskServiceSpy = createSpyFromClass(BusinessSiteTaskService)
    snackBarServiceSpy = createSpyFromClass(SnackBarService)
    featureToggleServiceSpy = createSpyFromClass(FeatureToggleService)
    taskDataService = createSpyFromClass(TaskDataService)
    featureToggleServiceSpy.isFeatureEnabled.nextWith(true)
    spyOn(offeredServiceDataService, 'getVerifiableServices').and.returnValue(of([]));
    spyOn(userSettingsService, 'getLanguageId').and.returnValue(of([]));

    await TestBed.configureTestingModule({
      declarations: [DataFieldVerificationDialogComponent, TranslatePipeMock],
      imports: [ReactiveFormsModule, MatDatepickerModule, MatNativeDateModule],
      providers: [
        TranslatePipeMock,
        UntypedFormBuilder,
        { provide: MatDialogRef, useValue: matDialogRefSpy },
        { provide: BusinessSiteStoreService, useValue: businessSiteStoreServiceSpy },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            fields: TaskMock.verificationTriggerData,
            service: mockService
          }
        },
        { provide: BusinessSiteTaskService, useValue: businessSiteTaskServiceSpy },
        { provide: SnackBarService, useValue: snackBarServiceSpy },
        { provide: FeatureToggleService, useValue: featureToggleServiceSpy },
        { provide: OfferedServiceDataService, useValue: offeredServiceDataService },
        { provide: UserSettingsService, useValue: userSettingsService },
        { provide: TaskDataService, useValue: taskDataService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DataFieldVerificationDialogComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should trigger close when trigger close dialog', () => {
    component.closeDialog()

    expect(matDialogRefSpy.close).toBeCalled()
  })

  describe('onSubmit', () => {
    it('should display success snackbar if verification task is successfully created with 4R enabled', () => {
      businessSiteTaskServiceSpy.createTask.mockReturnValue(of({}));
      component.form.get('comment')?.setValue('TESTING');
      component.form.get('dueDate')?.setValue(new Date('2024-08-30'));
      const mockFields: AggregateDataField[] = [
        { aggregateField: 'taxNo', aggregateName: 'BusinessSiteLegalInfo' }
      ];
      component.data = {
        fields: mockFields,
        service: mockService
      };

      component.onSubmit()

      expect(businessSiteTaskServiceSpy.createTask).toBeCalledWith(mock4RVerificationTaskCreationData)
      expect(snackBarServiceSpy.showInfo).toBeCalledWith('DATA_VERIFICATION_SNACK_BAR')
      expect(matDialogRefSpy.close).toBeCalled()
    })

    it('should display error snackbar if task failed to accept with 4R enabled', () => {
      businessSiteTaskServiceSpy.createTask.throwWith(Error)
      component.form.get('comment')?.setValue('TESTING');
      component.form.get('dueDate')?.setValue(new Date('2024-08-30'));
      const mockFields: AggregateDataField[] = [
        { aggregateField: 'taxNo', aggregateName: 'BusinessSiteLegalInfo' }
      ];
      component.data = {
        fields: mockFields,
        service: mockService
      };

      component.onSubmit()

      expect(businessSiteTaskServiceSpy.createTask).toBeCalledWith(mock4RVerificationTaskCreationData)
      expect(snackBarServiceSpy.showError).toBeCalledWith(Error)
    })

    it('should display success snackbar if verification task is successfully created with 4R disabled', () => {
      featureToggleServiceSpy.isFeatureEnabled.nextWith(false)
      businessSiteTaskServiceSpy.createTask.mockReturnValue(of({}));
      component.form.get('comment')?.setValue('TESTING');
      component.form.get('dueDate')?.setValue(new Date('2024-08-30'));
      const mockFields: AggregateDataField[] = [
        { dataCluster: 'LEGAL_TAX_NO'}
      ];
      component.data = {
        fields: mockFields,
        service: mockService
      };

      component.onSubmit()

      expect(businessSiteTaskServiceSpy.createTask).toBeCalledWith(mockNon4RVerificationTaskCreationData)
      expect(snackBarServiceSpy.showInfo).toBeCalledWith('DATA_VERIFICATION_SNACK_BAR')
      expect(matDialogRefSpy.close).toBeCalled()
    })

    // it('should display error snackbar if task failed to accept with 4R disabled', () => {
    //   featureToggleServiceSpy.isFeatureEnabled.nextWith(false)
    //   businessSiteTaskServiceSpy.createTask.throwWith(Error)
    //   component.form.get('comment')?.setValue('TESTING');
    //   component.form.get('dueDate')?.setValue(new Date('2024-08-30'));
    //   const mockFields: AggregateDataField[] = [
    //     { dataCluster: 'LEGAL_TAX_NO',
    //       aggregateField: 'taxNo', aggregateName: 'BusinessSiteLegalInfo'
    //     }
    //   ];
    //   component.data = {
    //     fields: mockFields,
    //     service: mockService
    //   };

    //   component.onSubmit()

    //   expect(businessSiteTaskServiceSpy.createTask).toBeCalledWith(mockNon4RVerificationTaskCreationData)
    //   expect(snackBarServiceSpy.showError).toBeCalledWith(Error)
    // })
  })
});
