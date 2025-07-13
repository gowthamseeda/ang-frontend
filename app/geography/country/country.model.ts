import { Translatable } from '../../shared/pipes/translate-data/translatable.model';

export class Country implements Translatable {
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
    timeZone?: string
  ) {
    this.id = id;
    this.name = name;
    this.languages = languages;
    this.defaultLanguageId = defaultLanguageId;
    this.timeZone = timeZone;
  }
}
