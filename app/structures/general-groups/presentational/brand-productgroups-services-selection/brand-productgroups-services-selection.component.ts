import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { combineLatest, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { UserService } from '../../../../iam/user/user.service';
import { MasterBrandService } from '../../../../master/brand/master-brand/master-brand.service';
import { PRODUCT_GROUP_ORDER } from '../../../../services/brand-product-group/brand-product-group.model';
import { ProductGroupService } from '../../../../services/product-group/product-group.service';
import { ServiceVariantDataService } from '../../../../services/service-variant/store/service-variant-data.service';
import { sortByReference } from '../../../../shared/util/arrays';
import { BrandProductGroupsServicesRow } from '../../container/edit-general-group/edit-general-group.component';
import { BrandProductGroupServiceId } from '../../model/brand-product-group-service.model';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'gp-brand-productgroups-services-selection',
  templateUrl: './brand-productgroups-services-selection.component.html',
  styleUrls: ['./brand-productgroups-services-selection.component.scss']
})
export class BrandProductgroupsServicesSelectionComponent implements OnInit, OnDestroy {
  brandProductGroupServiceIds: BrandProductGroupServiceId[] = [];
  brandProductGroupsServicesFormGroup: UntypedFormGroup;
  allBrandIds: string[] = [];
  allProductGroupIds: string[] = [];
  allowedProductGroupIds: string[] = [];
  allowedServices: { id: number; name: string }[] = [];
  allowedBrandProductGroupCombinations: Map<string, string[]>;
  isAllowedEditService = true;

  private unsubscribe = new Subject<void>();

  constructor(
    private userService: UserService,
    private masterBrandService: MasterBrandService,
    private productGroupService: ProductGroupService,
    private serviceVariantDataService: ServiceVariantDataService,
    private formBuilder: UntypedFormBuilder,
    public dialogRef: MatDialogRef<BrandProductgroupsServicesSelectionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    if (this.data?.allowedServices?.length > 0) {
      this.allowedServices = this.data.allowedServices;
    }
    this.isAllowedEditService = this.data.isAllowedEditService;
    this.initBrandsAndProductGroups();
    this.initAllowedBrandProductGroupCombinations();
    this.initFormGroup();
    this.patchFormGroup(this.data?.brandProductGroupServiceIds);
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  resetProductGroupSelection(): void {
    this.brandProductGroupsServicesFormGroup?.get('productGroupIds')?.setValue([]);
  }

  isProductGroupAllowed(productGroupId: string): boolean {
    return (
      this.allowedProductGroupIds.includes(productGroupId) &&
      this.allowedProductGroupsForSelectedBrand.includes(productGroupId)
    );
  }

  private get allowedProductGroupsForSelectedBrand(): string[] {
    const selectedBrandId = this.brandProductGroupsServicesFormGroup?.get('brandId')?.value;
    if (selectedBrandId === undefined) {
      return [];
    }
    return this.allowedBrandProductGroupCombinations?.get(selectedBrandId) || [];
  }

  private initBrandsAndProductGroups(): void {
    combineLatest([
      this.userService.getBrandRestrictions(),
      this.userService.getProductGroupRestrictions(),
      this.masterBrandService.getAll(),
      this.productGroupService.getAll()
    ])
      .pipe(
        takeUntil(this.unsubscribe),
        map(([brandRestrictions, productGroupRestrictions, brands, productGroups]) => {
          let allBrands;
          let allProductGroups;

          if (!brandRestrictions || brandRestrictions.length === 0) {
            allBrands = brands;
          } else {
            allBrands = brands.filter(brand => brandRestrictions.includes(brand.id));
          }

          if (!productGroupRestrictions || productGroupRestrictions.length === 0) {
            allProductGroups = productGroups;
          } else {
            allProductGroups = productGroups.filter(productGroup =>
              productGroupRestrictions.includes(productGroup.id)
            );
          }

          this.allBrandIds = allBrands
            .map(brand => brand.id)
            .filter(brandId => !this.data?.excludedBrandIds?.includes(brandId));

          this.allProductGroupIds = this.orderByProductGroupIdByRef(
            productGroups.map(productGroup => productGroup.id)
          );
          this.allowedProductGroupIds = allProductGroups.map(productGroup => productGroup.id);
        })
      )
      .subscribe();
  }

  private initAllowedBrandProductGroupCombinations(): void {
    if (!this.data?.countryId) {
      return;
    }

    this.serviceVariantDataService
      .getAllForStructureBy(this.data.countryId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(serviceVariants => {
        this.allowedBrandProductGroupCombinations = serviceVariants.reduce(
          (accumulator, current) => {
            if (current.brandId && current.productGroupId) {
              if (!accumulator.has(current.brandId)) {
                accumulator.set(current.brandId, [current.productGroupId]);
              } else if (!accumulator.get(current.brandId)?.includes(current.productGroupId)) {
                accumulator.get(current.brandId)?.push(current.productGroupId);
              }
            }
            return accumulator;
          },
          new Map<string, string[]>()
        );
      });
  }

  private initFormGroup(): void {
    this.brandProductGroupsServicesFormGroup = this.formBuilder.group({
      brandId: ['', Validators.required],
      productGroupIds: [[], Validators.required],
      serviceIds: [[], Validators.required]
    });

    this.brandProductGroupsServicesFormGroup.valueChanges
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((brandProductGroupsServicesRow: BrandProductGroupsServicesRow) => {
        const brandProductGroupServiceIds: BrandProductGroupServiceId[] = [];
        brandProductGroupsServicesRow.productGroupIds?.forEach(productGroupId => {
          brandProductGroupsServicesRow.serviceIds?.forEach(serviceId => {
            brandProductGroupServiceIds.push({
              brandId: this.brandProductGroupsServicesFormGroup.getRawValue().brandId,
              productGroupId: productGroupId,
              serviceId: serviceId
            });
          });
        });
        this.brandProductGroupServiceIds = brandProductGroupServiceIds;
      });
  }

  update(checked: MatCheckboxChange, value: string) {
    const control = this.brandProductGroupsServicesFormGroup.controls;
    let arr: string[] = control.productGroupIds.value || [];
    if (!checked.checked) {
      arr = arr.filter((x: string) => x != value);
    } else {
      arr.push(value);
    }
    control.productGroupIds.setValue(arr);
  }

  private patchFormGroup(brandProductGroupServiceIds: BrandProductGroupServiceId[]): void {
    const productGroupIds = brandProductGroupServiceIds?.reduce((accumulated, current) => {
      if (!accumulated.some(serviceId => serviceId === current.productGroupId)) {
        accumulated.push(current.productGroupId);
      }
      return accumulated;
    }, [] as string[]);

    const serviceIds = brandProductGroupServiceIds?.reduce((accumulated, current) => {
      if (!accumulated.some(serviceId => serviceId === current.serviceId)) {
        accumulated.push(current.serviceId);
      }
      return accumulated;
    }, [] as number[]);

    if (brandProductGroupServiceIds?.length > 0) {
      this.brandProductGroupsServicesFormGroup.patchValue({
        brandId: brandProductGroupServiceIds[0].brandId,
        productGroupIds: productGroupIds,
        serviceIds: serviceIds
      } as BrandProductGroupsServicesRow);
      this.brandProductGroupsServicesFormGroup.get('brandId')?.disable();
    }
  }

  private orderByProductGroupIdByRef(ids: string[]): string[] {
    return sortByReference<string, string>(ids, PRODUCT_GROUP_ORDER, (elem: string) => elem);
  }
}
