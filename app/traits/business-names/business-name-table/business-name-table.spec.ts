import { FormArray } from '@angular/forms';

import { BusinessNameTable } from './business-name-table';
import { BusinessNameTableMock } from './business-name-table.mock';

describe('BusinessNameTable', () => {
  describe('emptyRowExists', () => {
    it('should be true if an empty row exists', () => {
      const rows = new FormArray([
        BusinessNameTableMock.getRowWithBrands(),
        BusinessNameTableMock.getEmptyRow()
      ]);

      expect(BusinessNameTable.emptyRowExists(rows)).toBeTruthy();
    });

    it('should be false if there is no empty row', () => {
      const rows = new FormArray([
        BusinessNameTableMock.getRowWithBrands(),
        BusinessNameTableMock.getRowWithoutBrands()
      ]);

      expect(BusinessNameTable.emptyRowExists(rows)).toBeFalsy();
    });
  });

  describe('allAvailableBrandIdsSelected', () => {
    it('should be true if all available brandIds are selected', () => {
      const rows = new FormArray([BusinessNameTableMock.getRowWithBrands()]);
      const availableBrandIds = ['MB', 'SMT'];
      expect(BusinessNameTable.allAvailableBrandIdsSelected(availableBrandIds, rows)).toBeTruthy();
    });

    it('should be false if not all available brandIds are selected', () => {
      const rows = new FormArray([BusinessNameTableMock.getRowWithBrands()]);
      const availableBrandIds = ['MB', 'SMT', 'FUSO'];
      expect(BusinessNameTable.allAvailableBrandIdsSelected(availableBrandIds, rows)).toBeFalsy();
    });
  });

  describe('selectedBrandIds', () => {
    it('should return all selected brandIds', () => {
      const rows = new FormArray([BusinessNameTableMock.getRowWithBrands()]);
      expect(BusinessNameTable.selectedBrandIds(rows)).toEqual(['MB', 'SMT']);
    });
  });

  describe('deleteRow', () => {
    it('should set deleted flag', () => {
      const row = BusinessNameTableMock.getRowWithBrands();
      BusinessNameTable.deleteRow(row);

      expect(row.value).toEqual({ deleted: true });
    });
  });
});
