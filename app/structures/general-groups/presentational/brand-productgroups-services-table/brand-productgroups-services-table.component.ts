import { KeyValue } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { uniqBy } from 'ramda';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { UserService } from '../../../../iam/user/user.service';
import { MasterBrandService } from '../../../../master/brand/master-brand/master-brand.service';
import { ServiceVariantDataService } from '../../../../services/service-variant/store/service-variant-data.service';
import { intersectFilter } from '../../../../shared/util/arrays';
import { GeneralGroupsService } from '../../general-groups.service';
import { AllowedService } from '../../model/allowed-service.model';
import { BrandProductGroupServiceId } from '../../model/brand-product-group-service.model';
import { BrandProductgroupsServicesSelectionComponent } from '../brand-productgroups-services-selection/brand-productgroups-services-selection.component';
import { BrandService } from '../../../../services/brand/brand.service';

@Component({
  selector: 'gp-brand-productgroups-services-table',
  templateUrl: './brand-productgroups-services-table.component.html',
  styleUrls: ['./brand-productgroups-services-table.component.scss']
})
export class BrandProductgroupsServicesTableComponent implements OnInit, OnChanges, OnDestroy {
  @Input() brandProductGroupsServicesRows: Map<string, BrandProductGroupServiceId[]>;
  @Input() countryId: string;
  @Input() readOnly: boolean;
  @Input() disabled = false;
  @Output() brandProductGroupServiceIdsChange = new EventEmitter<BrandProductGroupServiceId[]>();
  displayedColumns: string[] = ['brands', 'productGroups', 'services', 'actions'];
  allowedServices: AllowedService[] = [];
  allBrandIds: string[] = [];
  authorizedBrands: string[] = [];
  authorizedProductGroups: string[] = [];
  brandProductGroupCombinations: Map<string, string[]>;

  private unsubscribe = new Subject<void>();

  constructor(
    private generalGroupsService: GeneralGroupsService,
    private brandService: BrandService,
    private userService: UserService,
    private masterBrandService: MasterBrandService,
    private serviceVariantDataService: ServiceVariantDataService,
    public dialogMat: MatDialog
  ) {}

