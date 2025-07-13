export class LanguageTagValidator {
  validate(languageTag: string): boolean {
    const language = '([A-Za-z]{2})';
    const script = '([A-Za-z]{4})';
    const region = '([A-Za-z]{2})';
    const langtag = '^(' + language + '(-' + script + ')?' + '(-' + region + ')?' + ')$';
    const regexp = new RegExp(langtag);
    return regexp.test(languageTag);
  }
}
