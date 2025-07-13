import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import moment from 'moment';

@Component({
  selector: 'gp-month-navigation',
  templateUrl: './month-navigation.component.html',
  styleUrls: ['./month-navigation.component.scss']
})
export class MonthNavigationComponent implements OnInit, OnChanges {
  @Input()
  selectedMonth: number;
  @Input()
  allowNavigation: false;
  @Input()
  translationLocale = 'en';
  @Output()
  previousMonthSelected = new EventEmitter<any>();
  @Output()
  nextMonthSelected = new EventEmitter<any>();

  monthName: string;

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.hasChangedMonth(changes.selectedMonth)) {
      this.monthName = moment()
        .locale(this.translationLocale)
        .month(this.selectedMonth)
        .format('MMMM');
    }
  }

  isEnabled(): boolean {
    return this.allowNavigation;
  }

  emitPreviousMonthClick(): void {
    this.previousMonthSelected.emit();
  }

  emitNextMonthClick(): void {
    this.nextMonthSelected.emit();
  }

  private hasChangedMonth(month: any): boolean {
    return month && (month.currentValue !== this.selectedMonth || month.isFirstChange());
  }
}
