import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ServiceVariant } from 'app/services/service-variant/service-variant.model';
import { combineLatest, Observable, of, Subject } from 'rxjs';
import { map, mergeMap, take, takeUntil } from 'rxjs/operators';

import { UserAuthorizationService } from '../../../../iam/user/user-authorization.service';
import { DistributionLevelsService } from '../../../../traits/distribution-levels/distribution-levels.service';
import { OfferedService } from '../../../offered-service/offered-service.model';
import { OfferedServiceService } from '../../../offered-service/offered-service.service';
import { ServiceVariantService } from '../../../service-variant/service-variant.service';
import { MultiSelectOfferedServiceIds } from '../../models/multi-select.model';
import { MultiSelectDataService } from '../../services/multi-select-service-data.service';

@Component({
  selector: 'gp-copy-offered-service',
  templateUrl: './copy-offered-service.component.html',
  styleUrls: ['./copy-offered-service.component.scss']
})
export class CopyOfferedServiceComponent implements OnInit, OnDestroy {
  @Input() serviceId: number;
  @Input() brandId: string;
  @Input() productGroupId: string;
  @Input() countryId: string;
  @Input() outletId: string;

  id?: string;
  offeredServiceId: Observable<string | undefined>;
  offeredService: Observable<OfferedService | undefined>;
  serviceVariant: Observable<ServiceVariant | undefined>;
  userHasPermissions: Observable<boolean>;
  isAssignable: Observable<boolean>;

  private unsubscribe = new Subject<void>();

  constructor(
    private offeredServiceService: OfferedServiceService,
    private userAuthorizationService: UserAuthorizationService,
    private serviceVariantService: ServiceVariantService,
    private distributionLevelsService: DistributionLevelsService,
    private multiSelectDataService: MultiSelectDataService
  ) {}

  ngOnInit(): void {
    this.serviceVariant = this.initServiceVariant();
    this.initOfferedServiceId();
    this.initOfferedService();
    this.initIsAssignable();
    this.userHasPermissions = this.evaluateUserPermissions();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  evaluateUserPermissions(): Observable<boolean> {
    return this.distributionLevelsService.getDistributionLevelsOfOutlet().pipe(
      mergeMap(distributionLevels => {
        return this.userAuthorizationService.isAuthorizedFor
          .permissions(['services.offeredservice.update'])
          .country(this.countryId)
          .brand(this.brandId)
          .productGroup(this.productGroupId)
          .businessSite(this.outletId)
          .distributionLevels(distributionLevels)
          .verify();
      })
    );
  }

  updateMultiSelection(): void {
    this.offeredService.pipe(take(1)).subscribe(offeredService => {
      if (offeredService) {
        this.targetAction({
          id: offeredService.id,
          serviceId: offeredService.serviceId,
          brandId: offeredService.brandId,
          productGroupId: offeredService.productGroupId,
          productCategoryId: offeredService.productCategoryId,
          outletId: this.outletId
        });
      }
    });
  }

  targetAction(offeredService: MultiSelectOfferedServiceIds): void {
    this.multiSelectDataService
      .isTarget(offeredService.id)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(isTarget => {
        isTarget
          ? this.multiSelectDataService.removeTarget(offeredService)
          : this.multiSelectDataService.addTarget(offeredService);
      });
  }

  private initServiceVariant(): Observable<ServiceVariant | undefined> {
    return this.serviceVariantService.getBy(this.serviceId, this.brandId, this.productGroupId);
  }

  private initOfferedServiceId(): void {
    this.offeredServiceId = this.offeredServiceService.getId(
      this.serviceId,
      this.brandId,
      this.productGroupId
    );

    this.offeredServiceId = combineLatest([this.offeredServiceId, this.serviceVariant]).pipe(
      map(([offeredServiceId, serviceVariant]) =>
        !offeredServiceId && serviceVariant?.id
          ? `${this.outletId}-${serviceVariant.id}`
          : offeredServiceId
      )
    );

    this.offeredServiceId.pipe(takeUntil(this.unsubscribe)).subscribe(id => (this.id = id));
  }

  private initOfferedService(): void {
    this.offeredService = this.offeredServiceId.pipe(
      mergeMap(offeredServiceId =>
        offeredServiceId ? this.offeredServiceService.get(offeredServiceId) : of(undefined)
      )
    );
  }

  private initIsAssignable(): void {
    this.isAssignable = this.serviceVariant.pipe(
      map(serviceVariant => serviceVariant?.active || false)
    );
  }
}
