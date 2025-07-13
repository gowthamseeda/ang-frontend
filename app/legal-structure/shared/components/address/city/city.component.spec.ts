import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';

import { TranslatePipeMock } from '../../../../../testing/pipe-mocks/translate';

import { CityComponent } from './city.component';
import { MatDialog } from '@angular/material/dialog';
import { TaskDataService } from '../../../../../tasks/task/store/task-data.service';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { AddressType } from '../../../models/address.model';
import { AGGREGATE_FIELDS, AGGREGATE_NAMES } from '../../../../../shared/model/constants';
import { DataCluster } from '../../../../../tasks/task.model';

function getAddressFormMock() {
  return new FormBuilder().group({
    address: new FormBuilder().group({
      city: ''
    })
  });
}

describe('CityComponent', () => {
  let component: CityComponent;
  let fixture: ComponentFixture<CityComponent>;
  let taskDataServiceSpy: Spy<TaskDataService>;
  let matDialogSpy: Spy<MatDialog>;

  beforeEach(
    waitForAsync(() => {
      taskDataServiceSpy = createSpyFromClass(TaskDataService);
      matDialogSpy = createSpyFromClass(MatDialog);

      TestBed.configureTestingModule({
        declarations: [CityComponent, TranslatePipeMock],
        providers: [
          { provide: TaskDataService, useValue: taskDataServiceSpy },
          { provide: MatDialog, useValue: matDialogSpy }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CityComponent);
    component = fixture.componentInstance;
    component.parentForm = getAddressFormMock();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit changes on form control change', () => {
    spyOn(component.cityChange, 'emit');

    component.formControlChange()

    expect(component.cityChange.emit).toBeCalled()
  })

  it('should return correct aggregateField for Main address type', () => {
    component.addressType = AddressType.Main;
    expect(component.aggregateField).toBe(AGGREGATE_FIELDS.BASE_DATA_ADDRESS_CITY);
  });

  it('should return correct aggregateField for Additional address type', () => {
    component.addressType = AddressType.Additional;
    expect(component.aggregateField).toBe(AGGREGATE_FIELDS.BASE_DATA_ADDITIONAL_ADDRESS_CITY);
  });

  it('should return correct aggregateName', () => {
    expect(component.aggregateName).toBe(AGGREGATE_NAMES.BUSINESS_SITE);
  });

  it('should return correct dataCluster for Main address type', () => {
    component.addressType = AddressType.Main;
    expect(component.dataCluster).toBe(DataCluster.BASE_DATA_ADDRESS_CITY);
  });

  it('should return correct dataCluster for Additional address type', () => {
    component.addressType = AddressType.Additional;
    expect(component.dataCluster).toBe(DataCluster.BASE_DATA_ADDITIONAL_ADDRESS);
  });
});
