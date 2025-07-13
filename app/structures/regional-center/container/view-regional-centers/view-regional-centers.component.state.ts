import { Translatable } from '../../../../shared/pipes/translate-data/translatable.model';
import { Address, RegionalCenter, SuperviseeCountry } from '../../model/regional-center.model';

export interface TranslatedSuperviseeCountry extends SuperviseeCountry, Translatable {
  name: string;
  translations?: { [key: string]: any };
}

export interface TranslatedAddress extends Address, Translatable {
  name: string;
  translations?: { [key: string]: any };
}

export interface RegionalCenterViewState extends RegionalCenter {
  superviseeCountries: TranslatedSuperviseeCountry[];
  address: TranslatedAddress;
}
