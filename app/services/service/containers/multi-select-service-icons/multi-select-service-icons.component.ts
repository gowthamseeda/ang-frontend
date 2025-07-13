import { ChangeDetectorRef, Component, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of, Subject } from 'rxjs';
import { mergeMap, takeUntil } from 'rxjs/operators';

import { UserAuthorizationService } from '../../../../iam/user/user-authorization.service';
import { DistributionLevelsService } from '../../../../traits/distribution-levels/distribution-levels.service';
import { OfferedServiceService } from '../../../offered-service/offered-service.service';
import { MultiSelectDataService } from '../../services/multi-select-service-data.service';
import { ServiceService } from '../../services/service.service';
import { MultiSelectActionsComponent } from '../multi-select-actions/multi-select-actions.component';

export interface IconAction {
  icon: string;
  relativeTarget: string;
  permissions: Observable<boolean>;
  userIsAuthorized: Observable<boolean>;
  tooltip: string;
  enabled: boolean;
}

@Component({
  selector: 'gp-multi-select-service-icons',
  templateUrl: './multi-select-service-icons.component.html',
  styleUrls: ['./multi-select-service-icons.component.scss']
})
export class MultiSelectServiceIconsComponent implements OnInit, OnDestroy {
  @Input() serviceTableRowHovered?: boolean;
  @Input() serviceTableSaved?: boolean;
  @Input() serviceId: number;
  @Input() serviceSupportsClockAction: boolean;
  @Input() countryId: string;
  @Input() outletId: string;
  @Input() showUnmaintainedInfo: boolean;

  userIsAuthorized: Observable<boolean>;
  actions = new Array<IconAction>();
  productCategoryId = 1;
  isNotEmpty: Observable<boolean>;
  isActive: Observable<boolean>;
  isValidityMaintained: Observable<boolean>;
  isOpeningHoursMaintained: Observable<boolean>;
  isContractsMaintained: Observable<boolean>;
  isCommunicationsMaintained: Observable<boolean>;

  private unsubscribe = new Subject<void>();

  constructor(
    private multiSelectDataService: MultiSelectDataService,
    private activatedRoute: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef,
    private distributionLevelsService: DistributionLevelsService,
    private matDialog: MatDialog,
    private offeredServiceService: OfferedServiceService,
    private serviceService: ServiceService,
    private translateService: TranslateService,
    private userAuthorizationService: UserAuthorizationService,
    private router: Router,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.isNotEmpty = this.offeredServiceService.isAtLeastOneOfferedForService(this.serviceId);
    this.isActive = this.serviceService.isServiceIsActive(this.serviceId);
    this.isValidityMaintained =
      this.offeredServiceService.isOfferedServiceValidityMaintainedForService(this.serviceId);
    this.isOpeningHoursMaintained =
      this.offeredServiceService.isOfferedServiceOpeningHourMaintainedForService(this.serviceId);
    this.isCommunicationsMaintained =
      this.offeredServiceService.isOfferedServiceCommunicationsMaintainedForService(this.serviceId);
    this.isContractsMaintained =
      this.offeredServiceService.isOfferedServiceContractsMaintainedForService(this.serviceId);
    this.evaluateUserRestrictions();
    this.initActionIcons();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  navigateToAction(action: IconAction): void {
    this.targetsEmpty()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((isEmpty: boolean) => {
        if (!isEmpty) {
          this.multiSelectDataService.mode.pipe(takeUntil(this.unsubscribe)).subscribe(mode => {
            mode ? this.edit(action.relativeTarget) : this.copy(action);
          });
        }
      });
  }

  edit(relativeTarget: string): void {
    this.ngZone.run(() =>
      this.router.navigate([relativeTarget], {
        relativeTo: this.activatedRoute
      })
    );
  }

  copy(action: IconAction): void {
    this.changeDetectorRef.detectChanges();

    const dialogRef = this.matDialog.open(MultiSelectActionsComponent, {
      width: '600px',
      height: '200px',
      data: {
        action: action,
        outletId: this.outletId,
        serviceId: this.serviceId,
        countryId: this.countryId
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.changeDetectorRef.detectChanges();
    });
  }

  targetsEmpty(): Observable<boolean> {
    return this.multiSelectDataService.isTargetsEmpty;
  }

  private initActionIcons(): void {
    const clockAction: IconAction = {
      icon: 'clock',
      relativeTarget: 'opening-hours/multi-edit',
      permissions: this.evaluateUserPermissions(['openinghours.openinghours.read']),
      userIsAuthorized: of(true),
      tooltip: this.translateService.instant('OPENING_HOURS'),
      enabled: true
    };
    const contactAction: IconAction = {
      icon: 'contact',
      relativeTarget: 'communication/multi-edit',
      permissions: this.evaluateUserPermissions(['communications.communicationdata.read']),
      userIsAuthorized: of(true),
      tooltip: this.translateService.instant('COMMUNICATION'),
      enabled: true
    };

    const validityAction: IconAction = {
      icon: 'validity',
      relativeTarget: 'validities/multi-edit',
      permissions: this.evaluateUserPermissions(['services.validity.read']),
      userIsAuthorized: this.userIsAuthorized ?? false,
      tooltip: this.translateService.instant('VALIDITY'),
      enabled: true
    };

    const contractAction: IconAction = {
      icon: 'contract',
      relativeTarget: 'contracts',
      permissions: this.evaluateUserPermissions(['contracts.contract.read']),
      userIsAuthorized: this.userIsAuthorized ?? false,
      tooltip: this.translateService.instant('CONTRACTS'),
      enabled: false
    };
    this.actions = [validityAction, clockAction, contractAction, contactAction];
  }

  getIconName(action: IconAction) {
    if (action.icon === 'validity' && this.isValidityMaintained) {
      return action.icon;
    }

    if (action.icon === 'contact' && this.isCommunicationsMaintained) {
      return action.icon;
    }

    if (action.icon === 'clock' && this.isOpeningHoursMaintained) {
      return action.icon;
    }

    if (action.icon === 'contract' && this.isContractsMaintained) {
      return action.icon;
    }

    return 'pen';
  }

  private evaluateUserRestrictions(): void {
    this.userIsAuthorized = this.distributionLevelsService.get(this.outletId).pipe(
      mergeMap(distributionLevels => {
        return this.userAuthorizationService.isAuthorizedFor
          .businessSite(this.outletId)
          .country(this.countryId)
          .distributionLevels(distributionLevels)
          .verify();
      })
    );
  }

  private evaluateUserPermissions(permissions: string[]): Observable<boolean> {
    return this.userAuthorizationService.isAuthorizedFor.permissions(permissions).verify();
  }
}
