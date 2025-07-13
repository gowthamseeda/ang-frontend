import { LanguageTagValidator } from './language-tag-validator';

describe('CreateLanguageComponent LanguageTagValidator', () => {
  let validator: LanguageTagValidator = new LanguageTagValidator();

  it('Allow real valid language tag', () => {
    expect(validator.validate('de')).toBeTruthy();
    expect(validator.validate('en-US')).toBeTruthy();
    expect(validator.validate('zh-Latn-TW')).toBeTruthy();
    expect(validator.validate('zh-Hans-CN')).toBeTruthy();
  });

  it('Disallow real valid language tag : 3ALPHA', () => {
    expect(validator.validate('ine')).toBeFalsy();
  });

  it('Disallow real valid language tag : region 3DIGIT', () => {
    expect(validator.validate('es-419')).toBeFalsy();
  });

  it('Disallow wrong syntax language tag', () => {
    expect(validator.validate('???')).toBeFalsy;
    expect(validator.validate('z1-Latn-TW')).toBeFalsy;
    expect(validator.validate('zh-Lat1-TW')).toBeFalsy;
    expect(validator.validate('zh-Latn-T1')).toBeFalsy;
    expect(validator.validate('asdfghjka-qwertyui-zxcvbnmq')).toBeFalsy;
    expect(validator.validate('12345678-12345678-12345678')).toBeFalsy;
  });

  it('Disallow valid language tag but not supported: grandfathered', () => {
    expect(validator.validate('zh-guoyu')).toBeFalsy;
  });

  it('Disallow syntax correct but not supported: extended language subtags and 4ALPHA and 5*8ALPHA', () => {
    expect(validator.validate('asdfghjk')).toBeFalsy;
    expect(validator.validate('asdfghjk-qwertyui')).toBeFalsy;
    expect(validator.validate('asdfghjk-qwertyui-zxcvbnmq')).toBeFalsy;
    expect(validator.validate('abc-abc-abc-abc')).toBeFalsy;
  });

  it('Disallow real valid language tag but not supported : extended language subtags and 4ALPHA and 5*8ALPHA', () => {
    expect(validator.validate('zh-cmn-Hans-CN')).toBeFalsy;
  });

  it('Disallow valid language tag but not supported: privateuse', () => {
    expect(validator.validate('de-CH-x-phonebk')).toBeFalsy;
  });

  it('Disallow real valid language tag but not supported : variant', () => {
    expect(validator.validate('hy-Latn-IT-arevela')).toBeFalsy;
  });
});
