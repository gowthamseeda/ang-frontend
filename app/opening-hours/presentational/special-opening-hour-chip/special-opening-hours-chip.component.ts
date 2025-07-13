import { Component, EventEmitter, Input, Output } from '@angular/core';
import moment from 'moment';

@Component({
  selector: 'gp-special-opening-hours-chip',
  templateUrl: './special-opening-hours-chip.component.html',
  styleUrls: ['./special-opening-hours-chip.component.scss']
})
export class SpecialOpeningHoursChipComponent {
  @Input()
  startDate: number;
  @Input()
  endDate: number;
  @Output()
  closed = new EventEmitter<any>();

  constructor() {}

  onCloseClicked(): void {
    this.closed.emit();
  }

  isSingleDay(): any {
    return moment(this.startDate).isSame(this.endDate, 'd');
  }
}
