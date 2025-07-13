import { FormArray } from '@angular/forms';

import { AssignedBrandLabelTable } from './assigned-brand-label-table';
import { AssignedBrandLabelTableMock } from './assigned-brand-label-table.mock';

describe('AssignedBrandLabelTable', () => {
  describe('emptyRowExists', () => {
    it('should be true if an empty row exists', () => {
      const rows = new FormArray([
        AssignedBrandLabelTableMock.getRowWithBrands(),
        AssignedBrandLabelTableMock.getEmptyRow()
      ]);

      expect(AssignedBrandLabelTable.emptyRowExists(rows)).toBeTruthy();
    });

    it('should be false if there is no empty row', () => {
      const rows = new FormArray([
        AssignedBrandLabelTableMock.getRowWithBrands(),
        AssignedBrandLabelTableMock.getRowWithoutBrands()
      ]);

      expect(AssignedBrandLabelTable.emptyRowExists(rows)).toBeFalsy();
    });
  });

  describe('selectedBrandIds', () => {
    it('should return all selected brandIds', () => {
      const rows = new FormArray([AssignedBrandLabelTableMock.getRowWithBrands()]);
      expect(AssignedBrandLabelTable.selectedBrandIds(rows)).toEqual(['MB', 'SMT']);
    });
  });

  describe('deleteRow', () => {
    it('should set deleted flag', () => {
      const row = AssignedBrandLabelTableMock.getRowWithBrands();
      AssignedBrandLabelTable.deleteRow(row);

      expect(row.value).toEqual({ deleted: true });
    });
  });
});
