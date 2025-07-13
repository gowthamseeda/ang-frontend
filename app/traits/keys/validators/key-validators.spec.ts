import { FormControl } from '@angular/forms';

import { KeyValidators } from './key-validators';

describe('KeyValidators', () => {
  describe('alphaNumericExceptDot', () => {
    it('should give no error for alpha-numeric values and dot', () => {
      expect(KeyValidators.alphaNumericExceptDot(new FormControl('a1.'))).toBeNull();
    });

    it('should give an error for any non alpha-numeric values except dot', () => {
      expect(KeyValidators.alphaNumericExceptDot(new FormControl('a1.&'))).toEqual({
        alphaNumericExceptDot: true
      });
    });
  });

  describe('alphaNumericExceptHyphen', () => {
    it('should give no error for alpha-numeric values and hyphen', () => {
      expect(KeyValidators.alphaNumericExceptHyphen(new FormControl('a1-'))).toBeNull();
    });

    it('should give an error for any non alpha-numeric values except hyphen', () => {
      expect(KeyValidators.alphaNumericExceptHyphen(new FormControl('a1-&'))).toEqual({
        alphaNumericExceptHyphen: true
      });
    });
  });
});
