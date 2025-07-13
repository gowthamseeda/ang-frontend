import { Component, Input } from '@angular/core';

import { CommunicationDataDiffData, GeneralCommunicationDataDiff } from '../../../task.model';

@Component({
  selector: 'gp-task-diff-general-communication',
  templateUrl: './task-diff-general-communication.component.html',
  styleUrls: ['./task-diff-general-communication.component.scss']
})
export class TaskDiffGeneralCommunicationComponent {
  @Input() taskDiff: GeneralCommunicationDataDiff;
  @Input() languageId: string;

  valueChanged(diff: CommunicationDataDiffData): boolean {
    return diff.old !== diff.new;
  }
}
