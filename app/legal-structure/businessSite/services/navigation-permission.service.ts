import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of, Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  switchMap,
  take,
  takeUntil
} from 'rxjs/operators';

import { RetailRolloutService } from '../../../iam/shared/services/retail-rollout/retail-rollout.service';
import { UserAuthorizationService } from '../../../iam/user/user-authorization.service';
import { OfferedServiceService } from '../../../services/offered-service/offered-service.service';
import { ServiceVariantService } from '../../../services/service-variant/service-variant.service';
import { allowedServiceDistributionLevels } from '../../../services/services-routing.module';
import { FeatureToggleService } from '../../../shared/directives/feature-toggle/feature-toggle.service';
import { FEATURE_NAMES } from '../../../shared/model/constants';
import * as fromOutlet from '../../../store';
import { DistributionLevelsService } from '../../../traits/distribution-levels/distribution-levels.service';
import { Outlet } from '../../shared/models/outlet.model';

import { select, Store } from '@ngrx/store';
import { AssignableType } from '../../../traits/label/label.model';
import { LabelService } from '../../../traits/label/label.service';
import { selectCountryState, selectDistributionLevelsState } from '../store/selectors';
import { BusinessSiteStoreService } from './business-site-store.service';
import {
  FeatureToggles,
  NavigationPermissions,
  permissionsFrom,
  ServiceNavigationPermissions,
  UserOutletAuthorizations,
  UserPermissions
} from './navigation-permissions.model';

const PER_CREATE_INVESTORS = ['investors.currency.create', 'investors.investor.create'];
const PER_CREATE_VERIFICATION_TASK = ['tasks.task.data.verification.create'];
const PER_READ_ASSIGNED_BRAND_LABEL = ['traits.assignedbrandlabel.read'];
const PER_READ_SERVICES = ['services.service.read'];
const PER_READ_OUTLET_RELATIONSHIPS = ['structures.outletrelationships.read'];

@Injectable()
export class NavigationPermissionsService {
  private unsubscribe: Subject<void> = new Subject();
  private hasAssignableLabels = new BehaviorSubject(false);

  private featureToggles = new BehaviorSubject<FeatureToggles>({
    shareHolders: false,
    outletRelationships: false,
    historization: false
  });

  private userPermissions = new BehaviorSubject<UserPermissions>({
    createInvestors: false,
    readServices: false,
    outletRelationships: false
  });

  constructor(
    private businessSiteStoreService: BusinessSiteStoreService,
    private featureToggleService: FeatureToggleService,
    private userAuthorizationService: UserAuthorizationService,
    private retailRolloutService: RetailRolloutService,
    private offeredServiceService: OfferedServiceService,
    private serviceVariantService: ServiceVariantService,
    private distributionLevelsService: DistributionLevelsService,
    private store: Store<fromOutlet.State>,
    private labelService: LabelService
  ) {
    this.initializeFeatureToggles();
    this.initializeUserPermissions();
    this.initHasPermissionsAndAssignableLabels();
  }

  getPermissions(): Observable<NavigationPermissions> {
    return combineLatest([
      this.featureToggles.asObservable(),
      this.userPermissions.asObservable(),
      this.userOutletAuthorizations(),
      this.selectOutletServiceRestriction(),
      this.serviceDistributionLevelToggle()
    ]).pipe(
      map((data: [FeatureToggles, UserPermissions, UserOutletAuthorizations, boolean, boolean]) => {
        const [
          featureToggles,
          userPermissions,
          userOutletAuthorization,
          isAllowedService,
          isServiceDistributionLevelsToggleOn
        ] = data;
        return permissionsFrom(
          featureToggles,
          userPermissions,
          userOutletAuthorization,
          allowedServiceDistributionLevels,
          isAllowedService,
          isServiceDistributionLevelsToggleOn
        );
      })
    );
  }

  getServicePermissions(): Observable<ServiceNavigationPermissions> {
    return combineLatest([
      this.getUserServiceAuthorization(),
      this.userAuthorizationService.isAuthorizedFor
        .permissions(['services.validity.read'])
        .verify(),
      this.userAuthorizationService.isAuthorizedFor
        .permissions(['openinghours.openinghours.read'])
        .verify(),
      this.userAuthorizationService.isAuthorizedFor
        .permissions(['contracts.contract.read'])
        .verify(),
      this.userAuthorizationService.isAuthorizedFor
        .permissions(['communications.communicationdata.read'])
        .verify()
    ]).pipe(
      map(
        ([
          userIsAuthorized,
          validityEnabled,
          openingHoursEnabled,
          contractsEnabled,
          communicationEnabled
        ]) => {
          return {
            validityEnabled: userIsAuthorized && validityEnabled,
            openingHoursEnabled,
            contractsEnabled: userIsAuthorized && contractsEnabled,
            communicationEnabled
          };
        }
      )
    );
  }

  private getUserServiceAuthorization(): Observable<boolean> {
    return this.selectedOutlet().pipe(
      switchMap(outlet =>
        combineLatest([of(outlet), this.distributionLevelsService.get(outlet.id)])
      ),
      switchMap(([outlet, distributionLevels]) =>
        this.userAuthorizationService.isAuthorizedFor
          .businessSite(outlet.id)
          .country(outlet.countryId)
          .distributionLevels(distributionLevels)
          .verify()
      )
    );
  }

