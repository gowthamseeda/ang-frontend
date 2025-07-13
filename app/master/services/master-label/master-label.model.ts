import { Translatable } from '../../../shared/pipes/translate-data/translatable.model';

export class MasterLabel implements Translatable {
  id: number;
  name: string;
  assignableTo: string[];
  restrictedToBrandIds?: string[];
  restrictedToCountryIds?: string[];
  restrictedToDistributionLevels?: string[];
  translations?: { [key: string]: any };
}
