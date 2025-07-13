export const mockData = {
  validityTableRow: {
    validUntil: '2024-12-31',
    offeredServicesMap: {
      'GS001-1': {
        id: 'GS001-1',
        serviceId: 1,
        brandId: 'B1',
        productGroupId: 'PG1',
        productCategoryId: 1,
        businessSite: { id: 'GS001' },
        validity: { validFrom: '2024-01-01', validUntil: '2024-12-31' }
      },
      'GS001-2': {
        id: 'GS001-2',
        serviceId: 1,
        brandId: 'B2',
        productGroupId: 'PG2',
        productCategoryId: 2,
        businessSite: { id: 'GS001' },
        validity: { validFrom: '2024-02-01', validUntil: '2024-01-01' }
      }
    }
  },
  services: [
    {
      id: 1,
      name: 'Service 1',
      brandProductGroups: [
        { brandId: 'B1', productGroupId: 'PG1' },
        { brandId: 'B2', productGroupId: 'PG2' }
      ],
      position: 0,
      active: true,
      openingHoursSupport: false
    }
  ],
  outletIds: ['GS001']
};

export const mockDataWithUndefinedBrandProductGroups = {
  services: [
    {
      id: 1,
      name: 'Service 1',
      brandProductGroups: undefined,
      position: 0,
      active: true,
      openingHoursSupport: false
    }
  ],
  validityTableRow: {
    validUntil: '2024-12-31',
    offeredServicesMap: {
      'GS001-1': {
        id: '1',
        serviceId: 1,
        brandId: 'B1',
        productGroupId: 'PG1',
        productCategoryId: 1,
        businessSite: { id: 'GS001' },
        validity: { validFrom: '2024-01-01', validUntil: '2024-12-31' }
      },
      'GS001-2': {
        id: '2',
        serviceId: 1,
        brandId: 'B2',
        productGroupId: 'PG2',
        productCategoryId: 2,
        businessSite: { id: 'GS001' },
        validity: { validFrom: '2025-01-01', validUntil: '2024-12-31' }
      }
    }
  },
  outletIds: ['GS001']
};

export const dataWithMissingValidUntil = {
  ...mockData,
  validityTableRow: {
    ...mockData.validityTableRow,
    offeredServicesMap: {
      'GS001-3': {
        id: 'GS001-3',
        serviceId: 1,
        brandId: 'B3',
        productGroupId: '1', 
        productCategoryId: 1,
        businessSite: { id: 'GS001' },
        validity: {
          validFrom: '2024-01-01',
          validUntil: ''
        }
      }
    }
  },
  services: [
    {
      id: 1,
      name: 'Service 1',
      brandProductGroups: [
        { brandId: 'B3', productGroupId: '1' }
      ],
      position: 0,            
      active: true,                                 
      openingHoursSupport: false 
    }
  ]
};