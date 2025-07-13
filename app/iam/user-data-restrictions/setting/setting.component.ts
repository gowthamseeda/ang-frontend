import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

import { DataRestrictionType } from '../services/user-data-restrictions/data-restrictions-type.model';
import { UpdateUserDataRestrictions } from '../services/user-data-restrictions/user-data-restrictions.model';
import { UserDataRestrictionsService } from '../services/user-data-restrictions/user-data-restrictions.service';
import { UserDataRestrictionMapperService } from '../../shared/services/user-data-restriction-mapper/user-data-restriction-mapper.service';
import { SnackBarService } from '../../../shared/services/snack-bar/snack-bar.service';

@Component({
  selector: 'gp-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit, OnDestroy {
  @Input()
  userId: string;

  @Input()
  focusFeatureToggleFlag: Observable<boolean>;

  groupType: string;
  tenantDataRestrictionValues: string[];
  languageDataRestrictionValues: string[];
  countryDataRestrictionValues: string[];
  brandDataRestrictionValues: string[];
  productGroupDataRestrictionValues: string[];
  distributionLevelDataRestrictionValues: string[];
  businessSiteDataRestrictionValues: string[];
  serviceDataRestrictionValues: string[];
  focusProductGroupDataRestrictionValues: string[];
  isError = false;
  isLoading = false;
  parentForm: UntypedFormGroup;
  currentIgnoreFocusProductGroupFlag: boolean;
  ignoreFocusProductGroupFlagToggle: boolean;

  private unsubscribe = new Subject<void>();

  constructor(
    private userDataRestrictionsService: UserDataRestrictionsService,
    private snackBarService: SnackBarService,
    private formBuilder: UntypedFormBuilder,
    private userDataRestrictionMapperService: UserDataRestrictionMapperService
  ) {}

  ngOnInit(): void {
    this.initFormGroup();
    this.initData();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onSubmit(): void {
    this.isLoading = true;

    const userDataRestrictions: UpdateUserDataRestrictions = {
      tenantIds: this.tenantDataRestrictionValues,
      languageIds: this.languageDataRestrictionValues,
      countryIds: this.countryDataRestrictionValues,
      brandIds: this.brandDataRestrictionValues,
      productGroupIds: this.productGroupDataRestrictionValues,
      distributionLevelIds: this.distributionLevelDataRestrictionValues,
      businessSiteIds: this.businessSiteDataRestrictionValues,
      serviceIds: this.serviceDataRestrictionValues,
      ignoreFocusProductGroup: this.ignoreFocusProductGroupFlagToggle
    };

    this.userDataRestrictionsService
      .update(this.userId, userDataRestrictions)
      .pipe(
        takeUntil(this.unsubscribe),
        finalize(() => (this.isLoading = false))
      )
      .subscribe(
        () => {
          this.snackBarService.showInfo('DATARESTRICTIONS_SUCCESS');
          this.currentIgnoreFocusProductGroupFlag = this.ignoreFocusProductGroupFlagToggle;
        },
        error => {
          this.snackBarService.showError(error);
        }
      );
  }

  toggle(): void {
    this.ignoreFocusProductGroupFlagToggle = !this.ignoreFocusProductGroupFlagToggle;
  }

  initFormGroup(): void {
    this.parentForm = this.formBuilder.group({
      ignoreFocusProductGroupFlagToggle: null
    });
  }

  initData(): void {
    this.userDataRestrictionsService
      .get(this.userId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        userDataRestrictions => {
          this.groupType = userDataRestrictions.groupType;
          this.ignoreFocusProductGroupFlagToggle = this.currentIgnoreFocusProductGroupFlag =
            userDataRestrictions.ignoreFocusProductGroup;
          this.updateToggleValue();

          this.tenantDataRestrictionValues =
            this.userDataRestrictionMapperService.getDataRestrictionValues(
              userDataRestrictions.assignedDataRestrictions,
              DataRestrictionType.TENANT
            );
          this.languageDataRestrictionValues =
            this.userDataRestrictionMapperService.getDataRestrictionValues(
              userDataRestrictions.assignedDataRestrictions,
              DataRestrictionType.LANGUAGE
            );
          this.countryDataRestrictionValues =
            this.userDataRestrictionMapperService.getDataRestrictionValues(
              userDataRestrictions.assignedDataRestrictions,
              DataRestrictionType.COUNTRY.valueOf()
            );
          this.brandDataRestrictionValues =
            this.userDataRestrictionMapperService.getDataRestrictionValues(
              userDataRestrictions.assignedDataRestrictions,
              DataRestrictionType.BRAND
            );
          this.productGroupDataRestrictionValues =
            this.userDataRestrictionMapperService.getDataRestrictionValues(
              userDataRestrictions.assignedDataRestrictions,
              DataRestrictionType.PRODUCTGROUP
            );
          this.distributionLevelDataRestrictionValues =
            this.userDataRestrictionMapperService.getDataRestrictionValues(
              userDataRestrictions.assignedDataRestrictions,
              DataRestrictionType.DISTRIBUTIONLEVEL
            );
          this.businessSiteDataRestrictionValues =
            this.userDataRestrictionMapperService.getDataRestrictionValues(
              userDataRestrictions.assignedDataRestrictions,
              DataRestrictionType.BUSINESSSITE
            );
          this.serviceDataRestrictionValues =
            this.userDataRestrictionMapperService.getDataRestrictionValues(
              userDataRestrictions.assignedDataRestrictions,
              DataRestrictionType.SERVICE
            );
          this.focusProductGroupDataRestrictionValues =
            this.userDataRestrictionMapperService.getDataRestrictionValues(
              userDataRestrictions.assignedDataRestrictions,
              DataRestrictionType.FOCUSPRODUCTGROUP
            );
        },
        () => {
          this.isError = true;
        }
      );
  }

  private updateToggleValue(): void {
    this.parentForm.controls['ignoreFocusProductGroupFlagToggle'].setValue(
      this.ignoreFocusProductGroupFlagToggle
    );
  }
}
