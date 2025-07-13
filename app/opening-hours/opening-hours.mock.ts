import { Mock } from '../testing/test-utils/mock';

export class OpeningHoursMock extends Mock {
  static multiEditOpeningHours(): any[] {
    return [
      {
        offeredServiceId: 'GS00000001-1',
        openingHours: [
          {
            day: 'MO',
            times: [
              {
                begin: '05:00',
                end: '11:00'
              },
              {
                begin: '13:30',
                end: '19:00'
              }
            ],
            closed: false
          },
          {
            day: 'TU',
            times: [
              {
                begin: '05:00',
                end: '11:00'
              },
              {
                begin: '13:30',
                end: '19:00'
              }
            ],
            closed: false
          }
        ]
      },
      {
        offeredServiceId: 'GS00000001-2',
        openingHours: [
          {
            day: 'WE',
            times: [
              {
                begin: '05:00',
                end: '11:00'
              },
              {
                begin: '13:30',
                end: '19:00'
              }
            ],
            closed: false
          }
        ]
      },
      {
        offeredServiceId: 'GS00000001-3',
        openingHours: [
          {
            day: 'MO',
            times: [
              {
                begin: '05:00',
                end: '11:00'
              },
              {
                begin: '13:30',
                end: '19:00'
              }
            ],
            closed: false
          },
          {
            day: 'TU',
            times: [
              {
                begin: '05:00',
                end: '11:00'
              },
              {
                begin: '13:30',
                end: '19:00'
              }
            ],
            closed: false
          }
        ]
      },
      {
        offeredServiceId: 'GS00000001-5',
        openingHours: [
          {
            day: 'WE',
            times: [
              {
                begin: '08:00',
                end: '12:00'
              },
              {
                begin: '14:00',
                end: '20:00'
              }
            ],
            closed: false
          }
        ]
      }
    ];
  }

  static multiEditSpecialOpeningHours(): any[] {
    return [
      {
        offeredServiceId: 'GS00000001-1',
        startDate: '2017-01-26',
        endDate: '2017-01-29',
        openingHours: [
          {
            day: 'WE',
            times: [
              {
                begin: '08:00',
                end: '12:00'
              },
              {
                begin: '14:00',
                end: '20:00'
              }
            ],
            closed: false
          }
        ]
      },
      {
        offeredServiceId: 'GS00000001-3',
        startDate: '2017-01-26',
        endDate: '2017-01-29',
        openingHours: [
          {
            day: 'WE',
            times: [
              {
                begin: '08:00',
                end: '12:00'
              },
              {
                begin: '14:00',
                end: '20:00'
              }
            ],
            closed: false
          }
        ]
      },
      {
        offeredServiceId: 'GS00000001-4',
        startDate: '2017-01-26',
        endDate: '2017-01-29',
        openingHours: [
          {
            day: 'TH',
            closed: true
          }
        ]
      },
      {
        offeredServiceId: 'GS00000001-5',
        startDate: '2017-01-26',
        endDate: '2017-01-29',
        openingHours: [
          {
            day: 'TU',
            times: [
              {
                begin: '05:00',
                end: '11:00'
              },
              {
                begin: '13:30',
                end: '19:00'
              }
            ],
            closed: false
          }
        ]
      }
    ];
  }
}
