import { ConstraintType } from '../../models/outlet.model';

export interface GenericAdminOutletResponse {
  id: string;
  businessSiteId: string;
  companyId: string;
  preconditions?: Precondition[];
  status: boolean;
}

export interface Precondition {
  ids?: string[];
  type: ConstraintType;
  messages: string[];
}
