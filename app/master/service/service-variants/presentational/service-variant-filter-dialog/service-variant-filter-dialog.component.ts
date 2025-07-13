import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';

import { OfferedService } from '../../../../../services/offered-service/offered-service.model';
import { MasterBrand } from '../../../../brand/master-brand/master-brand.model';
import { MasterBrandService } from '../../../../brand/master-brand/master-brand.service';
import { MasterProductGroup } from '../../../../product-group/master-product-group/master-product-group.model';
import { MasterProductGroupService } from '../../../../product-group/master-product-group/master-product-group.service';
import { MasterService } from '../../../master-service/master-service.model';
import { MasterServiceService } from '../../../master-service/master-service.service';
import { ServiceVariantFilterCriteria } from '../../models/service-variant-filter-criteria.model';
import { ServiceVariantFilterService } from '../../services/service-variant-filter.service';

@Component({
  selector: 'gp-service-variant-filter-dialog',
  templateUrl: './service-variant-filter-dialog.component.html',
  styleUrls: ['./service-variant-filter-dialog.component.scss']
})
export class ServiceVariantFilterDialogComponent implements OnInit, OnDestroy {
  serviceVariantFilterFormGroup: UntypedFormGroup;
  categories: OfferedService[];
  services: MasterService[];
  productGroups: MasterProductGroup[];
  servicesSelections: string[];
  brands: MasterBrand[];
  private unsubscribe = new Subject<void>();
  private pristineFilterCriteria: ServiceVariantFilterCriteria;

  constructor(
    private serviceService: MasterServiceService,
    private productGroupService: MasterProductGroupService,
    private brandService: MasterBrandService,
    private formBuilder: UntypedFormBuilder,
    private dialogRef: MatDialogRef<ServiceVariantFilterDialogComponent>,
    private serviceVariantFilterService: ServiceVariantFilterService
  ) {}

  ngOnInit(): void {
    this.initServiceVariantForm();
    this.patchUpdateFormGroup(this.serviceVariantFilterService.filterServiceVariantCriteria);

    this.initServices();
    this.initProductGroup();
    this.initBrands();

    this.serviceVariantFilterService.pristineFilterCriteria.pipe(take(1)).subscribe(pristine => {
      this.pristineFilterCriteria = pristine;
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  search(): void {
    const serviceVariantFilter = this.serviceVariantFilterFormGroup.getRawValue();
    const filterCriteria: ServiceVariantFilterCriteria = {
      services: serviceVariantFilter.service,
      productGroups: serviceVariantFilter.productGroup,
      brands: serviceVariantFilter.brand,
      active: serviceVariantFilter.active
    };

    this.serviceVariantFilterService.filterServiceVariantCriteria = filterCriteria;
    this.serviceVariantFilterService.changeFilterCriteriaTo(filterCriteria);
    this.dialogRef.close(filterCriteria);
  }

  reset(): void {
    this.serviceVariantFilterService.filterServiceVariantCriteria = this.pristineFilterCriteria;
    this.patchUpdateFormGroup(this.serviceVariantFilterService.filterServiceVariantCriteria);
    this.search();
  }

  private patchUpdateFormGroup(filterCriteria: ServiceVariantFilterCriteria): void {
    if (filterCriteria != null) {
      if (filterCriteria.active === true) {
        this.serviceVariantFilterFormGroup.controls['active'].setValue(true);
      } else {
        this.serviceVariantFilterFormGroup.controls['active'].setValue(false);
      }
      if (filterCriteria.services && filterCriteria.services.length > 0) {
        this.serviceVariantFilterFormGroup.controls['service'].setValue(filterCriteria.services);
      } else {
        this.serviceVariantFilterFormGroup.controls['service'].setValue([]);
      }
      if (filterCriteria.brands && filterCriteria.brands.length > 0) {
        this.serviceVariantFilterFormGroup.controls['brand'].setValue(filterCriteria.brands);
      } else {
        this.serviceVariantFilterFormGroup.controls['brand'].setValue([]);
      }
      if (filterCriteria.productGroups && filterCriteria.productGroups.length > 0) {
        this.serviceVariantFilterFormGroup.controls['productGroup'].setValue(
          filterCriteria.productGroups
        );
      } else {
        this.serviceVariantFilterFormGroup.controls['productGroup'].setValue([]);
      }
    }
  }

  private initServiceVariantForm(): void {
    this.serviceVariantFilterFormGroup = this.formBuilder.group({
      service: [],
      brand: [''],
      productGroup: [''],
      active: false
    });
  }

  private initServices(): void {
    this.serviceService.getAll().subscribe((services: MasterService[]) => {
      this.services = services;
    });
  }

  private initProductGroup(): void {
    this.productGroupService.getAll().subscribe((productGroups: MasterProductGroup[]) => {
      this.productGroups = productGroups;
    });
  }

  private initBrands(): void {
    this.brandService.getAll().subscribe((brands: MasterBrand[]) => {
      this.brands = brands;
    });
  }
}
