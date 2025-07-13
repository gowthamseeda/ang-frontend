import { Brand } from '../brand.model';
import { ExternalKey } from '../external-key/external-key.model';

import { KeyType } from './key-type.model';
import { GroupedKey } from './key.model';

export function getGroupedKeysMock(): GroupedKey[] {
  return [
    new GroupedKey(KeyType.BRAND_CODE, '2211', [new Brand('MB'), new Brand('SMT')]),
    new GroupedKey(KeyType.BRAND_CODE, '2212', [new Brand('FUSO')])
  ];
}

export function getExternalKeysMock(): ExternalKey[] {
  return [
    new ExternalKey('COFICO01', 'extKey01'),
    new ExternalKey('COFICO02', 'extKey02', 'MB'),
    new ExternalKey('COFICO03', 'extKey03', 'MB', 'PC')
  ];
}
