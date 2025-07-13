import { Mock } from '../testing/test-utils/mock';

import { GroupedTask } from './grouped-task.model';
import { DataCluster, Status, Type } from './task.model';

export class GroupedTaskMock extends Mock {
  static mock: { [key: string]: GroupedTask } = {
    GS0000001: {
      businessSite: {
        businessSiteId: 'GS0000001',
        legalName: 'My Company Ltd.',
        address: {
          street: 'Mainstreet',
          streetNumber: '1',
          city: 'London',
          zipCode: '12345',
          countryId: 'UK'
        }
      },
      lastChanged: '2020-06-03T12:00:00',
      tasks: [
        {
          taskId: 1,
          businessSiteId: 'GS0000001',
          type: Type.DATA_VERIFICATION,
          status: Status.OPEN,
          initiator: 'JOHNDOE',
          dataCluster: DataCluster.BASE_DATA_ADDRESS,
          creationDate: '2020-06-03T12:00:00'
        },
        {
          taskId: 2,
          businessSiteId: 'GS0000001',
          type: Type.DATA_VERIFICATION,
          status: Status.OPEN,
          dataCluster: DataCluster.COMMUNICATION_CHANNELS,
          creationDate: '2020-06-01T12:00:00'
        }
      ]
    }
  };

  static forContracts(): GroupedTask[] {
    return [
      {
        businessSite: {
          businessSiteId: 'GS00000001',
          legalName: 'Auto Lang',
          address: {
            city: 'London',
            countryId: 'GB'
          }
        },
        lastChanged: '2020-01-01T00:00:00.000Z',
        tasks: [
          {
            taskId: 1,
            businessSiteId: 'GS00000001',
            type: Type.DATA_VERIFICATION,
            status: Status.OPEN,
            dataCluster: DataCluster.BASE_DATA_ADDRESS,
            creationDate: '2020-01-01T00:00:00.000Z'
          }
        ]
      },
      {
        businessSite: {
          businessSiteId: 'GS20000001',
          legalName: 'Auto Lang',
          address: {
            city: 'Liverpool',
            countryId: 'GB'
          }
        },
        lastChanged: '2020-06-12T14:35:00.000Z',
        tasks: [
          {
            taskId: 2,
            businessSiteId: 'GS20000001',
            type: Type.DATA_CHANGE,
            status: Status.OPEN,
            dueDate: '2020-07-12',
            dataCluster: DataCluster.OPENING_HOURS,
            creationDate: '2020-06-12T14:35:00.000Z',
            initiator: 'JOHNDOE',
            comments: [
              {
                creationDate: '2020-06-12T14:35:00.000Z',
                user: 'HENNES8',
                comment: 'Please update your opening hours!'
              }
            ]
          }
        ]
      }
    ];
  }

  static forContract(): GroupedTask {
    return {
      businessSite: {
        businessSiteId: 'GS00000001',
        legalName: 'Auto Lang',
        address: {
          city: 'London',
          countryId: 'GB'
        }
      },
      lastChanged: '2020-01-01T00:00:00.000Z',
      tasks: [
        {
          taskId: 1,
          businessSiteId: 'GS00000001',
          type: Type.DATA_VERIFICATION,
          status: Status.OPEN,
          dataCluster: DataCluster.BASE_DATA_ADDRESS,
          creationDate: '2020-01-01T00:00:00.000Z'
        }
      ]
    };
  }
}
