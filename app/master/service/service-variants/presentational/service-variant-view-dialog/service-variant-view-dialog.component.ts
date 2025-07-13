import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { MasterCountry } from '../../../../country/master-country/master-country.model';
import { MasterCountryService } from '../../../../country/master-country/master-country.service';
import { MasterServiceService } from '../../../master-service/master-service.service';
import { MasterServiceVariantService } from '../../master-service-variant/master-service-variant.service';
import { ServiceVariantView } from '../../models/service-variant.model';

@Component({
  selector: 'gp-service-variant-view-dialog',
  templateUrl: './service-variant-view-dialog.component.html',
  styleUrls: ['./service-variant-view-dialog.component.scss']
})
export class ServiceVariantViewDialogComponent implements OnInit, OnDestroy {
  serviceVariantIds: number[];
  displayedColumns: string[] = ['service', 'brand', 'productGroup'];
  displayedCountryRestriction: string[] = ['countryRestrictions'];
  dataSource: ServiceVariantView[];
  countries: MasterCountry[];
  private unsubscribe = new Subject<void>();

  constructor(
    public dialogRef: MatDialogRef<ServiceVariantViewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private serviceVariantService: MasterServiceVariantService,
    private serviceService: MasterServiceService,
    private countryService: MasterCountryService
  ) {
    this.serviceVariantIds = data.serviceVariantIds;
  }

  ngOnInit(): void {
    this.initCountriesSource();
    this.initTableDataSource();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  initCountriesSource(): void {
    this.countryService
      .getAll()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(countries => {
        this.countries = countries;
      });
  }

  initTableDataSource(): void {
    const rows: ServiceVariantView[] = [];
    this.serviceVariantIds.forEach(id => {
      this.serviceVariantService.getBy(id).subscribe(serviceVariant => {
        const row: ServiceVariantView = {
          id: serviceVariant.id,
          brand: serviceVariant.brandId,
          productGroup: serviceVariant.productGroupId,
          service: this.getServiceName(serviceVariant.serviceId),
          countryRestrictions: this.getCountryName(serviceVariant.countryRestrictions),
          active: serviceVariant.active
        };
        rows.push(row);
      });
    });
    this.dataSource = rows;
  }

  getServiceName(serviceId: number): string {
    let name = '';
    this.serviceService.getBy(serviceId).subscribe(serviceVariant => {
      name = serviceVariant.name;
    });
    return name;
  }

  getCountryName(countryIds?: string[]): string[] {
    return this.countries
      .filter(country => countryIds?.includes(country.id))
      .map(country => {
        return country.name;
      })
      .sort();
  }
}
