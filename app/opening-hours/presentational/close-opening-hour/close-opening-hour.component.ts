import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'gp-close-opening-hour',
  templateUrl: './close-opening-hour.component.html',
  styleUrls: ['./close-opening-hour.component.scss']
})
export class CloseOpeningHourComponent {
  @Input()
  position: string;
  @Input()
  enabled: boolean;
  @Output()
  removeAllOpeningHoursEvent = new EventEmitter<any>();
  @Output()
  openOpeningHoursEvent = new EventEmitter<any>();

  constructor() {}

  removeAllOpeningHours(): void {
    this.removeAllOpeningHoursEvent.emit();
  }

  openOpeningHours(): void {
    this.openOpeningHoursEvent.emit();
  }
}
