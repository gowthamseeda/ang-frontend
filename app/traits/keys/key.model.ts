import { Brand } from '../brand.model';

import { KeyType } from './key-type.model';

export class GroupedKey {
  type?: KeyType;
  key: string;
  brands: Brand[];
  deleted = false;
  readonly = false;

  constructor(type?: KeyType, key?: string, brands?: Brand[], readonly?: boolean) {
    this.type = type;
    this.key = key || '';
    this.brands = brands || [];
    this.readonly = readonly || false;
  }
}

export interface FlatKey {
  type?: KeyType;
  key: string;
  brandId?: string;
}

export namespace GroupedKey {
  export function toFlatKeys(value: GroupedKey): FlatKey[] {
    if (!value.key || value.key === '') {
      return [];
    }

    if (value.brands && value.brands.length > 0) {
      return value.brands.map(brand => ({
        type: value.type,
        key: value.key,
        brandId: brand.brandId
      }));
    }
    return [
      {
        type: value.type,
        key: value.key
      }
    ];
  }

  export function hasReadonlyBrand(key: GroupedKey): boolean {
    return key.brands.some(brand => brand.readonly);
  }
}
