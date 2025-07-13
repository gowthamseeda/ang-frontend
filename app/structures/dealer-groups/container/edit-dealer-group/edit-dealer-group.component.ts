import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { difference } from 'ramda';
import { concat, Observable, Subject } from 'rxjs';
import { finalize, map, switchMap, take, takeUntil, takeWhile, tap } from 'rxjs/operators';

import { UserAuthorizationService } from '../../../../iam/user/user-authorization.service';
import { CanDeactivateComponent } from '../../../../shared/guards/can-deactivate-guard.model';
import { ProgressBarService } from '../../../../shared/services/progress-bar/progress-bar.service';
import { SnackBarService } from '../../../../shared/services/snack-bar/snack-bar.service';
import {
  DealerGroup,
  DealerGroupHeadquarter,
  DealerGroupHeadquarterAdded,
  DealerGroupMember,
  DealerGroupMemberWithRO
} from '../../../models/dealer-group.model';
import { OutletStructureApiService } from '../../../outlet-structure/services/outlet-structure-api.service';
import { MembersSelectionComponent } from '../../../shared/components/members-selection/members-selection.component';
import { RegisteredOfficeMembersTableComponent } from '../../../shared/components/registered-office-members-table/registered-office-members-table.component';
import { SuccessorSelectionComponent } from '../../../shared/components/successor-selection/successor-selection.component';
import { StructuresCountry } from '../../../shared/models/shared.model';
import { DealerGroupsService } from '../../dealer-groups.service';

const permissions = ['structures.dealergroups.update'];

@Component({
  selector: 'gp-edit-dealer-group',
  templateUrl: './edit-dealer-group.component.html',
  styleUrls: ['./edit-dealer-group.component.scss']
})
export class EditDealerGroupComponent implements OnInit, OnDestroy, CanDeactivateComponent {
  private get dealerGroupIdOfRoute(): Observable<string> {
    return this.activatedRoute.paramMap.pipe(
      takeUntil(this.unsubscribe),
      map(paramMap => paramMap.get('dealerGroupId')),
      tap(dealerGroupId => {
        if (!dealerGroupId) {
          this.router.navigate(['../../'], { relativeTo: this.activatedRoute });
        }
      }),
      takeWhile(dealerGroupId => dealerGroupId !== null),
      map(dealerGroupId => dealerGroupId as string)
    );
  }

  dealerGroupFormGroup: UntypedFormGroup;
  isAuthorized: boolean;
  dealerGroupId: string;
  dealerGroupCountry?: StructuresCountry;
  headquarter?: DealerGroupHeadquarter;
  dealerGroupMembers: DealerGroupMember[] = [];
  hasSuccessor: boolean;
  successorGroupName: string | null;
  dealerGroupMembersWithRO: DealerGroupMemberWithRO[] = [];
  dealerGroupMembersWithoutRO: DealerGroupMember[] = [];
  sortEvent: MatSort;
  filterValue: string;

  @ViewChild(RegisteredOfficeMembersTableComponent)
  registeredOfficeMembersTableComponent: RegisteredOfficeMembersTableComponent;

  private unsubscribe = new Subject<void>();

