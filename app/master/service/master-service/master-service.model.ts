import { Translatable } from 'app/shared/pipes/translate-data/translatable.model';

export interface MasterService extends Translatable {
  id?: number;
  name: string;
  position?: number;
  description?: string;
  translations?: { [key: string]: any };
  active: boolean;
  openingHoursSupport?: boolean;
  retailerVisibility?: boolean;
  allowedDistributionLevels?: string[];
  detailDescription?: string;
}
