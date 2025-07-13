import { Translatable } from '../../shared/pipes/translate-data/translatable.model';

export class Label implements Translatable {
  id: number;
  name: string;
  translations?: { [key: string]: any };
  assignableTo?: string[];
  restrictedToCountryIds?: string[];
  restrictedToBrandIds?: string[];
  restrictedToDistributionLevels?: string[];

  constructor(
    id: number,
    name: string,
    translations?: { [key: string]: any },
    assignableTo?: string[],
    restrictedToCountryIds?: string[],
    restrictedToBrandIds?: string[],
    restrictedToDistributionLevels?: string[]
  ) {
    this.id = id;
    this.name = name;
    this.translations = translations || {};
    this.assignableTo = assignableTo || [];
    this.restrictedToCountryIds = restrictedToCountryIds || [];
    this.restrictedToBrandIds = restrictedToBrandIds || [];
    this.restrictedToDistributionLevels = restrictedToDistributionLevels || [];
  }
}

export enum AssignableType {
  BRAND = 'BRAND'
}
