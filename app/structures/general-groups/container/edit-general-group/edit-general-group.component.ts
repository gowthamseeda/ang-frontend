import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { groupBy } from 'ramda';
import { Observable, Subject } from 'rxjs';
import { map, switchMap, take, takeUntil, takeWhile, tap } from 'rxjs/operators';

import { UserAuthorizationService } from '../../../../iam/user/user-authorization.service';
import { PRODUCT_GROUP_ORDER } from '../../../../services/brand-product-group/brand-product-group.model';
import { CanDeactivateComponent } from '../../../../shared/guards/can-deactivate-guard.model';
import { ProgressBarService } from '../../../../shared/services/progress-bar/progress-bar.service';
import { SnackBarService } from '../../../../shared/services/snack-bar/snack-bar.service';
import { sortByReference } from '../../../../shared/util/arrays';
import { MembersSelectionComponent } from '../../../shared/components/members-selection/members-selection.component';
import { SuccessorSelectionComponent } from '../../../shared/components/successor-selection/successor-selection.component';
import { StructuresCountry } from '../../../shared/models/shared.model';
import { GeneralGroupsService } from '../../general-groups.service';
import { BrandProductGroupServiceId } from '../../model/brand-product-group-service.model';
import { GeneralGroup, GeneralGroupMember } from '../../model/general-groups.model';

export interface BrandProductGroupsServicesRow {
  brandId: string;
  productGroupIds: string[];
  serviceIds: number[];
}

const permissions = ['structures.generalgroups.update'];

@Component({
  selector: 'gp-edit-general-group',
  templateUrl: './edit-general-group.component.html',
  styleUrls: ['./edit-general-group.component.scss']
})
export class EditGeneralGroupComponent implements OnInit, OnDestroy, CanDeactivateComponent {
  private get generalGroupIdOfRoute(): Observable<string> {
    return this.activatedRoute.paramMap.pipe(
      takeUntil(this.unsubscribe),
      map(paramMap => paramMap.get('generalGroupId')),
      tap(generalGroupId => {
        if (!generalGroupId) {
          this.router.navigate(['../../'], { relativeTo: this.activatedRoute });
        }
      }),
      takeWhile(generalGroupId => generalGroupId !== null),
      map(generalGroupId => generalGroupId as string)
    );
  }

  generalGroupFormGroup: UntypedFormGroup;
  brandProductGroupsServicesRows: Map<string, BrandProductGroupServiceId[]>;
  generalGroupMembers: GeneralGroupMember[] = [];
  isAuthorized: boolean;

  hasSuccessor: boolean;
  generalGroupCountry: StructuresCountry;
  successorGroupName: string | null;

