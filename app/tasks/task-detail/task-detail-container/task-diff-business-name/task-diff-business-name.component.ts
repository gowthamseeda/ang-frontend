import { Component, Input } from '@angular/core';
//import { BusinessNameDiff, BusinessNameDiffData, TaskDiffData } from 'app/tasks/task.model';

import { TaskDiffService } from '../../task-diff.service';
import { BusinessNameDiff, BusinessNameDiffData, TaskDiffData } from '../../../task.model';

@Component({
  selector: 'gp-task-diff-business-name',
  templateUrl: './task-diff-business-name.component.html',
  styleUrls: ['./task-diff-business-name.component.scss']
})
export class TaskDiffBusinessNameComponent {
  taskOld: TaskDiffData;
  taskNew: TaskDiffData;
  isEmptyOldTask: Boolean;
  isEmptyNewTask: Boolean;
  defaultEmptyValue = '-';

  private diffNew: TaskDiffData;
  private diffOld: TaskDiffData;

  @Input() set taskDiff(taskDiff: BusinessNameDiff) {
    this.taskOld = this.adjustDiff(taskDiff.old);
    this.taskNew = this.adjustDiff(taskDiff.new);
    this.isEmptyOldTask = taskDiff.old.length === 0;
    this.isEmptyNewTask = taskDiff.new.length === 0;
    this.diffNew = this.taskDiffService.diff(this.taskOld, this.taskNew);
    this.diffOld = this.taskDiffService.removedDiff(this.taskOld, this.taskNew);
  }

  constructor(private taskDiffService: TaskDiffService) {}

  highlighted(key: string, mode: string): boolean {
    return this.taskDiffService.highlighted(key, mode === 'old' ? this.diffOld : this.diffNew);
  }

  emptyDiff(): boolean {
    return Object.keys(this.taskOld).length === 0 && Object.keys(this.taskNew).length === 0;
  }

  private adjustDiff(taskDiff: BusinessNameDiffData[]): TaskDiffData {
    let adjustedDiff: TaskDiffData = {};

    Object.values(taskDiff).map((task: BusinessNameDiffData): void => {
      if (adjustedDiff[task.businessName]) {
        adjustedDiff[task.businessName] = [...adjustedDiff[task.businessName], task.brandId];
      } else {
        adjustedDiff = {
          ...adjustedDiff,
          [task.businessName]: [task.brandId]
        };
      }
    });
    return adjustedDiff;
  }
}
