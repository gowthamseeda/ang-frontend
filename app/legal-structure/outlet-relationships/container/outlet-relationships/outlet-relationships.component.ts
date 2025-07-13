import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormArray, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, Subject, of} from 'rxjs';
import { catchError, map, switchMap, takeUntil, tap } from 'rxjs/operators';

import { UserAuthorizationService } from '../../../../iam/user/user-authorization.service';
import { CanDeactivateComponent } from '../../../../shared/guards/can-deactivate-guard.model';
import { SnackBarService } from '../../../../shared/services/snack-bar/snack-bar.service';
import { OutletService } from '../../../shared/services/outlet.service';
import { OutletRelationshipsTableComponent } from '../../presentational/outlet-relationships-table/outlet-relationships-table.component';
import { OutletRelationshipsService } from '../../services/outlet-relationships.service';
import { DistributionLevelsService } from '../../../../traits/distribution-levels/distribution-levels.service';
import { paramOutletId } from '../../../legal-structure-routing-paths';

@Component({
  selector: 'gp-outlet-relationships',
  templateUrl: './outlet-relationships.component.html',
  styleUrls: ['./outlet-relationships.component.scss']
})
export class OutletRelationshipsComponent implements OnInit, OnDestroy, CanDeactivateComponent {
  outletId: string;
  form: UntypedFormGroup;

  saveButtonDisabled = true;
  cancelButtonDisabled = true;

  isAllowedEdit: Observable<boolean>;

  @ViewChild(OutletRelationshipsTableComponent)
  outletRelationshipsTableComponent: OutletRelationshipsTableComponent;

  private unsubscribe = new Subject<void>();

  isTestOutlet: Boolean = false;

  constructor(
    private outletRelationshipsService: OutletRelationshipsService,
    private outletService: OutletService,
    private userAuthorizationService: UserAuthorizationService,
    private snackBarService: SnackBarService,
    private route: ActivatedRoute,
    private distributionLevelsService: DistributionLevelsService
  ) {}

  ngOnInit(): void {
    this.getOutletIdByRouteParams()
      .pipe(tap(outletId => (this.outletId = outletId)))
      .subscribe();

    this.isAllowedEdit = this.getOutletIdByRouteParams().pipe(
      takeUntil(this.unsubscribe),
      switchMap(outletId => {
        this.outletId = outletId;
        return this.outletService.getOrLoadBusinessSite(outletId);
      }),
      switchMap(outlet => {
        return this.distributionLevelsService.getDistributionLevelsOfOutlet().pipe(
          switchMap(distributionsLevels => {
            this.isTestOutlet = distributionsLevels.includes('TEST_OUTLET');
            return this.userAuthorizationService.isAuthorizedFor
              .country(outlet.countryId)
              .permissions([
                this.isTestOutlet
                  ? 'structures.testoutlet.update'
                  : 'structures.outletrelationships.update'
              ])
              .verify();
          })
        );
      })
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  updateFormAndValidity(): void {
    this.form = this.outletRelationshipsTableComponent.form;
    this.saveButtonDisabled = this.form.pristine || this.form.invalid;
    this.cancelButtonDisabled = this.form.pristine;
  }

  save(): void {
    const outletRelationships = (this.form.get('outletRelationships') as UntypedFormArray)
      .getRawValue()
      .map(outletRelationship => {
        const { relatedBusinessSiteId, relationshipDefCode } = outletRelationship;
        return {
          relatedBusinessSiteId,
          relationshipDefCode
        };
      });

    this.outletRelationshipsService
      .update(this.outletId, { outletRelationships })
      .pipe(
        tap(() => {
          this.form.markAsPristine();
          this.outletRelationshipsTableComponent.form.markAsPristine();
          this.saveButtonDisabled = true;
          this.cancelButtonDisabled = true;
          this.snackBarService.showInfo('OUTLET_RELATIONSHIPS_UPDATE_SUCCESS');
        }),
        catchError(error => {
          this.saveButtonDisabled = false;
          this.cancelButtonDisabled = false;
          this.snackBarService.showError(error);
          return of(error);
        })
      )
      .subscribe();
  }

  cancel(): void {
    this.outletRelationshipsTableComponent.initForm();
  }

  canDeactivate(): boolean {
    return this.saveButtonDisabled && this.cancelButtonDisabled;
  }

  private getOutletIdByRouteParams(): Observable<string> {
    return this.route.paramMap.pipe(
      map((params: ParamMap) => {
        return params.get(paramOutletId) || '';
      })
    );
  }
}
