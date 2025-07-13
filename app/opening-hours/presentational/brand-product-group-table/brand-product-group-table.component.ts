import { WeekDay } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChange,
  SimpleChanges
} from '@angular/core';
import {
  AbstractControl,
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup
} from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { equals, repeat } from 'ramda';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import {
  EMPTY_HOUR,
  GroupedOpeningHour,
  INITIAL_HOUR,
  Times,
  WeekDayOpeningHours
} from '../../models/opening-hour.model';
import { formatTimes } from '../../util/opening-hours-formatter';
import {
  validateBeginIsBeforeEnd,
  validateCrossingTimeRange,
  validateValueRange
} from '../opening-hour-input/opening-hour-input-validation';
import { OpeningHourWeekDayCellEvent } from '../opening-hour-input/opening-hour-input.component';

import { GroupedOpeningHourColumn } from './grouped-opening-hour-column.model';

@Component({
  selector: 'gp-brand-product-group-table',
  templateUrl: './brand-product-group-table.component.html',
  styleUrls: ['./brand-product-group-table.component.scss']
})
export class BrandProductGroupTableComponent implements OnInit, OnChanges, OnDestroy {
  @Input()
  groupedOpeningHourColumns: GroupedOpeningHourColumn[] = [];
  @Input()
  weekdaysOpeningHours: WeekDayOpeningHours[] = [];
  @Input()
  editableWeekDays: WeekDay[] = [];
  @Input()
  supportAutoComplete: boolean;
  @Input()
  selectedStartDate: number;
  @Input()
  selectedEndDate: number;
  @Input()
  weekDays: WeekDay[] = [];
  @Input()
  locale: string;
  @Input()
  isMTR: boolean;
  @Output()
  weekdaysOpeningHoursChange = new EventEmitter<WeekDayOpeningHours[]>();
  @Input()
  verification4RTaskExist: boolean = false;
  @Input()
  showDataChangeNotification: boolean = false;
  @Output()
  formValidityChanged = new EventEmitter<boolean>();

  columns: GroupedOpeningHourColumn[] = [];
  displayedColumns: string[];
  formGroup: UntypedFormGroup;
  rows: UntypedFormArray;
  dataSource: MatTableDataSource<AbstractControl>;
  unsubscribe: Subject<boolean> = new Subject<boolean>();

  constructor(private formBuilder: UntypedFormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    this.fillForm();
  }

  setNotificationBackground(
    openingHourData: any,
    groupId: string
  ): string | null {
    const group = openingHourData[groupId];

    if(this.verification4RTaskExist)
      return '#FFF3BB'

    return group ? this.getNotificationColour(group.notification) : null
  }

