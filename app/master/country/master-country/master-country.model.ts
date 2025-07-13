import { Translatable } from '../../../shared/pipes/translate-data/translatable.model';

export class MasterCountry implements Translatable {
  id: string;
  name: string;
  languages: Array<string>;
  defaultLanguageId?: string;
  translations?: { [key: string]: any };
  timeZone?: string;

  constructor(
    id: string,
    name: string,
    languages: Array<string>,
    defaultLanguageId: string,
    translations: { [key: string]: any },
    timeZone?: string
  ) {
    this.id = id;
    this.name = name;
    this.languages = languages;
    this.defaultLanguageId = defaultLanguageId;
    this.translations = translations;
    this.timeZone = timeZone;
  }
}
