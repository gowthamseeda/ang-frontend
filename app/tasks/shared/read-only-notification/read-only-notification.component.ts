import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BusinessSiteTaskService, TaskQueryParams } from '../business-site-task.service';

@Component({
  selector: 'gp-read-only-notification',
  templateUrl: './read-only-notification.component.html',
  styleUrls: ['./read-only-notification.component.scss']
})
export class ReadOnlyNotificationComponent implements OnChanges, OnDestroy {
  @Input() outletId?: string;
  @Input() taskFilter?: TaskQueryParams;
  @Input() showMessage?: boolean;
  private unsubscribe = new Subject<void>();

  constructor(private businessSiteTaskService: BusinessSiteTaskService) {}

  ngOnChanges(): void {
    if (this.outletId && this.taskFilter) {
      this.businessSiteTaskService
        .existsFor(this.outletId, this.taskFilter)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(isTaskPresent => {
          if (isTaskPresent) {
            this.showMessage = true;
          } else {
            this.showMessage = false;
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
