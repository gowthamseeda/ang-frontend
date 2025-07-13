import { Component, Input, OnInit } from '@angular/core';
import _ from 'lodash';
import {
  AdditionalTranslationCheck,
  BusinessName,
  OutletTranslation,
  SnapshotChanges
} from '../../models/outlet-history-snapshot.model';
import { FEATURE_NAMES } from "../../../shared/model/constants";
import { FeatureToggleService } from "../../../shared/directives/feature-toggle/feature-toggle.service";
import { MatDialog } from "@angular/material/dialog";
import { DetailSnapshotMasterDataDescriptor } from "../../models/master-data-history-snapshot.model";
import { DetailSnapshotMasterDataComponent } from "../detail-snapshot-master-data/detail-snapshot-master-data.component";

@Component({
  selector: 'gp-snapshot-additional-translations',
  templateUrl: './snapshot-additional-translations.component.html',
  styleUrls: ['./snapshot-additional-translations.component.scss']
})
export class SnapshotAdditionalTranslationsComponent implements OnInit {
  @Input()
  selectedDate: string;

  @Input()
  currentAdditionalTranslations: { [key: string]: OutletTranslation };

  @Input()
  comparingAdditionalTranslations?: { [key: string]: OutletTranslation };

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

  objectKeys = Object.keys;

  masterDataChangesFeatureToggle = false;

  legalNameField = "legalName";

  constructor(
    private featureToggleService: FeatureToggleService,
    private matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.setHistorizationMasterDataToggle();
  }

  isFieldChanged(languageId: string, fieldName: string): boolean {
    if (this.changes === undefined) {
      return false;
    }

    let searchFieldName = `additionalTranslations.${languageId}.${fieldName}`;

    if (fieldName === 'businessNames') {
      searchFieldName = `businessNames.translations.${languageId}`;
    }

    return this.changes?.some(change => change.changedField === searchFieldName);
  }

  getChangeEditor(key: string, fieldName: string): string {
    if (this.changes === undefined) {
      return '';
    }

    let searchFieldName = `additionalTranslations.${key}.${fieldName}`;

    if (fieldName === 'businessNames') {
      searchFieldName = `businessNames.translations.${key}`;
    }

    let foundChanges = this.changes?.find(change => {
      return change.changedField === searchFieldName;
    });

    if (foundChanges !== undefined) {
      return  foundChanges.userId;
    } else {
      return '';
    }
  }

  displayFieldValueBasedOnToggle(key: string, fieldName: string): string {
    const currentData = this.transform(
      this.getFieldData(fieldName, this.currentAdditionalTranslations?.[key])
    );
    const previousData = this.transform(
      this.getFieldData(fieldName, this.comparingAdditionalTranslations?.[key])
    );

    if (this.displayChangesToggleInput && this.isFieldChanged(key, fieldName)) {
      return '[' + previousData + '] => ' + '[' + currentData + ']';
    }

    return currentData;
  }

  displayBusinessNameFieldValueBasedOnToggle(
    key: string,
    fieldName: string,
    currentBusinessName: BusinessName
  ): string {
    const currentFieldValue = currentBusinessName[fieldName];

    if (this.displayChangesToggleInput && this.isFieldChanged(key, 'businessNames')) {
      return (
        '[' +
        this.transform(
          this.getFieldData(
            fieldName,
            this.getBusinessNameCurrentComparingData(currentBusinessName, key)
          )
        ) +
        '] => ' +
        '[' +
        this.transform(currentFieldValue) +
        ']'
      );
    }

    return currentFieldValue;
  }

  getFieldData(fieldName: string, additionalTranslations?: any): any | undefined {
    return _.get(additionalTranslations, fieldName);
  }

  transform(value: any): any {
    return value === undefined ||
      value === null ||
      value === '' ||
      (Array.isArray(value) && value.length == 0)
      ? '-'
      : value;
  }

  getBusinessNameCurrentComparingData(currentData: BusinessName, key: string) {
    return this.comparingAdditionalTranslations?.[key]?.businessNames?.find(
      comparingBusinessName => {
        return (
          currentData.businessName === comparingBusinessName.businessName ||
          currentData.brandId === comparingBusinessName.brandId
        );
      }
    );
  }

  isAdditionalTranslationsFieldChanged(locals: AdditionalTranslationCheck): boolean {
    return (
      locals.isLegalNameFieldChanged ||
      locals.isNameAdditionFieldChanged ||
      locals.isAddressStreetFieldChanged ||
      locals.isAddressStreetNumberFieldChanged ||
      locals.isAddressCityFieldChanged ||
      locals.isAddressDistrictFieldChanged ||
      locals.isAddressAdditionFieldChanged ||
      locals.isPoBoxCityFieldChanged ||
      locals.isProvinceFieldChanged ||
      locals.isStateFieldChanged ||
      locals.isBusinessNamesFieldChanged
    );
  }

  private setHistorizationMasterDataToggle(): void {
    this.featureToggleService.isFeatureEnabled(FEATURE_NAMES.HISTORIZATION_MASTER_DATA)
      .subscribe(isEnabled => this.masterDataChangesFeatureToggle = isEnabled);
  }

  toggleMasterDataLanguageDetail(languageId: string) {
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
}
