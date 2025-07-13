import { User } from './user.model';

export function getUserMock(): User {
  return {
    userId: 'JODOE',
    givenName: 'John',
    familyName: 'Doe',
    email: 'john.doe@daimler.com',
    roles: ['GSSNPLUS.MPCUser', 'GSSNPLUS.HQUser'],
    permissions: ['geography.language.create', 'geography.language.read'],
    dataRestrictions: {
      Country: ['GE', 'GB'],
      Brand: ['MB'],
      ProductGroup: ['TRUCK'],
      DistributionLevel: ['RETAILER'],
      Language: ['en-UK'],
      Tenant: ['GSSNPLUS']
    },
    groupType: '0',
    country: 'DE'
  };
}

export function getUserMockWithEncodedPermission(): User {
  return {
    userId: 'JODOE',
    givenName: 'John',
    familyName: 'Doe',
    email: 'john.doe@daimler.com',
    roles: ['GSSNPLUS.MPCUser', 'GSSNPLUS.HQUser'],
    permissions: ['Sk9ET0VnZW9ncmFwaHkubGFuZ3VhZ2UuY3JlYXRl', 'Sk9ET0VnZW9ncmFwaHkubGFuZ3VhZ2UucmVhZA=='],
    dataRestrictions: {
      Country: ['GE', 'GB'],
      Brand: ['MB'],
      ProductGroup: ['TRUCK'],
      DistributionLevel: ['RETAILER'],
      Language: ['en-UK'],
      Tenant: ['GSSNPLUS']
    },
    groupType: '0',
    country: 'DE'
  };
}

export function getUserMockWithBusinessSideLegalStructureUpdatePermission(): User {
  return {
    userId: 'HANSO',
    givenName: 'Han',
    familyName: 'Solo',
    email: 'han.solo@daimler.com',
    roles: [
      'GSSNPLUS.MPCUser',
      'GSSNPLUS.HQUser',
      'GSSNPLUS.BusinessSiteResponsible',
      'GSSNPLUS.TPROHQUser'
    ],
    permissions: [
      'geography.language.create',
      'geography.language.read',
      'legalstructure.businesssite.update'
    ],
    dataRestrictions: {
      Country: ['GE', 'GB'],
      Brand: ['MB'],
      Language: ['en-UK'],
      Tenant: ['GSSNPLUS']
    },
    groupType: '0',
    country: 'DE'
  };
}
