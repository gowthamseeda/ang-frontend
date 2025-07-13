import { Country } from '../../../geography/country/country.model';
import { Outlet } from '../../shared/models/outlet.model';

export interface LoadingStatus {
  isOutletLoading: boolean;
  isError: boolean;
  errorMsg: string;
}

export interface BusinessSiteState {
  businessNames: string[];
  brandIds: string[];
  country: Country | undefined;
  distributionLevels: string[];
  loadingStatus: LoadingStatus | undefined;
  outlet: Outlet | undefined;
  languageId: string | undefined;
}
