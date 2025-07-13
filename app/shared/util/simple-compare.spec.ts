import { simpleCompare } from './simple-compare';

describe('Simple Compare', () => {
  it('should return true, if objects are equal', () => {
    const objA = { a: 'Test', b: 'Test' };
    const objB = { a: 'Test', b: 'Test' };
    expect(simpleCompare(objA, objB)).toBeTruthy();
  });
  it('should return false, if objects are not equal', () => {
    const objA = { a: 'Test', b: 'Test' };
    const objB = { a: 'Test', b: 'Test1' };
    expect(simpleCompare(objA, objB)).toBeFalsy();
  });
  it('should return true, if arrays are equal', () => {
    const arrA = ['Test', 'Test'];
    const arrB = ['Test', 'Test'];
    expect(simpleCompare(arrA, arrB)).toBeTruthy();
  });
  it('should return false, if arrays are not equal', () => {
    const arrA = ['Test', 'Test'];
    const arrB = ['Test', 'T3st'];
    expect(simpleCompare(arrA, arrB)).toBeFalsy();
  });
});
