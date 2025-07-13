import { TestBed } from '@angular/core/testing';

import { CustomEncoder } from './custom-encoder';

describe('CustomEncoder', () => {
  let customEncoder: CustomEncoder;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustomEncoder]
    });

    customEncoder = TestBed.inject(CustomEncoder);
  });

  it('should be created', () => {
    expect(customEncoder).toBeTruthy();
  });

  it('encodeValue should encode plus sign correctly', () => {
    const mutated = customEncoder.encodeValue('+');

    expect(mutated).toEqual('%2B');
  });

  it('encodeKey should encode plus sign correctly', () => {
    const mutated = customEncoder.encodeKey('+');

    expect(mutated).toEqual('%2B');
  });

  it('decodeValue should encode plus sign correctly', () => {
    const mutated = customEncoder.decodeValue('%2B');

    expect(mutated).toEqual('+');
  });

  it('decodeKey should encode plus sign correctly', () => {
    const mutated = customEncoder.decodeKey('%2B');

    expect(mutated).toEqual('+');
  });
});
