import { FormControl, FormGroup } from '@angular/forms';

export namespace AssignedBrandLabelTableMock {
  export function getRowWithBrands(): FormGroup {
    const row: FormGroup = new FormGroup({});
    row.setControl('labelId', new FormControl('BL100'));
    row.setControl('brands', new FormControl([{ brandId: 'MB' }, { brandId: 'SMT' }]));
    row.setControl('deleted', new FormControl(false));

    return row;
  }

  export function getRowWithoutBrands(): FormGroup {
    const row: FormGroup = new FormGroup({});
    row.setControl('labelId', new FormControl('BL101'));
    row.setControl('brands', new FormControl([]));
    row.setControl('deleted', new FormControl(false));

    return row;
  }

  export function getEmptyRow(): FormGroup {
    const row: FormGroup = new FormGroup({});
    row.setControl('labelId', new FormControl(null));
    row.setControl('brands', new FormControl(null));
    row.setControl('deleted', new FormControl(false));

    return row;
  }
}
