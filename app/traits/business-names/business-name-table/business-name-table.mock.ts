import { FormControl, FormGroup } from '@angular/forms';

export namespace BusinessNameTableMock {
  export function getRowWithBrands(): FormGroup {
    const row: FormGroup = new FormGroup({});
    row.setControl('name', new FormControl('BS100'));
    row.setControl('brands', new FormControl([{ brandId: 'MB' }, { brandId: 'SMT' }]));
    row.setControl('translations', new FormControl(null));
    row.setControl('deleted', new FormControl(false));

    return row;
  }

  export function getRowWithoutBrands(): FormGroup {
    const row: FormGroup = new FormGroup({});
    row.setControl('name', new FormControl('BS101'));
    row.setControl('brands', new FormControl([]));
    row.setControl('translations', new FormControl(null));
    row.setControl('deleted', new FormControl(false));

    return row;
  }

  export function getEmptyRow(): FormGroup {
    const row: FormGroup = new FormGroup({});
    row.setControl('name', new FormControl(''));
    row.setControl('brands', new FormControl(null));
    row.setControl('translations', new FormControl(null));
    row.setControl('deleted', new FormControl(false));

    return row;
  }
}
