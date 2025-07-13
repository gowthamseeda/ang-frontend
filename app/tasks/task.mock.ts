import { AGGREGATE_FIELDS, AGGREGATE_NAMES } from 'app/shared/model/constants';
import { Mock } from '../testing/test-utils/mock';

import { AggregateDataField, DataCluster, Status, Task, Type } from './task.model';

export class TaskMock extends Mock {
  static mock: { [key: string]: Task } = {
    1: {
      taskId: 1,
      businessSiteId: 'GS00000001',
      type: Type.DATA_VERIFICATION,
      status: Status.OPEN,
      initiator: 'JOHNDOE',
      dataCluster: DataCluster.BASE_DATA_ADDRESS,
      creationDate: '2020-06-03T12:00:00'
    },
    2: {
      taskId: 2,
      businessSiteId: 'GS20000001',
      type: Type.DATA_CHANGE,
      status: Status.OPEN,
      dataCluster: DataCluster.BASE_DATA_ADDRESS,
      creationDate: '2020-06-01T12:00:00'
    },
    3: {
      taskId: 3,
      businessSiteId: 'GS20000001',
      type: Type.DATA_VERIFICATION,
      status: Status.OPEN,
      dataCluster: DataCluster.LEGAL_TAX_NO,
      creationDate: '2020-06-01T12:00:00'
    },
    4: {
      taskId: 3,
      businessSiteId: 'GS20000001',
      type: Type.DATA_VERIFICATION,
      status: Status.OPEN,
      creationDate: '2020-06-01T12:00:00',
      aggregateName: AGGREGATE_NAMES.COMPANY_LEGAL_INFO,
      aggregateField: 'vatNo'
    },
    5: {
      taskId: 5,
      businessSiteId: 'GS20000001',
      type: Type.DATA_CHANGE,
      status: Status.OPEN,
      dataCluster: DataCluster.LEGAL_LEGAL_FOOTER,
      creationDate: '2020-06-03T12:00:00'
    },
    6: {
      taskId: 6,
      businessSiteId: 'GS20000001',
      type: Type.DATA_VERIFICATION,
      status: Status.OPEN,
      dataCluster: DataCluster.LEGAL_LEGAL_FOOTER,
      creationDate: '2020-06-01T12:00:00'
    }
  };

  static mockTaskWithOpeningHoursDiff: Task[] = [
    {
      taskId: 1,
      businessSiteId: 'GS0000001',
      status: Status.OPEN,
      type: Type.DATA_CHANGE,
      dataCluster: DataCluster.OPENING_HOURS,
      creationDate: '2020-01-01T00:00:00.000Z',
      initiator: 'USER!',
      tags: {
        productCategoryId: ['1'],
        serviceId: ['1']
      },
      diff: {
        openingHoursDiff: [
          {
            id: 100000,
            productCategoryId: 1,
            serviceId: 1,
            serviceName: 'Service1',
            productGroupId: 'AB',
            brandId: 'MB',
            day: 'TU',
            diff: {
              old: {
                times: [
                  {
                    begin: '08:30',
                    end: '18:00'
                  }
                ],
                closed: false,
              },
              new: {
                times: [
                  {
                    begin: '09:30',
                    end: '18:00'
                  }
                ],
                closed: false,
              }
            }
          }
        ]
      }
    }
  ];

  static forContracts(): Task[] {
    return [
      {
        taskId: 1,
        businessSiteId: 'GS00000001',
        type: Type.DATA_VERIFICATION,
        status: Status.OPEN,
        dataCluster: DataCluster.BASE_DATA_ADDRESS,
        creationDate: '2020-01-01T00:00:00.000Z'
      },
      {
        taskId: 2,
        businessSiteId: 'GS20000001',
        type: Type.DATA_CHANGE,
        status: Status.OPEN,
        dataCluster: DataCluster.OPENING_HOURS,
        creationDate: '2020-06-12T14:35:00.000Z',
        dueDate: '2020-07-12',
        initiator: 'JOHNDOE',
        comments: [
          {
            user: 'HENNES8',
            creationDate: '2020-06-12T14:35:00.000Z',
            comment: 'Please update your opening hours!'
          }
        ]
      },
      {
        taskId: 322,
        businessSiteId: 'GS00000001',
        type: Type.DATA_CHANGE,
        status: Status.OPEN,
        dataCluster: DataCluster.OPENING_HOURS,
        creationDate: '2020-06-12T14:35:00.000Z'
      },
      {
        taskId: 346,
        businessSiteId: 'GS00000001',
        type: Type.DATA_CHANGE,
        status: Status.OPEN,
        dataCluster: DataCluster.COMMUNICATION_CHANNELS,
        creationDate: '2020-06-12T14:35:00.000Z'
      }
    ];
  }

  static forContract(): Task {
    return {
      taskId: 1,
      businessSiteId: 'GS00000001',
      type: Type.DATA_VERIFICATION,
      status: Status.OPEN,
      dataCluster: DataCluster.BASE_DATA_ADDRESS,
      creationDate: '2020-01-01T00:00:00.000Z'
    };
  }

  static mockTaskArray: Task[] = [
    {
      taskId: 2,
      businessSiteId: 'GS20000001',
      type: Type.DATA_CHANGE,
      status: Status.OPEN,
      dataCluster: DataCluster.BASE_DATA_ADDRESS,
      creationDate: '2020-06-01T12:00:00'
    },
    {
      taskId: 3,
      businessSiteId: 'GS20000001',
      type: Type.DATA_CHANGE,
      status: Status.OPEN,
      dataCluster: DataCluster.LEGAL_TAX_NO,
      creationDate: '2020-06-01T12:00:00'
    },
    {
      taskId: 4,
      businessSiteId: 'GS20000001',
      type: Type.DATA_CHANGE,
      status: Status.OPEN,
      creationDate: '2020-06-01T12:00:00',
      aggregateName: AGGREGATE_NAMES.COMPANY_LEGAL_INFO,
      aggregateField: AGGREGATE_FIELDS.LEGAL_INFO_VAT_NUMBER
    },
    {
      taskId: 5,
      businessSiteId: 'GS20000001',
      type: Type.DATA_CHANGE,
      status: Status.DECLINED,
      creationDate: '2024-06-01T12:00:00',
      aggregateName: 'BaseData',
      aggregateField: 'AddressAddition'
    }
  ]

  static verificationTriggerData: AggregateDataField = {
    aggregateName: AGGREGATE_NAMES.BUSINESS_SITE_LEGAL_INFO,
    aggregateField: AGGREGATE_FIELDS.LEGAL_INFO_TAX_NUMBER,
    dataCluster: DataCluster.LEGAL_TAX_NO
  }
}
