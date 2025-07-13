import { OutletStructure, OutletStructureOutlets } from './outlet-structure.model';

export function getOutletStructureWith_OneMainHaving_TwoSublets(): OutletStructure {
  return {
    outlets: [getMainOutletWith_Sublets([getSubOutlet_GS000100(), getSubOutlet_GS000101()])]
  };
}

export function getMainOutletWith_Sublets(
  sublets: OutletStructureOutlets[],
  businessSiteId?: string
): OutletStructureOutlets {
  return {
    active: true,
    brandCodes: [
      {
        brandCode: '1',
        brandId: 'THB'
      }
    ],
    businessNames: [
      {
        businessName: 'GSSN+ Co. Ltd.',
        brandId: 'MB'
      }
    ],
    businessSiteId: businessSiteId ? businessSiteId : 'GS0000460',
    city: 'Regensburg',
    companyId: 'GC0009056',
    countryId: 'DE',
    distributionLevels: [],
    legalName: 'Daimler AG',
    marketStructureEnabled: false,
    mainOutlet: true,
    registeredOffice: false,
    subOutlet: false,
    subOutlets: sublets
  };
}

export function getSubOutlet_GS000100(): OutletStructureOutlets {
  return {
    active: true,
    brandCodes: [],
    businessSiteId: 'GS000100',
    city: 'Regensburg',
    companyId: 'GC0009056',
    countryId: 'DE',
    distributionLevels: ['RETAILER', 'MANUFACTURER'],
    legalName: 'Daimler AG',
    marketStructureEnabled: true,
    mainOutlet: false,
    registeredOffice: false,
    subOutlet: true
  };
}

export function getSubOutlet_GS000101(): OutletStructureOutlets {
  return {
    active: true,
    brandCodes: [],
    businessSiteId: 'GS000101',
    city: 'Regensburg',
    companyId: 'GC0009056',
    countryId: 'DE',
    distributionLevels: ['RETAILER', 'MANUFACTURER'],
    legalName: 'Daimler AG',
    marketStructureEnabled: true,
    mainOutlet: false,
    registeredOffice: false,
    subOutlet: true
  };
}

export function getSubOutlet_GS000102(): OutletStructureOutlets {
  return {
    active: true,
    brandCodes: [],
    businessSiteId: 'GS000102',
    city: 'Regensburg',
    companyId: 'GC0009056',
    countryId: 'DE',
    distributionLevels: ['RETAILER', 'MANUFACTURER'],
    legalName: 'Daimler AG',
    marketStructureEnabled: true,
    mainOutlet: false,
    registeredOffice: false,
    subOutlet: true
  };
}

export function getSubOutlet_GS000103(): OutletStructureOutlets {
  return {
    active: true,
    brandCodes: [],
    businessSiteId: 'GS000103',
    city: 'Lindau',
    companyId: 'GC0009056',
    countryId: 'DE',
    distributionLevels: ['RETAILER'],
    legalName: 'Daimler AG',
    marketStructureEnabled: true,
    mainOutlet: false,
    registeredOffice: false,
    subOutlet: true
  };
}
