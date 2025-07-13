import { Component, Input, OnInit } from '@angular/core';

import { Outlet, SnapshotChanges } from '../../models/outlet-history-snapshot.model';
import { outletHistoryDataClusterFields } from '../../models/outlet-history-tree.constants';
import {
  DataClusterFields,
  OutletHistoryDataCluster
} from '../../models/outlet-history-tree.model';
import { MatDialog } from '@angular/material/dialog';
import { FEATURE_NAMES } from "../../../shared/model/constants";
import { FeatureToggleService } from "../../../shared/directives/feature-toggle/feature-toggle.service";
import { DetailSnapshotMasterDataDescriptor } from '../../models/master-data-history-snapshot.model';
import { DetailSnapshotMasterDataComponent } from '../detail-snapshot-master-data/detail-snapshot-master-data.component';

@Component({
  selector: 'gp-data-cluster-snapshot',
  templateUrl: './data-cluster-snapshot.component.html',
  styleUrls: ['./data-cluster-snapshot.component.scss']
})
export class DataClusterSnapshotComponent implements OnInit {
  @Input()
  selectedDate: string;

  @Input()
  isUserCountryPermitted: boolean;

  @Input()
  dataCluster: OutletHistoryDataCluster;

  @Input()
  currentSnapshot?: Outlet;

  @Input()
  comparingSnapshot?: Outlet;

  @Input()
  changes?: SnapshotChanges[];

  @Input()
  displayChangesToggleInput: boolean;

  @Input()
  hideEditorsToggleInput: boolean;

  @Input()
  showChangeOnlyToggleInput: boolean;

  @Input()
  hideAdditionalTranslationsToggleInput: boolean;

  @Input()
  hideExtraInformationToggleInput: boolean

  dataClusterFields?: DataClusterFields;

  skipEditorField: readonly string[] = ['additionalTranslations'];

  masterDataChangesFeatureToggle = false;

  isMoveOutlet: Boolean = false;

  moveOutletInitiator: string = '';

  constructor(
    private featureToggleService: FeatureToggleService,
    private matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.dataClusterFields = outletHistoryDataClusterFields[this.dataCluster];
    this.setHistorizationMasterDataToggle()
    this.cleanMoveOutletVariable()
    this.setMoveOutletVariable()
  }

  getChangeData(fieldName: string, parentFieldName?: string): SnapshotChanges | undefined {
    const searchFieldName = this.getFullCurrentFieldName(fieldName, parentFieldName);
    // we use "includes" to determine the data cluster with array data type such as offered service to be show or not
    // with the format of offeredServices.GS0001.validity.valid
    if (
      searchFieldName === 'offeredServices' ||
      searchFieldName === 'additionalTranslations' ||
      searchFieldName === 'communicationData'||
      searchFieldName === 'contractStatus'
    ) {
      return this.changes?.find(change => change.changedField.includes(searchFieldName));
    } else if (searchFieldName === 'outletRelationships') {
      return this.changes?.find(change => change.changedField.includes('outletRelationship'));
    } else if (searchFieldName === 'closeDownReason.name') {
      return this.changes?.find(change => change.changedField.includes('closeDownReason'));
    }
    return this.changes?.find(change => change.changedField === searchFieldName);
  }

  getFieldData(fieldName: string, nestedSnapshot?: any): any | undefined {
    return nestedSnapshot ? nestedSnapshot[fieldName] : this.currentSnapshot?.[fieldName];
  }

  getComparingFieldData(fieldName: string, comparingNestedSnapshot?: any): any | undefined {
    return comparingNestedSnapshot
      ? comparingNestedSnapshot[fieldName]
      : this.comparingSnapshot?.[fieldName];
  }

  isChanged(fieldName: string, parentFieldName?: string): boolean {
    if(fieldName === 'moveOutlet' && parentFieldName === 'assignedKeys'){
      return false
    }
    return this.getChangeData(fieldName, parentFieldName) !== undefined;
  }

  isValidMoveOutlet(fieldName: string, editorName: string): boolean {
    if(this.isMoveOutlet){
      if (
        fieldName === 'companyId' ||
        fieldName === 'legalName' ||
        fieldName === 'registeredOffice'
      ) {
        return true;
      } else if (editorName === 'System'){
        return true;
      }
    }
    return false;
  }

  skipEditorToDisplay(fieldName: string): boolean {
    return this.skipEditorField.includes(fieldName);
  }

  getFullCurrentFieldName(fieldName: string, parentFieldName?: string) {
    if (
      parentFieldName === 'companyLegalInfo' ||
      parentFieldName === 'businessSiteLegalInfo' ||
      parentFieldName === 'offeredServices' ||
      parentFieldName === 'assignedKeys' ||
      parentFieldName === 'assignedLabels' ||
      parentFieldName === 'generalCommunicationData' ||
      parentFieldName === 'outletRelationship'
    ) {
      return fieldName;
    }
    return parentFieldName ? `${parentFieldName}.${fieldName}` : fieldName;
  }

  getChangeEditor(fieldName: string, parentFieldName?: string): string {
    return this.getChangeData(fieldName, parentFieldName)?.userId || '';
  }

  shouldDisplayFieldName(fieldName: string, hideFieldNameToggle: boolean[]): boolean {
    return !this.getToggleBy(fieldName, hideFieldNameToggle);
  }

  getToggleBy(fieldName: string, hideFieldNameToggle: boolean[]): boolean {
    switch (fieldName) {
      case 'additionalTranslations':
        return hideFieldNameToggle[0];
      case 'offeredServices':
        if (this.currentSnapshot?.offeredServices?.length === 0) {
          return false;
        }
        return true;
      default:
        return false;
    }
  }

  toggleMasterDataByCountryId(countryId: string) {
    const descriptor: DetailSnapshotMasterDataDescriptor = {
      fieldType: 'CountryId',
      type: 'Country',
      fieldValue: countryId,
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
    this.featureToggleService.isFeatureEnabled(FEATURE_NAMES.HISTORIZATION_MASTER_DATA).subscribe(
      isEnabled => this.masterDataChangesFeatureToggle = isEnabled
    );
  }

  toggleMasterDataByLanguageId(languageId: string) {
    if(languageId) {
      const descriptor: DetailSnapshotMasterDataDescriptor = {
        fieldType: 'LanguageId',
        type: 'Language',
        fieldValue: languageId,
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

  toggleMasterDataByCloseDownReasonId(closeDownReasonId: number) {
    var descriptor: DetailSnapshotMasterDataDescriptor = {
      fieldType: 'CloseDownReasonId',
      type: 'CloseDownReason',
      fieldValue: closeDownReasonId,
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

  cleanMoveOutletVariable() {
    this.isMoveOutlet = false;
    this.moveOutletInitiator = '';
  }

  setMoveOutletVariable() {
    const snapshotChanges = this.changes?.find(change => change.changedField === 'moveOutlet');
    if (snapshotChanges) {
      this.isMoveOutlet = true;
      this.moveOutletInitiator = snapshotChanges.userId || '';
    }
  }
}
