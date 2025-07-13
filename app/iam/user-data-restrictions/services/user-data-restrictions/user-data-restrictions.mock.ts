import { UserDataRestrictions } from './user-data-restrictions.model';

export function getUserDataRestrictionsMock(): UserDataRestrictions {
  const userDataRestrictions = new UserDataRestrictions();

  userDataRestrictions.userId = 'HANS';
  userDataRestrictions.ignoreFocusProductGroup = false;
  userDataRestrictions.assignedDataRestrictions = {
    Tenant: ['GSSNPLUS'],
    Language: ['fr-FR'],
    Country: ['FR'],
    Brand: ['SMT'],
    ProductGroup: ['BUS'],
    DistributionLevel: ['RETAILER'],
    BusinessSite: ['GS1234567'],
    Service: ['801'],
    FocusProductGroup: ['PC', 'VAN']
  };
  return userDataRestrictions;
}

export function getUserDataRestrictionsResponseMock(): UserDataRestrictions {
  const mock = getUserDataRestrictionsMock();

  return {
    userId: mock.userId,
    groupType: '0',
    assignedDataRestrictions: mock.assignedDataRestrictions,
    ignoreFocusProductGroup: mock.ignoreFocusProductGroup
  };
}

export function getUserDataRestrictionsOnlyCountryMock(): UserDataRestrictions {
  const userDataRestrictions = new UserDataRestrictions();

  userDataRestrictions.userId = 'HANS';
  userDataRestrictions.assignedDataRestrictions = {
    Country: ['FR']
  };
  return userDataRestrictions;
}
