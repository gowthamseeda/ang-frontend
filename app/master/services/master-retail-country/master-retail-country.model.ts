import { Translatable } from '../../../shared/pipes/translate-data/translatable.model';

export class MasterRetailCountry implements Translatable {
  id: string;
  name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}
