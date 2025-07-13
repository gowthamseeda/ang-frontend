import { WeekDay } from '@angular/common';

import { Hours } from '../store/reducers';

import { Response } from './opening-hour-response.model';
import { OpeningHour, SpecialOpeningHour, StandardOpeningHour } from './opening-hour.model';
import { TaskData } from '../../tasks/task.model';
import { MultiSelectOfferedServiceIds } from '../../services/service/models/multi-select.model';

/* OpeningHour */
function getClosed(day: WeekDay): OpeningHour {
  return {
    weekDay: day,
    closed: true,
    times: []
  };
}

function getOpen(day: WeekDay): OpeningHour {
  return {
    weekDay: day,
    closed: true,
    times: [{ begin: '09:00', end: '13:30' }]
  };
}

/* StandardOpeningHour */
export function getMondayOpenFusoTruckVanStandardHour(): StandardOpeningHour {
  return {
    brandId: 'FUSO',
    productGroupIds: ['TRUCK', 'VAN'],
    openingHours: [getOpen(WeekDay.Monday)]
  };
}

export function getMondayClosedFusoTruckVanStandardHour(): StandardOpeningHour {
  return {
    brandId: 'FUSO',
    productGroupIds: ['TRUCK', 'VAN'],
    openingHours: [getClosed(WeekDay.Monday)]
  };
}

export function getMondayClosedFusoTruckStandardHour(): StandardOpeningHour {
  return {
    brandId: 'FUSO',
    productGroupIds: ['TRUCK'],
    openingHours: [getClosed(WeekDay.Monday)]
  };
}

export function getMondayClosedFusoVanStandardHour(): StandardOpeningHour {
  return {
    brandId: 'FUSO',
    productGroupIds: ['VAN'],
    openingHours: [getClosed(WeekDay.Monday)]
  };
}

export function getMondayClosedFusoUnimogStandardHour(): StandardOpeningHour {
  return {
    brandId: 'FUSO',
    productGroupIds: ['UNIMOG'],
    openingHours: [getClosed(WeekDay.Monday)]
  };
}

export function getMondayClosedFusoBusStandardHour(): StandardOpeningHour {
  return {
    brandId: 'FUSO',
    productGroupIds: ['BUS'],
    openingHours: [getClosed(WeekDay.Monday)]
  };
}

export function getMondayClosedFusoBusVanStandardHour(): StandardOpeningHour {
  return {
    brandId: 'FUSO',
    productGroupIds: ['BUS', 'VAN'],
    openingHours: [getClosed(WeekDay.Monday)]
  };
}

export function getMondayClosedFusoUnimogVanStandardHour(): StandardOpeningHour {
  return {
    brandId: 'FUSO',
    productGroupIds: ['UNIMOG', 'VAN'],
    openingHours: [getClosed(WeekDay.Monday)]
  };
}

export function getMondayClosedMbVanStandardHour(): StandardOpeningHour {
  return {
    brandId: 'MB',
    productGroupIds: ['VAN'],
    openingHours: [getClosed(WeekDay.Monday)]
  };
}

export function getMondayOpenedMbVanStandardHour(): StandardOpeningHour {
  return {
    brandId: 'MB',
    productGroupIds: ['VAN'],
    openingHours: [getOpen(WeekDay.Monday)]
  };
}

export function getMondayClosedMbPcTruckStandardHour(): StandardOpeningHour {
  return {
    brandId: 'MB',
    productGroupIds: ['PC', 'TRUCK'],
    openingHours: [getClosed(WeekDay.Monday)]
  };
}

export function getMondayOpenMbVanStandardHour(): StandardOpeningHour {
  return {
    brandId: 'MB',
    productGroupIds: ['VAN'],
    openingHours: [getOpen(WeekDay.Monday)]
  };
}

export function getSundayClosedSmtPcStandardHour(): StandardOpeningHour {
  return {
    brandId: 'SMT',
    productGroupIds: ['PC'],
    openingHours: [getClosed(WeekDay.Sunday)]
  };
}

