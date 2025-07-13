import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { UntypedFormArray, UntypedFormGroup } from '@angular/forms';
import { GroupedOpeningHour, Times } from 'app/opening-hours/models/opening-hour.model';
import {
  GroupedOpeningHourColumn,
  OpeningHourAs24HourTimeFormat
} from 'app/opening-hours/presentational/brand-product-group-table/grouped-opening-hour-column.model';
import { noop, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { EMPTY_HOUR, INITIAL_HOUR } from '../../models/opening-hour.model';
import {
  formatTime,
  TIME_FORMAT_12,
  TIME_FORMAT_24,
  timeFormatOf
} from '../../util/opening-hours-formatter';
import {OpeningHoursDiffTime} from "../../../tasks/task.model";

export interface OpeningHourWeekDayCellEvent {
  groupedOpeningHour: GroupedOpeningHour;
  weekDay: number;
}

enum KEY {
  BACK_SPACE = 'Backspace',
  TAB = 'Tab',
  ENTER = 'Enter',
  SHIFT = 'Shift',
  CONTROL = 'Control',
  ALT = 'Alt',
  ARROW_LEFT = 'ArrowLeft',
  ARROW_UP = 'ArrowUp',
  ARROW_RIGHT = 'ArrowRight',
  ARROW_DOWN = 'ArrowDown'
}

enum OPENING_HOUR {
  SECOND,
  THIRD
}

interface OpeningHourCellIndex {
  firstBegin: number;
  firstEnd: number;
  secondBegin: number;
  secondEnd: number;
  thirdBegin: number;
  thirdEnd: number;
}

const OPENING_HOURS_TIME_RANGES_MUST_NOT_OVERLAP = 'OPENING_HOURS_TIME_RANGES_MUST_NOT_OVERLAP';
const OPENING_HOURS_TIME_RANGE_IS_INVALID = 'OPENING_HOURS_TIME_RANGE_IS_INVALID';
const OPENING_HOURS_FROM_TIME_IS_INVALID = 'OPENING_HOURS_FROM_TIME_IS_INVALID';
const OPENING_HOURS_TO_TIME_IS_INVALID = 'OPENING_HOURS_TO_TIME_IS_INVALID';

@Component({
  selector: 'gp-opening-hour-input',
  templateUrl: './opening-hour-input.component.html',
  styleUrls: ['./opening-hour-input.component.scss']
})
export class OpeningHourInputComponent implements OnInit, OnChanges, OnDestroy {
  @Input()
  parentRowForm: UntypedFormGroup;
  @Input()
  column: GroupedOpeningHourColumn;
  @Input()
  weekDay: number;
  @Input()
  tabIndex: number;
  @Input()
  editable: boolean;
  @Input()
  locale: string;
  @Input()
  showDataChangeNotification: boolean = false;
  @Input()
  verification4RTaskExist: boolean = false;
  @Output()
  openingHourChanged = new EventEmitter<OpeningHourWeekDayCellEvent>();
  @Output()
  firstOpeningHourEnabled = new EventEmitter<OpeningHourWeekDayCellEvent>();
  @Output()
  firstOpeningHourDisabled = new EventEmitter<OpeningHourWeekDayCellEvent>();
  @Output()
  secondOpeningHourEnabled = new EventEmitter<OpeningHourWeekDayCellEvent>();
  @Output()
  secondOpeningHourDisabled = new EventEmitter<OpeningHourWeekDayCellEvent>();
  @Output()
  thirdOpeningHourEnabled = new EventEmitter<OpeningHourWeekDayCellEvent>();
  @Output()
  thirdOpeningHourDisabled = new EventEmitter<OpeningHourWeekDayCellEvent>();
  @Output()
  openingHourClosed = new EventEmitter<OpeningHourWeekDayCellEvent>();
  @Output()
  openingHourOpened = new EventEmitter<OpeningHourWeekDayCellEvent>();
  @Output()
  openingHourFormatChanged = new EventEmitter<any>();

  isReadyOnlyAndEmpty = true;
  inputIndexes: OpeningHourCellIndex;
  localeTimeFormat = TIME_FORMAT_24;
  unsubscribe: Subject<boolean> = new Subject<boolean>();

  keyDownMap = {};

  readonly FIRST_HOUR_FROM = 0;
  readonly FIRST_HOUR_TO = 1;
  readonly SECOND_HOUR_FROM = 2;
  readonly SECOND_HOUR_TO = 3;
  readonly THIRD_HOUR_FROM = 4;
  readonly THIRD_HOUR_TO = 5;

  openingHour: UntypedFormGroup;
  @HostBinding('class.validation-error')
  isInvalid = false;

  OPENING_HOUR = OPENING_HOUR;

  constructor() {}

  ngOnInit(): void {
    this.inputIndexes = {
      firstBegin: this.editable ? this.tabIndex : -1,
      firstEnd: this.editable ? this.tabIndex + 1 : -1,
      secondBegin: this.editable ? this.tabIndex + 2 : -1,
      secondEnd: this.editable ? this.tabIndex + 3 : -1,
      thirdBegin: this.editable ? this.tabIndex + 4 : -1,
      thirdEnd: this.editable ? this.tabIndex + 5 : -1
    };

    const openingHours = this.parentRowForm.controls.openingHours as UntypedFormGroup;
    this.openingHour = openingHours.get(this.column.columnDef) as UntypedFormGroup;
    this.openingHour.statusChanges
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((status: string) => (this.isInvalid = status === 'INVALID'));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.editable) {
      const openingHour: OpeningHourAs24HourTimeFormat =
        this.parentRowForm.value.openingHours[this.column.columnDef];
      const hasTime = (openingHour.times ? openingHour.times : [])
        .filter(time => time.enabled === true)
        .some(time => time.begin !== EMPTY_HOUR || time.end !== EMPTY_HOUR);
      const hasValue = hasTime || openingHour.closed === true;
      this.isReadyOnlyAndEmpty = !changes.editable.currentValue && !hasValue;
    }

    if (changes.locale) {
      this.localeTimeFormat = timeFormatOf(this.locale);
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe.next(true);
    this.unsubscribe.unsubscribe();
  }

  hasOpeningHourError(index: number): string {
    if (this.isInvalid) {
      const times = this.openingHour.get('times') as UntypedFormArray;
      const time = times.get(index.toString()) as UntypedFormGroup;
      const beginValue = time.get('begin') as UntypedFormGroup;
      const endValue = time.get('end') as UntypedFormGroup;

      const faultyTimeRange = time.errors?.faultyTimeRange;
      const beginInvalidValue = beginValue.errors?.invalidValueRange;
      const endInvalidValue = endValue.errors?.invalidValueRange;

      const isValid = !faultyTimeRange && !beginInvalidValue && !endInvalidValue;
      const overlappingTimeRanges = isValid && this.openingHour.errors?.crossingTimeRange;

      if (overlappingTimeRanges) {
        return OPENING_HOURS_TIME_RANGES_MUST_NOT_OVERLAP;
      } else if (faultyTimeRange) {
        return OPENING_HOURS_TIME_RANGE_IS_INVALID;
      } else if (beginInvalidValue) {
        return OPENING_HOURS_FROM_TIME_IS_INVALID;
      } else if (endInvalidValue) {
        return OPENING_HOURS_TO_TIME_IS_INVALID;
      }
    }
    return '';
  }

  hasNotBeenClosed(openingHour: GroupedOpeningHour): boolean {
    return !openingHour.closed;
  }

  hasPendingTask(openingHour: GroupedOpeningHour): boolean {
    return openingHour.dataChangeTask != null;
  }

  getTaskData = (openingHour: GroupedOpeningHour, type: string) =>
    type === 'future' ? openingHour.dataChangeTask?.new : openingHour.dataChangeTask?.old;

  checkIsClosed = (openingHour: GroupedOpeningHour, type: string): boolean =>
    this.getTaskData(openingHour, type)?.closed ?? false;

  getTaskDataDiffTime(openingHour: GroupedOpeningHour, type: string): OpeningHoursDiffTime[] {
    const taskData = this.getTaskData(openingHour, type);
    return taskData && Array.isArray(taskData.times) ? [...taskData.times] : [];
  }

  getHeightForCell(openingHour: GroupedOpeningHour): string {
    const height: { [key: number]: string } = {
      1: "62px",
      2: "77px",
      3: "98px",
    };

    if(openingHour.dataChangeTask){
      const newTimesLength = openingHour.dataChangeTask?.new.times.length;
      const oldTimesLength = openingHour.dataChangeTask?.old.times.length;
      if (newTimesLength >= oldTimesLength) {
        return height[newTimesLength] || height[1];
      } else if (oldTimesLength) {
        return height[oldTimesLength] || height[1];
      }
    }

    return height[1];
  }
  isOpeningHourEnabled(openingHour: GroupedOpeningHour, index: number): boolean {
    const time = openingHour.times && openingHour.times[index];
    return !!(time && time.enabled);
  }

  isTimeFormatChangeEnabled(openingHour: GroupedOpeningHour, hourInput: number): boolean {
    const inputElementValue = this.getInputElementValue(openingHour, hourInput);
    return (
      inputElementValue !== EMPTY_HOUR && this.localeTimeFormat === TIME_FORMAT_12 && this.editable
    );
  }

  onTimeInputClicked(event: Event): void {
    if (this.editable) {
      this.setValueAndSelect(event.target as HTMLInputElement);
    }
  }

  onTimeFormatClicked(openingHour: GroupedOpeningHour, hourInput: number): void {
    let inputElementValue = this.getInputElementValue(openingHour, hourInput);
    inputElementValue = formatTime(inputElementValue, TIME_FORMAT_12);
    const isAM = inputElementValue.includes('AM');
    const isPM = inputElementValue.includes('PM');

    const timeFormat = isAM ? 'PM' : isPM ? 'AM' : 'AM';
    const timeValue = inputElementValue.split(' ')[0] + ' ' + timeFormat;
    this.emitOpeningHourChangedEvent(openingHour, timeValue, hourInput);
    this.openingHourFormatChanged.emit();
  }

  onKeyDown(hourInput: number, event: KeyboardEvent): void {
    if (isFinite(Number(event.key))) {
      this.keyDownMap[hourInput] ? this.keyDownMap[hourInput]++ : (this.keyDownMap[hourInput] = 1);
    }
  }

  onKeyUp(hourInput: number, event: KeyboardEvent): void {
    if (isFinite(Number(event.key))) {
      this.keyDownMap[hourInput]
        ? this.keyDownMap[hourInput] === 0
          ? noop()
          : this.keyDownMap[hourInput]--
        : (this.keyDownMap[hourInput] = 0);
    }
  }

  onTimeInputKeyUp(openingHour: GroupedOpeningHour, hourInput: number, event: KeyboardEvent): void {
    this.onKeyUp(hourInput, event);
    if (this.editable && this.keyDownMap[hourInput] === 0) {
      const timeValue = this.timeValueFrom(event);
      this.emitOpeningHourChangedEvent(openingHour, timeValue, hourInput);
    }
  }

  onTimeInputFocusIn(openingHour: GroupedOpeningHour, hourInput: number, event: Event): void {
    if (this.editable) {
      const inputElement = event.target as HTMLInputElement;
      const inputElementValue =
        inputElement.value === EMPTY_HOUR ? INITIAL_HOUR : inputElement.value;

      let firstBegin = openingHour.times[0].begin;
      firstBegin = hourInput === this.FIRST_HOUR_FROM ? inputElementValue : firstBegin;

      let firstEnd = openingHour.times[0].end;
      firstEnd = firstEnd === INITIAL_HOUR ? EMPTY_HOUR : firstEnd;
      firstEnd = hourInput === this.FIRST_HOUR_TO ? inputElementValue : firstEnd;

      let secondBegin = openingHour.times[1].begin;
      secondBegin = secondBegin === INITIAL_HOUR ? EMPTY_HOUR : secondBegin;
      secondBegin = hourInput === this.SECOND_HOUR_FROM ? inputElementValue : secondBegin;

      let secondEnd = openingHour.times[1].end;
      secondEnd = secondEnd === INITIAL_HOUR ? EMPTY_HOUR : secondEnd;
      secondEnd = hourInput === this.SECOND_HOUR_TO ? inputElementValue : secondEnd;

      let thirdBegin = openingHour.times[2].begin;
      thirdBegin = secondBegin === INITIAL_HOUR ? EMPTY_HOUR : thirdBegin;
      thirdBegin = hourInput === this.THIRD_HOUR_FROM ? inputElementValue : thirdBegin;

      let thirdEnd = openingHour.times[2].end;
      thirdEnd = secondEnd === INITIAL_HOUR ? EMPTY_HOUR : thirdEnd;
      thirdEnd = hourInput === this.THIRD_HOUR_TO ? inputElementValue : thirdEnd;

      const firstEnabled = openingHour.times[0].enabled;
      const secondEnabled = openingHour.times[1].enabled;
      const thirdEnabled = openingHour.times[2].enabled;

      const openingHourEvent = {
        groupedOpeningHour: {
          ...openingHour,
          times: [
            { begin: firstBegin, end: firstEnd, enabled: firstEnabled },
            { begin: secondBegin, end: secondEnd, enabled: secondEnabled },
            { begin: thirdBegin, end: thirdEnd, enabled: thirdEnabled }
          ]
        },
        weekDay: this.weekDay
      };

      switch (hourInput) {
        case this.FIRST_HOUR_FROM:
        case this.FIRST_HOUR_TO:
          this.firstOpeningHourEnabled.emit(openingHourEvent);
          break;
        case this.SECOND_HOUR_FROM:
        case this.SECOND_HOUR_TO:
          this.secondOpeningHourEnabled.emit(openingHourEvent);
          break;
        case this.THIRD_HOUR_FROM:
        case this.THIRD_HOUR_TO:
          this.thirdOpeningHourEnabled.emit(openingHourEvent);
          break;
      }
    }
  }

  onTimeInputFocusOut(openingHour: GroupedOpeningHour): void {
    if (this.editable) {
      const firstEnabled = this.isOpeningHourEnabled(openingHour, 0);
      const firstHasNoValue = (openingHour.times ? openingHour.times : [])
        .filter((time: Times, index) => time && index === 0)
        .every(time => {
          const beginNoValue = time.begin === EMPTY_HOUR;
          const endNoValue = time.end === EMPTY_HOUR || time.end === INITIAL_HOUR;
          return beginNoValue && endNoValue;
        });

      const secondDisabled = !this.isOpeningHourEnabled(openingHour, 1);

      if (firstEnabled && firstHasNoValue && secondDisabled) {
        this.firstOpeningHourDisabled.emit({
          groupedOpeningHour: openingHour,
          weekDay: this.weekDay
        });
      }
    }
  }

  onPlusMinusIconClicked(
    groupedOpeningHour: GroupedOpeningHour,
    openingHour: OPENING_HOUR,
    isPlus: boolean
  ): void {
    if (this.editable) {
      let openingHourWeekDayCellEvent: OpeningHourWeekDayCellEvent = {
        groupedOpeningHour: groupedOpeningHour,
        weekDay: this.weekDay
      };
      switch (openingHour) {
        case OPENING_HOUR.SECOND:
          isPlus
            ? this.secondOpeningHourEnabled.emit(openingHourWeekDayCellEvent)
            : this.secondOpeningHourDisabled.emit(openingHourWeekDayCellEvent);
          break;
        case OPENING_HOUR.THIRD:
          isPlus
            ? this.thirdOpeningHourEnabled.emit(openingHourWeekDayCellEvent)
            : this.thirdOpeningHourDisabled.emit(openingHourWeekDayCellEvent);
          break;
      }
    }
  }

  onOpenIconClicked(openingHour: GroupedOpeningHour): void {
    if (this.editable) {
      this.openingHourOpened.emit({
        groupedOpeningHour: openingHour,
        weekDay: this.weekDay
      });
    }
  }

  onCloseIconClicked(openingHour: GroupedOpeningHour): void {
    if (this.editable) {
      this.openingHourClosed.emit({
        groupedOpeningHour: openingHour,
        weekDay: this.weekDay
      });
    }
  }

  private timeValueFrom(event: KeyboardEvent): string {
    switch (event.key) {
      case KEY.ENTER:
      case KEY.ARROW_LEFT:
      case KEY.ARROW_UP:
      case KEY.ARROW_RIGHT:
      case KEY.ARROW_DOWN:
      case KEY.SHIFT:
      case KEY.CONTROL:
      case KEY.ALT:
        return this.handleTimeFormatChange(event);
      case KEY.TAB:
        return this.handleNavigationChange(event);
      default:
        return this.handleTimeValueChange(event);
    }
  }

  private handleNavigationChange(event: KeyboardEvent): string {
    const inputElement = event.target as HTMLInputElement;
    this.setValueAndSelect(inputElement);
    return inputElement.value;
  }

  private handleTimeValueChange(event: KeyboardEvent): string {
    const inputElement = event.target as HTMLInputElement;
    const timeFormat = this.getTimeFormatLabel(event, this.localeTimeFormat);
    const timeValue = this.getTimeValueLabel(event).replace(/[^0-9]/g, '');
    const isBackSpace = event.key === KEY.BACK_SPACE;

    return this.isTimeFormat12Hours()
      ? this.handleTimeValue12Hours(inputElement, timeValue, timeFormat, isBackSpace)
      : this.handleTimeValue24Hours(inputElement, timeValue, isBackSpace);
  }

  private handleTimeFormatChange(event: KeyboardEvent): string {
    const inputElement = event.target as HTMLInputElement;
    let autoFilledValue = inputElement.value;

    if (this.isTimeFormat12Hours()) {
      const timeValue = this.getTimeValueLabel(event);
      let timeFormat = this.getTimeFormatLabel(event, this.localeTimeFormat);
      timeFormat = timeFormat === ' AM' ? ' PM' : ' AM';

      autoFilledValue = timeValue.trim() + timeFormat;
      this.setValueAndSelect(inputElement, autoFilledValue);
      return autoFilledValue;
    }

    return autoFilledValue;
  }

  private getTimeValueLabel(event: KeyboardEvent): string {
    const inputElement = event.target as HTMLInputElement;
    const inputElementValue = inputElement.value;
    return inputElementValue.substring(0, 5).trim();
  }

  private getTimeFormatLabel(event: KeyboardEvent, format: number): string {
    const inputElement = event.target as HTMLInputElement;
    const originalValue = inputElement.value;

    const defaultTimeFormat = format === TIME_FORMAT_12 ? ' AM' : '';
    const timeFormat = originalValue.substring(5).trim();
    const isBeforeMidday = timeFormat.trim().toUpperCase() === 'AM';
    const isAfterMidday = timeFormat.trim().toUpperCase() === 'PM';

    return isBeforeMidday ? ' AM' : isAfterMidday ? ' PM' : defaultTimeFormat;
  }

  private isTimeFormat12Hours(): boolean {
    return this.localeTimeFormat === TIME_FORMAT_12;
  }

  private handleTimeValue24Hours(
    inputElement: HTMLInputElement,
    timeValue: string,
    isBackSpace: boolean
  ): string {
    let autoFilledValue = INITIAL_HOUR;
    let hours = timeValue.slice(0, 2);
    let minutes = timeValue.slice(2);

    switch (timeValue.length) {
      case 0:
        this.setValueAndSelect(inputElement, autoFilledValue, 0, 5);
        break;
      case 1:
        if (parseInt(hours, 10) > 2) {
          autoFilledValue = '0' + hours + ':00';
          this.setValueAndSelect(inputElement, autoFilledValue, isBackSpace ? 1 : 2, 5);
        } else {
          autoFilledValue = hours + '0:00';
          this.setValueAndSelect(inputElement, autoFilledValue, isBackSpace ? 0 : 1, 5);
        }
        break;
      case 2:
        hours = parseInt(hours, 10) > 23 ? '23' : hours;
        autoFilledValue = hours + ':00';
        this.setValueAndSelect(inputElement, autoFilledValue, isBackSpace ? 1 : 2, 5);
        break;
      case 3:
        minutes = parseInt(minutes, 10) > 5 ? '5' : minutes;
        autoFilledValue = hours + ':' + minutes + '0';
        this.setValueAndSelect(inputElement, autoFilledValue, isBackSpace ? 3 : 4, 5);
        break;
      case 4:
        autoFilledValue = hours + ':' + minutes;
        this.setValueAndSelect(inputElement, autoFilledValue);
        break;
    }

    return autoFilledValue;
  }

  private handleTimeValue12Hours(
    inputElement: HTMLInputElement,
    timeValue: string,
    timeFormat: string,
    isBackSpace: boolean
  ): string {
    let hours = timeValue.slice(0, 1);
    let minutes = timeValue.slice(1);
    let autoFilledValue = INITIAL_HOUR;

    switch (timeValue.length) {
      case 0:
        this.setValueAndSelect(inputElement, autoFilledValue + timeFormat, 0, 5);
        break;
      case 1:
        hours = parseInt(hours, 10) === 0 ? '1' : hours;
        autoFilledValue = hours + ':00' + timeFormat;
        this.setValueAndSelect(inputElement, autoFilledValue, isBackSpace ? 0 : 2, 4);
        break;
      case 2:
        minutes = parseInt(minutes, 10) > 5 ? '5' : minutes;
        autoFilledValue = hours + ':' + minutes + '0' + timeFormat;
        this.setValueAndSelect(inputElement, autoFilledValue, isBackSpace ? 1 : 3, 4);
        break;
      case 3:
        autoFilledValue = hours + ':' + minutes + timeFormat;
        this.setValueAndSelect(inputElement, autoFilledValue, isBackSpace ? 2 : 4, 4);
        break;
      case 4:
        const firstTwoDigits = parseInt(timeValue.slice(0, 2), 10);
        const hasDoubleDigitHour = firstTwoDigits >= 10 && firstTwoDigits <= 12;
        hours = hasDoubleDigitHour ? timeValue.slice(0, 2) : timeValue.slice(0, 1);
        minutes = hasDoubleDigitHour ? timeValue.slice(2) : timeValue.slice(1, 3);

        autoFilledValue = hours + ':' + minutes + timeFormat;
        this.setValueAndSelect(inputElement, autoFilledValue);
        break;
    }

    return autoFilledValue;
  }

  private emitOpeningHourChangedEvent(
    openingHour: GroupedOpeningHour,
    timeValue: string,
    hourInput: number
  ): void {
    const normalizedTimeValue = formatTime(timeValue);
    if (normalizedTimeValue !== INITIAL_HOUR) {
      const times = openingHour.times;
      const firstEnabled = times[0].enabled;
      const secondEnabled = times[1].enabled;
      const thirdEnabled = times[2].enabled;

      const firstBegin = hourInput === this.FIRST_HOUR_FROM ? normalizedTimeValue : times[0].begin;
      const firstEnd = hourInput === this.FIRST_HOUR_TO ? normalizedTimeValue : times[0].end;
      const secondBegin =
        hourInput === this.SECOND_HOUR_FROM ? normalizedTimeValue : times[1].begin;
      const secondEnd = hourInput === this.SECOND_HOUR_TO ? normalizedTimeValue : times[1].end;
      const thirdBegin = hourInput === this.THIRD_HOUR_FROM ? normalizedTimeValue : times[2].begin;
      const thirdEnd = hourInput === this.THIRD_HOUR_TO ? normalizedTimeValue : times[2].end;

      this.openingHourChanged.emit({
        groupedOpeningHour: {
          ...openingHour,
          times: [
            {
              begin: firstBegin,
              end: firstEnd,
              enabled: firstEnabled
            },
            {
              begin: secondBegin,
              end: secondEnd,
              enabled: secondEnabled
            },
            {
              begin: thirdBegin,
              end: thirdEnd,
              enabled: thirdEnabled
            }
          ]
        },
        weekDay: this.weekDay
      });
    }
  }

  private getInputElementValue(openingHour: GroupedOpeningHour, hourInput: number): string {
    const inputElementValues: string[] = [];
    openingHour.times.forEach((time: Times) => {
      inputElementValues.push(time.begin);
      inputElementValues.push(time.end);
    });

    return inputElementValues[hourInput] ?? INITIAL_HOUR;
  }

  // MS Edge: make sure that the selection event happens at the end of the event chain.
  private setValueAndSelect(
    inputElement: HTMLInputElement,
    value?: string,
    start?: number,
    end?: number
  ): void {
    setTimeout(() => {
      if (value) {
        inputElement.value = value;
      }
      if (start && end) {
        inputElement.setSelectionRange(start, end);
      } else {
        inputElement.select();
      }
    }, 0);
  }
}
