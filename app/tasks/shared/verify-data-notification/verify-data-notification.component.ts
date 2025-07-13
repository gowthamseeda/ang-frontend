import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BusinessSiteTaskService, TaskQueryParams } from '../business-site-task.service';
import { FEATURE_NAMES } from '../../../shared/model/constants';

@Component({
  selector: 'gp-verify-data-notification',
  templateUrl: './verify-data-notification.component.html',
  styleUrls: ['./verify-data-notification.component.scss']
})
export class VerifyDataNotificationComponent implements OnChanges, OnDestroy {
  @Input() outletId?: string;
  @Input() taskFilter?: TaskQueryParams;
  @Input() showMessage?: boolean;
  readonly forRetailFeatureToggleName = FEATURE_NAMES.FOR_RETAIL;

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
