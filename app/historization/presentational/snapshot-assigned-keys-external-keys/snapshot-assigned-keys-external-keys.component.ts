import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import _, { isEqual } from 'lodash';
import { FeatureToggleService } from '../../../shared/directives/feature-toggle/feature-toggle.service';
import { FEATURE_NAMES } from '../../../shared/model/constants';
import { DetailSnapshotMasterDataDescriptor } from '../../models/master-data-history-snapshot.model';
import { ExternalKeys, SnapshotChanges } from '../../models/outlet-history-snapshot.model';
import { DetailSnapshotMasterDataComponent } from '../detail-snapshot-master-data/detail-snapshot-master-data.component';

@Component({
  selector: 'gp-snapshot-assigned-keys-external-keys',
  templateUrl: './snapshot-assigned-keys-external-keys.component.html',
  styleUrls: ['./snapshot-assigned-keys-external-keys.component.scss']
})
export class SnapshotAssignedKeysExternalKeysComponent implements OnInit {
  @Input()
  selectedDate: string;
  
  @Input()
  currentExternalKeys: ExternalKeys[] | undefined;

  @Input()
  comparingExternalKeys: ExternalKeys[] | undefined;

  @Input()
  changes?: SnapshotChanges[];

  @Input()
  displayChangesToggleInput: boolean;

  @Input()
  showChangeOnlyToggleInput: boolean;
  masterDataChangesFeatureToggle: boolean = false;

  constructor(private featureToggleService: FeatureToggleService, private matDialog: MatDialog) {}

  isChanged() {
    return !!this.changes?.find(change => change.changedField.includes('externalKeys'));
  }

  isFieldChangedFromComparingData(fieldName: string, currentBrandCode?: any): boolean {
    const current = JSON.stringify(this.getFieldData(fieldName, currentBrandCode));
    const currentComparingData = this.getCurrentComparingData(currentBrandCode);
    const comparing = JSON.stringify(this.getFieldData(fieldName, currentComparingData));

    return current !== comparing;
  }

  getFieldData(fieldName: string, brandCode?: any): any | undefined {
    return _.get(brandCode, fieldName);
  }

  getCurrentComparingData(currentData: ExternalKeys) {
    return this.comparingExternalKeys?.find(comparingBrandCode =>
      isEqual(comparingBrandCode, currentData)
    );
  }

  getFieldDataFromComparingData(fieldName: string, currentBrandCode?: any): any | undefined {
    const currentComparingData = this.getCurrentComparingData(currentBrandCode);
    return this.getFieldData(fieldName, currentComparingData);
  }

  ngOnInit(): void {
    this.setHistorizationMasterDataToggle();
  }

  isFieldChangedCompareWholeData(currentExternalKey?: any): boolean {
    const currentComparingData = this.getCurrentComparingData(currentExternalKey);
    return JSON.stringify(currentExternalKey) !== JSON.stringify(currentComparingData);
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

  toggleMasterDataByKeyTypeId(keyTypeId: string) {
    var descriptor: DetailSnapshotMasterDataDescriptor = {
      fieldType: 'KeyTypeId',
      type: 'KeyType',
      fieldValue: keyTypeId,
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
}
