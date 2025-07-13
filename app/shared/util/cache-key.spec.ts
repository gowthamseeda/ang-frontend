import { cacheKey } from './cache-key';

describe('Cached Key', () => {
  it('should return key by combining two arrays', () => {
    const arr1 = [1, 2, 3];
    const arr2 = ['a', 'b', 'c', 'd'];
    const result = cacheKey(arr1, arr2);
    expect(result).toEqual('34');
  });
  it('should return key by combining one string and one array', () => {
    const str = 'test';
    const arr1 = [1, 2, 3];
    const result = cacheKey(str, arr1);
    expect(result).toEqual('test3');
  });
  it('should return key by combining one number and one string', () => {
    const n = 9;
    const str = 'test';
    const result = cacheKey(n, str);
    expect(result).toEqual('9test');
  });
  it('should return key by combining an object', () => {
    const obj = { a: 1, b: [1, 2, 3], c: 'test' };
    const result = cacheKey(obj);
    expect(result).toEqual('13test');
  });
  it('should return key by combining object with nested object', () => {
    const obj = { a: 1, b: [1, 2, 3], c: { foo: 1, bar: [1, 2, 3, 4, 5] } };
    const result = cacheKey(obj);
    expect(result).toEqual('1315');
  });
  it('should return key by combining all types', () => {
    const n = 1;
    const str = 'foo';
    const arr1 = [1, 2, 3];
    const obj = { a: 'bar', b: [1, 'baz'] };
    const result = cacheKey(n, str, arr1, obj);
    expect(result).toEqual('1foo3bar2');
  });
});
