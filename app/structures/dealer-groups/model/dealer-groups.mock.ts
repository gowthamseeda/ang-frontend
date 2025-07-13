import {
  DealerGroupMember,
  DealerGroupMemberWithRO,
  DealerGroups
} from '../../models/dealer-group.model';

export const dealerGroupsMock: DealerGroups = {
  dealerGroups: [
    {
      dealerGroupId: 'DG00000001',
      name: 'Dealer Group',
      active: true,
      headquarter: {
        id: 'GS00000001',
        legalName: 'Auto Lang',
        address: {
          city: 'London'
        },
        isRegisteredOffice: false,
        brandCodes: [
          {
            brandCode: '00001',
            brandId: 'SMT'
          }
        ]
      },
      country: {
        id: 'GB',
        name: 'United Kingdom'
      },
      members: [
        {
          id: 'GS00000002',
          companyId: 'GC00000001',
          legalName: 'John Gill',
          address: {
            city: 'London'
          },
          isRegisteredOffice: false,
          country: {
            id: 'GB',
            name: 'United Kingdom'
          },
          active: true,
          brandCodes: [
            {
              brandCode: '12345',
              brandId: 'MB'
            }
          ]
        }
      ]
    },
    {
      dealerGroupId: 'DG00000002',
      name: 'Dealer Group',
      active: true,
      headquarter: {
        id: 'GS00000002',
        legalName: 'John Gill',
        address: {
          city: 'London'
        },
        isRegisteredOffice: false,
        brandCodes: [
          {
            brandCode: '12345',
            brandId: 'MB'
          }
        ]
      },
      country: {
        id: 'GB',
        name: 'United Kingdom'
      }
    },
    {
      dealerGroupId: 'DG00000003',
      name: 'Dealer Group',
      active: true,
      headquarter: {
        id: 'GS00000002',
        legalName: 'John Gill',
        address: {
          city: 'London'
        },
        isRegisteredOffice: false,
        brandCodes: [
          {
            brandCode: '12345',
            brandId: 'MB'
          }
        ]
      },
      country: {
        id: 'GB',
        name: 'United Kingdom'
      },
      members: [
        {
          id: 'GS00000001',
          companyId: 'GC00000001',
          legalName: 'Auto Lang',
          address: {
            city: 'London'
          },
          isRegisteredOffice: false,
          country: {
            id: 'GB',
            name: 'United Kingdom'
          },
          active: true,
          brandCodes: [
            {
              brandCode: '00001',
              brandId: 'SMT'
            }
          ]
        }
      ]
    },
    {
      active: false,
      country: {
        id: 'UK',
        name: 'United Kingdom'
      },
      dealerGroupId: 'DG00000004',
      headquarter: {
        address: {
          city: 'London'
        },
        id: 'GS00000002',
        isRegisteredOffice: false,
        legalName: 'John Gill',
        brandCodes: [
          {
            brandCode: '12345',
            brandId: 'MB'
          }
        ]
      },
      members: [
        {
          id: 'GS00000001',
          companyId: 'GC00000001',
          address: {
            city: 'London'
          },
          country: {
            id: 'GB',
            name: 'United Kingdom'
          },
          isRegisteredOffice: false,
          legalName: 'Auto Lang',
          active: true,
          brandCodes: [
            {
              brandCode: '00001',
              brandId: 'SMT'
            }
          ]
        }
      ],
      name: 'Dealer Group (inactive)',
      successorGroup: {
        id: 'DG00000002',
        name: 'Dealer Group'
      }
    }
  ]
};

export const dealerGroupMock = {
  dealerGroupId: 'DG00000001',
  name: 'Dealer Group',
  active: true,
  headquarter: {
    id: 'GS00000001',
    legalName: 'Auto Lang',
    address: {
      city: 'Geneva'
    },
    isRegisteredOffice: false
  },
  country: {
    id: 'CH',
    name: 'Switzerland'
  }
};

export const getDealerGroupMockForCreate = {
  id: 'DG00000005',
  name: 'Bell Truck & Van',
  active: true,
  members: ['GS00000002'],
  headquarterId: 'GS00000001'
};

