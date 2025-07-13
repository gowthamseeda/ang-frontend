import { ComponentType } from '@angular/cdk/portal';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { combineLatest, Observable, Subject, of } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { UserAuthorizationService } from '../../../iam/user/user-authorization.service';
import { UserService } from '../../../iam/user/user.service';
import { OutletService } from '../../../legal-structure/shared/services/outlet.service';
import { FeatureToggleService } from '../../../shared/directives/feature-toggle/feature-toggle.service';
import { FEATURE_NAMES } from '../../../shared/model/constants';
import { intersectFilter } from '../../../shared/util/arrays';
import { DistributionLevelsService } from '../distribution-levels.service';

import { DistributionLevelSelectDialogComponent } from './distribution-level-select-dialog/distribution-level-select-dialog.component';

@Component({
  selector: 'gp-distribution-level-selection',
  templateUrl: './distribution-level-selection.component.html',
  styleUrls: ['./distribution-level-selection.component.scss']
})
export class DistributionLevelSelectionComponent implements OnInit, OnDestroy {
  @Input()
  control: UntypedFormControl;
  @Input()
  registeredOffice: boolean;
  @Input()
  outletId: string;
  @Input()
  testOutlet: boolean;
  @Input()
  productResponsible: boolean;
  @Input()
  marketResponsible: boolean;
  @Input()
  isEditPage: boolean = true;
  allEditable = true;
  distributionLevels: string[] = ['RETAILER', 'APPLICANT', 'WHOLESALER', 'MANUFACTURER'];
  editableDistributionLevels: string[] = [];
  originDistributionLevels: string[] = [];

  test_outlet: string = 'TEST_OUTLET';

  private unsubscribe = new Subject<void>();

  constructor(
    public dialogMat: MatDialog,
    private userService: UserService,
    private outletService: OutletService,
    private distributionLevelService: DistributionLevelsService,
    private userAuthorizationService: UserAuthorizationService,
    private featureToggleService: FeatureToggleService
  ) {}

  ngOnInit(): void {
    this.initDistributionLevels();
    this.outletService
      .outletChanges()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => this.initDistributionLevels());

    combineLatest([
      this.userService.getDistributionLevelRestrictions(),
      this.userService.getPermissions()
    ])
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(([levels, permissions]) => {
        if (permissions.includes('legalstructure.testoutlet.read')) {
          this.distributionLevels.push(this.test_outlet);
        }

        if (levels.length > 0) {
          this.editableDistributionLevels = levels.filter(intersectFilter(this.distributionLevels));
        } else {
          this.editableDistributionLevels = this.distributionLevels;
        }
      });
    if (this.testOutlet) {
      this.control.value.setValue(this.control.value.push(this.test_outlet));
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  removeDistributionLevel(distributionLevelToRemove: string, clickEvent: Event): void {
    clickEvent.stopPropagation();

    this.control.setValue(
      this.control.value.filter(
        (distributionLevel: string) => distributionLevel !== distributionLevelToRemove
      )
    );
    this.control.markAsDirty();
  }

  openDialog(): void {
    this.openSelectDialog(DistributionLevelSelectDialogComponent);
  }

  isEditable(distributionLevel: string): Boolean {
    if (
      this.allEditable &&
      this.editableDistributionLevels &&
      this.editableDistributionLevels.length === this.distributionLevels.length
    ) {
      return true;
    }

    if (!this.control.enabled) {
      return false;
    }

    return (
      this.editableDistributionLevels.includes(distributionLevel) &&
      (this.allEditable ||
        this.distributionLevelService.isDistributionLevelEditable(
          this.originDistributionLevels,
          distributionLevel
        ))
    );
  }

  isEmpty(): boolean {
    return (!this.control.value || this.control.value.length === 0) && !this.registeredOffice;
  }

  private openSelectDialog(componentOrTemplateRef: ComponentType<any>): void {
    this.dialogMat.open(componentOrTemplateRef, {
      data: {
        assignedDistributionLevelControl: this.control,
        distributionLevels: this.distributionLevels,
         editableDistributionLevels: this.productResponsible ? this.distributionLevels : (this.marketResponsible ? this.editableDistributionLevels : []),
         originDistributionLevels: this.originDistributionLevels,
         allEditable: this.allEditable,
         ...(this.marketResponsible ? {} : { testOutletUser: this.testOutlet}),
         productResponsibleUser: this.productResponsible,
         marketResponsibleUser: this.marketResponsible,
        isEditPage: this.isEditPage
      }
    });
  }

  private initDistributionLevels(): void {
    if (this.outletId && this.outletId !== '') {
      combineLatest([
        this.distributionLevelService.get(this.outletId),
        this.marketResponsible ? of(true) : this.verifyAuthentication(),
        this.verifyFeatureToggleStatus()
      ])
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(([distributionLevels, isEditable, isToggleOn]) => {
          this.originDistributionLevels = distributionLevels;
          if (distributionLevels && distributionLevels.length > 0) {
            this.allEditable = isEditable && isToggleOn;
          }
          this.control.patchValue(distributionLevels);
          this.control.markAsPristine();
        });
    }
  }

  private verifyAuthentication(): Observable<boolean> {
    return this.userAuthorizationService.isAuthorizedFor
      .permissions(['app.basedata.distributionlevels.admin.save'])
      .verify();
  }

  private verifyFeatureToggleStatus(): Observable<boolean> {
    return this.featureToggleService.isFeatureEnabled(
      FEATURE_NAMES.SERVICES_DISTRIBUTION_LEVEL_RESTRICTION
    );
  }

  isTestOutletDisable(distributionLevel: string): boolean {
    if (distributionLevel === 'TEST_OUTLET') {
      return !(this.productResponsible && !this.isEditPage);
    }
    return false;
  }
}
