import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { UserAuthorizationService } from '../../../../iam/user/user-authorization.service';
import { DistributionLevelsService } from '../../../../traits/distribution-levels/distribution-levels.service';

interface TabAction {
  icon: string;
  tooltip: string;
  permissions: Array<string>;
  userIsAuthorized: Observable<boolean>;
}

@Component({
  selector: 'gp-service-action-tabs',
  templateUrl: './service-action-tabs.component.html',
  styleUrls: ['./service-action-tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServiceActionTabsComponent implements OnInit {
  @Input() countryId: string;
  @Input() outletId: string;

  userIsAuthorized: Observable<boolean>;
  tabs = new Array<TabAction>();

  constructor(
    private distributionLevelsService: DistributionLevelsService,
    private userAuthorizationService: UserAuthorizationService
  ) {}

  ngOnInit(): void {
    this.evaluateUserRestrictions();
    this.initActionTabs();
  }

  private initActionTabs(): void {
    const clockTab: TabAction = {
      icon: 'clock',
      tooltip: 'OPENING_HOURS',
      permissions: ['openinghours.openinghours.read'],
      userIsAuthorized: of(true)
    };
    const contactTab = {
      icon: 'contact',
      tooltip: 'COMMUNICATION',
      permissions: ['communications.communicationdata.read'],
      userIsAuthorized: of(true)
    };
    const validityTab = {
      icon: 'validity',
      tooltip: 'VALIDITY',
      permissions: ['services.validity.read'],
      userIsAuthorized: this.userIsAuthorized ?? false
    };
    const contractTab = {
      icon: 'contract',
      tooltip: 'CONTRACTS',
      permissions: ['contracts.contract.read'],
      userIsAuthorized: this.userIsAuthorized ?? false
    };
    this.tabs = [validityTab, clockTab, contractTab, contactTab];
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
}
