import { getOutletMock } from '../../shared/models/outlet.mock';
import { Outlet } from '../../shared/models/outlet.model';

import {
  FeatureToggles,
  NavigationPermissions,
  permissionsFrom,
  UserOutletAuthorizations,
  UserPermissions
} from './navigation-permissions.model';

describe('NavigationPermissions', () => {
  let featureToggles: FeatureToggles;
  let userPermissions: UserPermissions;
  let selectedOutlet: Outlet;
  let userOutletAuthorizations: UserOutletAuthorizations;
  let allowedDistributionLevels: string[];
  let isAllowedService: boolean;
  let isServiceDistributionLevelsToggleOn: boolean;
  let expectedNavigationPermissions: NavigationPermissions;

  beforeEach(() => {
    featureToggles = {
      shareHolders: true,
      outletRelationships: true,
      historization: true
    };

    userPermissions = {
      createInvestors: true,
      readServices: true,
      outletRelationships: true
    };

    selectedOutlet = getOutletMock();

    userOutletAuthorizations = {
      outlet: { ...selectedOutlet, registeredOffice: true },
      distributionLevels: ['RETAILER'],
      allowCreateVerificationTasks: true,
      allowReadAssignedBrandlabels: true,
      hasAssignableLabels: true,
      isRolledOut: true
    };

    expectedNavigationPermissions = {
      servicesEnabled: true,
      shareHolderEnabled: true,
      dataVerificationEnabled: true,
      assignedBrandLabelsEnabled: true,
      outletRelationshipsEnabled: true,
      historizationEnabled: true
    };

    allowedDistributionLevels = ['RETAILER'];
    isAllowedService = false;
    isServiceDistributionLevelsToggleOn = false;
  });

  it('should return true for all', () => {
    const results = permissionsFrom(
      featureToggles,
      userPermissions,
      userOutletAuthorizations,
      allowedDistributionLevels,
      isAllowedService,
      isServiceDistributionLevelsToggleOn
    );

    expect(results).toStrictEqual(expectedNavigationPermissions);
  });

  describe('should return false for services', () => {
    it('when the outlet is not retailer', () => {
      userOutletAuthorizations = {
        ...userOutletAuthorizations,
        outlet: {
          ...userOutletAuthorizations.outlet
        },
        distributionLevels: []
      };

      const results = permissionsFrom(
        featureToggles,
        userPermissions,
        userOutletAuthorizations,
        allowedDistributionLevels,
        isAllowedService,
        isServiceDistributionLevelsToggleOn
      );

      expect(results).toStrictEqual({
        ...expectedNavigationPermissions,
        dataVerificationEnabled: false,
        servicesEnabled: false
      });
    });

    it('when the user has no read rights for services', () => {
      userPermissions = {
        ...userPermissions,
        readServices: false
      };

      const results = permissionsFrom(
        featureToggles,
        userPermissions,
        userOutletAuthorizations,
        allowedDistributionLevels,
        isAllowedService,
        isServiceDistributionLevelsToggleOn
      );

      expect(results).toStrictEqual({
        ...expectedNavigationPermissions,
        servicesEnabled: false
      });
    });
  });

  describe('should return false for shareHolderEnabled', () => {
    it('when the feature is disabled', () => {
      const results = permissionsFrom(
        { ...featureToggles, shareHolders: false },
        userPermissions,
        userOutletAuthorizations,
        allowedDistributionLevels,
        isAllowedService,
        isServiceDistributionLevelsToggleOn
      );

      expect(results).toStrictEqual({
        ...expectedNavigationPermissions,
        shareHolderEnabled: false
      });
    });

    it('when the outlet is not registered office', () => {
      userOutletAuthorizations = {
        ...userOutletAuthorizations,
        outlet: {
          ...userOutletAuthorizations.outlet,
          registeredOffice: false
        }
      };

      const results = permissionsFrom(
        featureToggles,
        userPermissions,
        userOutletAuthorizations,
        allowedDistributionLevels,
        isAllowedService,
        isServiceDistributionLevelsToggleOn
      );

      expect(results).toStrictEqual({
        ...expectedNavigationPermissions,
        shareHolderEnabled: false
      });
    });

    it('when the user has no create rights for investors', () => {
      userPermissions = {
        ...userPermissions,
        createInvestors: false
      };

      const results = permissionsFrom(
        featureToggles,
        userPermissions,
        userOutletAuthorizations,
        allowedDistributionLevels,
        isAllowedService,
        isServiceDistributionLevelsToggleOn
      );

      expect(results).toStrictEqual({
        ...expectedNavigationPermissions,
        shareHolderEnabled: false
      });
    });
  });

  describe('should return false for dataVerificationEnabled', () => {
    it('when the outlet is not rolled out', () => {
      userOutletAuthorizations = {
        ...userOutletAuthorizations,
        isRolledOut: false
      };

      const results = permissionsFrom(
        featureToggles,
        userPermissions,
        userOutletAuthorizations,
        allowedDistributionLevels,
        isAllowedService,
        isServiceDistributionLevelsToggleOn
      );

      expect(results).toStrictEqual({
        ...expectedNavigationPermissions,
        dataVerificationEnabled: false
      });
    });

    it('when the outlet is not active', () => {
      const outlet = userOutletAuthorizations.outlet;
      userOutletAuthorizations = {
        ...userOutletAuthorizations,
        outlet: { ...outlet, active: false }
      };

      const results = permissionsFrom(
        featureToggles,
        userPermissions,
        userOutletAuthorizations,
        allowedDistributionLevels,
        isAllowedService,
        isServiceDistributionLevelsToggleOn
      );

      expect(results).toStrictEqual({
        ...expectedNavigationPermissions,
        dataVerificationEnabled: false
      });
    });

    it('and servicesEnabled when the outlet is not retailer', () => {
      userOutletAuthorizations = {
        ...userOutletAuthorizations,
        outlet: {
          ...userOutletAuthorizations.outlet
        },
        distributionLevels: ['WHOLESALE']
      };

      const results = permissionsFrom(
        featureToggles,
        userPermissions,
        userOutletAuthorizations,
        allowedDistributionLevels,
        isAllowedService,
        isServiceDistributionLevelsToggleOn
      );

      expect(results).toStrictEqual({
        ...expectedNavigationPermissions,
        dataVerificationEnabled: false,
        servicesEnabled: false
      });
    });

    it('when the user has no create rights for verification tasks', () => {
      userOutletAuthorizations = {
        ...userOutletAuthorizations,
        allowCreateVerificationTasks: false
      };

      const results = permissionsFrom(
        featureToggles,
        userPermissions,
        userOutletAuthorizations,
        allowedDistributionLevels,
        isAllowedService,
        isServiceDistributionLevelsToggleOn
      );

      expect(results).toStrictEqual({
        ...expectedNavigationPermissions,
        dataVerificationEnabled: false
      });
    });
  });

  describe('should return false for assignedBrandLabelsEnabled', () => {
    it('when the user has not read rights for assigned brand labels', () => {
      userOutletAuthorizations = {
        ...userOutletAuthorizations,
        allowReadAssignedBrandlabels: false
      };

      const results = permissionsFrom(
        featureToggles,
        userPermissions,
        userOutletAuthorizations,
        allowedDistributionLevels,
        isAllowedService,
        isServiceDistributionLevelsToggleOn
      );

      expect(results).toStrictEqual({
        ...expectedNavigationPermissions,
        assignedBrandLabelsEnabled: false
      });
    });
  });

  describe('should return false for outletRelationshipsEnabled', () => {
    it('when the user has not read rights for outlet relationships', () => {
      userPermissions = {
        ...userPermissions,
        outletRelationships: false
      };

      const results = permissionsFrom(
        featureToggles,
        userPermissions,
        userOutletAuthorizations,
        allowedDistributionLevels,
        isAllowedService,
        isServiceDistributionLevelsToggleOn
      );

      expect(results).toStrictEqual({
        ...expectedNavigationPermissions,
        outletRelationshipsEnabled: false
      });
    });
  });

  describe('should return false for historizationEnabled', () => {
    it('when historization is not enabled', () => {
      featureToggles = {
        ...featureToggles,
        historization: false
      };

      const results = permissionsFrom(
        featureToggles,
        userPermissions,
        userOutletAuthorizations,
        allowedDistributionLevels,
        isAllowedService,
        isServiceDistributionLevelsToggleOn
      );

      expect(results).toStrictEqual({
        ...expectedNavigationPermissions,
        historizationEnabled: false
      });
    });
  });
});
