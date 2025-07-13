import { Address } from '../shared/models/address.model';
import { GPS } from '../shared/models/gps.model';
import { POBox } from '../shared/models/po-box.model';

export interface Company {
  id?: string;
  legalName: string;
  nameAddition?: string;
  countryId: string;
  registeredOfficeId?: string;
  address: Address;
  poBox?: POBox;
  gps?: GPS;
  state?: string;
  province?: string;
}
