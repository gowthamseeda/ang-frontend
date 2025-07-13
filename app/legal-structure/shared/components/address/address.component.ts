import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

import { ComparableAddress } from '../../../../google/map-message/comparable-address.model';
import { LocationService } from '../../../location/services/location-service.model';
import { Address, AddressType } from '../../models/address.model';
import { DataNotification, DataNotificationChangeFields } from '../../../../notifications/models/notifications.model';
import { BaseDataUtil } from '../common/baseDataUtil';

@Component({
  selector: 'gp-address',
  templateUrl: './address.component.html'
})
export class AddressComponent implements OnInit, OnChanges {
  @Input()
  parentForm: UntypedFormGroup;
  @Input()
  address: Address = {
    street: '',
    streetNumber: '',
    zipCode: '',
    city: '',
    district: '',
    addressAddition: ''
  };
  @Input()
  addressStreetDataRequired = false;
  @Input()
  addressCityDataRequired = false;
  @Input()
  addressType: AddressType;
  @Input()
  dataNotification: DataNotification[];
  @Input()
  isRetailOutlet: boolean = false;

  dataNotificationChangeFields = new DataNotificationChangeFields()
  addressForm: UntypedFormGroup;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private locationService: LocationService,
    private baseDataUtils: BaseDataUtil
  ) {
  }

  ngOnInit(): void {
    this.initAddressForm();
    this.initDataNotificationsChangesFields();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.initDataNotificationsChangesFields();
  }

  formGroupChange(): void {
    const address = this.getOutletFormAddress();

    if (address?.country && address?.city && this.addressType === AddressType.Main) {
      this.locationService.updateLocationDataInStoreFor(address);
    }
  }

  private initAddressForm(): void {
    this.addressForm = this.formBuilder.group({});
    if (this.parentForm.disabled) {
      this.addressForm.disable();
    }
    this.parentForm.addControl(this.addressType, this.addressForm);
  }

  private getOutletFormAddress(): ComparableAddress | null {
    const addressWithType = <UntypedFormGroup>this.parentForm.get(this.addressType);
    return addressWithType === null ? null : this.formOutletFormAddress();
  }

  private formOutletFormAddress(): ComparableAddress {
    const countryId = this.parentForm.getRawValue().countryId;
    const address = (<UntypedFormGroup>this.parentForm.get(this.addressType)).value;
    return new ComparableAddress(
      address.streetNumber,
      address.street,
      address.city,
      countryId,
      address.zipCode
    );
  }

  private initDataNotificationsChangesFields() {
    this.dataNotificationChangeFields = { ...this.baseDataUtils.getDataNotificationChangeFields(this.dataNotification) };
  }
}
