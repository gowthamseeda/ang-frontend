import { Component, Input } from "@angular/core";
import { AuditLogCleanSchedulerStatus } from "../../model/scheduler.model";

@Component({
  selector: 'gp-user-task-clean-scheduler-status',
  templateUrl: './user-task-clean-scheduler-status.component.html',
  styleUrls: ['./user-task-clean-scheduler-status.component.scss']
})
export class UserTaskCleanSchedulerStatusComponent {
  @Input()
  jobDetails: AuditLogCleanSchedulerStatus[];

  displayedColumns: string[] = [
    'id',
    'name',
    'currentStatus',
    'lastRunningTime',
    'lastRunningStatus',
    'lastDeletedRecords'
  ];
}
