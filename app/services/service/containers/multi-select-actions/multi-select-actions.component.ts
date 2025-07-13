import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  OfferedServiceValidity,
  Validity,
  ValidityChange
} from 'app/services/validity/validity.model';
import { Observable, Subject } from 'rxjs';
import { map, mergeMap, take, takeUntil } from 'rxjs/operators';

import { MultiSelectDataService } from '../../services/multi-select-service-data.service';
import { IconAction } from '../multi-select-service-icons/multi-select-service-icons.component';
import { UserAuthorizationService } from '../../../../iam/user/user-authorization.service';
import { OfferedServiceService } from '../../../offered-service/offered-service.service';
import { OfferedService } from '../../../offered-service/offered-service.model';
import { DistributionLevelsService } from '../../../../traits/distribution-levels/distribution-levels.service';

interface MultiSelectAction {
  action: IconAction;
  outletId: string;
  serviceId: number;
  countryId: string;
}

@Component({
  selector: 'gp-select-select-actions',
  templateUrl: './multi-select-actions.component.html',
  styleUrls: ['./multi-select-actions.component.scss']
})
export class MultiSelectActionsComponent implements OnInit, OnDestroy {
  multiSelectAction: MultiSelectAction;
  offeredServices: OfferedService[] = [];
  targets: OfferedService[] = [];

  private unsubscribe = new Subject<void>();

  constructor(
    public offeredServiceService: OfferedServiceService,
    private distributionLevelsService: DistributionLevelsService,
    private multiSelectDataService: MultiSelectDataService,
    private userAuthorizationService: UserAuthorizationService,
    public dialogRef: MatDialogRef<MultiSelectActionsComponent>,
    @Inject(MAT_DIALOG_DATA) private data: MultiSelectAction
  ) {}

  ngOnInit(): void {
    this.multiSelectAction = this.data;
    this.initCopyOfferedService();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  copy(source: string): void {
    this.dialogRef.close();

    if (this.multiSelectAction.action.icon === 'validity') {
      this.copyValidityAndSave(source);
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  initCopyOfferedService(): void {
    this.multiSelectDataService.multiSelected.pipe(take(1)).subscribe(multiSelected => {
      multiSelected.targets.forEach(target => {
        // this.offeredServiceService.get(target).subscribe((offeredService: OfferedService) => {
        this.targets.push(target);
        // });
      });

      this.offeredServiceService
        .getAllForServiceWith(this.multiSelectAction.serviceId)
        .pipe(
          map(offeredServices =>
            offeredServices.filter(
              offeredService => !multiSelected.targets.map(target => target.id).includes(offeredService.id)
            )
          ),
          takeUntil(this.unsubscribe)
        )
        .subscribe(nonTargets => {
          this.offeredServices = nonTargets;
          this.filterOfferedServiceWithPermission(nonTargets);
        });
    });
  }

  copyValidityAndSave(source: string): void {
    this.offeredServiceService
      .get(source)
      .pipe(take(1))
      .subscribe((offeredServiceAsSource: OfferedService) => {
        const validities = this.targets.map(offeredService => {
          const offeredServiceValidity: OfferedServiceValidity = {
            id: offeredService.id
          };
          if (offeredServiceAsSource.validity) {
            offeredServiceValidity.validity = offeredServiceAsSource.validity;
          }
          return offeredServiceValidity;
        });

        this.updateValiditiesState(offeredServiceAsSource.validity);

        this.offeredServiceService.saveValiditiesInBatch(
          this.multiSelectAction.outletId,
          validities
        );
      });
  }
  offeredServicesIsEmpty(): boolean {
    return this.offeredServices.length > 0;
  }

  private updateValiditiesState(sourceValidity: Validity | undefined): void {
    const validityState: ValidityChange = {
      ids: this.targets.map(offeredService => offeredService.id)
    };
    if (sourceValidity) {
      validityState.validity = sourceValidity;
    }
    this.offeredServiceService.updateValidity(validityState);
  }

  private evaluateUserPermissions(brandId: string, productGroupId: string): Observable<boolean> {
    return this.distributionLevelsService.getDistributionLevelsOfOutlet().pipe(
      mergeMap(distributionLevels => {
        return this.userAuthorizationService.isAuthorizedFor
          .permissions(['services.offeredservice.update'])
          .country(this.multiSelectAction.countryId)
          .brand(brandId)
          .productGroup(productGroupId)
          .businessSite(this.multiSelectAction.outletId)
          .distributionLevels(distributionLevels)
          .verify();
      })
    );
  }

  private filterOfferedServiceWithPermission(nonTargets: OfferedService[]): void {
    nonTargets.forEach(nonTarget => {
      this.evaluateUserPermissions(nonTarget.brandId, nonTarget.productGroupId)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(isAllow => {
          if (!isAllow) {
            this.offeredServices = this.offeredServices.filter(
              offeredService => offeredService.id !== nonTarget.id
            );
          }
        });
    });
  }
}
