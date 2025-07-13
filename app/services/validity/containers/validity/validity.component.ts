import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Subject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { mergeMap, takeUntil } from 'rxjs/operators';

import { AppConfigProvider } from '../../../../app-config.service';
import { UserAuthorizationService } from '../../../../iam/user/user-authorization.service';
import { OutletService } from '../../../../legal-structure/shared/services/outlet.service';
import { CanDeactivateComponent } from '../../../../shared/guards/can-deactivate-guard.model';
import { DistributionLevelsService } from '../../../../traits/distribution-levels/distribution-levels.service';
import { UserSettingsService } from '../../../../user-settings/user-settings/services/user-settings.service';
import { OfferedServiceService } from '../../../offered-service/offered-service.service';
import { Service } from '../../../service/models/service.model';
import { ServiceService } from '../../../service/services/service.service';
import { ValidityTableStatusService } from '../../services/validity-table-status.service';
import { ValidityTableService } from '../../services/validity-table.service';

@Component({
  selector: 'gp-validity',
  templateUrl: './validity.component.html',
  styleUrls: ['./validity.component.scss']
})
export class ValidityComponent implements OnInit, OnDestroy, CanDeactivateComponent {
  outletId: string;
  countryId: string;
  serviceId: number;
  currentSelectedLanguage?: string;

  service: Observable<Service | undefined>;
  userHasPermissions: Observable<boolean>;
  pristine = this.validityTableStatusService.pristine;
  valid = this.validityTableStatusService.valid;
  isFormChanged = false;
  serviceIsAvailable = true;

  private unsubscribe = new Subject<void>();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private outletService: OutletService,
    private serviceService: ServiceService,
    private offeredServiceService: OfferedServiceService,
    private distributionLevelService: DistributionLevelsService,
    private validityTableStatusService: ValidityTableStatusService,
    private validityTableService: ValidityTableService,
    private userAuthorizationService: UserAuthorizationService,
    private userSettingsService: UserSettingsService,
    private appConfigProvider: AppConfigProvider
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        mergeMap(({ outletId }) => {
          this.outletId = outletId;
          return this.outletService.getOrLoadBusinessSite(outletId);
        }),
        takeUntil(this.unsubscribe)
      )
      .subscribe(outlet => {
        this.countryId = outlet.countryId;
        this.userHasPermissions = this.evaluateUserPermissions();
      });

    this.userSettingsService
      .getLanguageId()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(languageId => {
        this.currentSelectedLanguage = languageId;
      });

    this.activatedRoute.queryParams.pipe(takeUntil(this.unsubscribe)).subscribe(({ serviceId }) => {
      if (!serviceId) {
        this.router.navigate(['../'], { relativeTo: this.activatedRoute });
      }
      this.serviceId = Number(serviceId);
      this.initServiceAvailable(serviceId);
    });
    this.initFormChangeSubscription();
  }

  ngOnDestroy(): void {
    this.validityTableStatusService.changePristineTo(true);
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  canDeactivate(): Observable<boolean> | boolean {
    return this.isFormChanged;
  }

  save(): void {
    this.offeredServiceService.saveValidities(this.outletId, this.serviceId);
    this.validityTableStatusService.changePristineTo(true);
  }

  cancel(): void {
    this.offeredServiceService.fetchAllForOutlet(this.outletId);
    this.validityTableService.initValidityTableRows(this.serviceId);
    this.validityTableStatusService.changePristineTo(true);
  }

  getEnableCompanyNavigation(): boolean {
    return this.appConfigProvider.getAppConfig().enableCompanyNavigationOnNewPage;
  }

  private initServiceAvailable(serviceId: number): void {
    this.serviceService.fetchBy(serviceId);
    this.service = this.serviceService.selectBy(serviceId);

    combineLatest([this.service, this.serviceService.isLoading()]).subscribe(
      ([loadedService, isLoading]) => {
        if (!loadedService && !isLoading) {
          this.serviceIsAvailable = false;
        }
      }
    );
  }

  private evaluateUserPermissions(): Observable<boolean> {
    return this.distributionLevelService.getDistributionLevelsOfOutlet().pipe(
      mergeMap(distributionLevels => {
        return this.userAuthorizationService.isAuthorizedFor
          .permissions(['services.offeredservice.update'])
          .businessSite(this.outletId)
          .country(this.countryId)
          .distributionLevels(distributionLevels)
          .verify();
      })
    );
  }

  private initFormChangeSubscription(): void {
    combineLatest([this.pristine, this.valid])
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(([isPristine, isValid]) => {
        this.isFormChanged = !isValid || isPristine;
      });
  }
}
