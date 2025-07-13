import { Histories, History } from './history.model';

export function getHistoriesMock(): Histories {
  return {
    snapshots: [getHistoryMock(), getHistoryWithAssignedRestrictionsMock()]
  };
}

export function getHistoryMock(): History {
  return {
    userId: 'JONAS',
    modifyUserId: 'TIM',
    ignoreFocusProductGroup: false,
    groupType: '1',
    assignedDataRestrictions: {
      FocusProductGroup: ['BUS', 'TRUCK', 'UNIMOG'],
      ProductGroup: ['PC', 'VAN', 'BUS', 'TRUCK', 'UNIMOG']
    },
    createTimestamp: new Date('2011-01-03T20:04:04.000Z')
  };
}

export function getHistoryWithAssignedRestrictionsMock(): History {
  return {
    userId: 'TOM',
    modifyUserId: 'TIM',
    ignoreFocusProductGroup: false,
    groupType: '1',
    assignedDataRestrictions: {
      Tenant: ['GSSNPLUS', 'TPRO'],
      Language: ['en-US', 'en-CA'],
      Country: ['USA', 'CA'],
      Brand: ['MB', 'SMT'],
      FocusProductGroup: ['BUS', 'TRUCK', 'UNIMOG'],
      ProductGroup: ['PC', 'VAN', 'BUS', 'TRUCK', 'UNIMOG'],
      DistributionLevel: ['RETAILER', 'APPLICANT'],
      BusinessSite: ['GS0000001', 'GS0000002'],
      Services: ['120', '007']
    },
    createTimestamp: new Date('2011-01-03T20:04:04.000Z')
  };
}
