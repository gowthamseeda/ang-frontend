import { KeysPipe } from './keys.pipe';

describe('KeysPipe', () => {
  let pipe: KeysPipe;

  beforeEach(() => {
    pipe = new KeysPipe();
  });

  it('return keys of object', () => {
    const object = {
      key1: { 'sub-key1': 'sub-value1' },
      key2: { 'sub-key1': 'sub-value2' }
    };

    expect(pipe.transform(object)).toEqual(['key1', 'key2']);
  });

  it('return empty key-array when object is null', () => {
    expect(pipe.transform(null)).toEqual([]);
  });

  it('return empty key-array when object is undefined', () => {
    expect(pipe.transform(undefined)).toEqual([]);
  });
});