export function getMBPcAndSmtPcAndMybPcStandardHourAllDaysFilled(): StandardOpeningHour[] {
  return [
    {
      brandId: 'MB',
      productGroupIds: ['PC'],
      openingHours: [
        getOpen(WeekDay.Monday),
        getOpen(WeekDay.Tuesday),
        getOpen(WeekDay.Wednesday),
        getOpen(WeekDay.Thursday),
        getOpen(WeekDay.Friday),
        getOpen(WeekDay.Saturday),
        getOpen(WeekDay.Sunday)
      ]
    },
    {
      brandId: 'SMT',
      productGroupIds: ['PC'],
      openingHours: [
        getOpen(WeekDay.Monday),
        getOpen(WeekDay.Tuesday),
        getOpen(WeekDay.Wednesday),
        getOpen(WeekDay.Thursday),
        getOpen(WeekDay.Friday),
        getOpen(WeekDay.Saturday),
        getOpen(WeekDay.Sunday)
      ]
    },
    {
      brandId: 'MYB',
      productGroupIds: ['PC'],
      openingHours: [
        getOpen(WeekDay.Monday),
        getOpen(WeekDay.Tuesday),
        getOpen(WeekDay.Wednesday),
        getOpen(WeekDay.Thursday),
        getOpen(WeekDay.Friday),
        getOpen(WeekDay.Saturday),
        getOpen(WeekDay.Sunday)
      ]
    }
  ];
}

export function getSingleDayClosedMbPcHours(): Hours {
  return {
    standardOpeningHours: [getMondayClosedMbVanStandardHour()],
    specialOpeningHours: [
      {
        ...getMondayClosedMbVanStandardHour(),
        startDate: '2019-05-10',
        endDate: '2019-05-10',
        configured: false
      }
    ]
  };
}

export function getSingleDayClosedMbVan_SmtPc_FusoTruckVanSpecialHours(): Hours {
  return {
    standardOpeningHours: [
      getMondayClosedMbVanStandardHour(),
      getSundayClosedSmtPcStandardHour(),
      getMondayClosedFusoTruckVanStandardHour()
    ],
    specialOpeningHours: [
      {
        ...getMondayClosedMbVanStandardHour(),
        startDate: '2019-04-08',
        endDate: '2019-04-12',
        configured: false
      },
      {
        ...getSundayClosedSmtPcStandardHour(),
        startDate: '2019-04-08',
        endDate: '2019-04-12',
        configured: false
      },
      {
        ...getMondayClosedFusoTruckVanStandardHour(),
        startDate: '2019-04-08',
        endDate: '2019-04-12',
        configured: false
      },
      {
        ...getMondayClosedMbVanStandardHour(),
        startDate: '2019-05-10',
        endDate: '2019-05-12',
        configured: false
      },
      {
        ...getSundayClosedSmtPcStandardHour(),
        startDate: '2019-05-10',
        endDate: '2019-05-12',
        configured: false
      },
      {
        ...getMondayClosedFusoTruckVanStandardHour(),
        startDate: '2019-05-10',
        endDate: '2019-05-12',
        configured: false
      },
      {
        ...getMondayClosedMbVanStandardHour(),
        startDate: '2019-06-11',
        endDate: '2019-06-11',
        configured: false
      },
      {
        ...getSundayClosedSmtPcStandardHour(),
        startDate: '2019-06-11',
        endDate: '2019-06-11',
        configured: false
      },
      {
        ...getMondayClosedFusoTruckVanStandardHour(),
        startDate: '2019-06-11',
        endDate: '2019-06-11',
        configured: false
      }
    ]
  };
}

export function getSingleDayMbPcTruck_MbVan_SmtPCHours(): Hours {
  return {
    standardOpeningHours: [
      getMondayClosedMbPcTruckStandardHour(),
      getMondayClosedMbVanStandardHour(),
      getSundayClosedSmtPcStandardHour()
    ],
    specialOpeningHours: [
      {
        ...getMondayClosedMbPcTruckStandardHour(),
        startDate: '2019-09-12',
        endDate: '2019-09-18',
        configured: true
      },
      {
        ...getMondayClosedMbVanStandardHour(),
        startDate: '2019-09-12',
        endDate: '2019-09-18',
        configured: true
      },
      {
        ...getSundayClosedSmtPcStandardHour(),
        startDate: '2019-09-12',
        endDate: '2019-09-18',
        configured: true
      },
      {
        ...getMondayClosedMbPcTruckStandardHour(),
        startDate: '2020-02-02',
        endDate: '2020-02-08',
        configured: true
      },
      {
        ...getSundayClosedSmtPcStandardHour(),
        startDate: '2020-02-02',
        endDate: '2020-02-08',
        configured: true
      },
      {
        ...getMondayClosedMbVanStandardHour(),
        startDate: '2020-02-02',
        endDate: '2020-02-08',
        configured: true
      }
    ]
  };
}

