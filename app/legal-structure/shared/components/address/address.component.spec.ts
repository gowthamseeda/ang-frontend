import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { createSpyFromClass, Spy } from 'jest-auto-spies';
import { TestingModule } from '../../../../testing/testing.module';
import { LocationService } from '../../../location/services/location-service.model';

import { AddressAdditionComponent } from './address-addition/address-addition.component';
import { AddressComponent } from './address.component';
import { DataNotificationChangeFields } from '../../../../notifications/models/notifications.model';
import { AddressType } from '../../models/address.model';
import { BaseDataUtil } from '../common/baseDataUtil';
import { CityComponent } from './city/city.component';
import { DistrictComponent } from './district/district.component';
import { StreetNumberComponent } from './street-number/street-number.component';
import { StreetComponent } from './street/street.component';
import { ZipCodeComponent } from './zip-code/zip-code.component';

describe('AddressFormComponent', () => {
  let component: AddressComponent;
  let fixture: ComponentFixture<AddressComponent>;

  let locationServiceSpy: Spy<LocationService>;
  let baseDataUtilSpy: Spy<BaseDataUtil>;

  beforeEach(waitForAsync(() => {
    locationServiceSpy = createSpyFromClass(LocationService);
    locationServiceSpy.updateLocationDataInStoreFor.mockReturnValue(true);
    baseDataUtilSpy = createSpyFromClass(BaseDataUtil);
    baseDataUtilSpy.getDataNotificationChangeFields.mockReturnValue(new DataNotificationChangeFields());
    TestBed.configureTestingModule({
      declarations: [
        AddressComponent,
        AddressAdditionComponent,
        CityComponent,
        DistrictComponent,
        StreetComponent,
        StreetNumberComponent,
        ZipCodeComponent
      ],
      providers: [
        { provide: LocationService, useValue: locationServiceSpy },
        { provide: BaseDataUtil, useValue: baseDataUtilSpy },
      ],
      imports: [ReactiveFormsModule, TestingModule],
      schemas: [NO_ERRORS_SCHEMA]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressComponent);
    component = fixture.componentInstance;
    component.parentForm = new FormGroup({ test: new FormControl() });
    component.dataNotification = [];
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should initialize address form on init', () => {
    component.addressType = AddressType.Main

    component.ngOnInit();
    expect(component.addressForm).toBeDefined();
    expect(component.parentForm.contains(AddressType.Main)).toBeTruthy();
  });

  it('should disable address form if parent form is disabled', () => {
    component.parentForm.disable();
    component.ngOnInit();
    expect(component.addressForm.disabled).toBeTruthy();
  });
});
