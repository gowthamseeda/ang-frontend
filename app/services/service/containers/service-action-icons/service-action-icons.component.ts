import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of, Subject } from 'rxjs';
import { mergeMap, takeUntil } from 'rxjs/operators';

import { UserAuthorizationService } from '../../../../iam/user/user-authorization.service';
import { DistributionLevelsService } from '../../../../traits/distribution-levels/distribution-levels.service';
import { OfferedServiceService } from '../../../offered-service/offered-service.service';
import { ServiceService } from '../../services/service.service';

export interface QueryParams {
  productCategoryId: number;
  serviceId: number;
}

interface IconAction {
  icon: string;
  relativeTarget: string;
  permissions: Observable<boolean>;
  userIsAuthorized: Observable<boolean>;
  tooltip: string;
}

@Component({
  selector: 'gp-service-action-icons',
  templateUrl: './service-action-icons.component.html',
  styleUrls: ['./service-action-icons.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceActionIconsComponent implements OnChanges, OnDestroy, OnInit {
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
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private offeredServiceService: OfferedServiceService,
    private serviceService: ServiceService,
    private distributionLevelsService: DistributionLevelsService,
    private userAuthorizationService: UserAuthorizationService,
    private translateService: TranslateService,
    private ngZone: NgZone
  ) {}

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ngOnInit(): void {
    this.initActionIcons();
  }

  ngOnChanges(): void {
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
  }

  iconClick(action: IconAction): void {
    if (action.icon !== 'clock' || this.serviceSupportsClockAction) {
      this.navigateTo(action.relativeTarget);
    }
  }

  private navigateTo(relativeTarget: string): void {
    const queryParams: QueryParams = {
      productCategoryId: this.productCategoryId,
      serviceId: this.serviceId
    };
    this.ngZone.run(() =>
      this.router.navigate([relativeTarget], {
        queryParams,
        relativeTo: this.activatedRoute
      })
    );
  }

  private initActionIcons(): void {
    const clockAction: IconAction = {
      icon: 'clock',
      relativeTarget: 'opening-hours',
      permissions: this.evaluateUserPermissions(['openinghours.openinghours.read']),
      userIsAuthorized: of(true),
      tooltip: this.translateService.instant('OPENING_HOURS')
    };
    const contactAction: IconAction = {
      icon: 'contact',
      relativeTarget: 'communication',
      permissions: this.evaluateUserPermissions(['communications.communicationdata.read']),
      userIsAuthorized: of(true),
      tooltip: this.translateService.instant('COMMUNICATION')
    };
    const validityAction: IconAction = {
      icon: 'validity',
      relativeTarget: 'validities',
      permissions: this.evaluateUserPermissions(['services.validity.read']),
      userIsAuthorized: this.userIsAuthorized ?? false,
      tooltip: this.translateService.instant('VALIDITY')
    };
    const contractAction: IconAction = {
      icon: 'contract',
      relativeTarget: 'contracts',
      permissions: this.evaluateUserPermissions(['contracts.contract.read']),
      userIsAuthorized: this.userIsAuthorized ?? false,
      tooltip: this.translateService.instant('CONTRACTS')
    };
    this.actions = [validityAction, clockAction, contractAction, contactAction];
  }

  private evaluateUserRestrictions(): void {
    this.userIsAuthorized = this.distributionLevelsService.get(this.outletId).pipe(
      mergeMap(distributionLevels => {
        return this.userAuthorizationService.isAuthorizedFor
          .businessSite(this.outletId)
          .country(this.countryId)
          .distributionLevels(distributionLevels)
          .verify();
      }),
      takeUntil(this.unsubscribe)
    );
  }

  private evaluateUserPermissions(permissions: string[]): Observable<boolean> {
    return this.userAuthorizationService.isAuthorizedFor.permissions(permissions).verify();
  }
}
