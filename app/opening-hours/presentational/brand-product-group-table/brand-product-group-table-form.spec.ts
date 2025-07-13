import { WeekDay } from '@angular/common';
import { Component, EventEmitter, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';

import { TestingModule } from '../../../testing/testing.module';
import { OpeningHourConvertion } from '../../brand-product-group/brand-product-group-opening-hours';
import { WeekDayOpeningHours } from '../../models/opening-hour.model';
import { Hours } from '../../store/reducers';

import { BrandProductGroupTableComponent } from './brand-product-group-table.component';
import { GroupedOpeningHourColumn } from './grouped-opening-hour-column.model';

const columnsMock: GroupedOpeningHourColumn[] = [
  {
    columnDef: 'MBPC,VAN',
    brandId: 'MB',
    productGroups: [
      {
        id: 'PC',
        hasMoveLeftAction: false,
        hasMoveRightAction: false
      },
      {
        id: 'VAN',
        hasMoveLeftAction: false,
        hasMoveRightAction: false
      }
    ],
    cell: (weekDay: FormControl) => {
      const weekDayOpeningHour = weekDay.value.openingHours['MBPC,VAN'];
      return {
        times: weekDayOpeningHour.times,
        closed: weekDayOpeningHour.closed
      };
    }
  },
  {
    columnDef: 'SMTPC',
    brandId: 'SMT',
    productGroups: [
      {
        id: 'PC',
        hasMoveLeftAction: false,
        hasMoveRightAction: false
      }
    ],
    cell: (weekDay: FormControl) => {
      const weekDayOpeningHour = weekDay.value.openingHours['SMTPC'];
      return {
        times: weekDayOpeningHour.times,
        closed: weekDayOpeningHour.closed
      };
    }
  }
];

const weekDayValues: Hours = {
  standardOpeningHours: [
    {
      brandId: 'MB',
      productGroupIds: ['PC', 'VAN'],
      openingHours: [
        {
          weekDay: WeekDay.Monday,
          times: [
            {
              begin: '08:00',
              end: '18:00'
            }
          ],
          closed: false,
          special: false,
          index: 110
        },
        {
          weekDay: WeekDay.Tuesday,
          times: [],
          closed: true,
          special: false,
          index: 120
        }
      ]
    },
    {
      brandId: 'SMT',
      productGroupIds: ['PC'],
      openingHours: [
        {
          weekDay: WeekDay.Wednesday,
          times: [
            {
              begin: '09:00',
              end: '19:00'
            },
            {
              begin: '20:00',
              end: '23:00'
            }
          ],
          closed: false,
          special: false,
          index: 210
        }
      ]
    }
  ],
  specialOpeningHours: []
};

const expectedValues = {
  Monday: [
    {
      groupId: 'MBPC,VAN',
      closed: false,
      changed: false,
      special: false,
      index: 110,
      times: [
        {
          begin: '08:00',
          end: '18:00'
        }
      ]
    },
    {
      groupId: 'SMTPC',
      closed: false,
      changed: false,
      special: false,
      index: 210,
      times: []
    }
  ],
  Tuesday: [
    {
      groupId: 'MBPC,VAN',
      closed: true,
      changed: false,
      special: false,
      index: 120,
      times: []
    },
    {
      groupId: 'SMTPC',
      closed: false,
      changed: false,
      special: false,
      index: 220,
      times: []
    }
  ],
  Wednesday: [
    {
      groupId: 'MBPC,VAN',
      closed: false,
      changed: false,
      special: false,
      index: 130,
      times: []
    },
    {
      groupId: 'SMTPC',
      closed: false,
      changed: false,
      special: false,
      index: 230,
      times: [
        {
          begin: '09:00',
          end: '19:00'
        },
        {
          begin: '20:00',
          end: '23:00'
        }
      ]
    }
  ]
};

@Component({
  template:
    '<gp-brand-product-group-table [groupedOpeningHourColumns]="groupedOpeningHourColumns" ' +
    '[weekdaysOpeningHours]="weekdaysOpeningHours"></gp-brand-product-group-table>'
})
class TestBrandProductGroupTableComponent {
  @ViewChild(BrandProductGroupTableComponent)
  public brandProductGroupTable: BrandProductGroupTableComponent;
  groupedOpeningHourColumns: GroupedOpeningHourColumn[] = columnsMock;
  weekdaysOpeningHours: WeekDayOpeningHours[] = OpeningHourConvertion.convertToWeekDaysOpeningHours(
    weekDayValues,
    false,
    ['MB', 'SMT', 'STR', 'FUSO', 'THB', 'BAB', 'FTL', 'WST', 'STG', 'THB', 'MYB']
  );
  weekdaysOpeningHoursChange = new EventEmitter<WeekDayOpeningHours[]>();
}

describe('BrandProductGroupTableForm', () => {
  let component: TestBrandProductGroupTableComponent;
  let fixture: ComponentFixture<TestBrandProductGroupTableComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [BrandProductGroupTableComponent, TestBrandProductGroupTableComponent],
        imports: [
          MatTableModule,
          ReactiveFormsModule,
          FormsModule,
          TestingModule,
          MatFormFieldModule
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TestBrandProductGroupTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should enable the first opening hour on Wednesday for MBPC,VAN.', done => {
    component.brandProductGroupTable.weekdaysOpeningHoursChange.subscribe(
      (weekDayHours: WeekDayOpeningHours[]) => {
        weekDayHours.forEach((hours: WeekDayOpeningHours) => {
          switch (hours.weekDay) {
            case WeekDay.Monday:
              expect(hours.openingHours).toStrictEqual(expectedValues.Monday);
              break;
            case WeekDay.Tuesday:
              expect(hours.openingHours).toStrictEqual(expectedValues.Tuesday);
              break;
            case WeekDay.Wednesday:
              expect(hours.openingHours).toStrictEqual([
                {
                  groupId: 'MBPC,VAN',
                  closed: false,
                  changed: true,
                  special: false,
                  index: 130,
                  times: [
                    {
                      begin: '11:11',
                      end: '22:22'
                    }
                  ]
                },
                {
                  groupId: 'SMTPC',
                  closed: false,
                  changed: false,
                  special: false,
                  index: 230,
                  times: [
                    {
                      begin: '09:00',
                      end: '19:00'
                    },
                    {
                      begin: '20:00',
                      end: '23:00'
                    }
                  ]
                }
              ]);
              break;
          }
        });
        done();
      }
    );

    component.brandProductGroupTable.onFirstOpeningHourEnabled({
      groupedOpeningHour: {
        changed: true,
        closed: false,
        special: false,
        index: 130,
        groupId: 'MBPC,VAN',
        times: [
          {
            begin: '11:11',
            end: '22:22',
            enabled: false
          },
          {
            begin: '',
            end: '',
            enabled: false
          },
          {
            begin: '',
            end: '',
            enabled: false
          }
        ]
      },
      weekDay: WeekDay.Wednesday
    });

    // force emitting for testing purposes
    component.brandProductGroupTable.emitState();
  });

  test('should enable the second opening hour on Monday for MBPC,VAN.', done => {
    component.brandProductGroupTable.weekdaysOpeningHoursChange.subscribe(
      (weekDayHours: WeekDayOpeningHours[]) => {
        weekDayHours.forEach((hours: WeekDayOpeningHours) => {
          switch (hours.weekDay) {
            case WeekDay.Monday:
              expect(hours.openingHours).toStrictEqual([
                {
                  groupId: 'MBPC,VAN',
                  closed: false,
                  changed: true,
                  special: false,
                  index: 110,
                  times: [
                    {
                      begin: '08:00',
                      end: '18:00'
                    },
                    {
                      begin: '00:00',
                      end: '00:00'
                    }
                  ]
                },
                {
                  groupId: 'SMTPC',
                  closed: false,
                  changed: false,
                  special: false,
                  index: 210,
                  times: []
                }
              ]);
              break;
            case WeekDay.Tuesday:
              expect(hours.openingHours).toStrictEqual(expectedValues.Tuesday);
              break;
            case WeekDay.Wednesday:
              expect(hours.openingHours).toStrictEqual(expectedValues.Wednesday);
              break;
          }
        });
        done();
      }
    );

    component.brandProductGroupTable.onSecondOpeningHourEnabled({
      groupedOpeningHour: {
        changed: true,
        closed: false,
        special: false,
        index: 110,
        groupId: 'MBPC,VAN',
        times: [
          {
            begin: '08:00',
            end: '18:00'
          },
          {
            begin: '00:00',
            end: '00:00'
          }
        ]
      },
      weekDay: WeekDay.Monday
    });

    // force emitting for testing purposes
    component.brandProductGroupTable.emitState();
  });

  test('should disable the second opening hour on Wednesday for SMTPC.', done => {
    component.brandProductGroupTable.weekdaysOpeningHoursChange.subscribe(
      (weekDayHours: WeekDayOpeningHours[]) => {
        weekDayHours.forEach((hours: WeekDayOpeningHours) => {
          switch (hours.weekDay) {
            case WeekDay.Monday:
              expect(hours.openingHours).toStrictEqual(expectedValues.Monday);
              break;
            case WeekDay.Tuesday:
              expect(hours.openingHours).toStrictEqual(expectedValues.Tuesday);
              break;
            case WeekDay.Wednesday:
              expect(hours.openingHours).toStrictEqual([
                {
                  groupId: 'MBPC,VAN',
                  closed: false,
                  changed: false,
                  special: false,
                  index: 130,
                  times: []
                },
                {
                  groupId: 'SMTPC',
                  closed: false,
                  changed: true,
                  special: false,
                  index: 230,
                  times: [
                    {
                      begin: '09:00',
                      end: '19:00'
                    }
                  ]
                }
              ]);
          }
        });
        done();
      }
    );

    component.brandProductGroupTable.onSecondOpeningHourDisabled({
      groupedOpeningHour: {
        changed: true,
        closed: false,
        special: false,
        index: 230,
        groupId: 'SMTPC',
        times: [
          {
            begin: '09:00',
            end: '19:00',
            enabled: true
          },
          {
            begin: '20:00',
            end: '23:00',
            enabled: true
          },
          {
            begin: '',
            end: '',
            enabled: false
          }
        ]
      },
      weekDay: WeekDay.Wednesday
    });

    component.brandProductGroupTable.emitState();
  });

  test('should close the Monday of MBPC,VAN.', done => {
    component.brandProductGroupTable.weekdaysOpeningHoursChange.subscribe(
      (weekDayHours: WeekDayOpeningHours[]) => {
        weekDayHours.forEach((hours: WeekDayOpeningHours) => {
          switch (hours.weekDay) {
            case WeekDay.Monday:
              expect(hours.openingHours).toStrictEqual([
                {
                  groupId: 'MBPC,VAN',
                  closed: true,
                  changed: true,
                  special: false,
                  index: 110,
                  times: []
                },
                {
                  groupId: 'SMTPC',
                  closed: false,
                  changed: false,
                  special: false,
                  index: 210,
                  times: []
                }
              ]);
              break;
            case WeekDay.Tuesday:
              expect(hours.openingHours).toStrictEqual(expectedValues.Tuesday);
              break;
            case WeekDay.Wednesday:
              expect(hours.openingHours).toStrictEqual(expectedValues.Wednesday);
          }
        });
        done();
      }
    );

    component.brandProductGroupTable.onOpeningHourClosed({
      groupedOpeningHour: {
        changed: true,
        closed: false,
        special: false,
        index: 110,
        groupId: 'MBPC,VAN',
        times: [
          {
            begin: '08:00',
            end: '18:00',
            enabled: true
          },
          {
            begin: '',
            end: '',
            enabled: false
          }
        ]
      },
      weekDay: WeekDay.Monday
    });

    component.brandProductGroupTable.emitState();
  });

  test('should open Tuesday of MBPC,VAN.', done => {
    component.brandProductGroupTable.weekdaysOpeningHoursChange.subscribe(
      (weekDayHours: WeekDayOpeningHours[]) => {
        weekDayHours.forEach((hours: WeekDayOpeningHours) => {
          switch (hours.weekDay) {
            case WeekDay.Monday:
              expect(hours.openingHours).toStrictEqual(expectedValues.Monday);
              break;
            case WeekDay.Tuesday:
              expect(hours.openingHours).toStrictEqual([
                {
                  groupId: 'MBPC,VAN',
                  closed: false,
                  changed: true,
                  special: false,
                  index: 120,
                  times: []
                },
                {
                  groupId: 'SMTPC',
                  closed: false,
                  changed: false,
                  special: false,
                  index: 220,
                  times: []
                }
              ]);
              break;
            case WeekDay.Wednesday:
              expect(hours.openingHours).toStrictEqual(expectedValues.Wednesday);
          }
        });
        done();
      }
    );

    component.brandProductGroupTable.onOpeningHourOpened({
      groupedOpeningHour: {
        changed: true,
        closed: true,
        special: false,
        index: 120,
        groupId: 'MBPC,VAN',
        times: [
          {
            begin: '',
            end: '',
            enabled: false
          },
          {
            begin: '',
            end: '',
            enabled: false
          }
        ]
      },
      weekDay: WeekDay.Tuesday
    });

    component.brandProductGroupTable.emitState();
  });
});
