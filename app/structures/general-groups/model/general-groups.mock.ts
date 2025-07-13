import { GeneralGroupMember, GeneralGroups } from './general-groups.model';

export const generalGroupsMock: GeneralGroups = {
  generalGroups: [
    {
      generalGroupId: 'GG00000001',
      name: 'General Group',
      active: true,
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
          country: {
            id: 'GB',
            name: 'United Kingdom'
          },
          isRegisteredOffice: false,
          active: true,
          brandCodes: [
            {
              brandCode: '12345',
              brandId: 'MB'
            }
          ]
        }
      ],
      brandProductGroupServices: [
        {
          brand: {
            id: 'MB',
            name: 'Mercedes-Benz'
          },
          productGroup: {
            id: 'PC',
            name: 'Passenger-Car'
          },
          service: {
            id: 170,
            name: 'Used Cars'
          }
        }
      ]
    },
    {
      generalGroupId: 'GG00000002',
      name: 'General Group',
      active: true,
      country: {
        id: 'GB',
        name: 'United Kingdom'
      }
    },
    {
      generalGroupId: 'GG00000003',
      name: 'General Group',
      active: true,
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
          country: {
            id: 'GB',
            name: 'United Kingdom'
          },
          isRegisteredOffice: false,
          active: true
        }
      ]
    },
    {
      generalGroupId: 'GG00000004',
      name: 'General Group (inactive)',
      active: false,
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
          country: {
            id: 'GB',
            name: 'United Kingdom'
          },
          isRegisteredOffice: false,
          active: true
        }
      ],
      successorGroup: {
        id: 'GG00000002',
        name: 'General Group'
      }
    }
  ]
};

export const generalGroupMock = {
  generalGroupId: 'GG00000001',
  name: 'Herbrand GmbH',
  active: true,
  country: {
    id: 'CH',
    name: 'Switzerland'
  }
};

export const generalGroupMembersMock: GeneralGroupMember[] = [
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

export const generalGroupMockForCreate = {
  id: 'GG00000005',
  name: 'DM DU 01',
  active: true,
  countryId: 'CH',
  members: ['GS00000002'],
  brandProductGroupServices: [
    {
      brandId: 'MB',
      productGroupId: 'PC',
      serviceId: 170
    }
  ]
};
