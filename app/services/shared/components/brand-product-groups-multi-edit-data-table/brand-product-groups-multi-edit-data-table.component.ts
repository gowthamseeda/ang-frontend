import {
  Component,
  ContentChild,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {
  MatCellDef,
  MatHeaderCellDef,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import {
  BrandProductGroupId,
  BrandProductGroupsGroupedByBrandId
} from '../../../../communication/model/brand-product-group-id.model';
import { OfferedService } from '../../../../communication/model/offered-service.model';
import { ContentLoader } from '../../../../shared/components/content-loader/content-loader.component';
import { brandProductGroupUtils } from '../../../brand-product-group/brand-product-group.model';
import { MultiSelectDataService } from '../../../service/services/multi-select-service-data.service';
import { getMultiEditOfferedServiceCurrentProcessState } from '../../util/multi-edit-offered-service-process-state';

import compareWithBrandProductGroupId = BrandProductGroupId.compareWithBrandProductGroupId;

export interface BrandProductGroupsData<T> {
  data?: T;
  brandProductGroupIds: BrandProductGroupId[];
}

export enum ArrowDirection {
  UP = 'UP',
  DOWN = 'DOWN'
}

export type AffectedBrandProductGroupsDataRows<T> = [
  BrandProductGroupsData<T>,
  BrandProductGroupsData<T>?
];

@Component({
  selector: 'gp-brand-product-groups-multi-edit-data-table',
  templateUrl: './brand-product-groups-multi-edit-data-table.component.html',
  styleUrls: ['./brand-product-groups-multi-edit-data-table.component.scss']
})
export class BrandProductGroupsMultiEditDataTableComponent implements OnChanges, ContentLoader {
  @Input() brandProductGroupsData: BrandProductGroupsData<any>[];
  @Input() brandProductGroupColumns: BrandProductGroupsGroupedByBrandId;
  @Input() offeredServices: OfferedService[]
  @Input() dataColumnName = '';
  @Input() isLoading: boolean;
  @Input() renderOnBrandProductGroupsDataChanges = false;
  @Input() disableBrandProductGroupsChange = false;
  @Input() readOnly = false;
  @Input() permissions: string[] = [];
  @Output() brandProductGroupChange = new EventEmitter<AffectedBrandProductGroupsDataRows<any>>();
  @Output() brandProductGroupsChange = new EventEmitter<BrandProductGroupsData<any>[]>();

  brandProductGroupsDataRef: BrandProductGroupsData<any>[] = [];
  brandProductGroupsDataDataSource: MatTableDataSource<BrandProductGroupsData<any>>;
  displayedColumns = ['data', 'brandProductGroups'];
  ArrowDirection = ArrowDirection;

  @ViewChild(MatTable) brandProductGroupsDataTable: MatTable<any>;
  @ContentChild(MatHeaderCellDef, { read: TemplateRef }) headerCellTemplate: any;
  @ContentChild(MatCellDef, { read: TemplateRef }) cellTemplate: any;

  borderWidth = 1;
  columnWidth = 60;
  dataCellWidth = 750;
  cellWidth = this.dataCellWidth + 'px';

  private unsubscribe = new Subject<void>();

  constructor(
    private multiSelectDataService: MultiSelectDataService
  ) {}

  ngOnChanges(): void {
    if (!this.brandProductGroupsData) {
      return;
    }
    this.updateBrandProductGroupsDataTable(this.renderOnBrandProductGroupsDataChanges);
  }

  calculateBrandsColumnWidth(brandId: string): string {
    return `${
      this.columnWidth * this.brandProductGroupColumns[brandId].length + this.borderWidth
    }px`;
  }

  calculateTableWidth(): string {
    if (!this.brandProductGroupColumns) {
      return `${this.dataCellWidth}px`;
    }

    const values = Object.values(this.brandProductGroupColumns);
    const totalProductGroups = values.reduce((count, row) => count + row.length, 0);

    return `${this.dataCellWidth + this.columnWidth * totalProductGroups}px`;
  }

  orderBrandProductGroups(brandProductGroups: BrandProductGroupId[]): BrandProductGroupId[] {
    return brandProductGroupUtils.orderByProductGroupId(brandProductGroups);
  }

  brandProductGroupExistsFor(
    brandProductGroupIds: BrandProductGroupId[],
    brandId: string,
    productGroupId: string
  ): boolean {
    return brandProductGroupIds.some(compareWithBrandProductGroupId({ brandId, productGroupId }));
  }

  getIcon(
    brandId: string,
    productGroupId: string
  ): Observable<string | undefined> {
    return this.multiSelectDataService.hoveredService.pipe(
      map(hoveredServiceId => {
        const isAssignable = this.offeredServiceBrandProductGroupExistsFor(
          brandId,
          productGroupId
        );

        if (!isAssignable) {
          return '';
        }

        const offeredService = this.offeredServices.filter(
          it => it.brandId === brandId && it.productGroupId === productGroupId
        );

        const serviceHovered = offeredService.some(it => it.serviceId === hoveredServiceId);

        const offeredServiceProcessState = getMultiEditOfferedServiceCurrentProcessState(
          offeredService[0],
          isAssignable
        );

        return serviceHovered
          ? offeredServiceProcessState?.hoverIcon
          : offeredServiceProcessState?.defaultIcon;
      }),
      takeUntil(this.unsubscribe)
    );
  }

  offeredServiceBrandProductGroupExistsFor(
    brandId: string,
    productGroupId: string
  ): boolean {

    return this.offeredServices.some(
      (offeredService: OfferedService) =>
        offeredService.brandId === brandId && offeredService.productGroupId === productGroupId
    );
  }

  private updateBrandProductGroupsDataTable(renderTable: boolean): void {
    this.brandProductGroupsDataRef.length = 0;
    this.brandProductGroupsDataRef.push.apply(
      this.brandProductGroupsDataRef,
      this.brandProductGroupsData
    );

    if (!this.brandProductGroupsDataDataSource) {
      this.brandProductGroupsDataDataSource = new MatTableDataSource<BrandProductGroupsData<any>>(
        this.brandProductGroupsDataRef
      );
    } else if (renderTable) {
      this.renderRows();
    }
  }

  private renderRows(): void {
    this.brandProductGroupsDataTable.renderRows();
  }
}
