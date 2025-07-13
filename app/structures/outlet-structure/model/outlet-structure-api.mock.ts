export function getOutletStructuresMock(): any {
  return {
    companyCity: 'Ulm',
    companyId: 'GC00000001',
    companyLegalName: 'My legal name',
    outlets: [
      {
        legalName: 'My legal name',
        companyId: 'GC00000001',
        businessSiteId: 'GS00000001',
        marketStructureEnabled: true,
        mainOutlet: true,
        subOutlet: false,
        city: 'Ulm',
        countryId: 'CH',
        subOutlets: [
          {
            legalName: 'My legal name',
            companyId: 'GC00000001',
            countryId: 'CH',
            businessSiteId: 'GS00000002',
            mainOutlet: false,
            marketStructureEnabled: true,
            subOutlet: true,
            city: 'Ulm',
            registeredOffice: false
          }
        ],
        registeredOffice: true,
        businessNames: [
          { businessName: 'Business Name', brandId: 'MB' },
          { businessName: 'Business Name', brandId: 'SMT' }
        ],
        brandCodes: [
          { brandCode: 'BC12345', brandId: 'MB' },
          { brandCode: 'BC12345', brandId: 'SMT' }
        ]
      },
      {
        legalName: 'My legal name',
        companyId: 'GC00000001',
        countryId: 'CH',
        businessSiteId: 'GS00000010',
        mainOutlet: false,
        marketStructureEnabled: true,
        subOutlet: false,
        city: 'Ulm',
        registeredOffice: false
      }
    ]
  };
}