  private userOutletAuthorizations(): Observable<UserOutletAuthorizations> {
    return combineLatest([
      this.selectedOutlet(),
      this.selectedDistributionLevels(),
      this.selectedOutletRolledOut(),
      this.isAuthorizedForCurrentOutletCountryAndPermissions(PER_CREATE_VERIFICATION_TASK),
      this.isAuthorizedForCurrentOutletCountryAndPermissions(PER_READ_ASSIGNED_BRAND_LABEL),
      this.hasAssignableLabels
    ]).pipe(
      debounceTime(0),
      map(
        ([
          outlet,
          distributionLevels,
          isRolledOut,
          allowCreateVerificationTasks,
          allowReadAssignedBrandlabels,
           hasAssignableLabels
        ]) => {
          return {
            outlet,
            distributionLevels,
            allowCreateVerificationTasks,
            allowReadAssignedBrandlabels,
            hasAssignableLabels,
            isRolledOut
          };
        }
      )
    );
  }

  private initializeFeatureToggles(): void {
    combineLatest([
      this.featureToggleService.isFeatureEnabled(FEATURE_NAMES.LINK_TO_SHAREHOLDER),
      this.featureToggleService.isFeatureEnabled(FEATURE_NAMES.OUTLET_RELATIONSHIPS),
      this.featureToggleService.isFeatureEnabled(FEATURE_NAMES.HISTORIZATION)
    ])
      .pipe(take(1))
      .subscribe(([shareHolders, outletRelationships, historization]) =>
        this.featureToggles.next({ shareHolders, outletRelationships, historization })
      );
  }

  private initializeUserPermissions(): void {
    combineLatest([
      this.userAuthorizationService.isAuthorizedFor.permissions(PER_CREATE_INVESTORS).verify(),
      this.userAuthorizationService.isAuthorizedFor.permissions(PER_READ_SERVICES).verify(),
      this.isAuthorizedForCurrentOutletCountryAndPermissions(PER_READ_OUTLET_RELATIONSHIPS)
    ]).subscribe(([createInvestors, readServices, outletRelationships]) =>
      this.userPermissions.next({
        createInvestors,
        readServices,
        outletRelationships
      })
    );
  }

  private isAuthorizedForCurrentOutletCountryAndPermissions(
    permissions: string[]
  ): Observable<boolean> {
    return this.businessSiteStoreService
      .getOutlet()
      .pipe(
        switchMap((outlet: Outlet) =>
          this.userAuthorizationService.isAuthorizedFor
            .country(outlet.countryId)
            .permissions(permissions)
            .verify()
        )
      );
  }

  private selectedOutletRolledOut(): Observable<boolean> {
    return this.businessSiteStoreService
      .getOutlet()
      .pipe(switchMap((outlet: Outlet) => this.retailRolloutService.isRolledOutFor(outlet.id)));
  }

  private selectedOutlet(): Observable<Outlet> {
    return this.businessSiteStoreService.getOutlet();
  }

  private selectedDistributionLevels(): Observable<string[]> {
    return this.businessSiteStoreService.getDistributionLevels();
  }

  private selectOutletServiceRestriction(): Observable<boolean> {
    return combineLatest([
      this.serviceVariantService.isEmpty(),
      this.offeredServiceService.isEmpty()
    ]).pipe(
      map(([isServiceVariantEmpty, isOfferedServiceEmpty]) => {
        const isEmpty = isServiceVariantEmpty && isOfferedServiceEmpty;
        return !isEmpty;
      })
    );
  }

  private serviceDistributionLevelToggle(): Observable<boolean> {
    return this.featureToggleService.isFeatureEnabled(
      FEATURE_NAMES.SERVICES_DISTRIBUTION_LEVEL_RESTRICTION
    );
  }

  private initHasPermissionsAndAssignableLabels(): void {
    combineLatest([
      this.isAuthorizedForCurrentOutletCountryAndPermissions(PER_READ_ASSIGNED_BRAND_LABEL),
      this.store.pipe(select(selectDistributionLevelsState)),
      this.store.pipe(
        select(selectCountryState),
        filter(country => country !== undefined)
      )
    ])
      .pipe(
        distinctUntilChanged(),
        mergeMap(([hasPermission, distributionLevels, country]) => {
          return hasPermission && country
            ? this.initHasAssignableLabels(distributionLevels, country.id)
            : of(false);
        }),
        takeUntil(this.unsubscribe)
      )
      .subscribe(isPermittedAndHasAssignableLabels => {
        this.hasAssignableLabels.next(isPermittedAndHasAssignableLabels);
      });
  }

  private initHasAssignableLabels(
    distributionLevels: string[],
    countryId: string
  ): Observable<boolean> {
    return this.labelService.getAllAssignable(AssignableType.BRAND).pipe(
      map(allAssignableLabels => {
        return (
          allAssignableLabels
            .filter(
              label =>
                label.restrictedToDistributionLevels &&
                (label.restrictedToDistributionLevels.length === 0 ||
                  label.restrictedToDistributionLevels.some(restrictedToDistributionLevel =>
                    distributionLevels.includes(restrictedToDistributionLevel)
                  ))
            )
            .filter(
              label =>
                label.restrictedToCountryIds &&
                (label.restrictedToCountryIds.length === 0 ||
                  label.restrictedToCountryIds.includes(countryId))
            ).length > 0
        );
      }),
      takeUntil(this.unsubscribe)
    );
  }
}
