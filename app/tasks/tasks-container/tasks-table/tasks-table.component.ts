import { Component, EventEmitter, Input, Output } from '@angular/core';

import { GroupedTask } from '../../grouped-task.model';

@Component({
  selector: 'gp-tasks-table',
  templateUrl: './tasks-table.component.html',
  styleUrls: ['./tasks-table.component.scss']
})
export class TasksTableComponent {
  @Input() groupedTasks: GroupedTask[];
  @Output() approve = new EventEmitter<number>();
  @Output() reject = new EventEmitter<number>();
  @Output() initTaskList = new EventEmitter<null>();
  @Output() saveExpandedStatus = new EventEmitter<any>();

  columnsToDisplay: string[] = [
    'expansionIndicator',
    'legalName',
    'address',
    'outletId',
    'brandCodes',
    'lastEdited'
  ];
}
