import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { uniq } from 'ramda';
import { combineLatest, Observable, of, Subject, zip } from 'rxjs';
import { distinctUntilChanged, map, mergeMap, switchMap, takeUntil, tap } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { AppConfigProvider } from '../../../app-config.service';
import { UserAuthorizationService } from '../../../iam/user/user-authorization.service';
import { UserService } from '../../../iam/user/user.service';
import { LegalStructureRoutingService } from '../../../legal-structure/legal-structure-routing.service';
import { OutletService } from '../../../legal-structure/shared/services/outlet.service';
import { BreadcrumbItem } from '../../../main/header/models/header.model';
import { BrandProductGroupValidity } from '../../../services/offered-service/brand-product-group-validity.model';
import { Service } from '../../../services/service/models/service.model';
import { BrandProductGroupsData } from '../../../services/shared/components/brand-product-groups-data-table/brand-product-groups-data-table.component';
import { CanDeactivateComponent } from '../../../shared/guards/can-deactivate-guard.model';
import { simpleCompare } from '../../../shared/util/simple-compare';
import { DistributionLevelsService } from '../../../traits/distribution-levels/distribution-levels.service';
import { UserSettingsService } from '../../../user-settings/user-settings/services/user-settings.service';
import { ContractsService } from '../../contracts.service';
import { Address } from '../../model/address.model';
import {
  BrandProductGroupId,
  BrandProductGroupsGroupedByBrandId
} from '../../model/brand-product-group-id.model';
import { BusinessSite } from '../../model/business-site.model';
import { Company } from '../../model/company.model';
import { Contract } from '../../model/contract.model';
import { OfferedService } from '../../model/offered-service.model';
import minusBrandProductGroupIds = BrandProductGroupId.minusBrandProductGroupIds;
import { ServiceService } from '../../../services/service/services/service.service';

export interface EditContractsQueryParams {
  serviceId: number;
  serviceCharacteristicId?: number;
  productCategoryId: number;
}

@Component({
  selector: 'gp-edit-contracts',
  templateUrl: './edit-contracts.component.html',
  styleUrls: ['./edit-contracts.component.scss'],
  providers: [ContractsService]
})
export class EditContractsComponent implements OnInit, OnDestroy, CanDeactivateComponent {
  outletId: Observable<string>;
  contractees: Observable<BrandProductGroupsData<BusinessSite & Address>[]>;
  brandProductGroupValidities: Observable<BrandProductGroupValidity[]>;
  offeredServicesBrandProductGroups: Observable<BrandProductGroupsGroupedByBrandId>;
  countryRestrictions: Observable<string[]>;
  contractor: BusinessSite & Company;
  currentSelectedLanguage?: string;
  serviceCharacteristicName?: string;
  isLoading: boolean;
  breadcrumbItems: BreadcrumbItem[];
  saveButtonDisabled = true;
  cancelButtonDisabled = true;
  userHasPermission: Observable<boolean>;
  service: Service | undefined;

  private pageParams: EditContractsQueryParams;
  private unsubscribe = new Subject<void>();

  constructor(
    private contractsService: ContractsService,
    private userService: UserService,
    private legalStructureRoutingService: LegalStructureRoutingService,
    private distributionLevelService: DistributionLevelsService,
    private activatedRoute: ActivatedRoute,
    private outletService: OutletService,
    private userAuthorizationService: UserAuthorizationService,
    private router: Router,
    private serviceService: ServiceService,
    private userSettingsService: UserSettingsService,
    private appConfigProvider: AppConfigProvider
  ) {}

