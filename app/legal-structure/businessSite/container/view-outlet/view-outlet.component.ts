import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  OnDestroy,
  OnInit,
  Type,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject, combineLatest, of } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  switchMap,
  take,
  takeUntil
} from 'rxjs/operators';

import { UserAuthorizationService } from '../../../../iam/user/user-authorization.service';
import { Brand } from '../../../../services/brand/brand.model';
import { OfferedServiceService } from '../../../../services/offered-service/offered-service.service';
import { ServiceVariantService } from '../../../../services/service-variant/service-variant.service';
import { ToggleAffiliate } from '../../../../structures/outlet-structure/container/outlet-tree-navigation/outlet-tree-navigation.component';
import { OutletStructureService } from '../../../../structures/outlet-structure/services/outlet-structure.service';
import { AssignableType } from '../../../../traits/label/label.model';
import { LabelService } from '../../../../traits/label/label.service';
import { paramOutletId } from '../../../legal-structure-routing-paths';
import { Address } from '../../../shared/models/address.model';
import { Outlet } from '../../../shared/models/outlet.model';
import * as fromOutlet from '../../../store';
import { VerificationRequestComponent } from '../../../verification-request/container/verification-request.component';
import { MenuAction, MenuItem } from '../../models/menu-item.model';
import { BusinessSiteActionService } from '../../services/business-site-action.service';
import { BusinessSiteStoreService } from '../../services/business-site-store.service';
import { NavigationPermissionsService } from '../../services/navigation-permission.service';
import { NavigationPermissions } from '../../services/navigation-permissions.model';
import {
  selectAddressState,
  selectBrandIdsState,
  selectBusinessNamesState,
  selectCountryState,
  selectDistributionLevelTags,
  selectDistributionLevelsState,
  selectIsOutletLoadingState
} from '../../store/selectors';
import { FeatureToggleService } from "../../../../shared/directives/feature-toggle/feature-toggle.service";
import { FEATURE_NAMES } from "../../../../shared/model/constants";
import { ExternalKeyTypeService } from "../../../../traits/keys/external-key-type-selection/external-key-type.service";
import {BusinessSiteTaskService} from "../../../../tasks/shared/business-site-task.service";

