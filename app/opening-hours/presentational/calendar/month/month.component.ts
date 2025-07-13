import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import moment, { Moment } from 'moment';

import { CalendarEvent } from '../calendar.component';
import { Cell, DayCell, HighLiteType, Type } from '../cell/cell.model';

@Component({
  selector: 'gp-month',
  templateUrl: './month.component.html',
  styleUrls: ['./month.component.scss']
})
export class MonthComponent implements OnInit, OnChanges {
  @Input()
  year: number;
  @Input()
  month: number;
  @Input()
  events: CalendarEvent[] = [];
  @Input()
  translationLocale = 'en';
  @Output()
  daySelected = new EventEmitter<number>();
  @Output()
  eventDaySelected = new EventEmitter<number>();
  @Output()
  selectedEventDaySelected = new EventEmitter<number>();
  @Output()
  dayFocused = new EventEmitter<number>();

  days = new Array<DayCell>();
  weekDays = new Array<Cell>();
  weekNumbers = new Array<Cell>();
  formatterLocale = navigator.language;

  constructor() {}

  ngOnInit(): void {
    if (!this.translationLocale) {
      this.translationLocale = this.formatterLocale;
    }
    this.weekDays = this.defineWeekDays();
    this.initWeekNumberForDefaultLocale();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.hasChangedYear(changes.year) || this.hasChangedMonth(changes.month)) {
      this.days = this.defineDays(changes.year.currentValue, changes.month.currentValue);
      this.weekNumbers = this.defineWeekNumbers(this.days);
    }
  }

  onDayCellClicked(cell: DayCell): void {
    if (cell.highLiteTypes.some(highLite => highLite === HighLiteType.Selected)) {
      this.selectedEventDaySelected.emit(cell.timeStamp);
    } else if (cell.highLiteTypes.some(highLite => highLite === HighLiteType.EventDay)) {
      this.eventDaySelected.emit(cell.timeStamp);
    } else if (cell.active) {
      this.daySelected.emit(cell.timeStamp);
    }
  }

  onDayCellFocused(cell: DayCell): void {
    this.dayFocused.emit(cell.timeStamp);
  }

  private initWeekNumberForDefaultLocale(): void {
    // ISO-8601, start with monday
    moment.updateLocale('en', {
      week: {
        dow: 1,
        doy: 4
      }
    });

    moment.updateLocale('en-us', {
      parentLocale: 'en',
      week: {
        dow: 0,
        doy: 6
      }
    });

    moment.updateLocale('en-ca', {
      parentLocale: 'en',
      week: {
        dow: 0,
        doy: 6
      }
    });
  }

  private hasChangedYear(year: any): boolean {
    return year && (year.currentValue !== this.year || year.isFirstChange());
  }

  private hasChangedMonth(month: any): boolean {
    return month && (month.currentValue !== this.month || month.isFirstChange());
  }

  private defineWeekDays(): Cell[] {
    return [0, 1, 2, 3, 4, 5, 6]
      .map(weekday => moment().locale(this.formatterLocale).weekday(weekday))
      .map(day => this.createWeekDayCell(day.clone().locale(this.translationLocale).format('ddd')));
  }

  private defineWeekNumbers(monthDays: DayCell[]): Cell[] {
    return monthDays
      .filter((monthDay, index) => index === 0 || index % 7 === 0)
      .map(monthDay => this.createWeekNumberCell(monthDay));
  }

  private defineDays(year: number, month: number): DayCell[] {
    const firstOfMonth: Moment = moment([year, month]);
    const daysBefore = this.defineDaysBefore(firstOfMonth.clone().locale(this.formatterLocale));

    const lastOfMonth: Moment = firstOfMonth.add(1, 'M').subtract(1, 'd');
    const days = this.defineDaysCurrent(lastOfMonth.clone());
    const daysAfter = this.defineDaysAfter(lastOfMonth.clone().locale(this.formatterLocale));

    return [...daysBefore, ...days, ...daysAfter];
  }

  private defineDaysBefore(firstOfMonth: Moment): DayCell[] {
    const daysBefore: DayCell[] = [];

    for (const day = firstOfMonth; day.weekday() % 7 > 0; ) {
      day.subtract(1, 'd');
      daysBefore.push(this.createDateCell(day.clone(), false));
    }
    return daysBefore.reverse();
  }

  private defineDaysCurrent(lastOfMonth: Moment): DayCell[] {
    const currentDays: DayCell[] = [];

    for (
      const day = moment([lastOfMonth.year(), lastOfMonth.month()]);
      day.isSameOrBefore(lastOfMonth);
      day.add(1, 'd')
    ) {
      currentDays.push(this.createDateCell(day.clone(), true));
    }
    return currentDays;
  }

  private defineDaysAfter(lastOfMonth: Moment): DayCell[] {
    const daysAfter: DayCell[] = [];

    for (const day = lastOfMonth; day.weekday() % 7 !== 6; ) {
      day.add(1, 'd');
      daysAfter.push(this.createDateCell(day, false));
    }
    return daysAfter;
  }

  private createDateCell(date: Moment, active: boolean): DayCell {
    return {
      id: date.valueOf().toString(),
      label: date.date().toString(),
      type: Type.Date,
      highLiteTypes: this.getHighlightTypes(date),
      timeStamp: date.valueOf(),
      active: active
    };
  }

  private createWeekDayCell(weekDayName: string): Cell {
    return {
      id: weekDayName,
      label: weekDayName,
      type: Type.WeekDay,
      highLiteTypes: [HighLiteType.None],
      active: false
    };
  }

  private createWeekNumberCell(monthDay: DayCell): Cell {
    const date = moment(monthDay.timeStamp).add(3, 'days');
    const weekNumber = date.isoWeek().toString();
    const dateTimeInMillis = date.milliseconds().toString();
    const id = weekNumber.concat('-').concat(dateTimeInMillis);

    return {
      id: id,
      label: weekNumber,
      type: Type.WeekNumber,
      highLiteTypes: [HighLiteType.None],
      active: false
    };
  }

  private getHighlightTypes(monthDay: Moment): HighLiteType[] {
    const highlightTypes: HighLiteType[] = [];

    if (moment().isSame(monthDay, 'day')) {
      highlightTypes.push(HighLiteType.CurrentDay);
    }

    const eventHighlights: HighLiteType[][] = this.events.map(foundEvent => {
      const foundEventHighlighTypes: HighLiteType[] = [];
      if (monthDay.isBetween(foundEvent.startDate, foundEvent.endDate, 'day', '[]')) {
        foundEventHighlighTypes.push(HighLiteType.EventDay);

        if (foundEvent.selected) {
          foundEventHighlighTypes.push(HighLiteType.Selected);
        }
        if (monthDay.isSame(foundEvent.startDate, 'day')) {
          foundEventHighlighTypes.push(HighLiteType.Start);
        }
        if (monthDay.isSame(foundEvent.endDate, 'day')) {
          foundEventHighlighTypes.push(HighLiteType.End);
        }
      }
      return foundEventHighlighTypes;
    });

    eventHighlights.forEach(highlights => highlightTypes.push(...highlights));
    return highlightTypes.length === 0 ? [HighLiteType.None] : highlightTypes;
  }
}
