import { GpsValidators } from './gps-validators';
import { FormBuilder, FormControl } from '@angular/forms';

describe('GpsValidators', () => {
  describe('latitudeValidator()', () => {
    it('should give no error if latitude is correct', () => {
      expect(GpsValidators.latitudeValidator(new FormControl('48.1768'))).toBeNull();
    });

    it('should give error if latitude is incorrect', () => {
      expect(GpsValidators.latitudeValidator(new FormControl('a48.1768'))).toEqual({
        latitude: true
      });
    });
  });

  describe('longitudeValidator()', () => {
    it('should give no error if longitude is incorrect', () => {
      expect(GpsValidators.longitudeValidator(new FormControl('a9.9769'))).toEqual({
        longitude: true
      });
    });

    it('should give error if longitude is correct', () => {
      expect(GpsValidators.longitudeValidator(new FormControl('9.9769'))).toBeNull();
    });
  });

  describe('gpsDataRequired()', () => {
    it('should give true if longitude is empty', () => {
      const fromGroup = new FormBuilder().group({
        gps: new FormBuilder().group({
          latitude: ['43.1233'],
          longitude: ['']
        })
      });
      expect(GpsValidators.longitudeEmpty(fromGroup)).toBeTruthy();
    });
    it('should give true if latitude is empty', () => {
      const fromGroup = new FormBuilder().group({
        gps: new FormBuilder().group({
          latitude: [''],
          longitude: ['9.23444']
        })
      });
      expect(GpsValidators.latitudeEmpty(fromGroup)).toBeTruthy();
    });
  });
  it('should give true if latitude and longitude are empty', () => {
    const fromGroup = new FormBuilder().group({
      gps: new FormBuilder().group({
        latitude: [''],
        longitude: ['']
      })
    });
    expect(GpsValidators.latitudeAndLongitudeEmpty(fromGroup)).toBeTruthy();
  });
});
