import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';

import { TranslatePipeMock } from '../../../../../testing/pipe-mocks/translate';

import { AddressAdditionComponent } from './address-addition.component';
import { AddressType } from '../../../models/address.model';
import { DataCluster } from '../../../../../tasks/task.model';
import { AGGREGATE_FIELDS, AGGREGATE_NAMES } from '../../../../../shared/model/constants';

function getAddressFormMock() {
  return new FormBuilder().group({
    address: new FormBuilder().group({
      addressAddition: ''
    })
  });
}

describe('AddressAdditionComponent', () => {
  let component: AddressAdditionComponent;
  let fixture: ComponentFixture<AddressAdditionComponent>;

  beforeEach(
    waitForAsync(() => {

      TestBed.configureTestingModule({
        declarations: [AddressAdditionComponent, TranslatePipeMock],
        providers: [],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressAdditionComponent);
    component = fixture.componentInstance;
    component.parentForm = getAddressFormMock();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return correct aggregateField for Main address type', () => {
    component.addressType = AddressType.Main;
    expect(component.aggregateField).toBe(AGGREGATE_FIELDS.BASE_DATA_ADDRESS_ADDRESS_ADDITION);
  });

  it('should return correct aggregateField for Additional address type', () => {
    component.addressType = AddressType.Additional;
    expect(component.aggregateField).toBe(AGGREGATE_FIELDS.BASE_DATA_ADDITIONAL_ADDRESS_ADDRESS_ADDITION);
  });

  it('should return correct aggregateName', () => {
    expect(component.aggregateName).toBe(AGGREGATE_NAMES.BUSINESS_SITE);
  });

  it('should return correct dataCluster for Main address type', () => {
    component.addressType = AddressType.Main;
    expect(component.dataCluster).toBe(DataCluster.BASE_DATA_ADDRESS_ADDRESS_ADDITION);
  });

  it('should return correct dataCluster for Additional address type', () => {
    component.addressType = AddressType.Additional;
    expect(component.dataCluster).toBe(DataCluster.BASE_DATA_ADDITIONAL_ADDRESS);
  });
});
