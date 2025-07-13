import { RegionalCenter } from './regional-center.model';

export interface ViewStatus {
  error: boolean | undefined;
  errorMsg: string;
}

export interface RegionalCenterState {
  regionalCenters: RegionalCenter[];
  status: ViewStatus;
}
