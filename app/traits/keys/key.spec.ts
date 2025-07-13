import { GroupedKey } from './key.model';
import { KeyType, keyTypeConfigBy } from './key-type.model';
import toFlatKeys = GroupedKey.toFlatKeys;

describe('Key', () => {
  describe('keyTypeConfigBy', () => {
    it('get key type config for type brand code', () => {
      const keyTypeConfig = keyTypeConfigBy(KeyType.BRAND_CODE);

      expect(keyTypeConfig.brandDependent).toBeTruthy();
      expect(keyTypeConfig.brandIdsValidators.length).toBe(1);
      expect(keyTypeConfig.keyValidators.length).toBe(3);
    });

    it('get key type config for type ALIAS', () => {
      const keyTypeConfig = keyTypeConfigBy(KeyType.ALIAS);

      expect(keyTypeConfig.brandDependent).toBeFalsy();
      expect(keyTypeConfig.brandIdsValidators.length).toBe(0);
      expect(keyTypeConfig.keyValidators.length).toBe(3);
      expect(keyTypeConfig.countryRestrictions).toBeDefined();
    });

    it('get default key type config', () => {
      const keyTypeConfig = keyTypeConfigBy(undefined);

      expect(keyTypeConfig.brandDependent).toBeFalsy();
      expect(keyTypeConfig.brandIdsValidators.length).toBe(0);
      expect(keyTypeConfig.keyValidators.length).toBe(0);
    });
  });

  describe('toFlatKeys', () => {
    it('should return empty array if key is undefined', () => {
      const flatKeys = toFlatKeys(new GroupedKey());

      expect(flatKeys.length).toBe(0);
    });

    it('should return empty array if key is empty string', () => {
      const flatKeys = toFlatKeys(new GroupedKey(KeyType.BRAND_CODE, ''));

      expect(flatKeys.length).toBe(0);
    });

    it('should return single flat key if brand ids are undefined', () => {
      const flatKeys = toFlatKeys(new GroupedKey(KeyType.ALIAS, '21'));

      expect(flatKeys).toContainEqual({ type: KeyType.ALIAS, key: '21' });
    });

    it('should return single flat key if brand ids are empty', () => {
      const flatKeys = toFlatKeys(new GroupedKey(KeyType.ALIAS, '21', []));

      expect(flatKeys).toContainEqual({ type: KeyType.ALIAS, key: '21' });
    });

    it('should return flat keys for each brand id', () => {
      const flatKeys = toFlatKeys(
        new GroupedKey(KeyType.BRAND_CODE, '21', [
          { brandId: 'SMT', readonly: false },
          { brandId: 'MB', readonly: false }
        ])
      );

      expect(flatKeys).toEqual([
        { type: KeyType.BRAND_CODE, key: '21', brandId: 'SMT' },
        { type: KeyType.BRAND_CODE, key: '21', brandId: 'MB' }
      ]);
    });
  });
});
