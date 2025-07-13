export class UserDataRestrictions {
  userId: string;
  groupType: string;
  ignoreFocusProductGroup: boolean;
  assignedDataRestrictions: { [dataRestrictionId: string]: string[] };
}

export class UpdateUserDataRestrictions {
  brandIds: string[];
  businessSiteIds: string[];
  countryIds: string[];
  distributionLevelIds: string[];
  languageIds: string[];
  productGroupIds: string[];
  serviceIds: string[];
  tenantIds: string[];
  ignoreFocusProductGroup?: boolean;
}
