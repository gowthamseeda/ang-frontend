import { Component, EventEmitter, NgZone, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { SnackBarService } from '../../../../../shared/services/snack-bar/snack-bar.service';
import { MasterProductGroup } from '../../../../product-group/master-product-group/master-product-group.model';
import { MasterService } from '../../../master-service/master-service.model';
import { MasterServiceService } from '../../../master-service/master-service.service';
import { MasterServiceVariant } from '../../master-service-variant/master-service-variant.model';
import { MasterServiceVariantService } from '../../master-service-variant/master-service-variant.service';
import { ServiceVariantFilterCriteria } from '../../models/service-variant-filter-criteria.model';
import { ServiceVariantTable } from '../../models/service-variant.model';
import { ServiceVariantDeleteDialogComponent } from '../../presentational/service-variant-delete-dialog/service-variant-delete-dialog.component';
import { ServiceVariantFilterDialogComponent } from '../../presentational/service-variant-filter-dialog/service-variant-filter-dialog.component';
import { ServiceVariantViewDialogComponent } from '../../presentational/service-variant-view-dialog/service-variant-view-dialog.component';
import { ServiceVariantFilterService } from '../../services/service-variant-filter.service';
import { ServiceVariantRouteDataService } from '../../services/service-variant-route-data.service';

@Component({
  selector: 'gp-service-variant',
  templateUrl: './service-variant.component.html',
  styleUrls: ['./service-variant.component.scss']
})
export class ServiceVariantComponent implements OnInit, OnDestroy {
  serviceVariantDataSource: Observable<ServiceVariantTable[]>;
  serviceVariants: Observable<MasterServiceVariant[]>;
  isLoading: Observable<boolean>;
  services: MasterService[];
  productGroups: MasterProductGroup[];
  selectedServiceVariantIds: number[];

  @Output() servicesFilter = new EventEmitter<ServiceVariantFilterCriteria>();

  private unsubscribe = new Subject<void>();
  private filterCriteria: ServiceVariantFilterCriteria;

  constructor(
    private serviceService: MasterServiceService,
    private serviceVariantService: MasterServiceVariantService,
    private dialog: MatDialog,
    private serviceVariantFilterService: ServiceVariantFilterService,
    private snackBarService: SnackBarService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private serviceVariantRouteDataService: ServiceVariantRouteDataService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.isLoading = this.serviceVariantService.isLoading();
    this.serviceVariants = this.serviceVariantService.getAll();

    this.initServiceVariantDataSource();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  selectedServiceVariant(serviceVariantIds: number[]): void {
    this.selectedServiceVariantIds = serviceVariantIds;
  }

  add(): void {
    this.serviceVariantRouteDataService.selectedServiceVariantIds = [];
    this.routeToConfiguration();
  }

  singleEdit(serviceVariantId: number): void {
    this.serviceVariantRouteDataService.selectedServiceVariantIds = [serviceVariantId];
    this.routeToConfiguration();
  }

  multiEdit(serviceVariantIds: number[]): void {
    this.serviceVariantRouteDataService.selectedServiceVariantIds = serviceVariantIds;
    this.routeToConfiguration();
  }

  singleDelete(serviceVariantId: number): void {
    this.openRemoveConfirmationDialog([serviceVariantId]);
  }

  multiDelete(serviceVariantIds: number[]): void {
    this.openRemoveConfirmationDialog(serviceVariantIds);
  }

  singleView(serviceVariantId: number): void {
    this.openCountryRestrictionDialog([serviceVariantId]);
  }

  multiView(serviceVariantIds: number[]): void {
    this.openCountryRestrictionDialog(serviceVariantIds);
  }

  routeToConfiguration(): void {
    this.ngZone.run(() =>
      this.router.navigate(['./configure'], { relativeTo: this.activatedRoute })
    );
  }

  openCountryRestrictionDialog(selectedServiceVariantIds: number[]): void {
    setTimeout(() => {
      this.dialog
        .open(ServiceVariantViewDialogComponent, {
          width: '1000px',
          data: {
            serviceVariantIds: selectedServiceVariantIds
          }
        })
        .afterClosed();
    });
  }

  openRemoveConfirmationDialog(selectedServiceVariantIds: number[]): void {
    setTimeout(() => {
      this.dialog
        .open(ServiceVariantDeleteDialogComponent, {
          width: '550px',
          data: {
            serviceVariantIds: selectedServiceVariantIds
          }
        })
        .afterClosed()
        .subscribe(confirmed => {
          if (confirmed) {
            this.removeServiceVariant(selectedServiceVariantIds);
          }
        });
    });
  }

  removeServiceVariant(serviceVariantIds: number[]): void {
    const serviceVariants = this.getServiceVariants(serviceVariantIds);

    this.serviceVariantService.delete(serviceVariants).subscribe(
      () => {
        this.serviceVariantService.clearCacheAndFetchAll();
        this.snackBarService.showInfo('MASTER_DATA_SERVICE_VARIANT_DELETE_SUCCESS');
        this.initServiceVariantDataSource();
      },
      error => {
        this.snackBarService.showError(error);
      }
    );
  }

  selectedMulti(): boolean {
    return this.selectedServiceVariantIds.length === 0;
  }

  openServiceVariantFilterDialog(): void {
    const dialog = this.dialog.open(ServiceVariantFilterDialogComponent, {
      width: '400px',
      data: this.filterCriteria
    });

    dialog
      .afterClosed()
      .subscribe((serviceFilterCriteria: ServiceVariantFilterCriteria | false) => {
        if (serviceFilterCriteria) {
          this.filterCriteria = serviceFilterCriteria;
          this.serviceVariantDataSource = this.setDataSource(serviceFilterCriteria);
        }
      });
  }

  private getServiceVariants(serviceVariantIds: number[]): MasterServiceVariant[] {
    const serviceVariants: MasterServiceVariant[] = [];
    serviceVariantIds.forEach(id => {
      this.serviceVariantService.getBy(id).subscribe(serviceVariant => {
        serviceVariants.push(serviceVariant);
      });
    });
    return serviceVariants;
  }

  private initServiceVariantDataSource(): void {
    this.serviceService
      .getAll()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((services: MasterService[]) => {
        this.services = services;
        this.serviceVariantDataSource = this.setDataSource(null);
      });
  }

  private setDataSource(
    serviceVariantFilterCriteria: ServiceVariantFilterCriteria | null
  ): Observable<ServiceVariantTable[]> {
    this.selectedServiceVariantIds = [];
    let serviceVariants = this.serviceVariantService.getAll();

    if (serviceVariantFilterCriteria !== null) {
      serviceVariants = this.serviceVariantFilterService.filter(
        serviceVariantFilterCriteria,
        serviceVariants
      );
    }
    return serviceVariants
      .pipe(takeUntil(this.unsubscribe))
      .pipe(map(serviceVariant => this.transformToDataSource(serviceVariant)));
  }

  private transformToDataSource(serviceVariants: MasterServiceVariant[]): ServiceVariantTable[] {
    return serviceVariants.map(serviceVariant => {
      return {
        id: serviceVariant.id,
        productGroup: serviceVariant.productGroupId,
        service: this.getServiceName(serviceVariant.serviceId),
        brand: serviceVariant.brandId,
        active: serviceVariant.active,
        isMultiCheck: false
      } as ServiceVariantTable;
    });
  }

  private getServiceName(serviceId: number): string {
    const serviceName = this.services.find(service => service.id === serviceId)?.name;
    return serviceName ?? '';
  }
}
