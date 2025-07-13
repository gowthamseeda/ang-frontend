import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  CommunicationDataDiff,
  DataCluster,
  OpeningHoursDiff,
  Status,
  Task,
  TaskFooterEvent,
  Type
} from 'app/tasks/task.model';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { UserService } from '../../../iam/user/user.service';
import { BreadcrumbItem } from '../../../main/header/models/header.model';
import { UserSettingsService } from '../../../user-settings/user-settings/services/user-settings.service';
import { TaskService } from '../../task/task.service';
import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';
import { BusinessSiteTaskService } from '../../shared/business-site-task.service';

@Component({
  selector: 'gp-task-detail-container',
  templateUrl: './task-detail-container.component.html',
  styleUrls: ['./task-detail-container.component.scss']
})
export class TaskDetailContainerComponent implements OnInit, OnDestroy {
  taskType = Type.DATA_VERIFICATION;
  taskId: number;
  task: Observable<Task>;
  breadcrumbItems: BreadcrumbItem[];
  statusOpen = Status.OPEN;
  statusPartially = Status.PARTIALLY_COMPLETED;
  dataCluster = {
    baseDataAddress: DataCluster.BASE_DATA_ADDRESS,
    baseDataAdditionalAddress: DataCluster.BASE_DATA_ADDITIONAL_ADDRESS,
    baseDataGps: DataCluster.BASE_DATA_GPS,
    baseDataPoBox: DataCluster.BASE_DATA_PO_BOX,
    baseDataNameAddition: DataCluster.BASE_DATA_NAME_ADDITION,
    baseDataStateAndProvince: DataCluster.BASE_DATA_STATE_AND_PROVINCE,
    businessName: DataCluster.BUSINESS_NAME,
    communicationChannels: DataCluster.COMMUNICATION_CHANNELS,
    generalCommunicationChannels: DataCluster.GENERAL_COMMUNICATION_CHANNELS,
    legalVatNo: DataCluster.LEGAL_VAT_NO,
    legalTaxNo: DataCluster.LEGAL_TAX_NO,
    legalLegalFooter: DataCluster.LEGAL_LEGAL_FOOTER,
    openingHours: DataCluster.OPENING_HOURS,
    baseDataAddressStreet: DataCluster.BASE_DATA_ADDRESS_STREET,
    baseDataAddressNumber: DataCluster.BASE_DATA_ADDRESS_NUMBER,
    baseDataAddressAddressAddition: DataCluster.BASE_DATA_ADDRESS_ADDRESS_ADDITION,
    baseDataAddressZipCode: DataCluster.BASE_DATA_ADDRESS_ZIP_CODE,
    baseDataAddressCity: DataCluster.BASE_DATA_ADDRESS_CITY,
    baseDataAddressDistrict: DataCluster.BASE_DATA_ADDRESS_DISTRICT,
    baseDataAddressState: DataCluster.BASE_DATA_ADDRESS_STATE,
    baseDataAddressProvince: DataCluster.BASE_DATA_ADDRESS_PROVINCE
  };
  currentUserId: string;
  languageId?: string;
  columnsToDisplay: string[] = ['outletId', 'legalName', 'address', 'brandCodes'];
  focusFeatureToggleName = 'FOCUS';
  private unsubscribe = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private businessSiteTaskService: BusinessSiteTaskService,
    private snackBarService: SnackBarService,
    private translateService: TranslateService,
    private userService: UserService,
    private userSettingsService: UserSettingsService
  ) {}

  ngOnInit(): void {
    this.taskId = this.route.snapshot.params['taskId'];
    this.breadcrumbItems = [
      { label: 'TASKS', path: '/tasks' },
      { label: `${this.translateService.instant('TASK')} ${this.taskId}` }
    ];
    this.initTask();
    this.userService
      .getCurrent()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(user => {
        this.currentUserId = user.userId;
      });

    this.userSettingsService
      .getLanguageId()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(languageId => {
        this.languageId = languageId;
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  showDiff(currentCluster: DataCluster, displayedClusters: DataCluster[]): boolean {
    return displayedClusters.includes(currentCluster);
  }

  approve(event: TaskFooterEvent): void {
    if (event.taskId) {
      this.businessSiteTaskService
        .updateStatus(event.taskId, Status.APPROVED, event?.payload?.comment)
        .pipe(take(1))
        .subscribe(
          _ => {
            this.router.navigate(['/tasks'], { relativeTo: this.route });
            this.snackBarService.showInfo('TASK_APPROVED_SUCCESS');
          },
          error => this.snackBarService.showError(error)
        );
    }
  }

  reject(event: TaskFooterEvent): void {
    if (event.taskId) {
      this.businessSiteTaskService
        .updateStatus(event.taskId, Status.DECLINED, event?.payload?.comment)
        .pipe(take(1))
        .subscribe(
          _ => {
            this.router.navigate(['/tasks'], { relativeTo: this.route });
            this.snackBarService.showInfo('TASK_REJECTED_SUCCESS');
          },
          error => this.snackBarService.showError(error)
        );
    }
  }

  isCurrentUserTaskInitiator(initiator: string): boolean {
    return this.currentUserId === initiator;
  }

  diffIsNotEmpty(diff: OpeningHoursDiff | CommunicationDataDiff): boolean {
    if (Object(diff).hasOwnProperty('openingHoursDiff')) {
      return Object(diff).openingHoursDiff.length !== 0;
    }
    if (Object(diff).hasOwnProperty('communicationDataDiff')) {
      return Object(diff).communicationDataDiff.length !== 0;
    }

    return false;
  }

  noMorePendingTask(
    diff: OpeningHoursDiff | CommunicationDataDiff,
    approvedDiff: OpeningHoursDiff | CommunicationDataDiff,
    declinedDiff: OpeningHoursDiff | CommunicationDataDiff
  ): boolean {
    return (
      !this.diffIsNotEmpty(diff) &&
      (this.diffIsNotEmpty(approvedDiff) || this.diffIsNotEmpty(declinedDiff))
    );
  }

  private initTask(): void {
    this.taskService
      .fetchBy(this.taskId)
      .pipe(take(1))
      .subscribe(_ => {
        this.task = this.taskService.getBy(this.taskId);
      });
  }
}
