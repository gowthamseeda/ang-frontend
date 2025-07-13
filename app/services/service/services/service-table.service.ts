import { Injectable } from '@angular/core';
import { uniq } from 'ramda';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  BrandProductGroupsGroupedByBrandId,
  brandProductGroupUtils
} from '../../brand-product-group/brand-product-group.model';
import { Service } from '../models/service.model';

import { ServiceService } from './service.service';
import { OfferedServiceService } from '../../offered-service/offered-service.service';
import { ServiceVariantService } from '../../service-variant/service-variant.service';
import { ServiceTableRow } from '../models/service-table-row.model';

@Injectable()
export class ServiceTableService {
  brandProductGroups: Observable<BrandProductGroupsGroupedByBrandId>;
  serviceTableRows: Observable<ServiceTableRow[]>;

  constructor(
    private serviceService: ServiceService,
    private serviceVariantService: ServiceVariantService,
    private offeredServiceService: OfferedServiceService
  ) {
    this.initServiceTableRows();
    this.initBrandProductGroups();
  }

  // fn: for testing purposes only
  initServiceTableRows(fn = () => {}): void {
    const serviceTableRowSource = this.serviceService.getAllWithServiceVariantsAndOfferedServices();

    this.serviceTableRows = serviceTableRowSource.pipe(
      map(services => {
        fn();
        return this.generateServiceTableRows(services);
      })
    );
  }

  initBrandProductGroups(): void {
    this.brandProductGroups = combineLatest([
      this.serviceVariantService.extractUniqueBrandProductGroups(),
      this.offeredServiceService.extractUniqueBrandProductGroups()
    ])
      .pipe(
        map(([serviceVariant, offeredService]) => {
          const combinedBrandProductGroups = serviceVariant.concat(offeredService);
          return uniq(combinedBrandProductGroups);
        })
      )
      .pipe(map(brandProductGroupUtils.groupByBrandId));
  }

  initPageIndex(): Observable<number> {
    return this.serviceService.getPageIndex();
  }

  setPageIndex(pageIndex: number): void {
    return this.serviceService.setPageIndex(pageIndex);
  }

  isDataLoading(): Observable<boolean> {
    return combineLatest([
      this.serviceService.isLoading(),
      this.serviceVariantService.isLoading()
    ]).pipe(
      map((areLoading: [boolean, boolean]) => {
        const [serviceIsLoading, serviceVariantIsLoading] = areLoading;
        return serviceIsLoading || serviceVariantIsLoading;
      })
    );
  }

  private generateServiceTableRows(services: Service[]): ServiceTableRow[] {
    return services.map(this.mapToServiceTableRow);
  }

  private mapToServiceTableRow(service: Service): ServiceTableRow {
    const serviceTableRow = new ServiceTableRow();
    serviceTableRow.entry = service;
    return serviceTableRow;
  }
}
