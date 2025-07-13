import {
  Component,
  ContentChild,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  TemplateRef,
  ViewChild,
  SimpleChanges
} from '@angular/core';
import {
  MatCellDef,
  MatHeaderCellDef,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';

import {
  BrandProductGroupId,
  BrandProductGroupsGroupedByBrandId
} from '../../../../communication/model/brand-product-group-id.model';
import { ContentLoader } from '../../../../shared/components/content-loader/content-loader.component';
import { brandProductGroupUtils } from '../../../brand-product-group/brand-product-group.model';
import { BrandProductGroupValidity } from '../../../offered-service/brand-product-group-validity.model';
import { Validity } from '../../../validity/validity.model';

import minusBrandProductGroupIds = BrandProductGroupId.minusBrandProductGroupIds;
import compareWithBrandProductGroupIds = BrandProductGroupId.compareWithBrandProductGroupIds;
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
  selector: 'gp-brand-product-groups-data-table',
  templateUrl: './brand-product-groups-data-table.component.html',
  styleUrls: ['./brand-product-groups-data-table.component.scss']
})
export class BrandProductGroupsDataTableComponent implements OnChanges, ContentLoader {
  @Input() brandProductGroupsData: BrandProductGroupsData<any>[];
  @Input() brandProductGroupValidities: BrandProductGroupValidity[];
  @Input() brandProductGroupColumns: BrandProductGroupsGroupedByBrandId;
  @Input() dataColumnName = '';
  @Input() isLoading: boolean;
  @Input() renderOnBrandProductGroupsDataChanges = false;
  @Input() disableBrandProductGroupsChange = false;
  @Input() readOnly = false;
  @Input() permissions: string[] = [];
  @Input() multiEdit = false;
  @Output() brandProductGroupChange = new EventEmitter<AffectedBrandProductGroupsDataRows<any>>();
  @Output() brandProductGroupsChange = new EventEmitter<BrandProductGroupsData<any>[]>();
  @Input() refreshTable: boolean;

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

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.brandProductGroupsData) {
      return;
    }
    this.keepUndefinedBrandProductGroupsDataSplitted();
    this.sortBrandProductGroupsData();
    this.updateBrandProductGroupsDataTable(this.renderOnBrandProductGroupsDataChanges);
     if (changes['refreshTable'] && changes['refreshTable'].currentValue) {
    this.brandProductGroupsDataDataSource = new MatTableDataSource<BrandProductGroupsData<any>>(this.brandProductGroupsData);
  }
  }

  moveBrandProductGroup(
    brandProductGroupIdToMove: BrandProductGroupId,
    arrowDirection: ArrowDirection
  ): void {
    const isMovementAllowed = this.isMovementAllowed(brandProductGroupIdToMove, arrowDirection);
    const dataRowIndex = this.getRowIndexOfBrandProductGroupsDataBy(brandProductGroupIdToMove);
    if (dataRowIndex === -1 || !isMovementAllowed) {
      return;
    }

    let anyBrandProductGroupOfExistingDataChanged = false;
    const dataRow = this.brandProductGroupsData[dataRowIndex];
    const affectedRows: {
      sourceRow: BrandProductGroupsData<any>;
      targetRow?: BrandProductGroupsData<any>;
    } = {
      sourceRow: dataRow
    };
    this.removeBrandProductGroupId(dataRow, brandProductGroupIdToMove);

    if (arrowDirection === ArrowDirection.DOWN) {
      if (this.isLastRow(dataRowIndex)) {
        const undefinedBrandProductGroupsData = {
          data: undefined,
          brandProductGroupIds: [brandProductGroupIdToMove]
        };
        this.brandProductGroupsData.push(undefinedBrandProductGroupsData);
        affectedRows.targetRow = undefinedBrandProductGroupsData;
      } else {
        const dataRowBelow = this.brandProductGroupsData[dataRowIndex + 1];
        this.addBrandProductGroupId(dataRowBelow, brandProductGroupIdToMove);
        affectedRows.targetRow = dataRowBelow;
      }
    } else if (arrowDirection === ArrowDirection.UP) {
      const dataRowAbove = this.brandProductGroupsData[dataRowIndex - 1];
      this.addBrandProductGroupId(dataRowAbove, brandProductGroupIdToMove);
      affectedRows.targetRow = dataRowAbove;
    }

    if (affectedRows.sourceRow.data) {
      this.brandProductGroupChange.emit([affectedRows.sourceRow, affectedRows.targetRow]);
      anyBrandProductGroupOfExistingDataChanged = true;
    } else if (affectedRows.targetRow?.data) {
      this.brandProductGroupChange.emit([affectedRows.targetRow]);
      anyBrandProductGroupOfExistingDataChanged = true;
    }

    if (dataRow.brandProductGroupIds.length === 0) {
      this.brandProductGroupsData.splice(dataRowIndex, 1);
    }

    this.updateBrandProductGroupsDataTable(true);

    if (anyBrandProductGroupOfExistingDataChanged) {
      this.brandProductGroupsChange.emit(this.brandProductGroupsData);
    }
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

  brandProductGroupIsInFirstRow(brandProductGroupId: BrandProductGroupId): boolean {
    const rowIndex = this.getRowIndexOfBrandProductGroupsDataBy(brandProductGroupId);
    return rowIndex === 0;
  }

  brandProductGroupIsOnlyOneInLastRow(brandProductGroupId: BrandProductGroupId): boolean {
    const rowIndex = this.getRowIndexOfBrandProductGroupsDataBy(brandProductGroupId);
    const countBrandProductGroupIdsOfRow = this.countBrandProductGroupsOfRow(rowIndex);

    return countBrandProductGroupIdsOfRow === 1 && this.isLastRow(rowIndex);
  }

  isMovementAllowed(
    brandProductGroupIdToMove: BrandProductGroupId,
    arrowDirection: ArrowDirection
  ): boolean {

    if (this.multiEdit) {
      return false;
    }

    if (this.disableBrandProductGroupsChange) {
      return false;
    }

    if (arrowDirection === ArrowDirection.UP) {
      return !this.brandProductGroupIsInFirstRow(brandProductGroupIdToMove);
    } else if (arrowDirection === ArrowDirection.DOWN) {
      return !this.brandProductGroupIsOnlyOneInLastRow(brandProductGroupIdToMove);
    }

    return true;
  }

  getValidityIcon(brandId: string, productGroupId: string): string {
    const brandProductGroupValidity: BrandProductGroupValidity | undefined =
      this.brandProductGroupValidities?.find(
        compareWithBrandProductGroupId({ brandId, productGroupId })
      );

    if (!brandProductGroupValidity) {
      return 'check';
    }

    const validity: Validity | undefined = brandProductGroupValidity.validity;

    if (validity) {
      if (validity.application) {
        return 'os-applicant';
      }

      if (validity.valid) {
        return 'os-offered-and-valid';
      }
    }

    return `os-planned-pg-${productGroupId.toLowerCase()}`;
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

  private sortBrandProductGroupsData(): void {
    this.brandProductGroupsData.sort((a, b) => {
      const aIndex = this.brandProductGroupsDataRef.findIndex(ref =>
        compareWithBrandProductGroupIds(a.brandProductGroupIds)(ref.brandProductGroupIds)
      );
      const bIndex = this.brandProductGroupsDataRef.findIndex(ref =>
        compareWithBrandProductGroupIds(b.brandProductGroupIds)(ref.brandProductGroupIds)
      );

      // place new entries to bottom
      if (aIndex < 0 || bIndex < 0) {
        return bIndex - aIndex;
      }
      // keep order of existing entries
      return aIndex - bIndex;
    });
  }

  private keepUndefinedBrandProductGroupsDataSplitted(): void {
    if (this.brandProductGroupsDataRef.filter(row => !row.data).length < 2) {
      return;
    }

    const brandProductGroupIdsOfUndefinedDataRow = this.brandProductGroupsData.find(
      row => row.data === undefined
    )?.brandProductGroupIds;

    const undefinedBrandProductGroupsDataRowsSplitted = this.brandProductGroupsDataRef
      .filter(row =>
        row.brandProductGroupIds.every(brandProductGroupId =>
          brandProductGroupIdsOfUndefinedDataRow?.some(
            compareWithBrandProductGroupId(brandProductGroupId)
          )
        )
      )
      .map(row => ({ data: undefined, brandProductGroupIds: row.brandProductGroupIds }));

    const definedBrandProductGroupDataRows = this.brandProductGroupsData.filter(
      row => row.data !== undefined
    );

    this.brandProductGroupsData = definedBrandProductGroupDataRows.concat(
      undefinedBrandProductGroupsDataRowsSplitted
    );
  }

  private renderRows(): void {
    this.brandProductGroupsDataTable.renderRows();
  }

  private getRowIndexOfBrandProductGroupsDataBy(brandProductGroupId: BrandProductGroupId): number {
    if (!this.brandProductGroupsData) {
      return -1;
    }
    return this.brandProductGroupsData.findIndex(row =>
      Object.values(row.brandProductGroupIds).some(this.hasBrandProductGroupId(brandProductGroupId))
    );
  }

  private hasBrandProductGroupId(
    brandProductGroupId: BrandProductGroupId
  ): (brandProductGroupId: BrandProductGroupId) => boolean {
    return (currentBrandProductGroupId: BrandProductGroupId) =>
      currentBrandProductGroupId.brandId === brandProductGroupId.brandId &&
      currentBrandProductGroupId.productGroupId === brandProductGroupId.productGroupId;
  }

  private countBrandProductGroupsOfRow(rowIndex: number): number {
    if (!this.brandProductGroupsData || rowIndex < 0) {
      return 0;
    }
    return Object.keys(this.brandProductGroupsData[rowIndex].brandProductGroupIds).length;
  }

  private isLastRow(currentRowIndex: number): boolean {
    return this.brandProductGroupsData?.length === currentRowIndex + 1;
  }

  private removeBrandProductGroupId(
    brandProductGroupsDataRow: BrandProductGroupsData<any>,
    brandProductGroupIdToRemove: BrandProductGroupId
  ): void {
    brandProductGroupsDataRow.brandProductGroupIds =
      brandProductGroupsDataRow.brandProductGroupIds.filter(
        minusBrandProductGroupIds([brandProductGroupIdToRemove])
      );
  }

  private addBrandProductGroupId(
    brandProductGroupsDataRow: BrandProductGroupsData<any>,
    brandProductGroupIdToAdd: BrandProductGroupId
  ): void {
    brandProductGroupsDataRow.brandProductGroupIds =
      brandProductGroupsDataRow.brandProductGroupIds.concat(brandProductGroupIdToAdd);
  }
}
