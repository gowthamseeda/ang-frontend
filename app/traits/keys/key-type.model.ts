import { ValidatorFn, Validators } from '@angular/forms';

import { minusFilter } from '../../shared/util/arrays';

import { KeyValidators } from './validators/key-validators';

export enum KeyType {
  BRAND_CODE = 'BRAND_CODE',
  ALIAS = 'ALIAS',
  FEDERAL_ID = 'FEDERAL_ID'
}

export interface KeyTypeConfig {
  keyValidators: ValidatorFn[];
  brandIdsValidators: ValidatorFn[];
  brandDependent: boolean;
  readPermission: string;
  updatePermissions: string[];
  countryRestrictions?: string[] | undefined;
  singleSelect?: boolean | false;
}

export function keyTypeConfigBy(keyType: KeyType | undefined): KeyTypeConfig {
  switch (keyType) {
    case KeyType.BRAND_CODE:
      return {
        keyValidators: [
          Validators.required,
          Validators.maxLength(8),
          KeyValidators.alphaNumericExceptDot
        ],
        brandIdsValidators: [Validators.required],
        brandDependent: true,
        readPermission: 'traits.brandcode.read',
        updatePermissions: [
          'traits.brandcode.create',
          'traits.brandcode.update',
          'traits.brandcode.delete'
        ]
      };
    case KeyType.ALIAS:
      return {
        keyValidators: [Validators.required, Validators.minLength(1), Validators.maxLength(25)],
        brandIdsValidators: [],
        brandDependent: false,
        readPermission: 'traits.alias.read',
        updatePermissions: ['traits.alias.update', 'traits.alias.delete'],
        countryRestrictions: ['DE'],
        singleSelect: true
      };
    case KeyType.FEDERAL_ID:
      return {
        keyValidators: [KeyValidators.alphaNumericExceptHyphen],
        brandIdsValidators: [],
        brandDependent: false,
        readPermission: 'traits.federalid.read',
        updatePermissions: ['traits.federalid.update', 'traits.federalid.delete'],
        countryRestrictions: ['US'],
        singleSelect: true
      };
    default:
      return {
        keyValidators: [],
        brandIdsValidators: [],
        brandDependent: false,
        readPermission: '',
        updatePermissions: []
      };
  }
}

export function keyTypeFilter(
  originalKeyTypes: KeyType[],
  selectedKeyTypes: KeyType[],
  excludedKeyTypes: KeyType[]
): KeyType[] {
  return originalKeyTypes.filter(minusFilter(excludedKeyTypes)).filter((type: KeyType) => {
    const typeConfig = keyTypeConfigBy(type);
    return !typeConfig.singleSelect || !selectedKeyTypes.includes(type);
  });
}
