import { UntypedFormGroup, ValidationErrors } from '@angular/forms';

import { GpsValidators } from './gps-validators';

export class AddressValidators {
  static addressAndGpsValidator(formGroup: UntypedFormGroup): ValidationErrors | null {
    const addressGroup = formGroup.get('address');
    const address = addressGroup ? addressGroup.value : '';
    const gpsGroup = formGroup.get('gps');
    const gps = gpsGroup ? gpsGroup.value : '';

    if (!address || !gps) {
      return null;
    }

    if ((!address.street || !address.city) && GpsValidators.latitudeAndLongitudeEmpty(gps)) {
      return { addressAndGps: true };
    }

    if (GpsValidators.latitudeAndLongitudeEmpty(gps)) {
      return null;
    }

    if (GpsValidators.longitudeSetAndLatitudeEmpty(gps)) {
      return { gps: true };
    }

    if (address.city === undefined || address.city.length === 0) {
      return { addressAndGps: true };
    }

    if (GpsValidators.latitudeSetAndLongitudeEmpty(gps)) {
      return { gps: true };
    }

    return null;
  }
}
