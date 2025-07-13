import { FormBuilder } from '@angular/forms';
import { AddressValidators } from './address-validators';

describe('AddressValidators', () => {
  describe('addressAndGpsValidator()', () => {
    it('should give no error if address values are given and gps values are empty', () => {
      const formBuilder = new FormBuilder();
      const fromGroup = formBuilder.group({
        address: formBuilder.group({
          street: ['Haubachstrasse'],
          streetNumber: ['43'],
          zipCode: ['10585'],
          city: ['Berlin'],
          district: ['Mitte'],
          addressAddition: ['z. Hd. Frau Müller']
        }),
        gps: formBuilder.group({
          latitude: [''],
          longitude: ['']
        })
      });
      expect(AddressValidators.addressAndGpsValidator(fromGroup)).toBeNull();
    });

    it('should give no error if gps values are given and address values are empty', () => {
      const formBuilder = new FormBuilder();
      const fromGroup = formBuilder.group({
        address: formBuilder.group({
          street: [''],
          streetNumber: [''],
          zipCode: [''],
          city: ['Berlin'],
          district: ['Mitte'],
          addressAddition: ['z. Hd. Frau Müller']
        }),
        gps: formBuilder.group({
          latitude: ['43.1233'],
          longitude: ['9.23444']
        })
      });
      expect(AddressValidators.addressAndGpsValidator(fromGroup)).toBeNull();
    });

    it('should give no error if gps values are given and address city is empty', () => {
      const formBuilder = new FormBuilder();
      const fromGroup = formBuilder.group({
        address: formBuilder.group({
          street: [''],
          streetNumber: [''],
          zipCode: [''],
          city: [''],
          district: [''],
          addressAddition: ['']
        }),
        gps: formBuilder.group({
          latitude: ['43.1233'],
          longitude: ['9.23444']
        })
      });
      expect(AddressValidators.addressAndGpsValidator(fromGroup)).toEqual({
        addressAndGps: true
      });
    });

    it('should give no error if latitude value not given and address values are not empty', () => {
      const formBuilder = new FormBuilder();
      const fromGroup = formBuilder.group({
        address: formBuilder.group({
          street: ['Haubachstrasse'],
          streetNumber: ['43'],
          zipCode: ['10585'],
          city: ['Berlin'],
          district: ['Mitte'],
          addressAddition: ['z. Hd. Frau Müller']
        }),
        gps: formBuilder.group({
          latitude: [''],
          longitude: ['9.23444']
        })
      });
      expect(AddressValidators.addressAndGpsValidator(fromGroup)).toEqual({
        gps: true
      });
    });

    it('should give error if address and gps values are empty', () => {
      const formBuilder = new FormBuilder();
      const fromGroup = formBuilder.group({
        address: formBuilder.group({
          street: [''],
          streetNumber: [''],
          zipCode: [''],
          city: [''],
          district: [''],
          addressAddition: ['']
        }),
        gps: formBuilder.group({
          latitude: [''],
          longitude: ['']
        })
      });
      expect(AddressValidators.addressAndGpsValidator(fromGroup)).toEqual({
        addressAndGps: true
      });
    });
  });
});
