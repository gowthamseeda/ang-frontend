import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

import { ComparableAddress } from '../../../google/map-message/comparable-address.model';
import { GpsValidators } from '../../../shared/validators/gps-validators';
import { LocationService } from '../../location/services/location-service.model';
import { AddressType } from '../../shared/models/address.model';
import { Company } from '../company.model';

@Component({
  selector: 'gp-company-form',
  templateUrl: './company-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompanyFormComponent {
  @Input()
  parentForm: UntypedFormGroup;
  @Input()
  company: Company;

  mainAddress = AddressType.Main;

  constructor(private locationService: LocationService) {}

  addressStreetDataRequired(): boolean {
    const gpsGroup = this.parentForm.get('gps');
    if (!gpsGroup) {
      return true;
    }
    return (
      GpsValidators.longitudeEmpty(gpsGroup.value) && GpsValidators.latitudeEmpty(gpsGroup.value)
    );
  }

  calculateMapsData(): void {
    this.locationService.updateLocationDataInStoreFor(this.getOutletFormAddress());
  }

  private getOutletFormAddress(): ComparableAddress {
    const address = (<UntypedFormGroup>this.parentForm.get('address')).value;
    return new ComparableAddress(
      address.streetNumber,
      address.street,
      address.city,
      this.parentForm.value.countryId,
      address.zipCode
    );
  }
}
