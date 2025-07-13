import { clone } from 'ramda';
import { OfferedService } from './offered-service.model';
import { Mock } from '../../testing/test-utils/mock';

export class OfferedServiceMock extends Mock {
  static mock: { [key: string]: OfferedService } = {
    'GS0000001-1': {
      id: 'GS0000001-1',
      serviceId: 1,
      productCategoryId: 1,
      brandId: 'MB',
      productGroupId: 'PC'
    },
    'GS0000001-2': {
      id: 'GS0000001-2',
      serviceId: 1,
      productCategoryId: 1,
      brandId: 'MYB',
      productGroupId: 'PC'
    },
    'GS0000001-3': {
      id: 'GS0000001-3',
      serviceId: 2,
      productCategoryId: 2,
      brandId: 'MB',
      productGroupId: 'PC',
      validity: {
        application: true,
        applicationValidUntil: '2019-01-01',
        validFrom: '2019-01-02',
        validUntil: '2019-01-31',
        valid: true
      }
    },
    'GS0000001-4': {
      id: 'GS0000001-4',
      serviceId: 1,
      productCategoryId: 1,
      brandId: 'MB',
      productGroupId: 'PC'
    },
    'GS0000001-5': {
      id: 'GS0000001-5',
      serviceId: 3,
      productCategoryId: 2,
      brandId: 'MB',
      productGroupId: 'VAN',
      validity: {
        application: true,
        applicationValidUntil: '2019-01-01',
        validFrom: '2019-01-02',
        validUntil: '2019-01-31',
        valid: true
      }
    }
  };

  private static offeredServicesForContracts: OfferedService[] = [
    {
      id: 'GS00000001-1',
      serviceId: 120,
      productCategoryId: 1,
      brandId: 'MB',
      productGroupId: 'PC'
    },
    {
      id: 'GS00000001-10',
      serviceId: 170,
      productCategoryId: 1,
      brandId: 'MB',
      productGroupId: 'PC',
      validity: {
        application: true,
        applicationValidUntil: '2018-12-31',
        validFrom: '2019-01-01',
        validUntil: '2020-01-01'
      },
      communications: [
        {
          communicationFieldId: 'Facebook',
          value: 'facebook.com'
        }
      ],
      contracts: [
        {
          contracteeId: 'GS30000001'
        }
      ],
      openingHours: [
        {
          day: 'WE',
          endDate: '2020-03-17',
          id: 1001,
          startDate: '2020-03-15',
          times: [
            {
              begin: '10:00',
              end: '12:00'
            },
            {
              begin: '14:00',
              end: '16:00'
            }
          ]
        }
      ]
    },
    {
      id: 'GS00000001-4',
      serviceId: 120,
      productCategoryId: 1,
      brandId: 'MB',
      productGroupId: 'PC'
    }
  ];

  static asIds(): string[] {
    return clone(Object.keys(this.mock).map(key => this.mock[key].id));
  }

  static forContracts(): OfferedService[] {
    return clone(this.offeredServicesForContracts);
  }
}
