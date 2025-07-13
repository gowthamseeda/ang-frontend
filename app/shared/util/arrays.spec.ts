import { diff, flatten, intersectFilter, minusFilter, sortByReference } from './arrays';

describe('Arrays', () => {
  describe('flatten', () => {
    it('should flatten empty outer array', () => {
      const array: string[][] = [];

      let reduced = array.reduce(flatten, []);

      expect(reduced).toEqual([]);
    });

    it('should flatten empty inner array', () => {
      const array = [[]];

      let reduced: string[] = array.reduce(flatten, []);

      expect(reduced).toEqual([]);
    });

    it('should flatten single inner array', () => {
      const array = [['test']];

      let reduced: string[] = array.reduce(flatten, []);

      expect(reduced).toEqual(['test']);
    });

    it('should flatten multiple inner array', () => {
      const array = [['first'], ['second', 'third']];

      let reduced: string[] = array.reduce(flatten, []);

      expect(reduced).toEqual(['first', 'second', 'third']);
    });
  });

  describe('intersectFilter', () => {
    it('should return empty array when both arrays are empty', () => {
      let intersection = [].filter(intersectFilter([]));

      expect(intersection).toEqual([]);
    });

    it('should return empty array when first array is empty', () => {
      let intersection = [].filter(intersectFilter(['test']));

      expect(intersection).toEqual([]);
    });

    it('should return empty array when second array is empty', () => {
      let intersection = ['test'].filter(intersectFilter([]));

      expect(intersection).toEqual([]);
    });

    it('should return intersection', () => {
      let intersection = ['test', 'test2'].filter(intersectFilter(['test', 'test3']));

      expect(intersection).toEqual(['test']);
    });
  });

  describe('minusFilter', () => {
    it('should return empty array when both arrays are empty', () => {
      let intersection = [].filter(minusFilter([]));

      expect(intersection).toEqual([]);
    });

    it('should return empty array when first array is empty', () => {
      let intersection = [].filter(minusFilter(['test']));

      expect(intersection).toEqual([]);
    });

    it('should return elements of first array when second array is empty', () => {
      let intersection = ['test'].filter(minusFilter([]));

      expect(intersection).toEqual(['test']);
    });

    it('should return elements only contained in first array', () => {
      let intersection = ['test', 'test2'].filter(minusFilter(['test', 'test3']));

      expect(intersection).toEqual(['test2']);
    });
  });

  describe('diff', () => {
    it('should contain added elements', () => {
      const diffs = diff(['test', 'test2', 'test3'], ['test2', 'test4']);

      expect(diffs.added).toEqual(['test4']);
    });

    it('should contain removed elements', () => {
      const diffs = diff(['test', 'test2', 'test3'], ['test2', 'test4']);

      expect(diffs.removed).toEqual(['test', 'test3']);
    });

    it('should contain intersection', () => {
      const diffs = diff(['test', 'test2', 'test3'], ['test2', 'test4']);

      expect(diffs.intersection).toEqual(['test2']);
    });
  });

  describe('sortByReference()', () => {
    it('sort by reference and add unknown elements to the end', () => {
      const ref = ['test3', 'test1', 'test2'];
      const data = ['test2', 'test3', 'test1', 'test6', 'test5'];
      const expected = ['test3', 'test1', 'test2', 'test5', 'test6'];

      const sorted = sortByReference(data, ref, (elem: string) => elem);

      expect(sorted).toEqual(expected);
    });
  });
});
