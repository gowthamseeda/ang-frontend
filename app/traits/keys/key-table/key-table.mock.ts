import { FormControl, FormGroup } from '@angular/forms';

import { ExternalKeyType } from '../external-key-type-selection/external-key-type.model';
import { KeyType } from '../key-type.model';
import { Brand } from '../../brand.model';

export namespace KeyTableMock {
  export function getBrandCodeRowWithBrands(): FormGroup {
    const row: FormGroup = new FormGroup({});
    row.setControl('key', new FormControl('GS100'));
    row.setControl('brands', new FormControl([{ brandId: 'MB' }, { brandId: 'SMT' }]));
    row.setControl('type', new FormControl(KeyType.BRAND_CODE));
    row.setControl('deleted', new FormControl(false));

    return row;
  }

  export function getBrandCodeRowWithoutBrands(): FormGroup {
    const row: FormGroup = new FormGroup({});
    row.setControl('key', new FormControl('GS101'));
    row.setControl('brands', new FormControl([]));
    row.setControl('type', new FormControl(KeyType.BRAND_CODE));
    row.setControl('deleted', new FormControl(false));

    return row;
  }

  export function getAliasRow(): FormGroup {
    const row: FormGroup = new FormGroup({});
    row.setControl('key', new FormControl('GS102'));
    row.setControl('brands', new FormControl([]));
    row.setControl('type', new FormControl(KeyType.ALIAS));
    row.setControl('deleted', new FormControl(false));

    return row;
  }

  export function getEmptyRow(): FormGroup {
    const row: FormGroup = new FormGroup({});
    row.setControl('key', new FormControl(null));
    row.setControl('brands', new FormControl(null));
    row.setControl('type', new FormControl(null));
    row.setControl('deleted', new FormControl(false));

    return row;
  }

  export function getExternalKeyRow(
    key?: string | undefined,
    brand?: string | undefined,
    productGroupId?: string | undefined
  ): FormGroup {
    const row: FormGroup = new FormGroup({});
    row.setControl('keyType', new FormControl(new ExternalKeyType('COFICO01', 'COFICO01', 10)));
    row.setControl('value', new FormControl(key === undefined ? 'key' : key));
    row.setControl('brand', new FormControl(brand ? new Brand(brand) : undefined));
    row.setControl('productGroupId', new FormControl(productGroupId));
    return row;
  }
}
