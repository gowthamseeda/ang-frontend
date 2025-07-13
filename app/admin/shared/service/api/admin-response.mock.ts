import { ConstraintType } from '../../models/outlet.model';

import { GenericAdminOutletResponse } from './admin-response.model';

export function getSuccessSwitchRoResponse(): GenericAdminOutletResponse {
  return {
    id: '7654321',
    businessSiteId: 'GS80000009',
    companyId: 'GC80000008',
    status: true
  };
}

export function getFailedSwitchRoResponse(): GenericAdminOutletResponse {
  return {
    id: '7654321',
    businessSiteId: 'GS00000017',
    companyId: 'GC00000017',
    status: false,
    preconditions: [
      {
        type: ConstraintType[ConstraintType.DEALERGROUP] as unknown as ConstraintType,
        ids: ['DG01', 'DG02'],
        messages: ['Dealer Groups constraint found: [DG01, DG02].']
      },
      {
        type: ConstraintType[ConstraintType.CONTRACTEE] as unknown as ConstraintType,
        ids: ['GC80000008'],
        messages: ['Contractees constraint found: [GC80000008].']
      }
    ]
  };
}
