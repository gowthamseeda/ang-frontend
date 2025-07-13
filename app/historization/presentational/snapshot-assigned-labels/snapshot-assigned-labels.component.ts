import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import _ from 'lodash';
import { FeatureToggleService } from '../../../shared/directives/feature-toggle/feature-toggle.service';
import { FEATURE_NAMES } from '../../../shared/model/constants';
import { DetailSnapshotMasterDataDescriptor } from '../../models/master-data-history-snapshot.model';
import { BrandLabels, SnapshotChanges } from '../../models/outlet-history-snapshot.model';
import { DetailSnapshotMasterDataComponent } from '../detail-snapshot-master-data/detail-snapshot-master-data.component';

@Component({
  selector: 'gp-snapshot-assigned-labels',
  templateUrl: './snapshot-assigned-labels.component.html',
  styleUrls: ['./snapshot-assigned-labels.component.scss']
})
export class SnapshotAssignedLabelsComponent implements OnInit {
  @Input()
  selectedDate: string;

  @Input()
  currentLabels: BrandLabels[] | undefined;

  @Input()
  comparingLabels: BrandLabels[] | undefined;

  @Input()
  changes?: SnapshotChanges[];

  @Input()
  displayChangesToggleInput: boolean;

  @Input()
  showChangeOnlyToggleInput: boolean;
  masterDataChangesFeatureToggle: boolean = false;
  constructor(private featureToggleService: FeatureToggleService, private matDialog: MatDialog) {}

  isChanged() {
    return !!this.changes?.find(change => change.changedField.includes('brandLabels'));
  }

  isFieldChangedFromComparingData(fieldName: string, currentLabel?: any): boolean {
    const current = JSON.stringify(this.getFieldData(fieldName, currentLabel));
    const currentComparingData = this.getCurrentComparingData(currentLabel);
    const comparing = JSON.stringify(this.getFieldData(fieldName, currentComparingData));

    return current !== comparing;
  }

  getFieldData(fieldName: string, label?: any): any | undefined {
    return _.get(label, fieldName);
  }

  getCurrentComparingData(currentData: BrandLabels) {
    return this.comparingLabels?.find(
      comparingLabels => comparingLabels.brandId === currentData.brandId
    );
  }

  getFieldDataFromComparingData(fieldName: string, currentLabel?: any): any | undefined {
    const currentComparingData = this.getCurrentComparingData(currentLabel);
    return this.getFieldData(fieldName, currentComparingData);
  }

  ngOnInit(): void {
    this.setHistorizationMasterDataToggle();
  }

  isFieldChangedCompareWholeData(currentLabel?: any): boolean {
    const currentComparingData = this.getCurrentComparingData(currentLabel);
    return JSON.stringify(currentLabel) !== JSON.stringify(currentComparingData);
  }

  toggleMasterDataByBrandId(brandId: string) {
    const descriptor: DetailSnapshotMasterDataDescriptor = {
      fieldType: 'BrandId',
      type: 'Brand',
      fieldValue: brandId,
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

  private setHistorizationMasterDataToggle(): void {
    this.featureToggleService
      .isFeatureEnabled(FEATURE_NAMES.HISTORIZATION_MASTER_DATA)
      .subscribe(isEnabled => (this.masterDataChangesFeatureToggle = isEnabled));
  }

  toggleMasterDataLabelDetail(labelId: string | undefined) {
    if (labelId) {
      const descriptor: DetailSnapshotMasterDataDescriptor = {
        fieldType: 'LabelId',
        type: 'Label',
        fieldValue: labelId,
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