export function getSingleDayClosedMbVan_SmtPc_FusoBus_FusoTruckVan_FusoUnimogHours(): Hours {
  return {
    standardOpeningHours: [
      getMondayClosedMbVanStandardHour(),
      getSundayClosedSmtPcStandardHour(),
      getMondayClosedFusoBusStandardHour(),
      getMondayClosedFusoTruckVanStandardHour(),
      getMondayClosedFusoUnimogStandardHour()
    ],
    specialOpeningHours: [
      {
        ...getMondayClosedMbVanStandardHour(),
        startDate: '2019-05-10',
        endDate: '2019-05-10',
        configured: true
      },
      {
        ...getSundayClosedSmtPcStandardHour(),
        startDate: '2019-05-10',
        endDate: '2019-05-10',
        configured: true
      },
      {
        ...getMondayClosedMbVanStandardHour(),
        startDate: '2019-06-11',
        endDate: '2019-06-25',
        configured: false
      },
      {
        ...getSundayClosedSmtPcStandardHour(),
        startDate: '2019-06-11',
        endDate: '2019-06-25',
        configured: false
      },
      {
        ...getMondayClosedFusoBusStandardHour(),
        startDate: '2019-06-11',
        endDate: '2019-06-25',
        configured: true
      },
      {
        ...getMondayClosedFusoTruckVanStandardHour(),
        startDate: '2019-06-11',
        endDate: '2019-06-25',
        configured: true
      },
      {
        ...getMondayClosedFusoUnimogStandardHour(),
        startDate: '2019-06-11',
        endDate: '2019-06-25',
        configured: true
      }
    ]
  };
}

export function getSingleDayClosedMbVan_FusoBusHours(): Hours {
  return {
    standardOpeningHours: [
      getMondayClosedMbVanStandardHour(),
      getMondayClosedFusoBusStandardHour()
    ],
    specialOpeningHours: [
      {
        ...getMondayClosedMbVanStandardHour(),
        startDate: '2019-09-10',
        endDate: '2019-10-10',
        configured: true
      },
      {
        ...getMondayClosedFusoBusStandardHour(),
        startDate: '2019-09-10',
        endDate: '2019-10-10',
        configured: true
      },
      {
        ...getMondayClosedMbVanStandardHour(),
        startDate: '2019-01-10',
        endDate: '2019-01-16',
        configured: true
      },
      {
        ...getMondayClosedFusoBusStandardHour(),
        startDate: '2019-01-10',
        endDate: '2019-01-16',
        configured: true
      },
      {
        ...getMondayClosedMbVanStandardHour(),
        startDate: '2019-11-05',
        endDate: '2019-11-10',
        configured: true
      },
      {
        ...getMondayClosedFusoBusStandardHour(),
        startDate: '2019-11-05',
        endDate: '2019-11-10',
        configured: true
      }
    ]
  };
}

export function getSingleDayClosed_OneSpecial_MbVan_FusoBusHours(): Hours {
  return {
    standardOpeningHours: [
      getMondayClosedMbVanStandardHour(),
      getMondayClosedFusoBusStandardHour()
    ],
    specialOpeningHours: [
      {
        ...getMondayClosedMbVanStandardHour(),
        startDate: '2019-09-10',
        endDate: '2019-10-10',
        configured: true
      },
      {
        ...getMondayClosedFusoBusStandardHour(),
        startDate: '2019-09-10',
        endDate: '2019-10-10',
        configured: true
      }
    ]
  };
}

export function getSpecialOpeningHours_MB_2017_01_26(): SpecialOpeningHour {
  return {
    brandId: 'MB',
    productGroupIds: ['PC', 'VAN', 'BUS', 'TRUCK'],
    startDate: '2017-01-26',
    endDate: '2017-01-29',
    configured: false,
    openingHours: [
      {
        weekDay: WeekDay.Wednesday,
        closed: false,
        times: [
          { begin: '05:00', end: '11:00' },
          { begin: '13:30', end: '19:00' }
        ]
      }
    ]
  };
}

