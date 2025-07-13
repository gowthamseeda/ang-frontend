import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { combineLatest, Observable, Subject } from 'rxjs';
import { delay, map, switchMap, takeUntil } from 'rxjs/operators';

import { UserAuthorizationService } from '../../../iam/user/user-authorization.service';
import { paramOutletId } from '../../../legal-structure/legal-structure-routing-paths';
import { Outlet } from '../../../legal-structure/shared/models/outlet.model';
import { OutletService } from '../../../legal-structure/shared/services/outlet.service';
import { FeatureToggleService } from '../../../shared/directives/feature-toggle/feature-toggle.service';
import { CanDeactivateComponent } from '../../../shared/guards/can-deactivate-guard.model';
import { DistributionLevelsService } from '../../distribution-levels/distribution-levels.service';
import { KeyTableComponent } from '../key-table/key-table.component';
import { KeyTableService } from '../key-table/key-table.service';

const keyPermissions = [
  'traits.alias.update',
  'traits.alias.delete',
  'traits.adamid.create',
  'traits.adamid.delete',
  'traits.brandcode.create',
  'traits.brandcode.update',
  'traits.brandcode.delete'
];

const externalKeyPermissions = ['traits.externalkey.update'];

@Component({
  selector: 'gp-edit-keys',
  templateUrl: './edit-keys.component.html',
  styleUrls: ['./edit-keys.component.scss']
})
export class EditKeysComponent implements OnInit, OnDestroy, AfterViewInit, CanDeactivateComponent {
  savedKeys: Observable<boolean>;
  outlet: Observable<Outlet>;
  isAuthorizedToEdit: Observable<boolean>;
  isNotAuthorizedForBusinessSite: Observable<boolean>;
  saveButtonDisabled = true;
  cancelButtonDisabled = true;
  focusEnabled: Observable<boolean>;
  @ViewChild(KeyTableComponent) keyTableComponent: KeyTableComponent;

  private fragment: string;
  private unsubscribe = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private changeDetector: ChangeDetectorRef,
    private outletService: OutletService,
    private keyTableService: KeyTableService,
    private userAuthorizationService: UserAuthorizationService,
    private distributionLevelsService: DistributionLevelsService,
    private featureToggleService: FeatureToggleService
  ) {
    this.savedKeys = this.keyTableService.saveKeys().pipe(delay(1000));
  }

  ngOnInit(): void {
    if (this.route.fragment) {
      this.route.fragment.pipe(takeUntil(this.unsubscribe)).subscribe(fragment => {
        if (fragment) {
          this.fragment = fragment;
        }
      });
    }
    this.outlet = this.loadOutlet();
    this.evaluateAuthorization();
    this.getFocusEnabled();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ngAfterViewInit(): void {
    this.changeDetector.detectChanges();

    setTimeout(() => {
      const element = document.getElementById(this.fragment);
      if (element) {
        element.scrollIntoView();
      }
    }, 250);
  }

  canDeactivate(): Observable<boolean> | boolean {
    return this.keyTableComponent ? this.keyTableComponent.keysForm.pristine : true;
  }

  private getOutletIdByRouteParams(): Observable<string> {
    return this.route.paramMap.pipe(
      map((params: ParamMap) => {
        return params.get(paramOutletId) || '';
      })
    );
  }

  private loadOutlet(): Observable<Outlet> {
    return this.getOutletIdByRouteParams().pipe(
      takeUntil(this.unsubscribe),
      switchMap((outletId: string) => this.outletService.getOrLoadBusinessSite(outletId))
    );
  }

  private evaluateAuthorization(): void {
    this.isNotAuthorizedForBusinessSite = combineLatest([
      this.outlet,
      this.distributionLevelsService.getDistributionLevelsOfOutlet()
    ]).pipe(
      switchMap((data: [Outlet, string[]]) => {
        const [outlet, distributionLevels] = data;
        return this.userAuthorizationService.isAuthorizedFor
          .businessSite(outlet.id)
          .country(outlet.countryId)
          .distributionLevels(distributionLevels)
          .verify()
          .pipe(map(isAuthorized => !isAuthorized));
      }),
      takeUntil(this.unsubscribe)
    );

    this.isAuthorizedToEdit = combineLatest([
      this.isNotAuthorizedForBusinessSite,
      this.userAuthorizationService.isAuthorizedFor.permissions(keyPermissions).verify(),
      this.userAuthorizationService.isAuthorizedFor.permissions(externalKeyPermissions).verify()
    ]).pipe(
      map(([isNotAuthorizedForBusinessSite, isAuthorizedForKeys, isAuthorizedForExternalKeys]) => {
        if (isNotAuthorizedForBusinessSite) {
          return false;
        }

        return isAuthorizedForKeys || isAuthorizedForExternalKeys;
      })
    );
  }

  private getFocusEnabled(): void {
    this.focusEnabled = this.featureToggleService.isFocusFeatureEnabled().pipe(
      map((focusEnabled: boolean) => {
        return focusEnabled;
      })
    );
  }
}
