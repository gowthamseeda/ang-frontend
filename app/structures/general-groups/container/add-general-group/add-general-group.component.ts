import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { groupBy } from 'ramda';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { PRODUCT_GROUP_ORDER } from '../../../../services/brand-product-group/brand-product-group.model';
import { CanDeactivateComponent } from '../../../../shared/guards/can-deactivate-guard.model';
import { ProgressBarService } from '../../../../shared/services/progress-bar/progress-bar.service';
import { SnackBarService } from '../../../../shared/services/snack-bar/snack-bar.service';
import { sortByReference } from '../../../../shared/util/arrays';
import { MembersSelectionComponent } from '../../../shared/components/members-selection/members-selection.component';
import { GeneralGroupsService } from '../../general-groups.service';
import { BrandProductGroupServiceId } from '../../model/brand-product-group-service.model';
import { GeneralGroupMember } from '../../model/general-groups.model';

@Component({
  selector: 'gp-add-general-group',
  templateUrl: './add-general-group.component.html',
  styleUrls: ['./add-general-group.component.scss']
})
export class AddGeneralGroupComponent implements OnInit, OnDestroy, CanDeactivateComponent {
  generalGroupFormGroup: UntypedFormGroup;
  brandProductGroupsServicesRows: Map<string, BrandProductGroupServiceId[]>;
  generalGroupMembers: GeneralGroupMember[];

  private unsubscribe = new Subject<void>();

  constructor(
    private formBuilder: UntypedFormBuilder,
    private generalGroupsService: GeneralGroupsService,
    private snackBarService: SnackBarService,
    private progressBarService: ProgressBarService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.initFormGroup();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  save(): void {
    this.progressBarService.start();

    const generalGroup = this.generalGroupFormGroup.getRawValue();
    generalGroup.members = generalGroup.members.map((member: GeneralGroupMember) => member.id);

    this.generalGroupsService
      .create(generalGroup)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        generalGroups => {
          this.generalGroupFormGroup.markAsPristine();
          this.router.navigate(['../' + generalGroups.id + '/edit'], {
            relativeTo: this.activatedRoute
          });
          this.snackBarService.showInfo('GENERAL_GROUPS_ADD_SUCCESS');
        },
        error => {
          this.progressBarService.stop();
          this.generalGroupFormGroup.setErrors(error);
          this.generalGroupFormGroup.markAsPristine();
          this.snackBarService.showError(error);
        },
        () => this.progressBarService.stop()
      );
  }

  reset(): void {
    this.initFormGroup();
    this.generalGroupFormGroup.markAsPristine();
  }

  updateBrandProductGroupServicesControl(
    brandProductGroupServiceIds: BrandProductGroupServiceId[]
  ): void {
    const controlToPatch = this.generalGroupFormGroup.get('brandProductGroupServices');
    controlToPatch?.patchValue(brandProductGroupServiceIds);
    this.initBrandProductGroupsServicesRows(controlToPatch?.value);
    this.generalGroupFormGroup.markAsDirty();
  }

  openGeneralGroupMembersList(): void {
    const dialog = this.matDialog.open(MembersSelectionComponent, {
      data: {
        excludedMembers: this.generalGroupMembers.map(member => member.id)
      }
    });

    dialog
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((generalGroupMembers: GeneralGroupMember[] | false) => {
        if (generalGroupMembers) {
          this.addGeneralGroupMembers(generalGroupMembers);
        }
      });
  }

  addGeneralGroupMembers(generalGroupMembers: GeneralGroupMember[]): void {
    const membersControl = this.generalGroupFormGroup.get('members');
    const membersToAdd = generalGroupMembers.filter(
      member => !membersControl?.value.map((m: GeneralGroupMember) => m.id).includes(member.id)
    );

    membersToAdd.forEach(member => {
      this.updateMembersControl([...membersControl?.value, member]);
    });
  }

  removeGeneralGroupMember(generalGroupMemberId: string): void {
    const updatedMembers: GeneralGroupMember[] = this.generalGroupFormGroup
      .get('members')
      ?.value.filter((member: GeneralGroupMember) => member.id !== generalGroupMemberId);
    this.updateMembersControl(updatedMembers);
  }

  updateMembersControl(updatedMembers: GeneralGroupMember[]): void {
    this.generalGroupFormGroup.get('members')?.patchValue(updatedMembers);
    this.generalGroupMembers = updatedMembers;
    this.generalGroupFormGroup.markAsDirty();
  }

  canDeactivate(): boolean {
    return this.generalGroupFormGroup === undefined ? true : this.generalGroupFormGroup.pristine;
  }

  private initBrandProductGroupsServicesRows(
    brandProductGroupServiceIds: BrandProductGroupServiceId[]
  ): void {
    const groupedBrandProductGroupServices = groupBy(
      (item: BrandProductGroupServiceId) => item.brandId
    )(brandProductGroupServiceIds);

    this.brandProductGroupsServicesRows = new Map(Object.entries(groupedBrandProductGroupServices));

    for (const [key, value] of this.brandProductGroupsServicesRows) {
      this.brandProductGroupsServicesRows.set(key, this.orderProductGroupIdsByRef(value));
    }
  }

  private initFormGroup(): void {
    this.generalGroupFormGroup = this.formBuilder.group({
      name: ['', Validators.required],
      countryId: ['', Validators.required],
      active: true,
      brandProductGroupServices: [],
      members: [[]]
    });

    this.brandProductGroupsServicesRows = new Map();
    this.generalGroupMembers = [];
  }

  private orderProductGroupIdsByRef(
    brandProductGroupServiceIds: BrandProductGroupServiceId[]
  ): BrandProductGroupServiceId[] {
    return sortByReference<BrandProductGroupServiceId, string>(
      brandProductGroupServiceIds,
      PRODUCT_GROUP_ORDER,
      (elem: BrandProductGroupServiceId) => elem.productGroupId
    );
  }
}
