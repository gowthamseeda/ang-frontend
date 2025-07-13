import { Service } from './service.model';

export class ServiceTableRow {
  entry: Service;
}
export interface ServiceFilterCriteria {
  isOfferedService: {
    value: boolean;
    isEnabled: boolean;
  };
}
