import { Outlet } from '../../shared/models/outlet.model';

export interface NavigationPermissions {
  servicesEnabled: boolean;
  shareHolderEnabled: boolean;
  dataVerificationEnabled?: boolean;
  assignedBrandLabelsEnabled: boolean;
  outletRelationshipsEnabled: boolean;
  historizationEnabled: boolean;
}

export interface ServiceNavigationPermissions {
  validityEnabled: boolean;
  openingHoursEnabled: boolean;
  contractsEnabled: boolean;
  communicationEnabled: boolean;
}

export interface FeatureToggles {
  shareHolders: boolean;
  outletRelationships: boolean;
  historization: boolean;
}

export interface UserPermissions {
  createInvestors: boolean;
  readServices: boolean;
  outletRelationships: boolean;
}

export interface UserOutletAuthorizations {
  outlet: Outlet;
  distributionLevels: string[];
  allowCreateVerificationTasks: boolean;
  allowReadAssignedBrandlabels: boolean;
  hasAssignableLabels: boolean;
  isRolledOut: boolean;
}

export const permissionsFrom = (
  featureToggles: FeatureToggles,
  userPermissions: UserPermissions,
  userOutletAuthorizations: UserOutletAuthorizations,
  allowedServiceDistributionLevels: string[],
  isAllowedService: boolean,
  isServiceDistributionLevelsToggleOn: boolean
): NavigationPermissions => {
  const isRegisteredOffice = userOutletAuthorizations.outlet
    ? userOutletAuthorizations.outlet.registeredOffice ?? false
    : false;

  const distributionLevels = userOutletAuthorizations.distributionLevels ?? [];

  const hasAllowedDistributionLevelFromStatic = distributionLevels.some(level =>
    allowedServiceDistributionLevels.includes(level)
  );

  const hasAllowedDistributionLevel: boolean = isServiceDistributionLevelsToggleOn
    ? isAllowedService
    : hasAllowedDistributionLevelFromStatic;

  const assignedBrandLabelsEnabled =
    userOutletAuthorizations.allowReadAssignedBrandlabels &&
    userOutletAuthorizations.hasAssignableLabels;

  const outletIsRetailer = distributionLevels.some(level => level === 'RETAILER');

  const shareHolderEnabled =
    featureToggles.shareHolders && userPermissions.createInvestors && isRegisteredOffice;

  const outletRelationshipsEnabled =
    featureToggles.outletRelationships && userPermissions.outletRelationships;

  const servicesEnabled = hasAllowedDistributionLevel && userPermissions.readServices;

  const dataVerificationEnabled =
    userOutletAuthorizations.allowCreateVerificationTasks &&
    userOutletAuthorizations.isRolledOut &&
    userOutletAuthorizations.outlet.active &&
    outletIsRetailer;

  const historizationEnabled = featureToggles.historization;

  return {
    servicesEnabled,
    outletRelationshipsEnabled,
    shareHolderEnabled,
    dataVerificationEnabled,
    assignedBrandLabelsEnabled,
    historizationEnabled
  };
};
