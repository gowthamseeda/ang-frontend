import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ServiceVariant } from 'app/services/service-variant/service-variant.model';
import { combineLatest, Observable, of, Subject } from 'rxjs';
import { map, mergeMap, takeUntil } from 'rxjs/operators';

import { UserAuthorizationService } from '../../../../iam/user/user-authorization.service';
import { DistributionLevelsService } from '../../../../traits/distribution-levels/distribution-levels.service';
import { OfferedService } from '../../../offered-service/offered-service.model';
import { OfferedServiceService } from '../../../offered-service/offered-service.service';
import { ServiceVariantService } from '../../../service-variant/service-variant.service';
import { ServiceTableStatusService } from '../../services/service-table-status.service';

@Component({
  selector: 'gp-offered-service',
  templateUrl: './offered-service.component.html',
  styleUrls: ['./offered-service.component.scss']
})
export class OfferedServiceComponent implements OnInit, OnDestroy {
  @Input() serviceId: number;
  @Input() brandId: string;
  @Input() productGroupId: string;
  @Input() countryId: string;
  @Input() outletId: string;
  @Input() showAddIcon: boolean;

  @Output() remove = new EventEmitter<string>();
  @Output() add = new EventEmitter<OfferedService>();

  id?: string;
  offeredServiceId: Observable<string | undefined>;
  offeredService: Observable<OfferedService | undefined>;
  serviceVariant: Observable<ServiceVariant | undefined>;
  userHasPermissions: Observable<boolean>;
  isAssignable: Observable<boolean>;

  // See Story: https://shared-jira.mercedes-benz.polygran.de/browse/GSSNPLUS-7809
  productCategoryId = 1;

  private unsubscribe = new Subject<void>();

  constructor(
    private offeredServiceService: OfferedServiceService,
    private userAuthorizationService: UserAuthorizationService,
    private serviceVariantService: ServiceVariantService,
    private distributionLevelsService: DistributionLevelsService,
    private serviceTableStatusService: ServiceTableStatusService
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

  addOfferedService(offeredService: OfferedService): void {
    this.add.emit(offeredService || this.createOfferedService());
    this.serviceTableStatusService.changeServiceTableSavedStatusTo(false);
    this.serviceTableStatusService.changePristineTo(false);
  }

  removeOfferedService(): void {
    this.remove.emit(this.id);
    this.serviceTableStatusService.changeServiceTableSavedStatusTo(false);
    this.serviceTableStatusService.changePristineTo(false);
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

  private createOfferedService(): OfferedService {
    return {
      id: this.id,
      productCategoryId: this.productCategoryId,
      serviceId: this.serviceId,
      brandId: this.brandId,
      productGroupId: this.productGroupId
    } as OfferedService;
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