  getNotificationColour(
    notificationType: string
  ): string | null {
    switch (notificationType) {
      case 'DIRECT_CHANGE':
        return '#D5F0C0';
      case 'APPROVED':
        return '#D5F0C0';
      case 'DECLINED':
        return '#eab0b0';
      default:
        return null
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    let shouldInit = this.hasColumnsChanged(changes.groupedOpeningHourColumns);
    shouldInit = shouldInit ? true : this.hasChanged(changes.weekDays);
    shouldInit = shouldInit ? true : this.hasChanged(changes.selectedStartDate);
    shouldInit = shouldInit ? true : this.hasChanged(changes.selectedEndDate);
    const shouldFill = shouldInit ? true : this.hasValuesChanged(changes.weekdaysOpeningHours);

    this.supportAutoComplete = changes.supportAutoComplete
      ? changes.supportAutoComplete.currentValue
      : this.supportAutoComplete;

    if (shouldInit) {
      this.initForm();
    }
    if (shouldFill) {
      this.fillForm();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe.next(true);
    this.unsubscribe.unsubscribe();
  }

  isWeekDayEditable(day: WeekDay): boolean {
    return this.editableWeekDays.some(someDay => someDay === day);
  }

  isFromSpecialOpeningHour(row: UntypedFormGroup, column: GroupedOpeningHourColumn): boolean {
    const openingHour: GroupedOpeningHour = row.value.openingHours[column.columnDef];
    return openingHour && openingHour.special === true;
  }

  getIndex(row: UntypedFormGroup, column: GroupedOpeningHourColumn): number {
    const openingHour: GroupedOpeningHour = row.value.openingHours[column.columnDef];
    return openingHour && openingHour.index ? openingHour.index : -1;
  }

  onFirstOpeningHourEnabled(event: OpeningHourWeekDayCellEvent): GroupedOpeningHour {
    const times = event.groupedOpeningHour.times;
    const value: GroupedOpeningHour = {
      ...event.groupedOpeningHour,
      times: [
        {
          begin: times[0].begin,
          end: times[0].end,
          enabled: true
        },
        {
          begin: times[1].begin,
          end: times[1].end,
          enabled: times[1].enabled
        },
        {
          begin: times[2].begin,
          end: times[2].end,
          enabled: times[2].enabled
        }
      ]
    };

    const updated = this.triggerFormValidation(value, event.weekDay, false);
    return this.triggerAutoComplete(updated, event.weekDay);
  }

  onFirstOpeningHourDisabled(event: OpeningHourWeekDayCellEvent): GroupedOpeningHour {
    const hoursRemoved = event.groupedOpeningHour.times.every(
      time => time.begin === EMPTY_HOUR && time.end === EMPTY_HOUR
    );

    const value: GroupedOpeningHour = {
      ...event.groupedOpeningHour,
      changed: hoursRemoved,
      times: event.groupedOpeningHour.times.map(() => ({
        begin: EMPTY_HOUR,
        end: EMPTY_HOUR,
        enabled: false
      }))
    };

    // emit only if hour values were removed by user and then focus was removed from the cell.
    return this.triggerFormValidation(value, event.weekDay, hoursRemoved);
  }

  onSecondOpeningHourEnabled(event: OpeningHourWeekDayCellEvent): GroupedOpeningHour {
    const value: GroupedOpeningHour = {
      ...event.groupedOpeningHour,
      times: event.groupedOpeningHour.times.slice(0, 2).map(time => ({
        begin: time.begin,
        end: time.end,
        enabled: true
      }))
    };

    return this.triggerFormValidation(value, event.weekDay, false);
  }

  onSecondOpeningHourDisabled(event: OpeningHourWeekDayCellEvent): GroupedOpeningHour {
    const times = event.groupedOpeningHour.times;

    const firstBeginValue = times[0].begin;
    const firstEndValue = times[0].end;
    const isFirstEmpty = firstBeginValue === '' && firstEndValue === '';

    const thirdBeginValue = times[2].begin;
    const thirdEndValue = times[2].end;
    const isThirdEmpty = thirdBeginValue === '' && thirdEndValue === '';

    const value: GroupedOpeningHour = {
      ...event.groupedOpeningHour,
      times: [
        {
          begin: firstBeginValue,
          end: firstEndValue,
          enabled: !isFirstEmpty
        },
        {
          begin: thirdBeginValue,
          end: thirdEndValue,
          enabled: !isThirdEmpty
        },
        {
          begin: EMPTY_HOUR,
          end: EMPTY_HOUR,
          enabled: false
        }
      ]
    };

    return this.triggerFormValidation(value, event.weekDay);
  }

  onThirdOpeningHourEnabled(event: OpeningHourWeekDayCellEvent): GroupedOpeningHour {
    const value: GroupedOpeningHour = {
      ...event.groupedOpeningHour,
      times: event.groupedOpeningHour.times.map(time => ({
        begin: time.begin,
        end: time.end,
        enabled: true
      }))
    };

    return this.triggerFormValidation(value, event.weekDay, false);
  }

  onThirdOpeningHourDisabled(event: OpeningHourWeekDayCellEvent): GroupedOpeningHour {
    const times = event.groupedOpeningHour.times;

    const firstBeginValue = times[0].begin;
    const firstEndValue = times[0].end;
    const isFirstEmpty = firstBeginValue === '' && firstEndValue === '';

    const secondBeginValue = times[1].begin;
    const secondEndValue = times[1].end;
    const isSecondEmpty = secondBeginValue === '' && secondEndValue === '';

    const value: GroupedOpeningHour = {
      ...event.groupedOpeningHour,
      times: [
        {
          begin: firstBeginValue,
          end: firstEndValue,
          enabled: !isFirstEmpty
        },
        {
          begin: secondBeginValue,
          end: secondEndValue,
          enabled: !isSecondEmpty
        },
        {
          begin: EMPTY_HOUR,
          end: EMPTY_HOUR,
          enabled: false
        }
      ]
    };

    return this.triggerFormValidation(value, event.weekDay);
  }

  onOpeningHourClosed(event: OpeningHourWeekDayCellEvent): GroupedOpeningHour {
    const value: GroupedOpeningHour = {
      ...event.groupedOpeningHour,
      times: event.groupedOpeningHour.times.map(() => ({
        begin: EMPTY_HOUR,
        end: EMPTY_HOUR,
        enabled: false
      })),
      closed: true
    };

    return this.triggerFormValidation(value, event.weekDay);
  }

  onOpeningHourOpened(event: OpeningHourWeekDayCellEvent): GroupedOpeningHour {
    const value: GroupedOpeningHour = {
      ...event.groupedOpeningHour,
      times: event.groupedOpeningHour.times.map(() => ({
        begin: EMPTY_HOUR,
        end: EMPTY_HOUR,
        enabled: false
      })),
      closed: false
    };

    return this.triggerFormValidation(value, event.weekDay);
  }

  onOpeningHourChanged(event: OpeningHourWeekDayCellEvent): GroupedOpeningHour {
    const value: GroupedOpeningHour = { ...event.groupedOpeningHour };
    return this.triggerFormValidation(value, event.weekDay, true, true);
  }

  onFormatChange(): void {
    this.emitState();
  }

  emitState(): void {
    this.weekdaysOpeningHours = this.rows.controls
      .filter(() => this.rows.valid)
      .map((row: UntypedFormGroup) => ({
        weekDay: row.value.weekDay,
        openingHours: Object.keys(row.value.openingHours)
          .map(key => row.value.openingHours[key])
          .map(openingHours => ({
            groupId: openingHours.groupId,
            closed: openingHours.closed,
            changed: openingHours.changed,
            special: openingHours.special,
            index: openingHours.index,
            times: openingHours.times
              .filter((times: Times) => times.enabled === true)
              .map((times: Times) => ({ begin: times.begin, end: times.end })),
            notification: openingHours.notification,
            dataChangeTask: openingHours.dataChangeTask
          }))
      }));

    this.weekdaysOpeningHoursChange.emit(this.weekdaysOpeningHours);
    this.formValidityChanged.emit(this.formGroup.valid);
  }

  private triggerFormValidation(
    newValue: GroupedOpeningHour,
    weekDay: number,
    emitEvent: boolean = true,
    onlySelf: boolean = false
  ): GroupedOpeningHour {
    this.rows.controls
      .filter((weekDayGroup: UntypedFormGroup) => weekDayGroup.value.weekDay === weekDay)
      .map((weekDayGroup: UntypedFormGroup) => weekDayGroup.controls.openingHours)
      .map((openingHoursGroup: UntypedFormGroup) => openingHoursGroup.controls)
      .map((openingHoursGroupObj: any) => {
        Object.keys(openingHoursGroupObj)
          .filter(groupId => newValue && groupId === newValue.groupId)
          .forEach(key => {
            const curValue = openingHoursGroupObj[key].value;
            const curTimes = formatTimes(curValue.times);
            const newTimes = formatTimes(newValue.times);
            const timesChanged = !equals(curTimes, newTimes);
            const closedChanged = !equals(curValue.closed, newValue.closed);

            if (closedChanged || timesChanged) {
              openingHoursGroupObj[key].patchValue(newValue, { emitEvent, onlySelf });
            }
          });
      });

    return newValue;
  }

  private triggerAutoComplete(
    selected: GroupedOpeningHour,
    selectedWeekDay: number
  ): GroupedOpeningHour {
    const foundValues: GroupedOpeningHour[] = [];

    this.rows.controls
      .filter(() => this.supportAutoComplete)
      .filter((weekDayGroup: UntypedFormGroup) => weekDayGroup.value.weekDay !== selectedWeekDay)
      .map((weekDayGroup: UntypedFormGroup) => weekDayGroup.controls.openingHours)
      .map((openingHoursGroup: UntypedFormGroup) => openingHoursGroup.controls)
      .map((openingHoursGroupObj: any) => {
        Object.keys(openingHoursGroupObj)
          .filter(groupId => groupId === selected.groupId)
          .filter(groupId => openingHoursGroupObj[groupId].valid)
          .map(groupId => openingHoursGroupObj[groupId].value)
          .filter(groupFrom => groupFrom.closed !== true)
          .filter(groupFrom => groupFrom.times.some((time: Times) => time.enabled === true))
          .forEach((groupFrom: GroupedOpeningHour) => foundValues.push(groupFrom));
      });

    this.rows.controls
      .filter(() => foundValues.length === 1)
      .filter((weekDayGroup: UntypedFormGroup) => {
        const day = weekDayGroup.value.weekDay;
        const isDaySunday = day === 0;
        const isDaySameOrLater = isDaySunday || day >= selectedWeekDay;
        const isSundaySelected = selectedWeekDay === 0;
        return isSundaySelected ? isDaySunday : isDaySameOrLater;
      })
      .forEach((weekDayGroup: UntypedFormGroup) => {
        const openingHoursFormGroup = weekDayGroup.get('openingHours') as UntypedFormGroup;
        Object.keys(openingHoursFormGroup.controls)
          .map(groupId => (openingHoursFormGroup.get(groupId) as UntypedFormGroup).controls)
          .filter((toBeFilled: any) => toBeFilled.groupId.value === selected.groupId)
          .filter((toBeFilled: any) => toBeFilled.closed.value === false)
          .filter(
            (toBeFilled: any) =>
              toBeFilled.times.controls[0].value.begin === EMPTY_HOUR ||
              toBeFilled.times.controls[0].value.begin === INITIAL_HOUR
          )
          .filter(
            (toBeFilled: any) =>
              toBeFilled.times.controls[0].value.end === EMPTY_HOUR ||
              toBeFilled.times.controls[0].value.end === INITIAL_HOUR
          )
          .forEach((toBeFilled: any) => {
            const times = foundValues[0].times;
            toBeFilled.times.setValue([
              {
                begin: times.length > 0 ? times[0].begin : EMPTY_HOUR,
                end: times.length > 0 ? times[0].end : EMPTY_HOUR,
                enabled: times.length > 0
              },
              {
                begin: times.length > 1 ? times[1].begin : EMPTY_HOUR,
                end: times.length > 1 ? times[1].end : EMPTY_HOUR,
                enabled: times.length > 1 ? times[1].enabled : false
              },
              {
                begin: times.length > 2 ? times[2].begin : EMPTY_HOUR,
                end: times.length > 2 ? times[2].end : EMPTY_HOUR,
                enabled: times.length > 2 ? times[2].enabled : false
              }
            ]);
          });
      });

    return selected;
  }

  private initForm(): void {
    this.rows = this.formBuilder.array([]);
    this.columns = [...this.groupedOpeningHourColumns];
    this.displayedColumns = this.columns.map(c => c.columnDef);
    this.formGroup = this.formBuilder.group({ openingHours: this.rows });

    this.weekDays.forEach(day => {
      this.rows.push(
        this.formBuilder.group({
          weekDay: day,
          openingHours: this.initWeekDayFormGroups(this.columns, day)
        })
      );
    });

    const hours = (this.formGroup.get('openingHours') as UntypedFormArray).controls;
    this.dataSource = new MatTableDataSource(hours);
    this.formGroup.valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe(() => this.emitState());
  }

  fillForm(emitEvent: boolean = false): void {
    this.weekDays.map(weekDay => {
      const sourceWeekDayData = this.weekdaysOpeningHours
        .filter(row => row.weekDay.valueOf() === weekDay)
        .map(row => row.openingHours)
        .pop();

      const sourceWeekDayDataObj = (sourceWeekDayData ? sourceWeekDayData : []).reduce(
        (hours, hour) => {
          const hasFirstBegin = hour.times && hour.times.length > 0;
          const hasFirstEnd =
            hour.times && hour.times.length > 0 ? hour.times[0].end !== INITIAL_HOUR : false;

          const hasSecondBegin =
            hour.times && hour.times.length > 1 ? hour.times[1].begin !== INITIAL_HOUR : false;
          const hasSecondEnd =
            hour.times && hour.times.length > 1 ? hour.times[1].end !== INITIAL_HOUR : false;

          const hasThirdBegin =
            hour.times && hour.times.length > 2 ? hour.times[2].begin !== INITIAL_HOUR : false;
          const hasThirdEnd =
            hour.times && hour.times.length > 2 ? hour.times[2].end !== INITIAL_HOUR : false;

          const hasTimeValue =
            hasFirstBegin ||
            hasFirstEnd ||
            hasSecondBegin ||
            hasSecondEnd ||
            hasThirdBegin ||
            hasThirdEnd;
          const special = hour.special === true ? hasTimeValue || hour.closed : false;

          hours[hour.groupId] = {
            groupId: hour.groupId,
            closed: hour.closed,
            special: special,
            changed: false,
            times: [
              {
                begin: hasFirstBegin ? hour.times[0].begin : EMPTY_HOUR,
                end: hasFirstEnd ? hour.times[0].end : EMPTY_HOUR,
                enabled: hasFirstBegin || hasFirstEnd
              },
              {
                begin: hasSecondBegin ? hour.times[1].begin : EMPTY_HOUR,
                end: hasSecondEnd ? hour.times[1].end : EMPTY_HOUR,
                enabled: hasSecondBegin || hasSecondEnd
              },
              {
                begin: hasThirdBegin ? hour.times[2].begin : EMPTY_HOUR,
                end: hasThirdEnd ? hour.times[2].end : EMPTY_HOUR,
                enabled: hasThirdBegin || hasThirdEnd
              }
            ],
            notification: hour.notification ? hour.notification : "",
            dataChangeTask: hour.dataChangeTask ? hour.dataChangeTask : null
          };
          return hours;
        },
        {}
      );

      this.rows.controls
        .filter(() => Object.keys(sourceWeekDayDataObj).length > 0)
        .filter((weekDayGroup: UntypedFormGroup) => weekDayGroup.value.weekDay === weekDay)
        .map((weekDayGroup: UntypedFormGroup) => weekDayGroup.controls.openingHours)
        .map((openingHoursGroup: UntypedFormGroup) => openingHoursGroup.controls)
        .map((openingHoursGroupObj: any) => {
          Object.keys(openingHoursGroupObj).forEach(key => {
            const weekDayCellFormGroup = openingHoursGroupObj[key];
            const groupId = weekDayCellFormGroup.value.groupId;
            const sourceWeekDayCellObj = sourceWeekDayDataObj[groupId];
            if (sourceWeekDayCellObj) {
              sourceWeekDayCellObj.index = weekDayCellFormGroup.value.index;
              weekDayCellFormGroup.setValue(sourceWeekDayCellObj, { emitEvent: emitEvent });
            }
          });
        });
    });
  }

  private initWeekDayFormGroups(columns: GroupedOpeningHourColumn[], weekDay: number): UntypedFormGroup {
    return new UntypedFormGroup(
      columns.reduce((columnsFormGroup, column, columnIndex) => {
        const columnGroup = this.formBuilder.group(
          {
            groupId: column.columnDef,
            index: (columnIndex + 1) * 100 + weekDay * 10,
            times: this.initWeekDayCellTimesFormArray(),
            closed: false,
            changed: false,
            special: false,
            notification: "",
            dataChangeTask: null
          },
          {
            validators: validateCrossingTimeRange
          }
        );

        columnGroup.valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe(newValue => {
          this.rows.controls
            .filter((weekDayGroup: UntypedFormGroup) => weekDayGroup.value.weekDay === weekDay)
            .map((weekDayGroup: UntypedFormGroup) => weekDayGroup.controls.openingHours)
            .map((openingHoursGroup: UntypedFormGroup) => openingHoursGroup.controls)
            .map(openingHoursGroupObj => {
              Object.keys(openingHoursGroupObj).forEach(key => {
                const weekDayCellFormGroup = openingHoursGroupObj[key];
                if (weekDayCellFormGroup.value.index === newValue.index) {
                  openingHoursGroupObj[key].patchValue(
                    { ...newValue, changed: true },
                    { emitEvent: false }
                  );
                }
              });
            });
        });

        columnsFormGroup[column.columnDef] = columnGroup;
        return columnsFormGroup;
      }, {})
    );
  }

  private initWeekDayCellTimesFormArray(): UntypedFormArray {
    const timeFormArray = this.formBuilder.array([]);
    repeat(EMPTY_HOUR, 3).forEach(time => {
      timeFormArray.push(
        new UntypedFormGroup(
          {
            begin: new UntypedFormControl(time, [validateValueRange]),
            end: new UntypedFormControl(time, [validateValueRange]),
            enabled: new UntypedFormControl(false)
          },
          {
            validators: validateBeginIsBeforeEnd
          }
        )
      );
    });
    return timeFormArray;
  }

  private hasChanged(change: SimpleChange): boolean {
    return change && !change.firstChange && change.currentValue !== change.previousValue;
  }

  private hasValuesChanged(hours: SimpleChange): boolean {
    return hours && !hours.firstChange;
  }

  private hasColumnsChanged(columns: SimpleChange): boolean {
    let changed = false;
    if (columns && !columns.firstChange) {
      if (columns.currentValue.length !== columns.previousValue.length) {
        changed = true;
      } else {
        changed = !columns.currentValue.every(
          (curValue: GroupedOpeningHourColumn) =>
            columns.previousValue.find(
              (prevValue: GroupedOpeningHourColumn) => prevValue === curValue
            ) !== undefined
        );
      }
    }
    return changed;
  }
}
