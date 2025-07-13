import { Component, Input, OnInit } from '@angular/core';
import _ from 'lodash';
import { CommunicationData, SnapshotChanges } from '../../models/outlet-history-snapshot.model';

@Component({
  selector: 'gp-snapshot-general-communications',
  templateUrl: './snapshot-general-communications.component.html',
  styleUrls: ['./snapshot-general-communications.component.scss']
})
export class SnapshotGeneralCommunicationsComponent implements OnInit {
  @Input()
  currentGeneralCommunications: CommunicationData[] | undefined;

  @Input()
  comparingGeneralCommunications: CommunicationData[] | undefined;

  @Input()
  changes?: SnapshotChanges[];

  @Input()
  displayChangesToggleInput: boolean;

  @Input()
  hideEditorsToggleInput: boolean;

  @Input()
  showChangeOnlyToggleInput: boolean;

  constructor() {}

  ngOnInit(): void {}

  getSnapshotChangeData(communicationData: CommunicationData): SnapshotChanges | undefined {
    var searchFieldName;
    if (communicationData.brandId !== undefined) {
      searchFieldName = `communicationData.${communicationData.brandId}.${communicationData.communicationFieldId}`;
    } else {
      searchFieldName = `communicationData.${communicationData.communicationFieldId}`;
    }
    return this.changes?.find(change => change.changedField === searchFieldName);
  }

  getChangeEditor(currentCommunicationData: CommunicationData): string {
    return this.getSnapshotChangeData(currentCommunicationData)?.userId || '';
  }

  isChanged(currentCommunicationData: CommunicationData): boolean {
    return this.getSnapshotChangeData(currentCommunicationData) !== undefined;
  }

  getFieldData(fieldName: string, generalCommunication?: any): any | undefined {
    return _.get(generalCommunication, fieldName);
  }

  getCurrentComparingData(currentData: CommunicationData) {
    return this.comparingGeneralCommunications?.find(comparingGeneralCommunication => {
      const { communicationFieldId: newCommunicationFieldId, brandId: newBrandId } = currentData;
      const { communicationFieldId: oldCommunicationFieldId, brandId: oldBrandId } =
        comparingGeneralCommunication;
      return newCommunicationFieldId === oldCommunicationFieldId && newBrandId === oldBrandId;
    });
  }

  getFieldDataFromComparingData(
    fieldName: string,
    currentGeneralCommunication?: any
  ): any | undefined {
    const currentComparingData = this.getCurrentComparingData(currentGeneralCommunication);
    return this.getFieldData(fieldName, currentComparingData);
  }
}
