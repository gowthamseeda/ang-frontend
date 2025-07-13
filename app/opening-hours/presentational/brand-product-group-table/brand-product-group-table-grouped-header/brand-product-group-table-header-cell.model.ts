import { GroupedOpeningHourColumn } from '../grouped-opening-hour-column.model';

export class BrandProductGroupTableHeaderCell {
  brandId: string;
  groupedColumns: GroupedOpeningHourColumn[] = [];

  constructor(brandId: string) {
    this.brandId = brandId;
  }

  hasMoveLeftAction(productGroupId: string): boolean {
    let hasMoveLeftAction = false;
    this.groupedColumns.forEach(groupedColumn => {
      if (
        (groupedColumn.productGroups ? groupedColumn.productGroups : [])
          .filter(productGroup => productGroup.id === productGroupId)
          .filter(productGroup => productGroup.hasMoveLeftAction)
          .pop()
      ) {
        hasMoveLeftAction = true;
      }
    });
    return hasMoveLeftAction;
  }

  hasMoveRightAction(productGroupId: string): boolean {
    let hasMoveRightAction = false;
    this.groupedColumns.forEach(groupedColumn => {
      if (
        (groupedColumn.productGroups ? groupedColumn.productGroups : [])
          .filter(productGroup => productGroup.id === productGroupId)
          .filter(productGroup => productGroup.hasMoveRightAction)
          .pop()
      ) {
        hasMoveRightAction = true;
      }
    });
    return hasMoveRightAction;
  }
}
