import { Component, Input } from '@angular/core';
import { AuditLogCleanSchedulerJob } from 'app/scheduler/model/scheduler.model';

@Component({
  selector: 'gp-audit-log-clean-scheduler-table',
  templateUrl: './audit-log-clean-scheduler-table.component.html',
  styleUrls: ['./audit-log-clean-scheduler-table.component.scss']
})
export class AuditLogCleanSchedulerTableComponent {

  @Input()
  jobDetails: AuditLogCleanSchedulerJob[];

  displayedColumns: string[] = [
    'name',
    'currentStatus',
    'schedule',
    'lastCleanTime',
    'lastCleanStatus',
    'lastDeleteRecords'
  ];

}
