import { Translatable } from '../../../shared/pipes/translate-data/translatable.model';

export class MasterCountryGroup implements Translatable {
  id: number;
  name: string;
  countryIds: Array<string>;
  translations?: { [key: string]: any };

  constructor(id: number, name: string, countryIds: Array<string>) {
    this.id = id;
    this.name = name;
    this.countryIds = countryIds;
  }
}