  private unsubscribe = new Subject<void>();
  private generalGroupId: string;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private generalGroupsService: GeneralGroupsService,
    private snackBarService: SnackBarService,
    private progressBarService: ProgressBarService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userAuthorizationService: UserAuthorizationService,
    private matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.initialize();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  save(): void {
    this.progressBarService.start();

    const generalGroup = this.generalGroupFormGroup.getRawValue();
    if (!this.hasSuccessor) {
      delete generalGroup['successorGroupId'];
    }

    generalGroup.members = generalGroup.members.map((member: GeneralGroupMember) => member.id);

    this.generalGroupsService
      .update(this.generalGroupId, generalGroup)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        () => this.snackBarService.showInfo('GENERAL_GROUPS_EDIT_SUCCESS'),
        error => {
          this.progressBarService.stop();
          this.generalGroupFormGroup.setErrors(error);
          this.generalGroupFormGroup.markAsPristine();
          this.snackBarService.showError(error);
        },
        () => {
          this.progressBarService.stop();
          this.generalGroupFormGroup.markAsPristine();
        }
      );
  }

  reset(): void {
    this.initGeneralGroupData();
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
        countryName: this.generalGroupCountry.name,
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

  openGeneralGroupSuccessorList(): void {
    const dialog = this.matDialog.open(SuccessorSelectionComponent, {
      data: { generalGroupId: this.generalGroupId }
    });

    dialog
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((generalGroup: GeneralGroup | false) => {
        if (generalGroup) {
          this.setGeneralGroupSuccessor(generalGroup);
        }
      });
  }

  setGeneralGroupSuccessor(successorGroup: GeneralGroup): void {
    this.generalGroupFormGroup.patchValue({ successorGroupId: successorGroup.generalGroupId });
    this.successorGroupName = successorGroup.name;
    this.generalGroupFormGroup.get('active')?.disable();
    this.hasSuccessor = true;
    this.generalGroupFormGroup.markAsDirty();
  }

  removeGeneralGroupSuccessor(): void {
    this.hasSuccessor = false;
    this.generalGroupFormGroup.get('active')?.enable();
    this.generalGroupFormGroup.patchValue({ successorGroupId: null });
    this.successorGroupName = null;
    this.generalGroupFormGroup.markAsDirty();
  }

  canDeactivate(): boolean {
    return this.generalGroupFormGroup === undefined ? true : this.generalGroupFormGroup.pristine;
  }

  private initialize(): void {
    this.userAuthorizationService.isAuthorizedFor
      .permissions(permissions)
      .verify()
      .pipe(take(1))
      .subscribe(isAuthorized => {
        this.isAuthorized = isAuthorized;
        this.initFormGroup();
        this.initGeneralGroupData();
      });
  }

  private initFormGroup(): void {
    this.generalGroupFormGroup = this.formBuilder.group({
      name: ['', Validators.required],
      countryId: { value: '', disabled: true },
      active: { value: false, disabled: !this.isAuthorized },
      successorGroupId: [],
      brandProductGroupServices: [],
      members: []
    });
  }

  private initGeneralGroupData(): void {
    this.progressBarService.start();

    this.generalGroupIdOfRoute
      .pipe(
        switchMap(generalGroupId => this.generalGroupsService.get(generalGroupId)),
        tap(() => this.progressBarService.stop()),
        takeUntil(this.unsubscribe)
      )
      .subscribe(
        (generalGroup: GeneralGroup) => {
          const brandProductGroupServiceIds = generalGroup.brandProductGroupServices?.map(
            it =>
              ({
                brandId: it.brand.id,
                productGroupId: it.productGroup.id,
                serviceId: it.service.id
              } as BrandProductGroupServiceId)
          );

          this.generalGroupFormGroup.patchValue({
            name: generalGroup.name,
            countryId: generalGroup.country.id,
            active: generalGroup.active,
            successorGroupId: generalGroup.successorGroup?.id,
            brandProductGroupServices: brandProductGroupServiceIds || [],
            members: generalGroup.members || []
          });

          this.generalGroupId = generalGroup.generalGroupId;
          this.generalGroupCountry = generalGroup.country;
          this.successorGroupName = generalGroup.successorGroup
            ? generalGroup.successorGroup.name
            : null;
          this.hasSuccessor = !!generalGroup.successorGroup;

          if (this.hasSuccessor) {
            this.generalGroupFormGroup.get('active')?.disable();
          } else {
            this.generalGroupFormGroup.get('active')?.enable();
          }

          this.initBrandProductGroupsServicesRows(brandProductGroupServiceIds || []);
          this.generalGroupMembers = generalGroup.members || [];

          this.isAuthorizedForCountry();
        },
        error => {
          this.router.navigate(['../../'], { relativeTo: this.activatedRoute });
          this.snackBarService.showError(error);
        }
      );
  }

  private isAuthorizedForCountry(): void {
    this.userAuthorizationService.isAuthorizedFor
      .country(this.generalGroupCountry.id)
      .verify()
      .pipe(take(1))
      .subscribe(isAuthorized => {
        if (!isAuthorized) {
          this.isAuthorized = isAuthorized;
          this.generalGroupFormGroup.get('active')?.disable();
        }
      });
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
