import { FormArray } from '@angular/forms';

import { KeyType } from '../key-type.model';
import { KeyTable } from './key-table';
import { KeyTableMock } from './key-table.mock';

describe('KeyTable', () => {
  describe('emptyRowExists', () => {
    it('should be true if an empty row exists', () => {
      const rows = new FormArray([
        KeyTableMock.getBrandCodeRowWithBrands(),
        KeyTableMock.getEmptyRow()
      ]);

      expect(KeyTable.emptyRowExists(rows)).toBeTruthy();
    });

    it('should be false if there is no empty row', () => {
      const rows = new FormArray([
        KeyTableMock.getBrandCodeRowWithBrands(),
        KeyTableMock.getBrandCodeRowWithoutBrands()
      ]);

      expect(KeyTable.emptyRowExists(rows)).toBeFalsy();
    });
  });

  describe('deleteRow', () => {
    it('should set deleted flag', () => {
      const row = KeyTableMock.getBrandCodeRowWithBrands();
      KeyTable.deleteRow(row);

      expect(row.value).toEqual({ deleted: true, type: 'BRAND_CODE' });
    });
  });

  describe('resetControl', () => {
    it('should reset the control', () => {
      const row = KeyTableMock.getBrandCodeRowWithoutBrands();
      KeyTable.resetControl(row, 'brands', ['MB', 'SMT'], []);

      const control = row.get('brands');
      if (control) {
        expect(control.value).toEqual(['MB', 'SMT']);
      }
    });
  });

  describe('controlByName', () => {
    it('should return the control by name', () => {
      const row = KeyTableMock.getBrandCodeRowWithBrands();

      expect(KeyTable.controlByName(row, 'key').value).toEqual('GS100');
    });
  });

  describe('hasBrandCode', () => {
    it('should be true if the rows have any brand code', () => {
      const rows = new FormArray([
        KeyTableMock.getBrandCodeRowWithBrands(),
        KeyTableMock.getBrandCodeRowWithoutBrands()
      ]);

      expect(KeyTable.hasBrandCode(rows)).toBeTruthy();
    });

    it('should be false if the rows do not have any brand codes', () => {
      const rows = new FormArray([
        KeyTableMock.getBrandCodeRowWithoutBrands(),
        KeyTableMock.getBrandCodeRowWithoutBrands()
      ]);

      expect(KeyTable.hasBrandCode(rows)).toBeTruthy();
    });
  });

  describe('isNewRow', () => {
    it('should return true if type is not set', () => {
      const row = KeyTableMock.getEmptyRow();

      expect(KeyTable.isNewRow(row)).toBeTruthy();
    });

    it('should return false if type is already set', () => {
      const row = KeyTableMock.getBrandCodeRowWithBrands();

      expect(KeyTable.isNewRow(row)).toBeFalsy();
    });
  });

  describe('isBrandDependent', () => {
    it('should return true for brand dependent key type', () => {
      const row = KeyTableMock.getBrandCodeRowWithBrands();

      expect(KeyTable.isBrandDependent(row)).toBeTruthy();
    });

    it('should return false for brand independent key type', () => {
      const row = KeyTableMock.getAliasRow();

      expect(KeyTable.isBrandDependent(row)).toBeFalsy();
    });
  });

  describe('isLastBrandCode', () => {
    it('should return true when a single brand code exists', () => {
      const rows = new FormArray([KeyTableMock.getBrandCodeRowWithBrands()]);

      expect(
        KeyTable.isLastBrandCode(KeyTableMock.getBrandCodeRowWithoutBrands(), rows)
      ).toBeTruthy();
    });

    it('should return false when multiple brand codes exist', () => {
      const rows = new FormArray([
        KeyTableMock.getBrandCodeRowWithBrands(),
        KeyTableMock.getBrandCodeRowWithoutBrands()
      ]);

      expect(KeyTable.isLastBrandCode(KeyTableMock.getBrandCodeRowWithBrands(), rows)).toBeFalsy();
    });

    it('should return true for brand code row, when only one brand code and another keys exist', () => {
      const rows = new FormArray([
        KeyTableMock.getBrandCodeRowWithBrands(),
        KeyTableMock.getAliasRow()
      ]);

      expect(
        KeyTable.isLastBrandCode(KeyTableMock.getBrandCodeRowWithoutBrands(), rows)
      ).toBeTruthy();
    });

    it('should return false for another key than brand code', () => {
      const rows = new FormArray([KeyTableMock.getAliasRow()]);

      expect(
        KeyTable.isLastBrandCode(KeyTableMock.getBrandCodeRowWithoutBrands(), rows)
      ).toBeFalsy();
    });
  });

  describe('getSelectedKeyTypes', () => {
    it('should return the selected key types', () => {
      const rows = new FormArray([
        KeyTableMock.getBrandCodeRowWithBrands(),
        KeyTableMock.getBrandCodeRowWithoutBrands(),
        KeyTableMock.getAliasRow()
      ]);

      expect(KeyTable.getSelectedKeyTypes(rows)).toEqual([
        KeyType.BRAND_CODE,
        KeyType.BRAND_CODE,
        KeyType.ALIAS
      ]);
    });
  });

  describe('brandRequiredForProductGroup', () => {
    it('should return no validation error if no brand and no product group is selected', () => {
      const invalidRow = KeyTableMock.getExternalKeyRow();

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(KeyTable.brandRequiredForProductGroup(invalidRow.get('brand')!!)).toBeFalsy();
    });

    it('should return no validation error if a brand but no product group is selected', () => {
      const invalidRow = KeyTableMock.getExternalKeyRow('key', 'MB');

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(KeyTable.brandRequiredForProductGroup(invalidRow.get('brand')!!)).toBeFalsy();
    });

    it('should return no validation error if both a brand and a product group is selected', () => {
      const invalidRow = KeyTableMock.getExternalKeyRow('key', 'MB', 'PC');

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(KeyTable.brandRequiredForProductGroup(invalidRow.get('brand')!!)).toBeFalsy();
    });

    it('should return a validation error if no brand but a product group is selected', () => {
      const invalidRow = KeyTableMock.getExternalKeyRow('key', undefined, 'PC');

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(KeyTable.brandRequiredForProductGroup(invalidRow.get('brand')!!)).toBeTruthy();
    });
  });
});
