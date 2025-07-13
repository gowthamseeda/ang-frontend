import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { SchedulerTableRow, SchedulerType } from 'app/scheduler/model/scheduler.model';
import { iif, of, Subject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { mergeMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'gp-scheduler-table',
  templateUrl: './scheduler-table.component.html',
  styleUrls: ['./scheduler-table.component.scss']
})
export class SchedulerTableComponent implements OnInit, OnDestroy {
  unsubscribe = new Subject<void>();

  @Input()
  schedulerType: SchedulerType;
  @Input()
  schedulerJobs: Observable<SchedulerTableRow[]>;
  @Input()
  editable: Observable<boolean>;

  @Output()
  triggerRun: EventEmitter<SchedulerTableRow> = new EventEmitter<SchedulerTableRow>();
  @Output()
  deleteScheduler: EventEmitter<string> = new EventEmitter<string>();

  isDisabled: Observable<boolean>;

  displayedColumns: string[] = [
    'name',
    'jobParameters',
    'schedule',
    'active',
    'running',
    'lastRunningStatus',
    'copyFileStorageStatus',
    'lastRunningTime',
    'triggerJob',
    'deleteSchedule'
  ];

  constructor() {}

  ngOnInit(): void {
    if (this.schedulerType === SchedulerType.XML) {
      this.displayedColumns = this.displayedColumns.filter(
        c => c !== 'jobParameters' && c !== 'deleteSchedule'
      );
    }
    this.isDisabled = this.editable.pipe(
      mergeMap(isEditable => iif(() => isEditable, of(false), of(true))),
      takeUntil(this.unsubscribe)
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  requestRun(schedulerTableRow: SchedulerTableRow): void {
    this.triggerRun.emit(schedulerTableRow);
  }

  deleteScheduleJob(jobId: string): void {
    this.deleteScheduler.emit(jobId);
  }
}
