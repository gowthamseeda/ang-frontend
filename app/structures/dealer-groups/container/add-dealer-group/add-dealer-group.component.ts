import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { difference } from 'ramda';
import { concat, Subject } from 'rxjs';
import { finalize, map, take, takeUntil } from 'rxjs/operators';

import { UserAuthorizationService } from '../../../../iam/user/user-authorization.service';
import { CanDeactivateComponent } from '../../../../shared/guards/can-deactivate-guard.model';
import { ProgressBarService } from '../../../../shared/services/progress-bar/progress-bar.service';
import { SnackBarService } from '../../../../shared/services/snack-bar/snack-bar.service';
import {
  DealerGroupHeadquarter,
  DealerGroupHeadquarterAdded,
  DealerGroupMember,
  DealerGroupMemberWithRO
} from '../../../models/dealer-group.model';
import { OutletStructureApiService } from '../../../outlet-structure/services/outlet-structure-api.service';
import { MembersSelectionComponent } from '../../../shared/components/members-selection/members-selection.component';
import { RegisteredOfficeMembersTableComponent } from '../../../shared/components/registered-office-members-table/registered-office-members-table.component';
import { StructuresCountry } from '../../../shared/models/shared.model';
import { DealerGroupsService } from '../../dealer-groups.service';

const permissions = ['structures.dealergroups.create'];
@Component({
  selector: 'gp-add-dealer-group',
  templateUrl: './add-dealer-group.component.html',
  styleUrls: ['./add-dealer-group.component.scss']
})
export class AddDealerGroupComponent implements OnInit, OnDestroy, CanDeactivateComponent {
  dealerGroupFormGroup: UntypedFormGroup;
  isAuthorized: boolean;
  dealerGroupCountry?: StructuresCountry;
  headquarter?: DealerGroupHeadquarter;
  dealerGroupMembers: DealerGroupMember[] = [];
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
    private snackBarService: SnackBarService,
    private progressBarService: ProgressBarService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
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
      .create(dealerGroup)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        dealerGroups => {
          this.dealerGroupFormGroup.markAsPristine();
          this.router.navigate(['../' + dealerGroups.id + '/edit'], {
            relativeTo: this.activatedRoute
          });
          this.snackBarService.showInfo('DEALER_GROUPS_ADD_SUCCESS');
        },
        error => {
          this.progressBarService.stop();
          this.dealerGroupFormGroup.setErrors(error);
          this.dealerGroupFormGroup.markAsPristine();
          this.snackBarService.showError(error);
        },
        () => this.progressBarService.stop()
      );
  }

  reset(): void {
    this.dealerGroupCountry = undefined;
    this.headquarter = undefined;
    this.dealerGroupMembers = [];
    this.dealerGroupMembersWithRO = [];
    this.dealerGroupMembersWithoutRO = [];
    this.initFormGroup();
    this.dealerGroupFormGroup.markAsPristine();
    if (this.registeredOfficeMembersTableComponent?.expandedOutletIdList) {
      this.registeredOfficeMembersTableComponent.expandedOutletIdList = [];
    }
  }

  removeHeadquarter(): void {
    this.dealerGroupFormGroup.patchValue({
      headquarterId: ''
    });
    this.dealerGroupCountry = undefined;
    this.headquarter = undefined;
  }

  addOrUpdateHeadquarter(headquarter: DealerGroupHeadquarterAdded): void {
    this.dealerGroupFormGroup.patchValue({
      headquarterId: headquarter.id
    });
    this.dealerGroupFormGroup.markAsDirty();
    this.headquarter = headquarter;

    this.dealerGroupCountry = {
      id: headquarter.countryId,
      name: headquarter.countryName
    };
  }

  openDealerGroupMembersList(): void {
    const dialog = this.matDialog.open(MembersSelectionComponent, {
      data: {
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
      });
  }

  private initFormGroup(): void {
    this.dealerGroupFormGroup = this.formBuilder.group({
      name: ['', Validators.required],
      active: true,
      headquarterId: ['', Validators.required],
      members: [[]]
    });
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
