export class User {
  userId: string;
  givenName: string;
  familyName: string;
  email: string;
  roles: string[];
  permissions: string[];
  dataRestrictions: UserDataRestrictions;
  groupType: string;
  country: string;
}

export class UserDataRestrictions {
  [dataRestrictionId: string]: string[];
}
