import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { OfferedServiceService } from '../../../offered-service/offered-service.service';
import { Service } from '../../models/service.model';
import { MultiSelectDataService } from '../../services/multi-select-service-data.service';
import { ServiceTableStatusService } from '../../services/service-table-status.service';

interface ServiceWithBrands extends Service {
  actionName: string;
  brandIds: string[];
}

enum ActionName {
  ADD = 'ADD',
  CHANGE = 'CHANGE',
  REMOVE = 'REMOVE'
}

@Component({
  selector: 'gp-service-confirmation',
  templateUrl: './service-confirmation.component.html',
  styleUrls: ['./service-confirmation.component.scss']
})
export class ServiceConfirmationComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['actions', 'service', 'brands', 'productGroups'];
  servicesToAddDataSource: ServiceWithBrands[];
  servicesToChangeDataSource: ServiceWithBrands[];
  servicesToRemoveDataSource: ServiceWithBrands[];
  allServicesToDataSource: ServiceWithBrands[];

  private unsubscribe = new Subject<void>();

  constructor(
    private offeredServiceService: OfferedServiceService,
    private serviceTableStatusService: ServiceTableStatusService,
    private multiSelectDataService: MultiSelectDataService,
    public dialogRef: MatDialogRef<ServiceConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA)
    private data: {
      outletId: string;
      servicesToAdd: Service[];
      servicesToChange: Service[];
      servicesToRemove: Service[];
    }
  ) {}

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  ngOnInit(): void {
    this.servicesToAddDataSource = this.assignToDataSource(this.data.servicesToAdd, ActionName.ADD);
    this.servicesToChangeDataSource = this.assignToDataSource(
      this.data.servicesToChange,
      ActionName.CHANGE
    );
    this.servicesToRemoveDataSource = this.assignToDataSource(
      this.data.servicesToRemove,
      ActionName.REMOVE
    );

    this.allServicesToDataSource = [
      ...this.servicesToAddDataSource,
      ...this.servicesToChangeDataSource,
      ...this.servicesToRemoveDataSource
    ];
  }

  assignToDataSource(service: Service[], actionName: string): ServiceWithBrands[] {
    return service.map(servicesToRemove => {
      return {
        actionName: actionName,
        ...servicesToRemove,
        brandIds:
          this.distinctList(
            servicesToRemove.brandProductGroups?.map(brandProductGroup => brandProductGroup.brandId)
          ) ?? []
      };
    });
  }

  save(): void {
    this.offeredServiceService.save(this.data.outletId);
    this.serviceTableStatusService.changePristineTo(true);
    this.multiSelectDataService.flushMultiSelectOfferedServiceList();

    this.dialogRef.close(true);
  }

  distinctList(list: string[] | undefined) {
    return list ? [...new Set(list)] : list;
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  getProductGroupIdsByActionName(actionName: string, service: string, brandId: string): string[] {
    switch (actionName) {
      case 'ADD':
        return this.getProductGroupIds(this.servicesToAddDataSource, service, brandId);
        break;
      case 'CHANGE':
        return this.getProductGroupIds(this.servicesToChangeDataSource, service, brandId);
        break;
      case 'REMOVE':
        return this.getProductGroupIds(this.servicesToRemoveDataSource, service, brandId);
        break;
      default:
        return [] as string[];
        break;
    }
  }

  getProductGroupIds(
    serviceDataSource: ServiceWithBrands[],
    service: string,
    brandId: string
  ): string[] {
    return (
      serviceDataSource
        .find(data => data.name == service)
        ?.brandProductGroups?.filter(brandProductGroup => brandProductGroup.brandId == brandId)
        .map(brandProductGroup => brandProductGroup.productGroupId) || []
    );
  }
}
