import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { MasterServiceService } from '../../../master-service/master-service.service';
import { MasterServiceVariantService } from '../../master-service-variant/master-service-variant.service';
import { ServiceVariant } from '../../models/service-variant.model';

@Component({
  selector: 'gp-service-variant-delete-dialog',
  templateUrl: './service-variant-delete-dialog.component.html',
  styleUrls: ['./service-variant-delete-dialog.component.scss']
})
export class ServiceVariantDeleteDialogComponent implements OnInit {
  serviceVariantIds: number[];
  displayedColumns: string[] = ['service', 'brand', 'productGroup'];
  dataSource: ServiceVariant[];

  constructor(
    public dialogRef: MatDialogRef<ServiceVariantDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private serviceVariantService: MasterServiceVariantService,
    private serviceService: MasterServiceService
  ) {
    this.serviceVariantIds = data.serviceVariantIds;
  }

  ngOnInit(): void {
    this.initTableDataSource();
  }

  initTableDataSource(): void {
    const rows: ServiceVariant[] = [];
    this.serviceVariantIds.forEach(id => {
      this.serviceVariantService.getBy(id).subscribe(serviceVariant => {
        const row: ServiceVariant = {
          id: serviceVariant.id,
          brand: serviceVariant.brandId,
          productGroup: serviceVariant.productGroupId,
          service: this.getServiceName(serviceVariant.serviceId),
          active: serviceVariant.active
        };
        rows.push(row);
      });
    });
    this.dataSource = rows;
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
  confirm(): void {
    this.dialogRef.close(true);
  }

  private getServiceName(serviceId: number): string {
    let name = '';
    this.serviceService.getBy(serviceId).subscribe(serviceVariant => {
      name = serviceVariant.name;
    });
    return name;
  }
}
