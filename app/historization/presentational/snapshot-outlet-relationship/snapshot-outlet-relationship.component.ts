import {Component, Input, OnInit} from '@angular/core';
import {Relationships, SnapshotChanges} from '../../models/outlet-history-snapshot.model';
import { MatDialog } from '@angular/material/dialog';
import _ from 'lodash';
import {FEATURE_NAMES} from "../../../shared/model/constants";
import {FeatureToggleService} from "../../../shared/directives/feature-toggle/feature-toggle.service";
import { DetailSnapshotMasterDataDescriptor } from '../../models/master-data-history-snapshot.model';
import { DetailSnapshotMasterDataComponent } from '../detail-snapshot-master-data/detail-snapshot-master-data.component';

@Component({
  selector: 'gp-snapshot-outlet-relationship',
  templateUrl: './snapshot-outlet-relationship.component.html',
  styleUrls: ['./snapshot-outlet-relationship.component.scss']
})
export class SnapshotOutletRelationshipComponent  implements OnInit {
  @Input()
  selectedDate: string;

  @Input()
  currentRelationships: Relationships[];

  @Input()
  comparingRelationships: Relationships[];

  @Input()
  changes?: SnapshotChanges[];

  @Input()
  hideEditorsToggleInput: boolean;

  @Input()
  displayChangesToggleInput: boolean;

  @Input()
  showChangeOnlyToggleInput: boolean;

  masterDataChangesFeatureToggle = false;
  constructor(private featureToggleService: FeatureToggleService, private matDialog: MatDialog) {}

  getFieldData(fieldName: string, outletRelationship?: Relationships): any | undefined {
    return _.get(outletRelationship, fieldName);
  }

  getComparingData(currentData: Relationships) {
    return this.comparingRelationships?.find(
      comparingOutletRelationship => comparingOutletRelationship.id === currentData.id
    );
  }

  ngOnInit(): void {
    this.setHistorizationMasterDataToggle()
  }

  private setHistorizationMasterDataToggle(): void {
    this.featureToggleService
      .isFeatureEnabled(FEATURE_NAMES.HISTORIZATION_MASTER_DATA)
      .subscribe(isEnabled => this.masterDataChangesFeatureToggle = isEnabled);
  }

  isFieldChangedCompareWholeData(currentOutletRelationship?: any): boolean {
    const comparingData = this.getComparingData(currentOutletRelationship);
    return JSON.stringify(currentOutletRelationship) !== JSON.stringify(comparingData);
  }

  getChangedData(outletRelationshipKey: string): SnapshotChanges | undefined {
    return this.changes?.find(changes => changes.changedField === `outletRelationship.${outletRelationshipKey}`);
  }

  getChangeEditor(outletRelationshipKey: string): string {
    return this.getChangedData(outletRelationshipKey)?.userId || '';
  }

  isChanged(outletRelationshipKey: string): boolean {
    return this.getChangedData(outletRelationshipKey) !== undefined;
  }

  getFieldDataFromComparingData(fieldName: string, outletRelationship?: any): any | undefined {
    const comparingData = this.getComparingData(outletRelationship);
    return this.getFieldData(fieldName, comparingData);
  }

  toggleMasterDataLabelDetail(outletRelationshipId: string | undefined) {
    if (outletRelationshipId) {
      const descriptor: DetailSnapshotMasterDataDescriptor = {
        fieldType: 'OutletRelationshipId',
        type: 'OutletRelationship',
        fieldValue: outletRelationshipId,
        historyDate: this.selectedDate
      };
      this.matDialog.open(DetailSnapshotMasterDataComponent, {
        height: '45rem',
        width: '60%',
        data: {
          masterDataDescriptor: descriptor
        }
      });
    }
  }
}
