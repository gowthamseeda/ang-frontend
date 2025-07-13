import { OfferedService } from './outlet-history-snapshot.model';

export const currentOfferedServiceSnapshotEntriesMock: OfferedService[] = [
  {
    offeredServiceId: 'GS0000001-226',
    businessSite: {
      id: 'GS0000001'
    },
    service: {
      id: 200,
      name: 'Service 200'
    },
    productCategory: {
      id: 1
    },
    brand: {
      id: 'MB'
    },
    productGroup: {
      id: 'VAN'
    },
    serviceCharacteristic: {
      id: 100
    },
    catalog: [
      {
        id: 101
      }
    ],
    series: [
      {
        id: 3
      },
      {
        id: 4
      }
    ],
    modelSeries: [
      {
        id: 'model series 3'
      },
      {
        id: 'model series 4'
      }
    ],
    onlineOnly: false,
    isDeleted: false
  },
  {
    offeredServiceId: 'GS0000001-74',
    businessSite: {
      id: 'GS0000001'
    },
    service: {
      id: 8,
      name: 'Service 8',
      allowedDistributionLevels: ['allowedDistributionLevels 1', 'allowedDistributionLevels 2']
    },
    productCategory: {
      id: 2
    },
    brand: {
      id: 'SMT Changed'
    },
    productGroup: {
      id: 'PC Changed'
    },
    validity: {
      application: false,
      validFrom: new Date('2022-12-01'),
      validUntil: new Date('2035-12-30'),
      valid: true
    },
    openingHours: [
      {
        id: 123,
        startDate: 'Start Date',
        endDate: 'End Date',
        day: 'the day',
        times: {
          begin: 'Starting Time',
          end: 'Ending Time'
        }
      },
      {
        id: 124,
        startDate: 'Start Date 2',
        endDate: 'End Date 2',
        day: 'the day 124',
        times: {
          begin: 'Starting Time 2',
          end: 'Ending Time 2'
        }
      }
    ],
    communications: [
      {
        communicationFieldId: 'communicationFieldId 1',
        value: 'Value URL 1'
      },
      {
        communicationFieldId: 'communicationFieldId 2',
        value: 'Value URL 2'
      }
    ],
    contractees: [
      {
        contracteeId: 'contracteeId 1'
      }
    ],
    contracteeList: [
      {
        contracteeId: 'contracteeId List 1'
      }
    ],
    onlineOnly: true,
    nonCustomerFacing: true,
    isDeleted: true
  },
  {
    offeredServiceId: 'GS0000001-1',
    businessSite: {
      id: 'GS0000001'
    },
    service: {
      id: 120,
      name: 'Service 120'
    },
    productCategory: {
      id: 1
    },
    brand: {
      id: 'MB'
    },
    productGroup: {
      id: 'PC'
    },
    validity: {
      application: false,
      validFrom: new Date('2022-12-07'),
      validUntil: new Date('2032-12-30'),
      valid: true
    },
    communications: [
      {
        communicationFieldId: 'PHONE',
        value: '032472889'
      },
      {
        communicationFieldId: 'EMAIL',
        value: 'customer@testing.com'
      }
    ],
    onlineOnly: true,
    isDeleted: false
  },
  {
    offeredServiceId: 'GS0000001-225',
    businessSite: {
      id: 'GS0000001'
    },
    service: {
      id: 200,
      name: 'Service 200'
    },
    productCategory: {
      id: 1
    },
    brand: {
      id: 'MB'
    },
    productGroup: {
      id: 'PC'
    },
    series: [
      {
        id: 3
      },
      {
        id: 4
      }
    ],
    modelSeries: [
      {
        id: 'model series 3'
      },
      {
        id: 'model series 4'
      }
    ],
    isDeleted: false
  },
  {
    offeredServiceId: 'GS0000001-486',
    businessSite: {
      id: 'GS0000001'
    },
    service: {
      id: 200,
      name: 'Service 200'
    },
    productCategory: {
      id: 1
    },
    brand: {
      id: 'FTL'
    },
    productGroup: {
      id: 'VAN'
    },
    isDeleted: false
  },
  {
    offeredServiceId: 'GS0000001-70',
    businessSite: {
      id: 'GS0000001'
    },
    service: {
      id: 7,
      name: 'Service 7'
    },
    productCategory: {
      id: 1
    },
    brand: {
      id: 'MB'
    },
    productGroup: {
      id: 'VAN'
    },
    communications: [
      {
        communicationFieldId: 'PHONE',
        value: '078900999'
      }
    ],
    isDeleted: false
  },
  {
    offeredServiceId: 'GS0000001-69',
    businessSite: {
      id: 'GS0000001'
    },
    service: {
      id: 7,
      name: 'Service 7'
    },
    productCategory: {
      id: 1
    },
    brand: {
      id: 'MB'
    },
    productGroup: {
      id: 'PC'
    },
    isDeleted: false
  }
];

