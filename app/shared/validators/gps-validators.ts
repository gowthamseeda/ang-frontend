import { AbstractControl, ValidationErrors } from '@angular/forms';

export class GpsValidators {
  static latitudeValidator(c: AbstractControl): ValidationErrors | null {
    if (c.value === '') {
      return null;
    }
    const LATITUDE_REGEXP = /^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/;
    return LATITUDE_REGEXP.test(c.value) ? null : { latitude: true };
  }

  static longitudeValidator(c: AbstractControl): ValidationErrors | null {
    c.markAsTouched();
    if (c.value === '') {
      return null;
    }
    const LONGITUDE_REGEXP = /^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$/;
    return LONGITUDE_REGEXP.test(c.value) ? null : { longitude: true };
  }

  static latitudeAndLongitudeEmpty(gps: any): boolean {
    if (gps === null) {
      return true;
    }
    return GpsValidators.latitudeEmpty(gps) && GpsValidators.longitudeEmpty(gps);
  }

  static longitudeSetAndLatitudeEmpty(gps: any): boolean {
    if (gps === null) {
      return true;
    }
    return gps.longitude != null && GpsValidators.latitudeEmpty(gps);
  }

  static latitudeSetAndLongitudeEmpty(gps: any): boolean {
    if (gps === null) {
      return true;
    }
    return gps.latitude != null && GpsValidators.longitudeEmpty(gps);
  }

  static latitudeEmpty(gps: any): boolean {
    if (gps === null) {
      return true;
    }
    return gps.latitude === undefined || gps.latitude === null || gps.latitude.length === 0;
  }

  static longitudeEmpty(gps: any): boolean {
    if (gps === null) {
      return true;
    }
    return gps.longitude === undefined || gps.longitude === null || gps.longitude.length === 0;
  }
}
