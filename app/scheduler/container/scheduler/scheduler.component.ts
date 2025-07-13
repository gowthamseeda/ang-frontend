import {Component, OnDestroy, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';
import {Observable} from 'rxjs/internal/Observable';
import {finalize, map, take, takeUntil} from 'rxjs/operators';

import {UserAuthorizationService} from '../../../iam/user/user-authorization.service';
import {SnackBarService} from '../../../shared/services/snack-bar/snack-bar.service';
import {
  APISchedulerJob,
  AuditLogCleanSchedulerJob, AuditLogCleanSchedulerStatus,
  SchedulerJob,
  SchedulerTableRow,
  SchedulerType,
  XMLSchedulerJob
} from '../../model/scheduler.model';
import {ApiSchedulerService} from '../../services/api-scheduler.service';
import {XmlSchedulerService} from '../../services/xml-scheduler.service';
import {AuditLogCleanSchedulerService} from '../../services/audit-log-clean-scheduler.service';

@Component({
  selector: 'gp-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss']
})
export class SchedulerComponent implements OnInit, OnDestroy {
  unsubscribe = new Subject<void>();
  xmlScheduler: Observable<SchedulerTableRow[]>;
  apiScheduler: Observable<SchedulerTableRow[]>;

  isXmlLoading: Boolean = true;
  isApiLoading: Boolean = true;
  isAuditLogCleanLoading: Boolean = true;
  isAuditLogCleanStatusLoading: Boolean = true;

  schedulerType = SchedulerType;

  auditLogCleanDetails: AuditLogCleanSchedulerJob[];
  auditLogCleanStatus: AuditLogCleanSchedulerStatus[];

  constructor(
    private apiSchedulerService: ApiSchedulerService,
    private xmlSchedulerService: XmlSchedulerService,
    private auditLogCleanSchedulerService: AuditLogCleanSchedulerService,
    private snackBarService: SnackBarService,
    private userAuthorizationService: UserAuthorizationService,
    private translationService: TranslateService
  ) {
  }

