import {  convertStringToUpperCaseAndUnderscore, getNormalizedString, replaceAll } from './strings';

describe('Strings', () => {
  describe('replaceAll', () => {
    it('should replace all occurences', () => {
      const value = 'the quick brown fox jumps over the lazy dog';

      const replaced = replaceAll(value, 'the', 'a');

      expect(replaced).toEqual('a quick brown fox jumps over a lazy dog');
    });
  });

  describe('getNormalizedString', () => {
    it('should return normalized string', () => {
      const value = 'This is a Text';
      const expected = 'this is a text';
      const result = getNormalizedString(value);
      expect(result).toEqual(expected);
    });
  });

  describe('convertStringToUpperCaseAndUnderscore', () => {
    it('should convert brandCreate to UPPER_CASE_WITH_UNDERSCORES', () => {
      const result = convertStringToUpperCaseAndUnderscore('brandCreate');
      expect(result).toEqual('BRAND_CREATE');
    });

    it('should handle strings with no camelCase correctly', () => {
      const result = convertStringToUpperCaseAndUnderscore('string');
      expect(result).toEqual('STRING');
    });

    it('should handle empty strings without throwing', () => {
      const result = convertStringToUpperCaseAndUnderscore('');
      expect(result).toEqual('');
    });
  });
});
