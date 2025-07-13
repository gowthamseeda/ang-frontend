import { patchValue } from './objects';

describe('Objects', () => {
  describe('patchValue', () => {
    it('should update source obj with updated obj', () => {
      let target = {
        name: 'Foo',
        surname: 'Bar',
        age: 42,
        address: {
          street: 'Famous St.',
          streetNumber: 1
        }
      };

      const source = {
        name: 'Baz',
        address: {
          streetNumber: 5
        }
      };

      let updated = patchValue(target, source);
      expect(updated.name).toBe('Baz');
      expect(updated.address.streetNumber).toBe(5);
    });
    it('should update source containing array', () => {
      let target = {
        animals: [
          { name: 'Lion', favouriteMeal: 'Humans' },
          { name: 'Monkey', favouriteMeal: 'Banana' }
        ]
      };

      let source = {
        animals: [
          { name: 'Lion', favouriteMeal: 'Humans' },
          { name: 'Monkey', favouriteMeal: 'Humans as well - what?' },
          { name: 'Crocodile', favouriteMeal: 'Humans' }
        ]
      };

      let updated = patchValue(target, source);
      expect(updated.animals[1].name).toBe(source.animals[1].name);
      expect(updated.animals[2]).toBe(source.animals[2]);
    });
  });
});
