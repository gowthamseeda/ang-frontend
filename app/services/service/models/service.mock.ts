import { clone } from 'ramda';

import { Mock } from '../../../testing/test-utils/mock';
import { Service } from './service.model';

export class ServiceMock extends Mock {
  static mock: { [key: number]: Service } = {
    0: {
      id: 0,
      name: 'Sales',
      position: 0,
      active: false,
      openingHoursSupport: false,
      description: 'Description for Sales'
    },
    1: {
      id: 1,
      name: 'Body Repair',
      position: 1,
      active: false,
      openingHoursSupport: false,
      allowedDistributionLevels: ['RETAILER'],
      description: 'Description for body repair'
    },
    2: {
      id: 170,
      name: 'Used Vehicles Trade',
      translations: {
        'en-UK': {
          serviceName: 'Used Vehicles Trade',
          serviceDescription: 'Trade of used vehicles'
        }
      },
      position: 2,
      active: false,
      openingHoursSupport: false,
      description: 'Description for used vehicles trade'
    }
  };

  static asIds(): number[] {
    return clone(Object.keys(this.mock).map(key => this.mock[key].id));
  }

  static forContracts(): Service[] {
    return clone([this.mock[1], this.mock[2]]);
  }
}