  ngOnInit(): void {
    this.getApiScheduler();
    this.getXmlScheduler();
    this.getAuditLogCleanScheduler();
    this.getAuditLogCleanSchedulerStatus();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  getXmlScheduler(): void {
    this.isAllowViewXmlScheduler().subscribe((isAllowed: boolean) => {
      if (isAllowed) {
        this.xmlScheduler = this.xmlSchedulerService.getAll().pipe(
          map(scheduledJobs => {
            return scheduledJobs.map(scheduledJob => {
              return this.mapToXMLSchedulerTableRow(scheduledJob);
            });
          }),
          takeUntil(this.unsubscribe),
          finalize(() => (this.isXmlLoading = false))
        );
      }
    });
  }

  getAuditLogCleanScheduler(): void {
    this.isAllowViewAuditLogCleanScheduler()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((isAllowed: boolean) => {
        if (isAllowed) {
          this.auditLogCleanSchedulerService.getAll().pipe(takeUntil(this.unsubscribe))
            .subscribe(auditLogCleanJobs => {
              this.auditLogCleanDetails = auditLogCleanJobs;
              this.isAuditLogCleanLoading = false;
            });
        }
      });
  }

  getAuditLogCleanSchedulerStatus(): void {
    this.isAllowViewAuditLogCleanScheduler()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((isAllowed: boolean) => {
        if (isAllowed) {
          this.auditLogCleanSchedulerService.getAllCleanSchedulerStatus()
            .pipe(take(1))
            .subscribe(auditLogCleanStatus => {
              this.auditLogCleanStatus = auditLogCleanStatus
              this.isAuditLogCleanStatusLoading = false;
            });
        }
      });
  }

  getApiScheduler(): void {
    this.isAllowViewApiScheduler().subscribe((isAllowed: boolean) => {
      if (isAllowed) {
        this.apiScheduler = this.apiSchedulerService.getAll().pipe(
          map(scheduledJobs => {
            return scheduledJobs.map(scheduledJob => {
              return this.mapToAPISchedulerTableRow(scheduledJob);
            });
          }),
          takeUntil(this.unsubscribe),
          finalize(() => (this.isApiLoading = false))
        );
      }
    });
  }

  triggerAction(schedulerTableRow: SchedulerTableRow): void {
    if (schedulerTableRow.isRunning) {
      schedulerTableRow.tableType === SchedulerType.XML
        ? this.abortXml(schedulerTableRow)
        : this.abortApi(schedulerTableRow);
    } else {
      schedulerTableRow.tableType === SchedulerType.XML
        ? this.runXml(schedulerTableRow)
        : this.runApi(schedulerTableRow);
    }
  }

  runApi(schedulerTableRow: SchedulerTableRow): void {
    this.apiSchedulerService.trigger(schedulerTableRow.jobId).subscribe(
      () => {
        this.snackBarService.showInfo('TRIGGER_JOB_SUCCESS');
        this.getApiScheduler();
      },
      error => {
        this.snackBarService.showError(error);
      }
    );
  }

  abortApi(schedulerTableRow: SchedulerTableRow): void {
    this.apiSchedulerService.abort(schedulerTableRow.jobId).subscribe(
      () => {
        this.snackBarService.showInfo('TRIGGER_ABORT_SUCCESS');
        this.getApiScheduler();
      },
      error => {
        this.snackBarService.showError(error);
      }
    );
  }

  runXml(schedulerTableRow: SchedulerTableRow): void {
    this.xmlSchedulerService.trigger(schedulerTableRow.jobId).subscribe(
      () => {
        this.snackBarService.showInfo('TRIGGER_JOB_SUCCESS');
        this.getXmlScheduler();
      },
      error => {
        this.snackBarService.showError(error);
      }
    );
  }

  abortXml(schedulerTableRow: SchedulerTableRow): void {
    this.xmlSchedulerService.abort(schedulerTableRow.jobId).subscribe(
      () => {
        this.snackBarService.showInfo('TRIGGER_ABORT_SUCCESS');
        this.getXmlScheduler();
      },
      error => {
        this.snackBarService.showError(error);
      }
    );
  }

  mapToXMLSchedulerTableRow(schedulerJob: XMLSchedulerJob): SchedulerTableRow {
    const schedule = [
      schedulerJob.second,
      schedulerJob.minute,
      schedulerJob.hour,
      schedulerJob.dayOfMonth,
      schedulerJob.month,
      schedulerJob.dayOfWeek
    ].join(' ');

    return {
      jobId: schedulerJob.schedulerId,
      jobName: schedulerJob.schedulerId,
      schedule,
      tableType: SchedulerType.XML,
      ...this.mapToSchedulerTableRow(schedulerJob)
    };
  }

  mapToAPISchedulerTableRow(schedulerJob: APISchedulerJob): SchedulerTableRow {
    return {
      jobId: schedulerJob.id,
      jobName: this.translationService.instant(schedulerJob.schedulerJob),
      jobParameters: schedulerJob.jobParameters,
      schedule: schedulerJob.cronExpression,
      tableType: SchedulerType.API,
      ...this.mapToSchedulerTableRow(schedulerJob)
    };
  }

  mapToSchedulerTableRow(schedulerJob: SchedulerJob): SchedulerJob {
    return {
      isActive: schedulerJob.isActive,
      isRunning: schedulerJob.isRunning,
      lastRunningStatus: schedulerJob.lastRunningStatus ?? '',
      copyFileStorageStatus: schedulerJob.copyFileStorageStatus ?? '',
      lastRunningTime: schedulerJob.lastRunningTime
    };
  }

  deleteSchedulerJob(jobId: string): void {
    this.apiSchedulerService.delete(jobId).subscribe(
      () => {
        this.snackBarService.showInfo('DELETE_SCHEDULE_JOB_SUCCESS');
        this.getApiScheduler();
      },
      error => {
        this.snackBarService.showError(error);
      }
    );
  }

  isAllowViewApiScheduler(): Observable<boolean> {
    return this.verifyAuthentication(['gssnplusapischeduler.scheduler.read']);
  }

  isAllowEditApiScheduler(): Observable<boolean> {
    return this.verifyAuthentication(['gssnplusapischeduler.scheduler.update']);
  }

  isAllowViewXmlScheduler(): Observable<boolean> {
    return this.verifyAuthentication(['gssnplusxmlscheduler.scheduler.read']);
  }

  isAllowEditXmlScheduler(): Observable<boolean> {
    return this.verifyAuthentication(['gssnplusxmlscheduler.scheduler.update']);
  }

  isAllowViewAuditLogCleanScheduler(): Observable<boolean> {
    return this.verifyAuthentication(['iam.housekeep.read']);
  }

  private verifyAuthentication(permissions: string[]): Observable<boolean> {
    return this.userAuthorizationService.isAuthorizedFor.permissions(permissions).verify();
  }
}
