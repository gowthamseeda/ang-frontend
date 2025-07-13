import { Component, Input, OnInit } from '@angular/core';

import { TaskDiffService } from '../../task-diff.service';
import { TaskDiff } from '../../../task.model';
import { TaskDiffData } from '../../../task.model';

@Component({
  selector: 'gp-task-diff-default',
  templateUrl: './task-diff-default.component.html',
  styleUrls: ['./task-diff-default.component.scss']
})
export class TaskDiffDefaultComponent implements OnInit {
  @Input() taskDiff: TaskDiff;
  @Input() fieldName: string | null = null;

  diffDisplay: TaskDiff = { old: {}, new: {} };
  diffData: TaskDiffData;

  constructor(private taskDiffService: TaskDiffService) {}

  ngOnInit(): void {
    if (!this.fieldName) {
      this.diffData = this.taskDiffService.diff(this.taskDiff?.old, this.taskDiff?.new);
      Object.keys({ ...this.taskDiff.old, ...this.taskDiff.new }).map(key => {
        this.diffDisplay.old[key] = this.taskDiff.old[key];
        this.diffDisplay.new[key] = this.taskDiff.new[key];
      });
    }
  }

  highlighted(key: string): boolean {
    return this.taskDiffService.highlighted(key, this.diffData);
  }

  emptyDiff(): boolean {
    if (!this.fieldName) {
      return Object.keys(this.diffData).length === 0
    } else {
      return !this.taskDiff
    }
  }
}
