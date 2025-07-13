import { Component, Input } from '@angular/core';

@Component({
  selector: 'gp-task-diff-item',
  templateUrl: './task-diff-item.component.html',
  styleUrls: ['./task-diff-item.component.scss']
})
export class TaskDiffItemComponent {
  @Input() title: string;
  @Input() value: string;
  @Input() customValue: boolean;

  constructor() {}
}
