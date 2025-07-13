import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';

import { TranslatePipeMock } from '../../../../../testing/pipe-mocks/translate';

import { DistrictComponent } from './district.component';
import { AddressType } from '../../../models/address.model';
import { DataCluster } from '../../../../../tasks/task.model';
import { AGGREGATE_FIELDS, AGGREGATE_NAMES } from '../../../../../shared/model/constants';

function getAddressFormMock() {
  return new FormBuilder().group({
    address: new FormBuilder().group({
      district: ''
    })
  });
}

describe('DistrictComponent', () => {
  let component: DistrictComponent;
  let fixture: ComponentFixture<DistrictComponent>;

  beforeEach(
    waitForAsync(() => {

      TestBed.configureTestingModule({
        declarations: [DistrictComponent, TranslatePipeMock],
        providers: [],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DistrictComponent);
    component = fixture.componentInstance;
    component.parentForm = getAddressFormMock();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return correct aggregateField for Main address type', () => {
    component.addressType = AddressType.Main;
    expect(component.aggregateField).toBe(AGGREGATE_FIELDS.BASE_DATA_ADDRESS_DISTRICT);
  });

  it('should return correct aggregateField for Additional address type', () => {
    component.addressType = AddressType.Additional;
    expect(component.aggregateField).toBe(AGGREGATE_FIELDS.BASE_DATA_ADDITIONAL_ADDRESS_DISTRICT);
  });

  it('should return correct aggregateName', () => {
    expect(component.aggregateName).toBe(AGGREGATE_NAMES.BUSINESS_SITE);
  });

  it('should return correct dataCluster for Main address type', () => {
    component.addressType = AddressType.Main;
    expect(component.dataCluster).toBe(DataCluster.BASE_DATA_ADDRESS_DISTRICT);
  });

  it('should return correct dataCluster for Additional address type', () => {
    component.addressType = AddressType.Additional;
    expect(component.dataCluster).toBe(DataCluster.BASE_DATA_ADDITIONAL_ADDRESS);
  });
});
