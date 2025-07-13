import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { MasterService } from '../../master-service/master-service.model';
import { MasterServiceVariant } from '../master-service-variant/master-service-variant.model';
import { ServiceVariantFilterCriteria } from '../models/service-variant-filter-criteria.model';
import { ServiceVariantTable } from '../models/service-variant.model';

@Injectable()
export class ServiceVariantFilterService {
  pristineServiceRows: ServiceVariantTable[];
  pristineServiceVariant: MasterServiceVariant[];
  services: MasterService[];
  filteredServiceVariantsRows: MasterServiceVariant[];
  filterServiceVariantCriteria: ServiceVariantFilterCriteria;
  private readonly _pristine = new BehaviorSubject<boolean>(false);
  private readonly _filterCriteria = this.pristineFilterCriteria;

  constructor() {}

  get pristine(): Observable<boolean> {
    return this._pristine.asObservable();
  }

  get pristineFilterCriteria(): BehaviorSubject<ServiceVariantFilterCriteria> {
    return new BehaviorSubject<ServiceVariantFilterCriteria>({
      services: [],
      brands: [],
      productGroups: [],
      active: false
    });
  }

  get filterCriteria(): Observable<ServiceVariantFilterCriteria> {
    return this._filterCriteria.asObservable();
  }

  initServiceFilterSearchData(
    serviceTableRows: ServiceVariantTable[],
    offeredService: MasterServiceVariant[]
  ): void {
    this.pristineServiceRows = serviceTableRows;
    this.pristineServiceVariant = offeredService;
  }

  changePristineTo(pristine: boolean): void {
    this._pristine.next(pristine);
  }

  changeFilterCriteriaTo(pristine: ServiceVariantFilterCriteria): void {
    this._filterCriteria.next(pristine);
  }

  filter(
    criteria: ServiceVariantFilterCriteria,
    serviceVariantDataSource: Observable<MasterServiceVariant[]>
  ): Observable<MasterServiceVariant[]> {
    serviceVariantDataSource.subscribe(source => (this.filteredServiceVariantsRows = source));
    this.filterActive(criteria.active);
    this.filterService(criteria.services);
    this.filterBrand(criteria.brands);
    this.filterProductGroup(criteria.productGroups);

    return of(this.filteredServiceVariantsRows);
  }

  filterSelected(
    serviceVariantItems: Observable<ServiceVariantTable[]>,
    isFilterSelected: boolean
  ): Observable<ServiceVariantTable[]> {
    return serviceVariantItems.pipe(
      map(serviceTableRows => {
        return isFilterSelected
          ? serviceTableRows.filter(value => value.isMultiCheck)
          : serviceTableRows;
      })
    );
  }

  private filterActive(active: boolean): void {
    if (active) {
      this.filteredServiceVariantsRows = this.filteredServiceVariantsRows.filter(
        serviceVariant => serviceVariant.active === active
      );
    }
  }

  private filterService(services: number[]): void {
    if (services.length > 0) {
      this.filteredServiceVariantsRows = this.filteredServiceVariantsRows.filter(serviceVariant =>
        services.some(service => service === serviceVariant.serviceId)
      );
    }
  }

  private filterBrand(brands: string[]): void {
    if (brands.length > 0) {
      this.filteredServiceVariantsRows = this.filteredServiceVariantsRows.filter(serviceVariant =>
        brands.some(brand => brand === serviceVariant.brandId)
      );
    }
  }

  private filterProductGroup(productGroups: string[]): void {
    if (productGroups.length > 0) {
      this.filteredServiceVariantsRows = this.filteredServiceVariantsRows.filter(serviceVariant =>
        productGroups.some(productGroup => productGroup === serviceVariant.productGroupId)
      );
    }
  }
}
