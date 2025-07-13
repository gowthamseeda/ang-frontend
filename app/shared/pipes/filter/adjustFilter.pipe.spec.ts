import { AdjustFilterPipe } from './adjustFilter';

describe('AdjustFilterPipe', () => {
  let pipe: AdjustFilterPipe;

  beforeEach(() => {
    pipe = new AdjustFilterPipe();
  });

  it('return businessSiteId', () => {
    const value = 'businessSiteId';
    expect(pipe.transform(value)).toEqual(value);
  });

  it('return adamId', () => {
    const value = 'adamIds';
    const expected = 'adamId';
    expect(pipe.transform(value)).toEqual(expected);
  });
});
