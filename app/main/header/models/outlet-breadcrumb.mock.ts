import { ActivatedRouteSnapshot } from '@angular/router';

import {
  NavigationPermissions,
  ServiceNavigationPermissions
} from '../../../legal-structure/businessSite/services/navigation-permissions.model';
import { Service, ServiceQueryParams } from '../../../services/service/models/service.model';

import { BreadcrumbItem, BreadcrumbLevel, ServiceOffering } from './header.model';

export const outletIdMock = 'GS0000001';

const paramMap = {
  get(): string {
    return outletIdMock;
  }
};

const queryParamMap = {
  get(): number {
    return 1;
  }
};

export const offeredServicesMock: Service[] = [
  {
    id: 1,
    name: 'Service A',
    position: 1,
    active: true,
    openingHoursSupport: true,
    productCategoryId: 1,
    serviceId: 1
  },
  {
    id: 2,
    name: 'Service B',
    position: 2,
    active: true,
    openingHoursSupport: true,
    productCategoryId: 1,
    serviceId: 2
  }
];

export const navigationPermissionsMock: NavigationPermissions = {
  servicesEnabled: true,
  shareHolderEnabled: true,
  assignedBrandLabelsEnabled: true,
  outletRelationshipsEnabled: false,
  historizationEnabled: true
};

export const serviceNavigationPermissionsMock: ServiceNavigationPermissions = {
  validityEnabled: true,
  openingHoursEnabled: true,
  contractsEnabled: true,
  communicationEnabled: false
};

export const activatedRouteSnapshotMock = {
  paramMap,
  queryParamMap,
  data: {
    breadcrumb: {
      level: BreadcrumbLevel.SERVICE_OFFERING,
      offering: ServiceOffering.VALIDITY
    }
  }
} as unknown as ActivatedRouteSnapshot;

export const outletChildrenMock = [
  {
    label: 'BASE_DATA',
    path: `/outlet/${outletIdMock}/edit`
  },
  {
    label: 'KEYS',
    path: `/outlet/${outletIdMock}/keys`
  },
  {
    label: 'LABELS',
    path: `/outlet/${outletIdMock}/labels`
  },
  {
    label: 'GENERAL_COMMUNICATION',
    path: `/outlet/${outletIdMock}/general-communication`
  },
  {
    label: 'LEGAL_INFO',
    path: `/outlet/${outletIdMock}/legal`
  },
  {
    label: 'SHAREHOLDER',
    path: `/outlet/${outletIdMock}/shareholder`
  },
  {
    label: 'HISTORY',
    path: `/outlet/${outletIdMock}/history`
  }
];

export const serviceOfferingChildrenMock = [
  {
    label: 'OPENING_HOURS',
    path: `/outlet/${outletIdMock}/services/opening-hours`,
    queryParams: getServiceQueryParams(1)
  },
  {
    label: 'CONTRACTS',
    path: `/outlet/${outletIdMock}/services/contracts`,
    queryParams: getServiceQueryParams(1)
  }
];

export const outletBreadcrumbMock = {
  label: `Outlet ${outletIdMock}`,
  path: `/outlet/${outletIdMock}`,
  children: outletChildrenMock
};

export const outletOfferingBreadcrumbMock = {
  label: 'SERVICES',
  path: `/outlet/${outletIdMock}/services`,
  children: [
    {
      label: 'Service A',
      children: getOutletOfferingChildren(1)
    },
    {
      label: 'Service B',
      children: [
        {
          label: 'VALIDITY',
          path: `/outlet/${outletIdMock}/services/validities`,
          queryParams: getServiceQueryParams(2)
        },
        ...getOutletOfferingChildren(2)
      ]
    }
  ]
};

export const serviceOfferingBreadcrumbMock = [
  {
    label: 'Service A',
    children: serviceOfferingChildrenMock
  },
  { label: 'VALIDITY' }
];

function getOutletOfferingChildren(serviceId: number): BreadcrumbItem[] {
  return [
    {
      label: 'OPENING_HOURS',
      path: `/outlet/${outletIdMock}/services/opening-hours`,
      queryParams: getServiceQueryParams(serviceId)
    },
    {
      label: 'CONTRACTS',
      path: `/outlet/${outletIdMock}/services/contracts`,
      queryParams: getServiceQueryParams(serviceId)
    }
  ];
}

function getServiceQueryParams(serviceId: number): ServiceQueryParams {
  return {
    productCategoryId: 1,
    serviceId: serviceId
  };
}