export const comparingOfferedServiceSnapshotEntriesMock: OfferedService[] = [
  {
    offeredServiceId: 'GS0000001-225',
    businessSite: {
      id: 'GS0000001'
    },
    service: {
      id: 200,
      name: 'Service 200'
    },
    productCategory: {
      id: 1
    },
    brand: {
      id: 'MB'
    },
    productGroup: {
      id: 'PC'
    },
    series: [
      {
        id: 4
      }
    ],
    isDeleted: false
  },
  {
    offeredServiceId: 'GS0000001-486',
    businessSite: {
      id: 'GS0000001'
    },
    service: {
      id: 200,
      name: 'Service 200'
    },
    productCategory: {
      id: 1
    },
    brand: {
      id: 'FTL'
    },
    productGroup: {
      id: 'VAN'
    },
    isDeleted: false
  },
  {
    offeredServiceId: 'GS0000001-70',
    businessSite: {
      id: 'GS0000001'
    },
    service: {
      id: 7,
      name: 'Service 7'
    },
    productCategory: {
      id: 1
    },
    brand: {
      id: 'MB'
    },
    productGroup: {
      id: 'VAN'
    },
    communications: [
      {
        communicationFieldId: 'PHONE',
        value: '078900999'
      }
    ],
    isDeleted: false
  },
  {
    offeredServiceId: 'GS0000001-74',
    businessSite: {
      id: 'GS0000001'
    },
    service: {
      id: 7,
      name: 'Service 7',
      allowedDistributionLevels: ['allowedDistributionLevels 1', 'allowedDistributionLevels 2']
    },
    productCategory: {
      id: 1
    },
    brand: {
      id: 'SMT'
    },
    productGroup: {
      id: 'PC'
    },
    validity: {
      application: false,
      validFrom: new Date('2022-12-01'),
      validUntil: new Date('2035-12-30'),
      valid: true
    },
    openingHours: [
      {
        id: 123,
        startDate: 'Start Date 123',
        endDate: 'End Date',
        day: 'the day',
        times: {
          begin: 'Starting Time 123',
          end: 'Ending Time'
        }
      },
      {
        id: 124,
        startDate: 'Start Date 2',
        endDate: 'End Date 2',
        day: 'the day 2',
        times: {
          begin: 'Starting Time 2',
          end: 'Ending Time 2'
        }
      }
    ],
    communications: [
      {
        communicationFieldId: 'communicationFieldId 1',
        value: 'Value URL 1'
      },
      {
        communicationFieldId: 'communicationFieldId 2',
        value: 'Value URL 2'
      }
    ],
    contractees: [
      {
        contracteeId: 'contracteeId 1'
      }
    ],
    contracteeList: [
      {
        contracteeId: 'contracteeId List 1'
      }
    ],
    isDeleted: false
  },
  {
    offeredServiceId: 'GS0000001-69',
    businessSite: {
      id: 'GS0000001'
    },
    service: {
      id: 7,
      name: 'Service 7'
    },
    productCategory: {
      id: 1
    },
    brand: {
      id: 'MB'
    },
    productGroup: {
      id: 'PC'
    },
    isDeleted: false
  },
  {
    offeredServiceId: 'GS0000001-1',
    businessSite: {
      id: 'GS0000001'
    },
    service: {
      id: 120,
      name: 'Service 120'
    },
    productCategory: {
      id: 1
    },
    brand: {
      id: 'MB'
    },
    productGroup: {
      id: 'PC'
    },
    isDeleted: false
  }
];