export function getSpecialOpeningHours_MB_2019_11_28(): SpecialOpeningHour {
  return {
    brandId: 'MB',
    productGroupIds: ['PC', 'VAN', 'BUS', 'TRUCK'],
    startDate: '2019-11-28',
    endDate: '2019-11-30',
    configured: false,
    openingHours: [
      {
        weekDay: WeekDay.Monday,
        closed: false,
        transient: true,
        times: [
          { begin: '05:00', end: '11:00' },
          { begin: '13:30', end: '19:00' }
        ]
      },
      {
        weekDay: WeekDay.Wednesday,
        closed: false,
        transient: true,
        times: [
          { begin: '05:00', end: '11:00' },
          { begin: '13:30', end: '19:00' }
        ]
      },
      {
        weekDay: WeekDay.Thursday,
        closed: false,
        times: [
          { begin: '05:00', end: '11:00' },
          { begin: '13:30', end: '19:00' }
        ]
      },
      {
        weekDay: WeekDay.Friday,
        closed: false,
        times: [
          { begin: '05:00', end: '11:00' },
          { begin: '13:30', end: '19:00' }
        ]
      }
    ]
  };
}

export function getSpecialOpeningHours_MB_Without_PC_2017_01_26(): SpecialOpeningHour {
  return {
    brandId: 'MB',
    productGroupIds: ['VAN', 'BUS', 'TRUCK'],
    startDate: '2017-01-26',
    endDate: '2017-01-29',
    configured: false,
    openingHours: [
      {
        weekDay: WeekDay.Wednesday,
        closed: false,
        times: [
          { begin: '05:00', end: '11:00' },
          { begin: '13:30', end: '19:00' }
        ]
      }
    ]
  };
}

export function getSpecialOpeningHours_MB_PC_2017_01_26(): SpecialOpeningHour {
  return {
    brandId: 'MB',
    productGroupIds: ['PC'],
    startDate: '2017-01-26',
    endDate: '2017-01-29',
    configured: false,
    openingHours: [
      {
        weekDay: WeekDay.Wednesday,
        closed: false,
        times: [
          { begin: '05:00', end: '11:00' },
          { begin: '13:30', end: '19:00' }
        ]
      }
    ]
  };
}

export function getSpecialOpeningHours_MB_2016_01_26(): SpecialOpeningHour {
  return {
    brandId: 'MB',
    productGroupIds: ['PC', 'VAN', 'BUS', 'TRUCK'],
    startDate: '2016-01-26',
    endDate: '2016-01-29',
    configured: false,
    openingHours: [
      {
        weekDay: WeekDay.Wednesday,
        closed: false,
        times: [
          { begin: '05:00', end: '11:00' },
          { begin: '13:30', end: '19:00' }
        ]
      }
    ]
  };
}

export function getSpecialOpeningHours_SMT_2017_01_26(): SpecialOpeningHour {
  return {
    brandId: 'SMT',
    productGroupIds: ['PC'],
    startDate: '2017-01-26',
    endDate: '2017-01-29',
    configured: false,
    openingHours: [
      {
        weekDay: WeekDay.Thursday,
        closed: false,
        times: [
          { begin: '09:00', end: '11:00' },
          { begin: '13:00', end: '20:00' }
        ]
      }
    ]
  };
}

export function getSpecialOpeningHours_MB_SMT_2017_01_26(): SpecialOpeningHour[] {
  return [
    {
      brandId: 'MB',
      productGroupIds: ['PC'],
      startDate: '2017-01-26',
      endDate: '2017-01-29',
      configured: false,
      openingHours: [
        {
          weekDay: WeekDay.Friday,
          closed: false,
          times: [
            { begin: '09:00', end: '11:00' },
            { begin: '13:00', end: '20:00' }
          ]
        }
      ]
    },
    {
      brandId: 'SMT',
      productGroupIds: ['PC'],
      startDate: '2017-01-26',
      endDate: '2017-01-29',
      configured: false,
      openingHours: [
        {
          weekDay: WeekDay.Thursday,
          closed: false,
          times: [
            { begin: '09:00', end: '11:00' },
            { begin: '13:00', end: '20:00' }
          ]
        },
        {
          weekDay: WeekDay.Friday,
          closed: true,
          times: []
        }
      ]
    },
    {
      brandId: 'MYB',
      productGroupIds: ['PC'],
      startDate: '2017-01-26',
      endDate: '2017-01-29',
      configured: false,
      openingHours: []
    }
  ];
}