export const getDealerGroupMockForUpdate = {
  name: 'Bell Truck & Van',
  active: true,
  members: ['GS00000002'],
  headquarterId: 'GS00000001',
  successorId: 'DG00000002'
};

export const dealerGroupMembersMock: DealerGroupMember[] = [
  {
    id: 'GS00000001',
    companyId: 'GC00000001',
    legalName: 'Herbrand GmbH',
    address: {
      street: 'Dieselstraße',
      streetNumber: '6',
      zipCode: '47533',
      city: 'Berlin'
    },
    country: {
      id: 'DE',
      name: 'Germany'
    },
    isRegisteredOffice: false,
    active: true
  }
];

export const dealerGroupMembersWithROMock: DealerGroupMember[] = [
  {
    id: 'GS00000002',
    companyId: 'GC00000001',
    legalName: 'John Gill',
    address: {
      city: 'London'
    },
    country: {
      id: 'GB',
      name: 'United Kingdom'
    },
    isRegisteredOffice: false,
    active: true
  },
  {
    id: 'GS00000003',
    companyId: 'GC00000001',
    legalName: 'John Gill',
    address: {
      city: 'London'
    },
    country: {
      id: 'GB',
      name: 'United Kingdom'
    },
    isRegisteredOffice: true,
    active: true
  },
  {
    id: 'GS00000008',
    companyId: 'GC00000001',
    legalName: 'John Gill',
    address: {
      city: 'London'
    },
    country: {
      id: 'GB',
      name: 'United Kingdom'
    },
    isRegisteredOffice: false,
    active: true
  }
];

export const dealerGroupMembersWithDifferentROMock: DealerGroupMember[] = [
  {
    id: 'GS00000002',
    companyId: 'GC00000001',
    legalName: 'John Gill',
    address: {
      city: 'London'
    },
    country: {
      id: 'GB',
      name: 'United Kingdom'
    },
    isRegisteredOffice: false,
    active: true
  },
  {
    id: 'GS00000003',
    companyId: 'GC00000001',
    legalName: 'John Gill',
    address: {
      city: 'London'
    },
    country: {
      id: 'GB',
      name: 'United Kingdom'
    },
    isRegisteredOffice: true,
    active: true
  },
  {
    id: 'GS00000031',
    companyId: 'GC00000001',
    legalName: 'John Gill',
    address: {
      city: 'London'
    },
    country: {
      id: 'GB',
      name: 'United Kingdom'
    },
    isRegisteredOffice: true,
    active: true
  },
  {
    id: 'GS00000021',
    companyId: 'GC00000001',
    legalName: 'John Gill',
    address: {
      city: 'London'
    },
    country: {
      id: 'GB',
      name: 'United Kingdom'
    },
    isRegisteredOffice: true,
    active: true
  }
];

export const dealerGroupMembersWithRO: DealerGroupMemberWithRO[] = [
  {
    registeredOffice: {
      id: 'GS00000001',
      companyId: 'GC00000001',
      legalName: 'Herbrand GmbH',
      address: {
        street: 'Dieselstraße',
        streetNumber: '6',
        zipCode: '47533',
        city: 'Berlin'
      },
      country: {
        id: 'DE',
        name: 'Germany'
      },
      isRegisteredOffice: true,
      active: true
    },
    members: [
      {
        id: 'GS00000002',
        companyId: 'GC00000001',
        legalName: 'Herbrand GmbH',
        address: {
          street: 'Dieselstraße',
          streetNumber: '7',
          zipCode: '47533',
          city: 'Berlin'
        },
        country: {
          id: 'DE',
          name: 'Germany'
        },
        isRegisteredOffice: false,
        active: true
      }
    ]
  },
  {
    registeredOffice: {
      id: 'GS00000003',
      companyId: 'GC00000002',
      legalName: 'Herbrand GmbH 2',
      address: {
        street: 'Dieselstraße',
        streetNumber: '8',
        zipCode: '47533',
        city: 'Berlin'
      },
      country: {
        id: 'DE',
        name: 'Germany'
      },
      isRegisteredOffice: true,
      active: true
    },
    members: []
  }
];
