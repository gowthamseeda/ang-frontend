import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChange,
  SimpleChanges
} from '@angular/core';
import moment from 'moment';

export interface CalendarEvent {
  startDate: Date;
  endDate: Date;
  selected: boolean;
}

interface CalendarMonth {
  year: number;
  number: number;
  allowNavigation: boolean;
  events: CalendarEvent[];
}
@Component({
  selector: 'gp-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, OnChanges {
  @Input()
  date: Date;
  @Input()
  numberOfMonths: number;
  @Input()
  events: CalendarEvent[] = [];
  @Input()
  translationLocale: string;
  @Output()
  daySelected = new EventEmitter<number>();
  @Output()
  eventDaySelected = new EventEmitter<number>();
  @Output()
  selectedEventDaySelected = new EventEmitter<number>();
  @Output()
  dayFocused = new EventEmitter<number>();
  @Output()
  monthSelected = new EventEmitter<Date>();
  @Output()
  yearSelected = new EventEmitter<number>();

  year: number;
  month: number;
  months: CalendarMonth[] = [];
  minSelectableYear: number;
  maxSelectableYear: number;
  calendarRangeStartDate: Date;

  constructor() {}

  ngOnInit(): void {
    if (this.date) {
      this.year = this.date.getFullYear();
      this.month = this.date.getMonth();
      this.minSelectableYear = this.year;
      this.maxSelectableYear = this.minSelectableYear + 3;
      this.months = this.getMonths(this.year, this.month);
      this.calendarRangeStartDate = new Date(this.year, this.month);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isDateHidden(changes.date)) {
      this.year = this.date.getFullYear();
      this.month = this.date.getMonth();
    }
    if (this.isEventsChanged(changes.events)) {
      this.months = this.getMonths(this.year, this.month);
    }
    if (this.isDateYearOutOfStartRange()) {
      this.calendarRangeStartDate = new Date(this.year, this.month);
      this.minSelectableYear = this.year;
      this.months = this.getMonths(this.year, this.month);
    }
  }

  onDaySelected(timeStamp: number): void {
    this.daySelected.emit(timeStamp);
  }

  onEventDaySelected(timeStamp: number): void {
    this.eventDaySelected.emit(timeStamp);
  }

  onSelectedEventDaySelected(timeStamp: number): void {
    this.selectedEventDaySelected.emit(timeStamp);
  }

  onDayFocused(timeStamp: number): void {
    this.dayFocused.emit(timeStamp);
  }

  onYearChanged(selectedYear: number): void {
    if (this.isYearInAllowedRange(selectedYear)) {
      this.year = selectedYear;
      this.months = this.getMonths(this.year, this.month);
      this.yearSelected.emit(this.year);
    }
  }

  onPreviousMonthSelected(): void {
    const date = new Date(this.year, this.month);
    date.setMonth(date.getMonth() - 1);

    if (this.isYearInAllowedRange(date.getFullYear())) {
      this.setValues(date.getFullYear(), date.getMonth());
      this.monthSelected.emit(new Date(date.getTime()));
    }
  }

  onNextMonthSelected(): void {
    const date = new Date(this.year, this.month);
    date.setMonth(date.getMonth() + 1);

    if (this.isYearInAllowedRange(date.getFullYear())) {
      this.setValues(date.getFullYear(), date.getMonth());
      this.monthSelected.emit(new Date(date.getTime()));
    }
  }

  private isDateYearOutOfStartRange(): boolean {
    return (
      this.calendarRangeStartDate &&
      this.date.getFullYear() < this.calendarRangeStartDate.getFullYear()
    );
  }

  private isDateHidden(dateChange: SimpleChange): boolean {
    return !this.months
      .filter(() => dateChange && !dateChange.isFirstChange())
      .filter(() => dateChange.currentValue.getFullYear() === this.year)
      .filter(month => month.year === this.year)
      .some((month: CalendarMonth) => month.number === dateChange.currentValue.getMonth());
  }

  private isEventsChanged(eventsChange: SimpleChange): boolean {
    return (
      eventsChange &&
      !eventsChange.isFirstChange() &&
      eventsChange.previousValue !== eventsChange.currentValue
    );
  }

  private setValues(year: number, month: number): void {
    this.months = this.getMonths(year, month);
    this.month = month;
    this.year = year;
  }

  private getMonths(year: number, month: number): CalendarMonth[] {
    const months: CalendarMonth[] = [];
    const date = new Date(year, month);

    for (let i = 0; i < this.numberOfMonths; i++) {
      if (this.isYearInAllowedRange(date.getFullYear())) {
        months.push({
          year: date.getFullYear(),
          number: date.getMonth(),
          allowNavigation: i === 0,
          events: this.events.filter(event => {
            return moment(date).isBetween(event.startDate, event.endDate, 'month', '[]');
          })
        });
        date.setMonth(date.getMonth() + 1);
      }
    }
    return months;
  }

  private isYearInAllowedRange(selectedYear: number): boolean {
    return selectedYear >= this.minSelectableYear && selectedYear <= this.maxSelectableYear;
  }
}
