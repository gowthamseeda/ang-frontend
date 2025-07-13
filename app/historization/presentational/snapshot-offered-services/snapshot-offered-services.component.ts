import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import _ from 'lodash';
import { FeatureToggleService } from '../../../shared/directives/feature-toggle/feature-toggle.service';
import { FEATURE_NAMES } from '../../../shared/model/constants';
import { DetailSnapshotMasterDataDescriptor } from '../../models/master-data-history-snapshot.model';
import { OfferedService, SnapshotChanges } from '../../models/outlet-history-snapshot.model';
import { DetailOfferedServiceComponent } from '../detail-offered-service/detail-offered-service.component';
import { DetailSnapshotMasterDataComponent } from '../detail-snapshot-master-data/detail-snapshot-master-data.component';

@Component({
  selector: 'gp-snapshot-offered-services',
  templateUrl: './snapshot-offered-services.component.html',
  styleUrls: ['./snapshot-offered-services.component.scss']
})
export class SnapshotOfferedServicesComponent implements OnInit {
  @Input()
  selectedDate: string;

  @Input()
  currentOfferedServices: OfferedService[];

  @Input()
  comparingOfferedServices?: OfferedService[];

  @Input()
  changes?: SnapshotChanges[];

  @Input()
  displayChangesToggleInput: boolean;

  @Input()
  hideEditorsToggleInput: boolean;

  @Input()
  showChangeOnlyToggleInput: boolean;

  @Input()
  hideExtraInformationToggleInput: boolean

  @Input()
  moveOutletInitiator: string = '';

  @Input()
  isMoveOutlet: boolean = false;
  masterDataChangesFeatureToggle = false;

  systemUserID = 'System';

  constructor(
    private featureToggleService: FeatureToggleService,
    private matDialog: MatDialog
  ) {}

  getChangeData(
    fieldName: string,
    currentOfferedService: OfferedService
  ): SnapshotChanges | undefined {
    const searchFieldName = `offeredServices.${currentOfferedService.offeredServiceId}.${fieldName}`;
    return this.changes?.find(change => change.changedField === searchFieldName);
  }

  getChangeEditor(fieldName: string, currentOfferedService: OfferedService): string {
    return this.getChangeData(fieldName, currentOfferedService)?.userId || '';
  }

  isChanged(fieldName: string, currentOfferedService: OfferedService): boolean {
    return this.getChangeData(fieldName, currentOfferedService) !== undefined;
  }

  isArrayChanged(arrayFieldName: string, currentOfferedService: any): boolean {
    const currentComparingData = this.getCurrentComparingData(currentOfferedService);
    const currentArrayData = this.getFieldData(arrayFieldName, currentOfferedService);
    const currentComparingArrayData = this.getFieldData(arrayFieldName, currentComparingData);
    return JSON.stringify(currentArrayData) !== JSON.stringify(currentComparingArrayData);
  }

  isValidityChanged(currentOfferedService: OfferedService): boolean {
    let validityProperties: string[] = [
      'validity.application',
      'validity.applicationValidUntil',
      'validity.validFrom',
      'validity.validUntil',
      'validity.valid'
    ];

    for (const propertyName of validityProperties) {
      if (this.isChanged(propertyName, currentOfferedService)) {
        return true;
      }
    }

    return false;
  }

  /*
   * Use this function to compare array field changes from previous snapshot
   * If there is object's id, please remember pass in it to compare the object if compare its property
   * */
  isArrayFieldChangedFromComparingData(
    arrayFieldName: string,
    currentValue: any,
    currentOfferedService?: any
  ): boolean {
    const currentComparingData = this.getCurrentComparingData(currentOfferedService);
    const currentComparingArray = this.getFieldData(arrayFieldName, currentComparingData);

    const result = _.find(currentComparingArray, currentValue);

    return result === undefined;
  }

  getFieldData(fieldName: string, offeredService?: any): any | undefined {
    return _.get(offeredService, fieldName);
  }

  getCurrentComparingData(currentData: OfferedService) {
    return this.comparingOfferedServices?.find(
      comparingOfferedService =>
        comparingOfferedService.offeredServiceId === currentData.offeredServiceId
    );
  }

  getFieldDataFromComparingData(fieldName: string, currentOfferedService?: any): any | undefined {
    const currentComparingData = this.getCurrentComparingData(currentOfferedService);
    return this.getFieldData(fieldName, currentComparingData);
  }

  getArrayFieldDataFromComparingData(
    arrayFieldName: string,
    currentIdValue: any,
    propertyName: any,
    currentOfferedService?: any
  ): any | undefined {
    const currentComparingData = this.getCurrentComparingData(currentOfferedService);
    const currentComparingArray = this.getFieldData(arrayFieldName, currentComparingData);

    const obj = _.find(currentComparingArray, currentIdValue);
    const objValue = _.get(obj, propertyName);

    return objValue;
  }

  ngOnInit(): void {
    this.setHistorizationMasterDataToggle();
  }

  isFieldChangedCompareWholeData(currentOfferedService?: any): boolean {
    const currentComparingData = this.getCurrentComparingData(currentOfferedService);
    return JSON.stringify(currentOfferedService) !== JSON.stringify(currentComparingData);
  }

  viewOfferedServiceValidityDetail(outletId: string, offeredServiceId: string) {
    this.matDialog.open(DetailOfferedServiceComponent, {
      height: '45rem',
      width: '60%',
      data: {
        outletId: outletId,
        offeredServiceId: offeredServiceId,
        date: this.selectedDate
      }
    });
  }

  toggleMasterDataProductGroupDetail(productGroupId: string) {
    if (productGroupId) {
      const descriptor: DetailSnapshotMasterDataDescriptor = {
        fieldType: 'ProductGroupId',
        type: 'ProductGroup',
        fieldValue: productGroupId,
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

  toggleMasterDataByServiceId(serviceId: number) {
    const descriptor: DetailSnapshotMasterDataDescriptor = {
      fieldType: 'ServiceId',
      type: 'Service',
      fieldValue: serviceId,
      historyDate: this.selectedDate
    };
    this.matDialog.open(DetailSnapshotMasterDataComponent, {
      height: '45rem',
      width: '60%',
      data: {
        masterDataDescriptor: descriptor
      }
    })
  }

  private setHistorizationMasterDataToggle(): void {
    this.featureToggleService
      .isFeatureEnabled(FEATURE_NAMES.HISTORIZATION_MASTER_DATA)
      .subscribe(isEnabled => (this.masterDataChangesFeatureToggle = isEnabled));
  }
}
