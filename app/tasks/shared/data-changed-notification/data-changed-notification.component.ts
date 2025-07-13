import {Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'gp-data-changed-notification',
  templateUrl: './data-changed-notification.component.html',
  styleUrls: ['./data-changed-notification.component.scss']
})
export class DataChangedNotificationComponent implements OnDestroy {
  @Input() showMessage?: boolean;
  @Output() viewDataChanged = new EventEmitter<void>();
  private unsubscribe = new Subject<void>();

  constructor() {}

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onActionClick(): void {
    this.viewDataChanged.emit();
  }
}
