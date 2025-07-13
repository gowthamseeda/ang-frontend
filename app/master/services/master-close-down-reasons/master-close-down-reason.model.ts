import { Translatable } from '../../../shared/pipes/translate-data/translatable.model';

export class MasterCloseDownReason implements Translatable {
  id: number;
  name: string;
  validity: string[];
  translations: { [key: string]: any };
}

export enum ValidityEnum {
  COMPANY = 'Company',
  BUSINESS_SITE = 'Outlet'
}
