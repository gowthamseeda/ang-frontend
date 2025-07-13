import { Address } from '../../../../shared/models/address.model';

export interface SelectedAddress extends Address {
  countryName: string;
  formattedStreetAndNumber?: string;
  formattedZipAndCity?: string;
}
