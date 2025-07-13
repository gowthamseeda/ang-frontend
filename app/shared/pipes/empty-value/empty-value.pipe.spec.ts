import { EmptyValuePipe } from './empty-value.pipe';

describe('EmptyValuePipe', () => {
  let pipe: EmptyValuePipe;

  beforeEach(() => {
    pipe = new EmptyValuePipe();
  });

  it('return "-" value', () => {
    const value = '';
    const expected = '-';
    expect(pipe.transform(value)).toEqual(expected);
  });

  it('return exact value', () => {
    const value = 'GS0000001';
    expect(pipe.transform(value)).toEqual(value);
  });

  it('return false value when given FALSE boolean', () => {
    const value:boolean = false;
    expect(pipe.transform(value)).toEqual(value);
  });

});
