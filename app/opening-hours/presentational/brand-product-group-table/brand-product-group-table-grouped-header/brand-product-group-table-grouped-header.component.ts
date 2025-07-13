import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { MultiSelectDataService } from 'app/services/service/services/multi-select-service-data.service';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs/index';
import { map, takeUntil } from 'rxjs/operators';
import { OfferedService } from '../../../../communication/model/offered-service.model';

import {
  BrandProductGroupSelection,
  GroupedOpeningHourColumn,
  ProductGroup
} from '../grouped-opening-hour-column.model';

import { BrandProductGroupTableHeaderCell } from './brand-product-group-table-header-cell.model';

@Component({
  selector: 'gp-brand-product-group-table-grouped-header',
  templateUrl: './brand-product-group-table-grouped-header.component.html',
  styleUrls: ['./brand-product-group-table-grouped-header.component.scss']
})
export class BrandProductGroupTableGroupedHeaderComponent implements OnInit, OnChanges {
  @Input()
  columns: GroupedOpeningHourColumn[];
  @Output()
  moveProductGroupLeft = new EventEmitter<BrandProductGroupSelection>();
  @Output()
  moveProductGroupRight = new EventEmitter<BrandProductGroupSelection>();
  @Input()
  offeredServices: OfferedService[] = [];
  isHover: boolean = false;

  columnHeaders: BrandProductGroupTableHeaderCell[];

  private unsubscribe = new Subject<void>();

  constructor(private multiSelectDataService: MultiSelectDataService) {}

  ngOnInit(): void {
    this.initColumnHeaderCells();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.columns) {
      this.initColumnHeaderCells();
    }
  }

  onMoveProductGroupLeft(
    brandId: string,
    productGroupId: string,
    isLastOfBrand: boolean,
    productGroups: ProductGroup[]
  ): void {
    this.moveProductGroupLeft.emit({
      brandId: brandId,
      productGroupId: productGroupId,
      isOnliestProduct: productGroups ? productGroups.length === 1 : false,
      isLastColumnOfBrand: isLastOfBrand
    });
  }

  onMoveProductGroupRight(
    brandId: string,
    productGroupId: string,
    isLastOfBrand: boolean,
    productGroups: ProductGroup[]
  ): void {
    this.moveProductGroupRight.emit({
      brandId: brandId,
      productGroupId: productGroupId,
      isOnliestProduct: productGroups ? productGroups.length === 1 : false,
      isLastColumnOfBrand: isLastOfBrand
    });
  }

  getIcon(brandId: string, productGroupId: string): Observable<boolean> {
    return this.multiSelectDataService.hoveredService.pipe(
      map(hoveredServiceId => {
        const offeredService = this.offeredServices.filter(
          it => it.brandId === brandId && it.productGroupId === productGroupId
        );
        return offeredService.some(it => it.serviceId === hoveredServiceId);
      }),
      takeUntil(this.unsubscribe)
    );
  }

  private initColumnHeaderCells(): void {
    this.columnHeaders = [];
    this.columns.forEach(groupedColumn => {
      if (groupedColumn.brandId) {
        const columnHeader = this.getColumnHeaderCell(groupedColumn.brandId);
        columnHeader.groupedColumns.push(groupedColumn);
      }
    });
  }

  private addColumnHeaderCell(brandId: string): BrandProductGroupTableHeaderCell {
    const columnHeader = new BrandProductGroupTableHeaderCell(brandId);
    this.columnHeaders.push(columnHeader);
    return columnHeader;
  }

  private getColumnHeaderCell(brandId: string): BrandProductGroupTableHeaderCell {
    const columnHeader = this.columnHeaders.find(column => column.brandId === brandId);
    return columnHeader ? columnHeader : this.addColumnHeaderCell(brandId);
  }
}
