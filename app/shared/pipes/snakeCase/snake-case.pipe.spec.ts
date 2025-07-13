import { SnakeCasePipe } from './snake-case.pipe';

describe('SnakeCasePipe', () => {
  let pipe: SnakeCasePipe;

  beforeEach(() => {
    pipe = new SnakeCasePipe();
  });

  it('return string in snake case upper of object', () => {
    const str = "testCase"
    const str2 = "TestCase"

    expect(pipe.transform(str)).toEqual("TEST_CASE");
    expect(pipe.transform(str2)).toEqual("TEST_CASE");
  });

  it('return string in snake case lower of object', () => {
    const str = "testCase"
    const str2 = "TestCase"
    expect(pipe.transform(str,false)).toEqual("test_case");
    expect(pipe.transform(str2,false)).toEqual("test_case");
  });

  it('return empty string when object is null', () => {
    expect(pipe.transform(null)).toEqual("");
  });

  it('return empty string when object is undefined', () => {
    expect(pipe.transform(undefined)).toEqual("");
  });
});
