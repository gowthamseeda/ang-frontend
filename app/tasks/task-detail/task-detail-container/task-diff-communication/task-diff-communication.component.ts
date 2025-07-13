import { Component, Input } from '@angular/core';

import {CommunicationData, CommunicationDataDiff, CommunicationDataDiffData} from '../../../task.model';

@Component({
  selector: 'gp-task-diff-communication',
  templateUrl: './task-diff-communication.component.html',
  styleUrls: ['./task-diff-communication.component.scss']
})
export class TaskDiffCommunicationComponent {
  @Input() taskDiff: CommunicationDataDiff;
  @Input() languageId: string;

  valueChanged(diff: CommunicationDataDiffData): boolean {
    return diff.old !== diff.new;
  }

  getTranslatedServiceName(data: CommunicationData): string {
    const serviceNameTranslation = data.serviceNameTranslations?.find(
      i => i.languageId === this.languageId
    );

    return serviceNameTranslation?.name ?? data.serviceName ?? data.offeredServiceId ?? '';
  }
}