export function getSpecialOpeningHours_with_merged_standardOh_SMT_2017_01_26(): SpecialOpeningHour[] {
  return [
    {
      brandId: 'MB',
      productGroupIds: ['PC'],
      startDate: '2017-01-26',
      endDate: '2017-01-29',
      configured: false,
      openingHours: [
        getOpen(WeekDay.Monday),
        getOpen(WeekDay.Tuesday),
        getOpen(WeekDay.Wednesday),
        getOpen(WeekDay.Thursday),
        {
          weekDay: WeekDay.Friday,
          closed: false,
          special: true,
          times: [
            { begin: '09:00', end: '11:00' },
            { begin: '13:00', end: '20:00' }
          ]
        },
        getOpen(WeekDay.Saturday),
        getOpen(WeekDay.Sunday)
      ]
    },
    {
      brandId: 'SMT',
      productGroupIds: ['PC'],
      startDate: '2017-01-26',
      endDate: '2017-01-29',
      configured: false,
      openingHours: [
        getOpen(WeekDay.Monday),
        getOpen(WeekDay.Tuesday),
        getOpen(WeekDay.Wednesday),
        {
          weekDay: WeekDay.Thursday,
          closed: false,
          special: true,
          times: [
            { begin: '09:00', end: '11:00' },
            { begin: '13:00', end: '20:00' }
          ]
        },
        { ...getClosed(WeekDay.Friday), special: true },
        getOpen(WeekDay.Saturday),
        getOpen(WeekDay.Sunday)
      ]
    },
    {
      brandId: 'MYB',
      productGroupIds: ['PC'],
      startDate: '2017-01-26',
      endDate: '2017-01-29',
      configured: false,
      openingHours: [
        getOpen(WeekDay.Monday),
        getOpen(WeekDay.Tuesday),
        getOpen(WeekDay.Wednesday),
        getOpen(WeekDay.Thursday),
        getOpen(WeekDay.Friday),
        getOpen(WeekDay.Saturday),
        getOpen(WeekDay.Sunday)
      ]
    }
  ];
}

export function getSpecialOpeningHours_SMT_2016_01_26(): SpecialOpeningHour {
  return {
    brandId: 'SMT',
    productGroupIds: ['PC'],
    startDate: '2016-01-26',
    endDate: '2016-01-29',
    configured: false,
    openingHours: [
      {
        weekDay: WeekDay.Thursday,
        closed: false,
        times: [
          { begin: '09:00', end: '11:00' },
          { begin: '13:00', end: '20:00' }
        ]
      }
    ]
  };
}

export function getSpecialOpeningHours(): SpecialOpeningHour[] {
  return [
    getSpecialOpeningHours_MB_2017_01_26(),
    getSpecialOpeningHours_MB_2016_01_26(),
    getSpecialOpeningHours_SMT_2017_01_26(),
    getSpecialOpeningHours_SMT_2016_01_26()
  ];
}

export function getSpecialOpeningHoursMock(): Hours {
  return {
    standardOpeningHours: [],
    specialOpeningHours: [
      {
        brandId: 'MB',
        productGroupIds: ['PC', 'VAN', 'BUS', 'TRUCK'],
        startDate: '2017-01-26',
        endDate: '2017-01-29',
        configured: false,
        openingHours: [
          {
            weekDay: WeekDay.Wednesday,
            closed: false,
            times: [
              { begin: '05:00', end: '11:00' },
              { begin: '13:30', end: '19:00' }
            ]
          }
        ]
      },
      {
        brandId: 'SMT',
        productGroupIds: ['PC'],
        startDate: '2017-01-26',
        endDate: '2017-01-29',
        configured: false,
        openingHours: [
          {
            weekDay: WeekDay.Thursday,
            closed: false,
            times: [
              { begin: '09:00', end: '11:00' },
              { begin: '13:00', end: '20:00' }
            ]
          }
        ]
      }
    ]
  };
}

