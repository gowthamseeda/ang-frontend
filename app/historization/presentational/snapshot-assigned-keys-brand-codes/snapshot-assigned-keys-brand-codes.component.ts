import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import _ from 'lodash';
import { FeatureToggleService } from '../../../shared/directives/feature-toggle/feature-toggle.service';
import { FEATURE_NAMES } from '../../../shared/model/constants';
import { DetailSnapshotMasterDataDescriptor } from '../../models/master-data-history-snapshot.model';
import { BrandCodes, SnapshotChanges } from '../../models/outlet-history-snapshot.model';
import { DetailSnapshotMasterDataComponent } from '../detail-snapshot-master-data/detail-snapshot-master-data.component';

@Component({
  selector: 'gp-snapshot-assigned-keys-brand-codes',
  templateUrl: './snapshot-assigned-keys-brand-codes.component.html',
  styleUrls: ['./snapshot-assigned-keys-brand-codes.component.scss']
})
export class SnapshotAssignedKeysBrandCodesComponent implements OnInit {
  @Input()
  selectedDate: string;
  
  @Input()
  currentBrandCodes: BrandCodes[] | undefined;

  @Input()
  comparingBrandCodes: BrandCodes[] | undefined;

  @Input()
  changes?: SnapshotChanges[];

  @Input()
  displayChangesToggleInput: boolean;

  @Input()
  showChangeOnlyToggleInput: boolean;
  masterDataChangesFeatureToggle: boolean;

  constructor(private featureToggleService: FeatureToggleService, private matDialog: MatDialog) {}

  isFieldChangedFromComparingData(fieldName: string, currentBrandCode?: any): boolean {
    const current = JSON.stringify(this.getFieldData(fieldName, currentBrandCode));
    const currentComparingData = this.getCurrentComparingData(currentBrandCode);
    const comparing = JSON.stringify(this.getFieldData(fieldName, currentComparingData));

    return current !== comparing;
  }

  getFieldData(fieldName: string, brandCode?: any): any | undefined {
    return _.get(brandCode, fieldName);
  }

  getCurrentComparingData(currentData: BrandCodes) {
    return this.comparingBrandCodes?.find(
      comparingBrandCode => comparingBrandCode.brandId === currentData.brandId
    );
  }

  getFieldDataFromComparingData(fieldName: string, currentBrandCode?: any): any | undefined {
    const currentComparingData = this.getCurrentComparingData(currentBrandCode);
    return this.getFieldData(fieldName, currentComparingData);
  }

  ngOnInit(): void {
    this.setHistorizationMasterDataToggle();
  }

  isFieldChangedCompareWholeData(currentBrandCode?: any): boolean {
    const currentComparingData = this.getCurrentComparingData(currentBrandCode);
    return JSON.stringify(currentBrandCode) !== JSON.stringify(currentComparingData);
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
}
