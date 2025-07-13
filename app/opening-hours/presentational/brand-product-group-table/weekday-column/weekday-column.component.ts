import { WeekDay } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import moment from 'moment';
import {WeekDayOpeningHours} from "../../../models/opening-hour.model";

interface DayCell {
  label: string;
  editable: boolean;
  weekDay: string;
}

@Component({
  selector: 'gp-weekday-column',
  templateUrl: './weekday-column.component.html',
  styleUrls: ['./weekday-column.component.scss']
})
export class WeekdayColumnComponent implements OnChanges {
  @Input()
  editableWeekDays: WeekDay[] = [];
  @Input()
  translationLocale: string;
  @Input()
  weekDays: WeekDay[] = [];
  @Input()
  weekDaysOpeningHours: WeekDayOpeningHours[] = [];
  @Input()
  showDataChangeNotification: boolean = false;
  dayCells: DayCell[];

  cellNumberOfDataLineMapping: { [key: string]: number } = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0
  };


  constructor() {}

  ngOnChanges(): void {
    this.dayCells = this.weekDays.map(weekDay => ({
      label: moment().isoWeekday(weekDay).locale(this.translationLocale).format('dddd'),
      editable: this.editableWeekDays.some(day => day === weekDay),
      weekDay:weekDay.toString()
    }));
  }

  calculateHeightForCell(): void {
    this.weekDays.forEach(weekDay => {
      const maxLines = this.weekDaysOpeningHours
        .filter(weekDayOpeningHour => weekDayOpeningHour.weekDay === weekDay)
        .map(weekDayOpeningHour => weekDayOpeningHour.openingHours)
        .reduce((acc, openingHours) => acc.concat(openingHours), [])
        .reduce((max, openingHour) => {
          if (openingHour.dataChangeTask) {
            const newTimesLength = openingHour.dataChangeTask.new.times.length;
            const oldTimesLength = openingHour.dataChangeTask.old.times.length;
            if (newTimesLength === 3 || oldTimesLength === 3) {
              return Math.max(max, 6);
            }
            return Math.max(max, newTimesLength + oldTimesLength);
          }
          return max;
        }, 0);
      this.cellNumberOfDataLineMapping[weekDay] = maxLines;
    });
  }

  getCellHeight(weekDay: string): string {
    const cellNumberOfDataLineMapping: { [key: number]: string } = {
      0: "126px",
      1: "126px",
      2: "126px",
      3: "155px",
      4: "155px",
      5: "197px",
      6: "197px"
    };
    return this.showDataChangeNotification ? cellNumberOfDataLineMapping[this.cellNumberOfDataLineMapping[weekDay]] : "126px";
  }
}