export function getMBSpecialOpeningHoursMock(): Hours {
  return {
    standardOpeningHours: [],
    specialOpeningHours: [
      {
        brandId: 'MB',
        productGroupIds: ['VAN', 'BUS'],
        startDate: '2017-01-26',
        endDate: '2017-01-29',
        configured: false,
        openingHours: [
          {
            weekDay: WeekDay.Wednesday,
            closed: false,
            times: [
              { begin: '05:00', end: '11:00' },
              { begin: '13:30', end: '19:00' }
            ]
          }
        ]
      },
      {
        brandId: 'MB',
        productGroupIds: ['PC'],
        startDate: '2017-01-26',
        endDate: '2017-01-29',
        configured: false,
        openingHours: [
          {
            weekDay: WeekDay.Thursday,
            closed: false,
            times: [
              { begin: '09:00', end: '11:00' },
              { begin: '13:00', end: '20:00' }
            ]
          }
        ]
      },
      {
        brandId: 'MB',
        productGroupIds: ['TRUCK', 'UNIMOG'],
        startDate: '2017-01-26',
        endDate: '2017-01-29',
        configured: false,
        openingHours: [
          {
            weekDay: WeekDay.Thursday,
            closed: false,
            times: [
              { begin: '09:01', end: '11:01' },
              { begin: '13:01', end: '20:01' }
            ]
          }
        ]
      }
    ]
  };
}

export function getDifferentSpecialOpeningHoursMock(): Hours {
  return {
    standardOpeningHours: [],
    specialOpeningHours: [
      {
        brandId: 'MB',
        productGroupIds: ['PC', 'VAN', 'BUS', 'TRUCK'],
        startDate: '2017-01-26',
        endDate: '2017-01-29',
        configured: false,
        openingHours: [
          {
            weekDay: WeekDay.Wednesday,
            closed: false,
            times: [
              { begin: '05:00', end: '11:00' },
              { begin: '13:30', end: '19:00' }
            ]
          }
        ]
      },
      {
        brandId: 'MB',
        productGroupIds: ['PC', 'VAN'],
        startDate: '2019-01-26',
        endDate: '2019-01-29',
        configured: false,
        openingHours: [
          {
            weekDay: WeekDay.Wednesday,
            closed: false,
            times: [
              { begin: '05:00', end: '11:00' },
              { begin: '13:30', end: '19:00' }
            ]
          }
        ]
      },
      {
        brandId: 'SMT',
        productGroupIds: ['PC'],
        startDate: '2018-01-26',
        endDate: '2018-01-29',
        configured: false,
        openingHours: [
          {
            weekDay: WeekDay.Thursday,
            closed: false,
            times: [
              { begin: '09:00', end: '11:00' },
              { begin: '13:00', end: '20:00' }
            ]
          }
        ]
      }
    ]
  };
}

export function getSingleOpeningHourMock(): Response {
  return {
    businessSiteId: '',
    countryId: 'DE',
    productCategoryId: '1',
    serviceCharacteristicId: '',
    serviceId: 7,
    serviceName: 'New Vehicle Sales',
    serviceCharacteristicName: 'Mercedes ServiceCard',
    standardOpeningHours: [],
    specialOpeningHours: [],
    translations: []
  };
}

export function getEmptyHours(): Hours {
  return {
    standardOpeningHours: [],
    specialOpeningHours: []
  };
}

export function getSimpleHours(timeFormat12Hours: boolean): Hours {
  return {
    standardOpeningHours: [
      {
        brandId: 'MB',
        productGroupIds: ['PC', 'VAN', 'BUS', 'TRUCK'],
        openingHours: [
          {
            weekDay: WeekDay.Wednesday,
            closed: false,
            times: [
              {
                begin: timeFormat12Hours ? '8:00 AM' : '08:00',
                end: timeFormat12Hours ? '12:00 PM' : '12:00'
              },
              {
                begin: timeFormat12Hours ? '1:30 PM' : '13:30',
                end: timeFormat12Hours ? '10:00 PM' : '22:00'
              }
            ]
          }
        ]
      }
    ],
    specialOpeningHours: [
      {
        brandId: 'MB',
        productGroupIds: ['PC', 'VAN', 'BUS', 'TRUCK'],
        startDate: '2017-01-26',
        endDate: '2017-01-29',
        configured: true,
        openingHours: [
          {
            weekDay: WeekDay.Wednesday,
            closed: false,
            times: [
              {
                begin: timeFormat12Hours ? '5:00 AM' : '05:00',
                end: timeFormat12Hours ? '11:00 AM' : '11:00'
              },
              {
                begin: timeFormat12Hours ? '1:30 PM' : '13:30',
                end: timeFormat12Hours ? '7:00 PM' : '19:00'
              }
            ]
          }
        ]
      }
    ]
  };
}