@Component({
  selector: 'gp-view-outlet',
  templateUrl: './view-outlet.component.html',
  styleUrls: ['./view-outlet.component.scss']
})
export class ViewOutletComponent implements OnInit, OnDestroy {
  isOutletLoading: Observable<boolean>;
  outletId: string;
  countryId: string;
  outlet: Observable<Outlet>;
  address: Observable<Address | undefined>;
  hasUserUpdatePermission: boolean;
  headerMenu: MenuItem[];
  gpsMenu: MenuItem[];
  poBoxMenu: MenuItem[];
  businessNames: Observable<string[]>;
  marketStructureTags: Observable<string[]>;
  distributionLevelTags: Observable<string[]>;
  outletChips: string[] = [];
  distributionLevelChips: string[] = [];
  brands: Observable<string[]>;
  hasAssignableLabels: boolean;
  allBrands: Observable<Brand[]>;
  provideToggleAffiliate: ToggleAffiliate;
  type: Type<VerificationRequestComponent>;
  componentRef: ComponentRef<VerificationRequestComponent>;
  hasUserTasksUpdatePermission: boolean;
  tasksFeatureToggleFlag: boolean;
  @ViewChild('VerificationRequestComponent')
  public verificationRequest: VerificationRequestComponent;

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private externalKeyTypeService: ExternalKeyTypeService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private store: Store<fromOutlet.State>,
    private actionService: BusinessSiteActionService,
    private labelService: LabelService,
    private structureStoreService: OutletStructureService,
    private navigationPermissionService: NavigationPermissionsService,
    private translationService: TranslateService,
    private resolver: ComponentFactoryResolver,
    private userAuthorizationService: UserAuthorizationService,
    public viewContainerRef: ViewContainerRef,
    private businessSiteStoreService: BusinessSiteStoreService,
    private offeredServiceService: OfferedServiceService,
    private serviceVariantService: ServiceVariantService,
    private featureToggleService: FeatureToggleService,
    private businessSiteTaskService: BusinessSiteTaskService
  ) {
    this.outlet = this.businessSiteStoreService.getOutlet();
    this.address = this.store.pipe(select(selectAddressState));
    this.isOutletLoading = this.store.pipe(select(selectIsOutletLoadingState));
    this.businessNames = store.pipe(select(selectBusinessNamesState));
    this.marketStructureTags = this.structureStoreService.getSelectedOutletMarketStructureTags();
    this.distributionLevelTags = this.store.pipe(select(selectDistributionLevelTags));
    this.brands = this.store.pipe(select(selectBrandIdsState));
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(takeUntil(this.unsubscribe)).subscribe(paramMap => {
      this.outletId = paramMap.get(paramOutletId) ?? '';
      this.initOutletOfferedService(this.outletId);
    });

    combineLatest([this.outlet, this.marketStructureTags, this.distributionLevelTags])
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(([currentOutlet, selectedOutletMarketStructureTags, distributionLevelTags]) => {
        this.countryId = currentOutlet.countryId;
        this.outletChips =
          currentOutlet && currentOutlet.affiliate
            ? [
                this.translationService.instant('AFFILIATE_OF_DAIMLER'),
                ...selectedOutletMarketStructureTags
              ]
            : [...selectedOutletMarketStructureTags];
        this.distributionLevelChips = distributionLevelTags;
      });

    this.outlet.pipe(takeUntil(this.unsubscribe)).subscribe(outlet => {
      this.provideToggleAffiliate = {
        isActive: outlet.registeredOffice ? outlet.registeredOffice : false,
        isAffiliate: outlet.affiliate
      };
    });

    this.serviceVariantService.fetchAllBy(this.outletId);

    this.navigationPermissionService
      .getPermissions()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(permissions => {
        this.initMainTileNavigationItems(permissions);
      });

    this.initHasUserUpdatePermission();
    this.initHasPermissionsAndAssignableLabels();
    this.getTasksFeatureToggle();
    this.initHasUserTasksUpdatePermission();
    this.preloadData();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  tilesMenuItemClicked(event: MenuAction): void {
    switch (event.action) {
      case 'SERVICES_PAGE': {
        this.navigateTo('services', event.param ? event.param : '');
        break;
      }
      case 'SHAREHOLDER_PAGE': {
        this.navigateTo('shareholder', event.param ? event.param : '');
        break;
      }
      case 'EDIT_KEYS': {
        this.navigateTo('keys', event.param ? event.param : '');
        break;
      }
      case 'EDIT_LABELS': {
        this.navigateTo('labels', event.param ? event.param : '');
        break;
      }
      case 'BASE_DATA_PAGE': {
        this.navigateTo('edit', event.param ? event.param : '');
        break;
      }
      case 'EDIT_LEGAL': {
        this.navigateTo('legal', event.param ? event.param : '');
        break;
      }
      case 'GENERAL_COMMUNICATION_PAGE': {
        this.navigateTo('general-communication', event.param ? event.param : '');
        break;
      }
      case 'EDIT_OUTLET_RELATIONSHIPS': {
        this.navigateTo('outlet-relationships', event.param ? event.param : '');
        break;
      }
      case 'HISTORIZATION_PAGE': {
        this.navigateTo('history', event.param ? event.param : '');
        break;
      }
      case 'INITIATE_DATA_VERIFICATION': {
        this.openDataVerification();
        break;
      }
      default: {
        console.error(`Unknown user action: ${event}`);
        break;
      }
    }
  }

  toggleAffiliate(outletId: string): void {
    this.outlet
      .pipe(
        take(1),
        filter(lastLoadedOutlet => lastLoadedOutlet.id === outletId)
      )
      .subscribe(outlet => {
        this.actionService.dispatchToggleAffiliateForOutlet(outlet);
      })
      .unsubscribe();
  }

  private navigateTo(relativeTarget: string, fragment: string): void {
    if (fragment && fragment.length > 0) {
      this.router.navigate([relativeTarget], {
        relativeTo: this.activatedRoute,
        fragment: fragment
      });
    } else {
      this.router.navigate([relativeTarget], { relativeTo: this.activatedRoute });
    }
  }

  private initMainTileNavigationItems(permissions: NavigationPermissions): void {
    this.headerMenu = new Array<MenuItem>(
      {
        label: 'BASE_DATA',
        action: 'BASE_DATA_PAGE'
      },
      {
        label: 'KEYS',
        action: 'EDIT_KEYS'
      }
    );

    if (permissions.assignedBrandLabelsEnabled) {
      this.headerMenu.push({
        label: 'LABELS',
        action: 'EDIT_LABELS'
      });
    }

    this.headerMenu.push({
      label: 'GENERAL_COMMUNICATION',
      action: 'GENERAL_COMMUNICATION_PAGE'
    });

    this.headerMenu.push({
      label: 'LEGAL_INFO',
      action: 'EDIT_LEGAL'
    });

    if (permissions.servicesEnabled) {
      this.headerMenu.push({
        label: 'OPENING_HOURS_VIA_SERVICES',
        action: 'SERVICES_PAGE'
      });
      this.headerMenu.push({
        label: 'SERVICES',
        action: 'SERVICES_PAGE'
      });
    }

    if (permissions.shareHolderEnabled) {
      this.headerMenu.push({
        label: 'SHAREHOLDER',
        action: 'SHAREHOLDER_PAGE'
      });
    }

    if (permissions.outletRelationshipsEnabled) {
      this.headerMenu.push({
        label: 'OUTLET_RELATIONSHIPS',
        action: 'EDIT_OUTLET_RELATIONSHIPS'
      });
    }

    if (permissions.historizationEnabled) {
      this.headerMenu.push({
        label: 'HISTORY',
        action: 'HISTORIZATION_PAGE'
      });
    }

    if (permissions.dataVerificationEnabled) {
      this.headerMenu.push({
        label: 'VERIFICATION_REQUEST',
        action: 'INITIATE_DATA_VERIFICATION',
        highlight: true
      });
    }
  }

  private initTilesMenueItems(hasUserUpdatePermission: boolean): void {
    const label = hasUserUpdatePermission ? 'TILE_DETAILS_EDIT' : 'TILE_DETAILS';
    this.gpsMenu = new Array<MenuItem>({
      label: label,
      action: 'BASE_DATA_PAGE',
      param: 'gpsCoordinates'
    });

    this.poBoxMenu = new Array<MenuItem>({
      label: label,
      action: 'BASE_DATA_PAGE',
      param: 'poBox'
    });
  }

  private initHasUserUpdatePermission(): void {
    combineLatest([this.outlet, this.store.pipe(select(selectDistributionLevelsState))])
      .pipe(
        switchMap((data: [Outlet, string[]]) => {
          const [outlet, distributionLevels] = data;
          return this.userAuthorizationService.isAuthorizedFor
            .permissions(['legalstructure.businesssite.update'])
            .businessSite(outlet.id)
            .country(outlet.countryId)
            .distributionLevels(distributionLevels)
            .verify();
        }),
        takeUntil(this.unsubscribe)
      )
      .subscribe(hasPermission => {
        this.hasUserUpdatePermission = hasPermission;
        this.initTilesMenueItems(hasPermission);
      });
  }

  private initHasPermissionsAndAssignableLabels(): void {
    combineLatest([
      this.userAuthorizationService.isAuthorizedFor
        .permissions(['traits.assignedbrandlabel.read'])
        .verify(),
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
        this.hasAssignableLabels = isPermittedAndHasAssignableLabels;
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

  private initHasUserTasksUpdatePermission(): void {
    combineLatest([this.outlet, this.store.pipe(select(selectDistributionLevelsState))])
      .pipe(
        switchMap((data: [Outlet, string[]]) => {
          const [outlet, distributionLevels] = data;
          return this.userAuthorizationService.isAuthorizedFor
            .permissions(['tasks.task.update'])
            .businessSite(outlet.id)
            .country(outlet.countryId)
            .distributionLevels(distributionLevels)
            .verify();
        }),
        takeUntil(this.unsubscribe)
      )
      .subscribe(hasPermission => {
        this.hasUserTasksUpdatePermission = hasPermission;
      });
  }

  private preloadData(): void {
    this.externalKeyTypeService
      .getAll(this.outletId)
      .pipe(take(1))
      .subscribe();

    this.featureToggleService.isFeatureEnabled('FOR_RETAIL').pipe(
      take(1)
    ).subscribe();
    this.businessSiteTaskService.findAllDataVerificationFields().pipe(
      take(1)
    ).subscribe();
  }

  private openDataVerification(): void {
    const componentFactory = this.resolver.resolveComponentFactory(VerificationRequestComponent);
    this.componentRef = this.viewContainerRef.createComponent(componentFactory);
    const instance = this.componentRef.instance;

    instance.isInitialized.pipe(takeUntil(this.unsubscribe)).subscribe(() => instance.openDialog());

    instance.isClosed
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => this.componentRef.destroy());
  }

  private initOutletOfferedService(outletId: string): void {
    if (outletId !== '') {
      this.offeredServiceService.fetchAllForOutlet(outletId);
    }
  }

  getTasksFeatureToggle(): void {
    this.featureToggleService
      .isFeatureEnabled(FEATURE_NAMES.FOR_RETAIL_TASKS_TILE)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (featureEnabled: boolean) => this.tasksFeatureToggleFlag = featureEnabled,
        () => this.tasksFeatureToggleFlag = false
      );
  }
}
