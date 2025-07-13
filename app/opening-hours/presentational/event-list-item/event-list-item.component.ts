import { Component, EventEmitter, Input, Output } from '@angular/core';
import moment from 'moment';

import { EventListItem } from './event-list-item.model';

@Component({
  selector: 'gp-event-list-item',
  templateUrl: './event-list-item.component.html',
  styleUrls: ['./event-list-item.component.scss']
})
export class EventListItemComponent {
  @Input()
  event: EventListItem;

  @Output()
  eventSelected = new EventEmitter<number>();
  @Output()
  eventDeleted = new EventEmitter<number>();

  constructor() {}

  emitEventSelected(): void {
    this.eventSelected.emit(this.event.start.getTime());
  }

  emitEventDeleted(): void {
    this.eventDeleted.emit(this.event.start.getTime());
  }

  isSingleDay(): any {
    return this.event !== undefined && moment(this.event.start).isSame(this.event.end, 'd');
  }
}
