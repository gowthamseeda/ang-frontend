import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { BusinessSiteStoreService } from '../../../legal-structure/businessSite/services/business-site-store.service';
import { getOutletMock } from '../../../legal-structure/shared/models/outlet.mock';
import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { TaskMock } from '../../task.mock';
import {AggregateDataField, DataVerificationFields, Status, Type} from '../../task.model';
import { BusinessSiteTaskService } from '../business-site-task.service';
// import { DataFieldVerificationDialogComponent } from '../data-field-verification-dialog/data-field-verification-dialog.component';
import { DataFieldVerificationButtonComponent } from './data-field-verification-button.component';
import {BaseData4rService} from "../../../legal-structure/outlet/base-data-4r.service";
import {of} from "rxjs";

describe('DataFieldVerificationButtonComponent', () => {
  let component: DataFieldVerificationButtonComponent;
  let fixture: ComponentFixture<DataFieldVerificationButtonComponent>;

  let matDialogSpy: Spy<MatDialog>;
  let businessSiteTaskServiceSpy: Spy<BusinessSiteTaskService>;
  let snackBarServiceSpy: Spy<SnackBarService>;
  let businessSiteStoreServiceSpy: Spy<BusinessSiteStoreService>;
  let baseData4rServiceSpy: Spy<BaseData4rService>;

  beforeEach(async () => {
    matDialogSpy = createSpyFromClass(MatDialog);
    businessSiteTaskServiceSpy = createSpyFromClass(BusinessSiteTaskService);
    snackBarServiceSpy = createSpyFromClass(SnackBarService);
    businessSiteStoreServiceSpy = createSpyFromClass(BusinessSiteStoreService);
    businessSiteStoreServiceSpy.getOutlet.nextWith(getOutletMock());
    baseData4rServiceSpy = createSpyFromClass(BaseData4rService);
    const mockDataVerificationFields: DataVerificationFields = {
      dataVerificationFields: [
        {
          aggregateName: 'Aggregate1',
          aggregateFields: ['Field1', 'Field2'],
          aggregateFieldObjs: [
            { name: 'Field1', isExpanded: false, isObject: false, isSubField: false, subFields: [] },
            { name: 'Field2', isExpanded: false, isObject: false, isSubField: false, subFields: [] }
          ]
        },
        {
          aggregateName: 'Aggregate2',
          aggregateFields: ['Field3', 'Field4'],
          aggregateFieldObjs: [
            { name: 'Field3', isExpanded: false, isObject: false, isSubField: false, subFields: [] },
            { name: 'Field4', isExpanded: false, isObject: false, isSubField: false, subFields: [] }
          ]
        }
      ]
    };
    businessSiteTaskServiceSpy.findAllDataVerificationFields.nextOneTimeWith( mockDataVerificationFields );

    await TestBed.configureTestingModule({
      declarations: [DataFieldVerificationButtonComponent],
      providers: [
        { provide: MatDialog, useValue: matDialogSpy },
        { provide: BusinessSiteTaskService, useValue: businessSiteTaskServiceSpy },
        { provide: SnackBarService, useValue: snackBarServiceSpy },
        { provide: BusinessSiteStoreService, useValue: businessSiteStoreServiceSpy },
        { provide: BaseData4rService, useValue: baseData4rServiceSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(DataFieldVerificationButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should open dialog on trigger verification', () => {
  //   const mockFieldData = TaskMock.verificationTriggerData;
  //   component.shouldShowDialog = true;
  //   component.fields = [mockFieldData];

  //   component.onTriggerVerification();

  //   expect(matDialogSpy.open).toBeCalledWith(DataFieldVerificationDialogComponent, {
  //     data: {
  //     fields: [
  //       {
  //         aggregateField: mockFieldData.aggregateField,
  //         aggregateName: mockFieldData.aggregateName,
  //         dataCluster: mockFieldData.dataCluster,
  //       }
  //     ],
  //     service: mockService 
  //   }
  //   });
  // });

  describe('shouldShowDialog = false', () => {
    it('should not open dialog when shouldShowDialog is false, api success', () => {
      businessSiteTaskServiceSpy.createTask.nextWith();
      const mockFieldData = TaskMock.verificationTriggerData;
      component.shouldShowDialog = false;
      component.fields = [mockFieldData];

      const taskData = {
        businessSiteId: getOutletMock().id,
        status: Status.OPEN,
        type: Type.DATA_VERIFICATION,
        comment: '',
        dueDate: '',
        aggregateField: mockFieldData.aggregateField,
        aggregateName: mockFieldData.aggregateName
      };

      component.onTriggerVerification();

      expect(businessSiteTaskServiceSpy.createTask).toBeCalledWith(taskData);
      expect(snackBarServiceSpy.showInfo).toBeCalledWith('DATA_VERIFICATION_SNACK_BAR');
    });

    it('should not open dialog when shouldShowDialog is false, api failed', () => {
      businessSiteTaskServiceSpy.createTask.throwWith(Error('TEST_ERROR'));

      const mockFieldData = TaskMock.verificationTriggerData;
      component.shouldShowDialog = false;
      component.fields = [mockFieldData];

      const taskData = {
        businessSiteId: getOutletMock().id,
        status: Status.OPEN,
        type: Type.DATA_VERIFICATION,
        comment: '',
        dueDate: '',
        aggregateField: mockFieldData.aggregateField,
        aggregateName: mockFieldData.aggregateName
      };

      component.onTriggerVerification();

      expect(businessSiteTaskServiceSpy.createTask).toBeCalledWith(taskData);
      expect(snackBarServiceSpy.showError).toBeCalledWith(Error('TEST_ERROR'));
    });
  });
  describe('initiateVerificationField', () => {
    it('should populate fields and filter out open verification tasks', () => {

      const mockFieldsToCheck: AggregateDataField[] = [
        { aggregateName: 'Aggregate1', aggregateField: 'Field1' },
        { aggregateName: 'Aggregate1', aggregateField: 'Field2' },
        { aggregateName: 'Aggregate2', aggregateField: 'Field3' },
        { aggregateName: 'Aggregate2', aggregateField: 'Field4' }
      ];

      baseData4rServiceSpy.isOpenVerificationTaskByAggregateField.mockReturnValue(of(false));

      component.fieldsStartName = 'Field';
      component.specificFields = ['test'];
      fixture.detectChanges();
      component.initiateVerificationField();

      expect(component.fields).toEqual(mockFieldsToCheck);

      component.isAllVerificationTasksAvailable.subscribe(isAvailable => {
        expect(isAvailable).toBe(false);
      });
    });

    it('should set isAllVerificationTasksAvailable to true if no fields are left', () => {
      baseData4rServiceSpy.isOpenVerificationTaskByAggregateField.mockReturnValueOnce(of(true));

      component.fieldsStartName = 'WrongField';
      component.specificFields = ['WrongField2'];
      fixture.detectChanges();
      component.initiateVerificationField();


      expect(component.fields).toEqual([]);

      component.isAllVerificationTasksAvailable.subscribe(isAvailable => {
        expect(isAvailable).toBe(true);
      });
    });
  });
});