  ngOnInit(): void {
    this.outletId = this.legalStructureRoutingService.outletIdChanges;
    this.isLoading = true;
    this.countryRestrictions = this.userService.getCountryRestrictions();
    this.initBrandProductGroupValidity();
    this.initOfferedServicesBrandProductGroups();
    this.initContractor();
    this.initContractees();
    this.initPermissions();
    this.initServiceNames();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  upsertContracts(
    newContracteeId: string,
    oldContractee: BrandProductGroupsData<BusinessSite & Address>
  ): void {
    this.contractsService.upsertContracts(
      newContracteeId,
      oldContractee.brandProductGroupIds,
      this.pageParams.productCategoryId,
      this.pageParams.serviceId,
      this.pageParams.serviceCharacteristicId,
      oldContractee.data ? undefined : this.contractor
    );

    this.enableDefaultEditActions();
  }

  mergeContracts(changedContracts: BrandProductGroupsData<BusinessSite & Address>[]): void {
    const isNewContract = changedContracts.length === 1;

    changedContracts.forEach(changedContract => {
      if (changedContract.data && changedContract.brandProductGroupIds.length > 0) {
        this.contractsService.upsertContracts(
          changedContract.data.id,
          changedContract.brandProductGroupIds,
          this.pageParams.productCategoryId,
          this.pageParams.serviceId,
          this.pageParams.serviceCharacteristicId,
          isNewContract ? this.contractor : undefined
        );
      } else {
        this.contractsService.deleteContracts(
          changedContract.brandProductGroupIds,
          this.pageParams.productCategoryId,
          this.pageParams.serviceId,
          this.pageParams.serviceCharacteristicId
        );
      }
    });

    this.enableDefaultEditActions();
  }

  save(): void {
    this.contractsService.saveContracts(this.contractor.id);
    this.disableDefaultEditActions();
  }

  reset(): void {
    this.initOfferedServicesBrandProductGroups();
    this.initBrandProductGroupValidity();
    this.contractsService.loadContracts(this.contractor.id);
    this.disableDefaultEditActions();
  }

  deleteContractPartner(brandProductGroupIds: BrandProductGroupId[]): void {
    this.contractsService.deleteContracts(
      brandProductGroupIds,
      this.pageParams.productCategoryId,
      this.pageParams.serviceId,
      this.pageParams.serviceCharacteristicId
    );

    this.enableDefaultEditActions();
  }

  navigateToContractPartnerOutlet(outletId: string): void {
    const origin = window.location.origin;
    const baseUrl = environment.settings.baseUrl || '/';
    window.open(`${origin}${baseUrl}app/outlet/${outletId}`, '_blank');
  }

  canDeactivate(): boolean {
    if (this.saveButtonDisabled && this.cancelButtonDisabled) {
      return true;
    }
    return false;
  }

  isUserPermittedFor(brandProductGroupIds: BrandProductGroupId[]): Observable<boolean> {
    return zip(
      ...brandProductGroupIds.map(brandProductGroup =>
        this.isUserPermittedForBrandProductGroup(
          brandProductGroup.brandId,
          brandProductGroup.productGroupId
        )
      )
    ).pipe(map(results => results.every(result => result === true)));
  }

  getContextId(rowIndex: number): string {
    return 'ContractPartner-' + this.pageParams.serviceId + rowIndex;
  }

  getEnableCompanyNavigation(): boolean {
    return this.appConfigProvider.getAppConfig().enableCompanyNavigationOnNewPage;
  }

  private isUserPermittedForBrandProductGroup(
    brandId: string,
    productGroupId: string
  ): Observable<boolean> {
    return this.userAuthorizationService.isAuthorizedFor
      .brand(brandId)
      .productGroup(productGroupId)
      .verify();
  }

  private initBrandProductGroupValidity(): void {
    this.brandProductGroupValidities = this.getOfferedServices().pipe(
      distinctUntilChanged(simpleCompare),
      map(uniq),
      map(OfferedService.mapToBrandProductGroupValidities)
    );
  }

  private initContractor(): void {
    this.contractsService
      .getContractor()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(contractor => {
        this.contractor = contractor;
      });
  }

  private initContractees(): void {
    this.contractees = combineLatest([this.getOfferedServices(), this.getContracts()]).pipe(
      takeUntil(this.unsubscribe),
      map(([offeredServices, contracts]) => {
        const contractees = Contract.mapToBrandProductGroupsContractees(contracts);
        const brandProductGroupIdsOfContracts: BrandProductGroupId[] =
          Contract.mapToBrandProductGroupIds(contracts);
        const brandProductGroupIdsOfOfferedServices =
          OfferedService.mapToBrandProductGroupIds(offeredServices);
        const brandProductGroupIdsWithoutContract = brandProductGroupIdsOfOfferedServices.filter(
          minusBrandProductGroupIds(brandProductGroupIdsOfContracts)
        );

        contractees.sort((first, second) => {
          if (first.data && second.data) {
            if (first.data.legalName < second.data.legalName) {
              return -1;
            }
            if (first.data.legalName > second.data.legalName) {
              return 1;
            }
          }
          return 0;
        });

        if (brandProductGroupIdsWithoutContract.length > 0) {
          const newContractee = {
            data: undefined,
            brandProductGroupIds: brandProductGroupIdsWithoutContract
          } as BrandProductGroupsData<BusinessSite & Address>;

          if (contractees.length > 0) {
            return [...contractees, newContractee];
          }

          return [newContractee];
        }

        return contractees;
      }),
      tap(() => (this.isLoading = false))
    );
  }

  private getContracts(): Observable<Contract[]> {
    return this.getActivatedRouteQueryParams().pipe(
      mergeMap(({ productCategoryId, serviceId, serviceCharacteristicId }) => {
        return this.contractsService
          .getContractsOfContractor()
          .pipe(
            Contract.filterBy(
              +productCategoryId,
              +serviceId,
              serviceCharacteristicId ? +serviceCharacteristicId : undefined
            )
          );
      })
    );
  }

  private getOfferedServices(): Observable<OfferedService[]> {
    return this.getActivatedRouteQueryParams().pipe(
      mergeMap(({ productCategoryId, serviceId, serviceCharacteristicId }) => {
        return this.contractsService
          .getOfferedServicesOfContractor()
          .pipe(
            OfferedService.filterBy(
              +productCategoryId,
              +serviceId,
              serviceCharacteristicId ? +serviceCharacteristicId : undefined
            )
          );
      })
    );
  }

  private initServiceNames(): void {
    this.activatedRoute.queryParams
      .pipe(
        switchMap(({ serviceId, serviceCharacteristicId }) => {
          return combineLatest([
            this.contractsService.getOfferedServicesOfContractor(),
            this.userSettingsService.getLanguageId(),
            this.serviceService
              .selectBy(serviceId)
              .pipe(tap(service => service ?? this.serviceService.fetchBy(serviceId))),
            of(serviceId),
            of(serviceCharacteristicId)
          ]);
        })
      )
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(([offeredServices, languageId, service, serviceId, serviceCharacteristicId]) => {
        this.service = service;
        const foundService = offeredServices.find(
          offeredService =>
            serviceId === offeredService.serviceId &&
            serviceCharacteristicId === offeredService.serviceCharacteristicId
        );
        if (foundService) {
          this.serviceCharacteristicName = foundService.serviceCharacteristic;
        }
        this.currentSelectedLanguage = languageId;
      });
  }

  private getActivatedRouteQueryParams(): Observable<Params> {
    return this.activatedRoute.queryParams.pipe(
      tap(({ productCategoryId, serviceId, serviceCharacteristicId }) => {
        if (!productCategoryId || !serviceId) {
          this.router.navigate(['../'], { relativeTo: this.activatedRoute });
        }
        this.disableDefaultEditActions();
        this.pageParams = {
          productCategoryId: +productCategoryId,
          serviceId: +serviceId,
          serviceCharacteristicId: serviceCharacteristicId ? +serviceCharacteristicId : undefined
        };
      })
    );
  }

  private initOfferedServicesBrandProductGroups(): void {
    this.offeredServicesBrandProductGroups = this.getOfferedServices().pipe(
      map(OfferedService.mapToBrandProductGroupIds),
      distinctUntilChanged(simpleCompare),
      map(uniq),
      map(BrandProductGroupId.groupByBrandId)
    );
  }

  private enableDefaultEditActions(): void {
    this.disableDefaultEditActions(false);
  }

  private disableDefaultEditActions(disable: boolean = true): void {
    this.saveButtonDisabled = disable;
    this.cancelButtonDisabled = disable;
  }

  private evaluateUserPermissions(outletId: string, countryId: string): void {
    let permission: string;
    this.userHasPermission = this.distributionLevelService.getDistributionLevelsOfOutlet().pipe(
      switchMap(distributionLevels => {
        permission = distributionLevels.includes('TEST_OUTLET')
          ? 'contracts.testoutlet.update'
          : 'contracts.contract.update';
        return this.userAuthorizationService.isAuthorizedFor
          .permissions([permission])
          .businessSite(outletId)
          .country(countryId)
          .distributionLevels(distributionLevels)
          .verify();
      })
    );
  }

  private initPermissions(): void {
    this.outletId
      .pipe(
        takeUntil(this.unsubscribe),
        switchMap(outletId =>
          combineLatest([of(outletId), this.outletService.getOrLoadBusinessSite(outletId)])
        )
      )
      .subscribe(([outletId, outlet]) => {
        this.evaluateUserPermissions(outletId, outlet.countryId);
      });
  }
}
