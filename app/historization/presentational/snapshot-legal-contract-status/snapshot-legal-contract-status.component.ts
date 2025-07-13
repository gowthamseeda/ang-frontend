import { Component, Input } from '@angular/core';
import _ from 'lodash';
import { LegalContractStatus, SnapshotChanges } from '../../models/outlet-history-snapshot.model';

@Component({
  selector: 'gp-snapshot-legal-contract-status',
  templateUrl: './snapshot-legal-contract-status.component.html',
  styleUrls: ['./snapshot-legal-contract-status.component.scss']
})
export class SnapshotLegalContractStatusComponent {
  @Input()
  currentContractStatuses: LegalContractStatus[];

  @Input()
  comparingContractStatuses?: LegalContractStatus[];

  @Input()
  hideEditorsToggleInput: boolean;

  @Input()
  changes?: SnapshotChanges[];

  @Input()
  displayChangesToggleInput: boolean;

  @Input()
  showChangeOnlyToggleInput: boolean;

  @Input()
  moveOutletInitiator: string = '';

  @Input()
  isMoveOutlet: boolean = false;

  systemUserID = 'System';

  getFieldData(fieldName: string, contractStatus?:LegalContractStatus): any | undefined {
    return _.get(contractStatus, fieldName);
  }

  getComparingData(currentData?: LegalContractStatus) {
    return this.comparingContractStatuses?.find(
      comparingContractStatus =>
      comparingContractStatus.id === currentData?.id
    );
  }

  isFieldChangedCompareWholeData(currentContractStatus?: LegalContractStatus): boolean {
    const comparingData = this.getComparingData(currentContractStatus);
    return JSON.stringify(currentContractStatus) !== JSON.stringify(comparingData);
  }

  getChangeData(
    contractStatusKey: string
  ): SnapshotChanges | undefined {
    return this.changes?.find(change => change.changedField === `contractStatus.${contractStatusKey}`);
  }

  getChangeEditor(contractStatusKey: string): string {
    return this.getChangeData(contractStatusKey)?.userId || '';
  }

  isChanged(contractStatusKey: string): boolean {
    return this.getChangeData(contractStatusKey) !== undefined;
  }

  getFieldDataFromComparingData(fieldName: string, currentContractStatus: LegalContractStatus): any | undefined {
    const comparingData = this.getComparingData(currentContractStatus);
    return this.getFieldData(fieldName, comparingData);
  }
}
