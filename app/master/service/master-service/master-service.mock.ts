import { Mock } from '../../../testing/test-utils/mock';

import { MasterService } from './master-service.model';

export class MasterServiceMock extends Mock {
  static mock: { [id: number]: MasterService } = {
    1: {
      name: 'Body Repair',
      active: false,
      id: 1,
      position: 1,
      openingHoursSupport: false,
      allowedDistributionLevels: ['RETAILER'],
      description: 'Description for body repair'
    },
    170: {
      translations: {
        'en-UK': {
          serviceName: 'Used Vehicles Trade',
          description: 'Used Vehicles Trade'
        }
      },
      name: 'Used Vehicles Trade',
      active: false,
      id: 170,
      position: 2,
      openingHoursSupport: false,
      retailerVisibility: true,
      description: 'desription for used vehicle trade'
    },
    200: {
      name: 'Parts',
      active: false,
      id: 200,
      position: 3,
      openingHoursSupport: false,
      retailerVisibility: true,
      description: 'desription for parts'
    },
    120: {
      name: 'Sales',
      active: false,
      id: 120,
      position: 4,
      openingHoursSupport: true,
      retailerVisibility: false,
      description: 'description for sale'
    }
  };
}
