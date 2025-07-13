import { Params } from '@angular/router';

import {
  communicationDataPath,
  contractsPath,
  editGeneralCommunicationPath,
  editKeysPath,
  editLabelsPath,
  editLegalPath,
  editOutletPath,
  historizationPath,
  investorsPath,
  openingHoursPath,
  outletRelationshipsPath,
  servicesPath,
  validitiesPath
} from '../../../legal-structure/legal-structure-routing-paths';

export type BreadcrumbOutletOffering = { [key in OutletOffering]: BreadcrumbItem };
export type BreadcrumbServiceOffering = { [key in ServiceOffering]: BreadcrumbItem };

export interface BreadcrumbData {
  level: BreadcrumbLevel;
  offering?: OutletOffering | ServiceOffering;
}

export interface BreadcrumbItem {
  label: string;
  path?: string;
  queryParams?: Params;
  children?: BreadcrumbItem[];
}

export enum BreadcrumbLevel {
  OUTLET,
  OUTLET_OFFERING,
  SERVICE_OFFERING
}

export enum OutletOffering {
  BASE_DATA,
  KEYS,
  LABELS,
  GENERAL_COMMUNICATION,
  LEGAL_INFO,
  SERVICES,
  SHAREHOLDER,
  OUTLET_RELATIONSHIPS,
  HISTORIZATION
}

export enum ServiceOffering {
  VALIDITY,
  OPENING_HOURS,
  CONTRACTS,
  COMMUNICATION
}

export const BREADCRUMB_OUTLET_OFFERING_MAP: BreadcrumbOutletOffering = {
  [OutletOffering.BASE_DATA]: { label: 'BASE_DATA', path: editOutletPath },
  [OutletOffering.KEYS]: { label: 'KEYS', path: editKeysPath },
  [OutletOffering.LABELS]: { label: 'LABELS', path: editLabelsPath },
  [OutletOffering.GENERAL_COMMUNICATION]: {
    label: 'GENERAL_COMMUNICATION',
    path: editGeneralCommunicationPath
  },
  [OutletOffering.LEGAL_INFO]: { label: 'LEGAL_INFO', path: editLegalPath },
  [OutletOffering.SERVICES]: { label: 'SERVICES', path: servicesPath },
  [OutletOffering.SHAREHOLDER]: { label: 'SHAREHOLDER', path: investorsPath },
  [OutletOffering.OUTLET_RELATIONSHIPS]: {
    label: 'OUTLET_RELATIONSHIPS',
    path: outletRelationshipsPath
  },
  [OutletOffering.HISTORIZATION]: { label: 'HISTORY', path: historizationPath }
};

export const BREADCRUMB_SERVICE_OFFERING_MAP: BreadcrumbServiceOffering = {
  [ServiceOffering.VALIDITY]: { label: 'VALIDITY', path: validitiesPath },
  [ServiceOffering.OPENING_HOURS]: { label: 'OPENING_HOURS', path: openingHoursPath },
  [ServiceOffering.CONTRACTS]: { label: 'CONTRACTS', path: contractsPath },
  [ServiceOffering.COMMUNICATION]: { label: 'COMMUNICATION', path: communicationDataPath }
};
