import { FormBuilder } from '@angular/forms';
import { POBoxValidators } from './pobox-validators';

describe('POBoxValidators', () => {
  describe('poBoxZipCodeEmpty()', () => {
    it('should return true if PO Box ZIP code is empty', () => {
      const fromGroup = new FormBuilder().group({
        zipCode: ['']
      });
      expect(POBoxValidators.poBoxZipCodeEmpty(fromGroup.value)).toBeTruthy();
    });
    it('should return false if PO Box ZIP code is not empty', () => {
      const fromGroup = new FormBuilder().group({
        zipCode: ['12345']
      });
      expect(POBoxValidators.poBoxZipCodeEmpty(fromGroup.value)).toBeFalsy();
    });
  });

  describe('poBoxCityEmpty()', () => {
    it('should return true if PO Box city is empty', () => {
      const fromGroup = new FormBuilder().group({
        city: ['']
      });
      expect(POBoxValidators.poBoxCityEmpty(fromGroup.value)).toBeTruthy();
    });
    it('should return false if PO Box city is not empty', () => {
      const fromGroup = new FormBuilder().group({
        city: ['Ulm']
      });
      expect(POBoxValidators.poBoxCityEmpty(fromGroup.value)).toBeFalsy();
    });
  });

  describe('poBoxNumberEmpty()', () => {
    it('should return true if PO Box number is empty', () => {
      const fromGroup = new FormBuilder().group({
        number: ['']
      });
      expect(POBoxValidators.poBoxNumberEmpty(fromGroup.value)).toBeTruthy();
    });
    it('should return false if PO Box number is not empty', () => {
      const fromGroup = new FormBuilder().group({
        number: ['12345']
      });
      expect(POBoxValidators.poBoxNumberEmpty(fromGroup.value)).toBeFalsy();
    });
  });

  describe('poBoxDetailsRequiredForCountry()', () => {
    it('should return true if PO Box details required for country', () => {
      expect(POBoxValidators.poBoxDetailsRequiredForCountry('DE')).toBeTruthy();
    });
    it('should return false if PO Box details not required for country', () => {
      expect(POBoxValidators.poBoxDetailsRequiredForCountry('FR')).toBeFalsy();
    });
  });

  describe('poBoxNumberRequired()', () => {
    it('should return true if PO Box city are present', () => {
      const form = new FormBuilder().group({
        city: ['Test']
      });
      expect(POBoxValidators.poBoxNumberRequired(form)).toBeTruthy();
    });
    it('should return true if PO Box ZIP code are present', () => {
      const form = new FormBuilder().group({
        zipCode: ['12345']
      });
      expect(POBoxValidators.poBoxNumberRequired(form)).toBeTruthy();
    });
    it('should return false if no PO Box details are present', () => {
      const form = new FormBuilder().group({
        zipCode: [''],
        city: ['']
      });
      expect(POBoxValidators.poBoxNumberRequired(form)).toBeFalsy();
    });
  });

  describe('poBoxCityRequired()', () => {
    it('should return false if PO Box city are not required for country', () => {
      const form = new FormBuilder().group({});
      expect(POBoxValidators.poBoxCityRequired('FR', form)).toBeFalsy();
    });
    it('should return true if PO Box city are required when PO Box number is present', () => {
      const form = new FormBuilder().group({
        number: ['12345']
      });
      expect(POBoxValidators.poBoxCityRequired('DE', form)).toBeTruthy();
    });
    it('should return true if PO Box city are required when PO Box zipCode is present', () => {
      const form = new FormBuilder().group({
        zipCode: ['12345']
      });
      expect(POBoxValidators.poBoxCityRequired('DE', form)).toBeTruthy();
    });
    it('should return false if no PO Box city is required', () => {
      const form = new FormBuilder().group({});
      expect(POBoxValidators.poBoxCityRequired('DE', form)).toBeFalsy();
    });
  });

  describe('poBoxZipCodeRequired()', () => {
    it('should return false if PO Box ZIP code are not required for country', () => {
      const form = new FormBuilder().group({});
      expect(POBoxValidators.poBoxZipCodeRequired('FR', form)).toBeFalsy();
    });
    it('should return true if PO Box ZIP code are required when PO Box number is present', () => {
      const form = new FormBuilder().group({
        number: ['12345']
      });
      expect(POBoxValidators.poBoxZipCodeRequired('DE', form)).toBeTruthy();
    });
    it('should return true if PO Box ZIP code are required when PO Box city is present', () => {
      const form = new FormBuilder().group({
        city: ['12345']
      });
      expect(POBoxValidators.poBoxZipCodeRequired('DE', form)).toBeTruthy();
    });
    it('should return false if no PO Box ZIP code is required', () => {
      const form = new FormBuilder().group({});
      expect(POBoxValidators.poBoxZipCodeRequired('DE', form)).toBeFalsy();
    });
  });
});
