import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment';

@Component({
  selector: 'gp-opening-hours',
  templateUrl: './opening-hours.component.html',
  styleUrls: ['./opening-hours.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OpeningHoursComponent implements OnInit {
  @Input()
  currentLang: string;
  @Input()
  date: string;
  @Input()
  fromTime: string;
  @Input()
  toTime: string;

  constructor(private translateService: TranslateService) {}

  ngOnInit(): void {}

  getContent(): any {
    const datePipe: DatePipe = new DatePipe(this.currentLang);
    const fromToTimes = this.fromTime + ' - ' + this.toTime;

    if (
      this.date === '' ||
      !moment(this.date).isValid() ||
      moment(this.date).isBefore(Date.now(), 'd')
    ) {
      return this.translateService.instant('OUTLET_PROFILE_OPENING_HOURS_NOT_AVAILABLE');
    }
    if (moment(this.date).isSame(Date.now(), 'd')) {
      return (
        this.translateService.instant('OUTLET_PROFILE_OPENING_HOURS_OPEN_TODAY') + ' ' + fromToTimes
      );
    }

    return (
      this.translateService.instant('OUTLET_PROFILE_OPENING_HOURS_OPENS') +
      ' ' +
      datePipe.transform(this.date, 'EEEE') +
      ' (' +
      datePipe.transform(this.date, 'd MMM') +
      ') ' +
      fromToTimes
    );
  }
}