  constructor(
    private formBuilder: UntypedFormBuilder,
    private dealerGroupsService: DealerGroupsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private snackBarService: SnackBarService,
    private progressBarService: ProgressBarService,
    private userAuthorizationService: UserAuthorizationService,
    private outletStructureApiService: OutletStructureApiService,
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

    const dealerGroup = this.dealerGroupFormGroup.getRawValue();

    dealerGroup.members = dealerGroup.members.map((member: DealerGroupMember) => member.id);

    this.dealerGroupsService
      .update(this.dealerGroupId, dealerGroup)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        () => this.snackBarService.showInfo('DEALER_GROUPS_EDIT_SUCCESS'),
        error => {
          this.progressBarService.stop();
          this.dealerGroupFormGroup.setErrors(error);
          this.dealerGroupFormGroup.markAsPristine();
          this.snackBarService.showError(error);
        },
        () => {
          this.progressBarService.stop();
          this.dealerGroupFormGroup.markAsPristine();
        }
      );
  }

  reset(): void {
    this.initDealerGroupData();
    this.dealerGroupFormGroup.markAsPristine();
    if (this.registeredOfficeMembersTableComponent?.expandedOutletIdList) {
      this.registeredOfficeMembersTableComponent.expandedOutletIdList = [];
    }
  }

  getCountryIdFormGroup(): UntypedFormGroup {
    return this.formBuilder.group({
      countryId: { value: this.dealerGroupCountry?.id, disabled: true }
    });
  }

  removeHeadquarter(): void {
    this.dealerGroupFormGroup.patchValue({
      headquarterId: ''
    });
    this.dealerGroupCountry = undefined;
    this.headquarter = undefined;
    this.dealerGroupFormGroup.markAsDirty();
  }

  addOrUpdateHeadquarter(headquarter: DealerGroupHeadquarterAdded): void {
    this.dealerGroupFormGroup.patchValue({
      headquarterId: headquarter.id
    });

    if (this.headquarter?.id !== this.dealerGroupFormGroup.controls.headquarterId.value) {
      this.dealerGroupFormGroup.markAsDirty();
    }
    this.headquarter = headquarter;

    this.dealerGroupCountry = {
      id: headquarter.countryId,
      name: headquarter.countryName
    };
  }

  removeDealerGroupMember(dealerGroupMemberId: string): void {
    const updatedMembers: DealerGroupMember[] = this.dealerGroupFormGroup
      .get('members')
      ?.value.filter((member: DealerGroupMember) => member.id !== dealerGroupMemberId);
    this.updateMembersControl(updatedMembers);
  }

  removeDealerGroupMemberWithRO(dealerGroupMemberId: string): void {
    const memberWithRO = this.dealerGroupMembersWithRO.find(
      member => member.registeredOffice.id === dealerGroupMemberId
    );

    let membersToRemove = [dealerGroupMemberId];

    if (memberWithRO) {
      membersToRemove = membersToRemove.concat(...memberWithRO.members.map(member => member.id));
    }

    const updatedMembers: DealerGroupMember[] = this.dealerGroupFormGroup
      .get('members')
      ?.value.filter((member: DealerGroupMember) => !membersToRemove.includes(member.id));
    this.updateMembersControl(updatedMembers);
  }

  updateMembersControl(updatedMembers: DealerGroupMember[]): void {
    this.dealerGroupFormGroup.get('members')?.patchValue(updatedMembers);
    this.initMembers(updatedMembers);
    this.dealerGroupFormGroup.markAsDirty();
  }

  openDealerGroupMembersList(): void {
    const dialog = this.matDialog.open(MembersSelectionComponent, {
      data: {
        countryName: this.dealerGroupCountry?.name,
        excludedMembers: this.dealerGroupMembers.map(member => member.id)
      }
    });

    dialog
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((dealerGroupMembers: DealerGroupMember[] | false) => {
        if (dealerGroupMembers) {
          this.addDealerGroupMembers(dealerGroupMembers);
        }
      });
  }

  addDealerGroupMembers(dealerGroupMembers: DealerGroupMember[]): void {
    const membersControl = this.dealerGroupFormGroup.get('members');
    const membersToAdd = dealerGroupMembers.filter(
      member => !membersControl?.value.map((m: DealerGroupMember) => m.id).includes(member.id)
    );

    membersToAdd.forEach(member => {
      this.updateMembersControl([...membersControl?.value, member]);
    });
  }

  openDealerGroupSuccessorList(): void {
    const dialog = this.matDialog.open(SuccessorSelectionComponent, {
      data: { dealerGroupId: this.dealerGroupId }
    });

    dialog
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((dealerGroup: DealerGroup | false) => {
        if (dealerGroup) {
          this.setDealerGroupSuccessor(dealerGroup);
        }
      });
  }

  setDealerGroupSuccessor(successorGroup: DealerGroup): void {
    this.dealerGroupFormGroup.patchValue({
      successorGroupId: successorGroup.dealerGroupId
    });
    this.successorGroupName = successorGroup.name;
    this.dealerGroupFormGroup.get('active')?.disable();
    this.hasSuccessor = true;
    this.dealerGroupFormGroup.markAsDirty();
  }

  removeDealerGroupSuccessor(): void {
    this.hasSuccessor = false;
    this.dealerGroupFormGroup.get('active')?.enable();
    this.dealerGroupFormGroup.patchValue({ successorGroupId: null });
    this.successorGroupName = null;
    this.dealerGroupFormGroup.markAsDirty();
  }

  sortChanged(event: any): void {
    this.sortEvent = event;
  }

  filter(event: any): void {
    this.filterValue = event;
  }

  canDeactivate(): boolean {
    return this.dealerGroupFormGroup === undefined ? true : this.dealerGroupFormGroup.pristine;
  }

  private initialize(): void {
    this.userAuthorizationService.isAuthorizedFor
      .permissions(permissions)
      .verify()
      .pipe(take(1))
      .subscribe(isAuthorized => {
        this.isAuthorized = isAuthorized;
        this.initFormGroup();
        this.initDealerGroupData();
      });
  }

  private initFormGroup(): void {
    this.dealerGroupFormGroup = this.formBuilder.group({
      name: ['', Validators.required],
      active: { value: false, disabled: !this.isAuthorized },
      headquarterId: ['', Validators.required],
      successorGroupId: [],
      members: []
    });
  }

  private initDealerGroupData(): void {
    this.progressBarService.start();

    this.dealerGroupIdOfRoute
      .pipe(
        switchMap(dealerGroupId => this.dealerGroupsService.get(dealerGroupId)),
        tap(() => this.progressBarService.stop()),
        takeUntil(this.unsubscribe)
      )
      .subscribe(
        (dealerGroup: DealerGroup) => {
          this.dealerGroupFormGroup.patchValue({
            name: dealerGroup.name,
            active: dealerGroup.active,
            headquarterId: dealerGroup.headquarter.id,
            successorGroupId: dealerGroup.successorGroup?.id,
            members: dealerGroup.members || []
          });

          this.dealerGroupId = dealerGroup.dealerGroupId;
          this.dealerGroupCountry = dealerGroup.country;
          this.headquarter = dealerGroup.headquarter;
          this.successorGroupName = dealerGroup.successorGroup
            ? dealerGroup.successorGroup.name
            : null;
          this.hasSuccessor = !!dealerGroup.successorGroup;

          if (this.hasSuccessor) {
            this.dealerGroupFormGroup.get('active')?.disable();
          } else {
            this.dealerGroupFormGroup.get('active')?.enable();
          }

          this.initMembers(dealerGroup.members || []);

          this.isAuthorizedForCountry();
        },
        error => {
          this.router.navigate(['../../'], { relativeTo: this.activatedRoute });
          this.snackBarService.showError(error);
        }
      );
  }

  private isAuthorizedForCountry(): void {
    if (this.dealerGroupCountry) {
      this.userAuthorizationService.isAuthorizedFor
        .country(this.dealerGroupCountry.id)
        .verify()
        .pipe(take(1))
        .subscribe(isAuthorized => {
          if (!isAuthorized) {
            this.isAuthorized = isAuthorized;
            this.dealerGroupFormGroup.get('active')?.disable();
          }
        });
    } else {
      this.isAuthorized = false;
      this.dealerGroupFormGroup.get('active')?.disable();
    }
  }

  private initMembers(members: DealerGroupMember[]): void {
    this.dealerGroupMembers = members;

    const isROMembers = this.dealerGroupMembers.filter(member => member.isRegisteredOffice);
    let nonROMembers = this.dealerGroupMembers.filter(member => !member.isRegisteredOffice);

    const groupedROMembers: DealerGroupMemberWithRO[] = [];

    concat(
      ...isROMembers.map(member => {
        return this.outletStructureApiService.get(member.id).pipe(
          map(outletStructure => {
            const membersInRO = nonROMembers.filter(nonROMember =>
              outletStructure.outlets.some(
                outlet =>
                  outlet.businessSiteId === nonROMember.id ||
                  outlet.subOutlets?.some(subOutlet => subOutlet.businessSiteId === nonROMember.id)
              )
            );

            nonROMembers = difference(nonROMembers, membersInRO);

            const groupedRO: DealerGroupMemberWithRO = {
              registeredOffice: member,
              members: membersInRO
            };

            groupedROMembers.push(groupedRO);
          })
        );
      })
    )
      .pipe(
        finalize(() => {
          this.dealerGroupMembersWithRO = groupedROMembers;
          this.dealerGroupMembersWithoutRO = nonROMembers;
        }),
        takeUntil(this.unsubscribe)
      )
      .subscribe();
  }
}