export function getMultiEditHourData(): Hours {
  return {
    standardOpeningHours: [
      {
        brandId: 'MB',
        productGroupIds: ['PC', 'VAN', 'BUS', 'TRUCK'],
        openingHours: [
          {
            weekDay: WeekDay.Tuesday,
            closed: false,
            times: [
              { begin: '05:00', end: '11:00' },
              { begin: '13:30', end: '19:00' }
            ]
          }
        ]
      }
    ],
    specialOpeningHours: [
      {
        brandId: 'MB',
        productGroupIds: ['PC', 'VAN', 'BUS', 'TRUCK'],
        startDate: '2017-01-26',
        endDate: '2017-01-29',
        configured: true,
        openingHours: [
          {
            weekDay: WeekDay.Wednesday,
            closed: false,
            times: [
              { begin: '05:00', end: '11:00' },
              { begin: '13:30', end: '19:00' }
            ]
          }
        ]
      }
    ]
  };
}

export function getMultiEditHoursData(): Hours {
  return {
    standardOpeningHours: [
      {
        brandId: 'MB',
        productGroupIds: ['PC'],
        openingHours: [
          {
            weekDay: WeekDay.Monday,
            closed: false,
            times: [
              { begin: '05:00', end: '11:00' },
              { begin: '13:30', end: '19:00' }
            ]
          },
          {
            weekDay: WeekDay.Tuesday,
            closed: false,
            times: [
              { begin: '05:00', end: '11:00' },
              { begin: '13:30', end: '19:00' }
            ]
          }
        ]
      },
      {
        brandId: 'MB',
        productGroupIds: ['VAN'],
        openingHours: [
          {
            weekDay: WeekDay.Wednesday,
            closed: false,
            times: [
              { begin: '08:00', end: '12:00' },
              { begin: '14:00', end: '20:00' }
            ]
          }
        ]
      },
      {
        brandId: 'SMT',
        productGroupIds: ['VAN'],
        openingHours: [
          {
            weekDay: WeekDay.Wednesday,
            closed: false,
            times: [
              { begin: '05:00', end: '11:00' },
              { begin: '13:30', end: '19:00' }
            ]
          }
        ]
      }
    ],
    specialOpeningHours: [
      {
        brandId: 'MB',
        productGroupIds: ['VAN'],
        startDate: '2017-01-26',
        endDate: '2017-01-29',
        configured: true,
        openingHours: [
          {
            weekDay: WeekDay.Tuesday,
            closed: false,
            times: [
              { begin: '05:00', end: '11:00' },
              { begin: '13:30', end: '19:00' }
            ]
          }
        ]
      },
      {
        brandId: 'MB',
        productGroupIds: ['PC'],
        startDate: '2017-01-26',
        endDate: '2017-01-29',
        configured: true,
        openingHours: [
          {
            weekDay: WeekDay.Wednesday,
            closed: false,
            times: [
              { begin: '08:00', end: '12:00' },
              { begin: '14:00', end: '20:00' }
            ]
          }
        ]
      },
      {
        brandId: 'SMT',
        productGroupIds: ['PC'],
        startDate: '2017-01-26',
        endDate: '2017-01-29',
        configured: true,
        openingHours: [
          {
            weekDay: WeekDay.Thursday,
            closed: true,
            times: []
          }
        ]
      }
    ]
  };
}

export function getTaskData(): TaskData {
  return {
    dueDate: '2022-12-03',
    comment: 'test multiEditData'
  };
}

export function getMultiSelectOfferedServiceIds(): MultiSelectOfferedServiceIds[] {
  return [
    {
      id: 'GS00000001-1',
      serviceId: 2,
      brandId: 'MB',
      productGroupId: 'PC',
      productCategoryId: 1,
      outletId: "GS00000001"
    },
    {
      id: 'GS00000001-2',
      serviceId: 2,
      brandId: 'SMT',
      productGroupId: 'VAN',
      productCategoryId: 1,
      outletId: "GS00000001"
    },
    {
      id: 'GS00000001-3',
      serviceId: 2,
      brandId: 'MB',
      productGroupId: 'PC',
      productCategoryId: 1,
      outletId: "GS00000001"
    },
    {
      id: 'GS00000001-4',
      serviceId: 3,
      brandId: 'SMT',
      productGroupId: 'PC',
      productCategoryId: 1,
      outletId: "GS00000001"
    },
    {
      id: 'GS00000001-5',
      serviceId: 2,
      brandId: 'MB',
      productGroupId: 'VAN',
      productCategoryId: 1,
      outletId: "GS00000001"
    }
  ];
}