  ngOnInit(): void {
    this.initAuthorizedBrands();
    this.initAuthorizedProductGroups();
    this.initAllowedServices();
    this.initBrands();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.countryId) {
      this.countryId = changes.countryId.currentValue;
      this.initBrandProductGroupCombination();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  editBrandProductGroupsServices(brandProductGroupServiceIds: BrandProductGroupServiceId[]): void {
    const isAllowedEditService = this.isAllowedToRemoveBrandProductGroupServices(
      brandProductGroupServiceIds
    );
    this.openBrandProductgroupsServicesSelectDialog({
      brandProductGroupServiceIds,
      isAllowedEditService
    });
  }

  addBrandProductGroupsServices(): void {
    this.openBrandProductgroupsServicesSelectDialog({
      excludedBrandIds: this.assignedBrandIds,
      isAllowedEditService: true
    });
  }

  getServiceName(serviceId: string): string | undefined {
    return this.allowedServices.find(service => service.id === +serviceId)?.name;
  }

  uniqueByProductGroup(
    brandProductGroupServices: BrandProductGroupServiceId[]
  ): BrandProductGroupServiceId[] {
    return uniqBy((it: BrandProductGroupServiceId) => it.productGroupId)(brandProductGroupServices);
  }

  uniqueByService(
    brandProductGroupServices: BrandProductGroupServiceId[]
  ): BrandProductGroupServiceId[] {
    return uniqBy((it: BrandProductGroupServiceId) => it.serviceId)(brandProductGroupServices);
  }

  removeBrandProductGroupServices(brandId: string): void {
    if (!this.brandProductGroupsServicesRows?.get(brandId)) {
      return;
    }

    this.brandProductGroupsServicesRows.delete(brandId);

    let brandProductGroupServiceIds: BrandProductGroupServiceId[] = [];
    Array.from(this.brandProductGroupsServicesRows.values()).forEach(
      (value: BrandProductGroupServiceId[]) =>
        (brandProductGroupServiceIds = brandProductGroupServiceIds.concat(...value))
    );

    this.brandProductGroupServiceIdsChange.emit(brandProductGroupServiceIds);
  }

  isAuthorizedBrand(brandProductGroupServiceId: BrandProductGroupServiceId[]): boolean {
    return (
      this.authorizedBrands.length === 0 ||
      brandProductGroupServiceId.some(it => this.authorizedBrands.includes(it.brandId))
    );
  }

  isAllowedToRemoveBrandProductGroupServices(
    brandProductGroupServiceId: BrandProductGroupServiceId[]
  ): boolean {
    const rowProductGroups = brandProductGroupServiceId.map(it => it.productGroupId);
    return (
      this.authorizedProductGroups.length === 0 ||
      rowProductGroups.every(it => this.authorizedProductGroups.includes(it))
    );
  }

  isAllowedToEditBrandProductGroupServices(brandId: string): boolean {
    const productGroupsByBrand = this.brandProductGroupCombinations?.get(brandId) ?? [];
    return (
      this.authorizedProductGroups.length === 0 ||
      this.authorizedProductGroups.filter(intersectFilter(productGroupsByBrand)).length !== 0
    );
  }

  sortByBrandPosition(
    groupedBrandProductGroups: KeyValue<string, BrandProductGroupServiceId[]>[]
  ): Observable<KeyValue<string, BrandProductGroupServiceId[]>[]> {
    return this.masterBrandService.sort(groupedBrandProductGroups, ['key']);
  }

  get availableBrandIds(): string[] {
    return this.allBrandIds.filter(brandId => !this.assignedBrandIds.includes(brandId));
  }

  private get assignedBrandIds(): string[] {
    let assignedBrandIds: string[] = [];
    if (this.brandProductGroupsServicesRows) {
      assignedBrandIds = Array.from(this.brandProductGroupsServicesRows.keys());
    }
    return assignedBrandIds;
  }

  private initAuthorizedBrands(): void {
    this.userService
      .getBrandRestrictions()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(brandRestrictions => (this.authorizedBrands = brandRestrictions));
  }

  private initAllowedServices(): void {
    this.generalGroupsService
      .getAllowedServices()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(allowedServices => {
        this.allowedServices = allowedServices;
      });
  }

  private initBrands(): void {
    this.brandService
      .getAll()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(brands => {
        this.allBrandIds = brands.map(brand => brand.id);
      });
  }

  private openBrandProductgroupsServicesSelectDialog(data?: any): void {
    const dialog = this.dialogMat.open(BrandProductgroupsServicesSelectionComponent, {
      data: Object.assign(
        {
          allowedServices: this.allowedServices,
          countryId: this.countryId
        },
        data
      )
    });

    dialog
      .afterClosed()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((brandProductGroupServiceIds: BrandProductGroupServiceId[] | false) => {
        if (brandProductGroupServiceIds) {
          this.updateBrandProductGroupServiceIds(brandProductGroupServiceIds);
        }
      });
  }

  private updateBrandProductGroupServiceIds(
    changedBrandProductGroupServiceIds: BrandProductGroupServiceId[]
  ): void {
    if (changedBrandProductGroupServiceIds.length === 0) {
      return;
    }

    this.removeBrandProductGroupServices(changedBrandProductGroupServiceIds[0].brandId);

    let brandProductGroupServiceIds: BrandProductGroupServiceId[] = [];
    Array.from(this.brandProductGroupsServicesRows?.values()).forEach(
      (value: BrandProductGroupServiceId[]) =>
        (brandProductGroupServiceIds = brandProductGroupServiceIds.concat(...value))
    );
    brandProductGroupServiceIds = brandProductGroupServiceIds.concat(
      ...changedBrandProductGroupServiceIds
    );
    this.brandProductGroupServiceIdsChange.emit(brandProductGroupServiceIds);
  }

  private initAuthorizedProductGroups(): void {
    this.userService
      .getProductGroupRestrictions()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        productGroupRestrictions => (this.authorizedProductGroups = productGroupRestrictions)
      );
  }

  private initBrandProductGroupCombination(): void {
    if (!this.countryId) {
      return;
    }

    this.serviceVariantDataService
      .getAllForStructureBy(this.countryId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(serviceVariants => {
        this.brandProductGroupCombinations = serviceVariants.reduce((accumulator, current) => {
          if (current.brandId && current.productGroupId) {
            if (!accumulator.has(current.brandId)) {
              accumulator.set(current.brandId, [current.productGroupId]);
            } else if (!accumulator.get(current.brandId)?.includes(current.productGroupId)) {
              accumulator.get(current.brandId)?.push(current.productGroupId);
            }
          }
          return accumulator;
        }, new Map<string, string[]>());
      });
  }
}
