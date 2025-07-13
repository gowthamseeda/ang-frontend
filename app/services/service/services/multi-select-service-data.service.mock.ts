import { of } from 'rxjs';
import { MultiSelect, MultiSelectMode } from '../models/multi-select.model';

export class MultiSelectDataServiceMock {
  multiSelected = of<MultiSelect>({
    targets: [
      {
        id: 'GS0000001-1',
        serviceId: 1,
        productCategoryId: 1,
        brandId: 'MB',
        productGroupId: 'PC',
        outletId: "GS0000001"
      }
    ],
    mode: MultiSelectMode.EDIT,
    offeredServiceSelectionList: [
      {
        id: 'GS0000001-1',
        serviceId: 1,
        productCategoryId: 1,
        brandId: 'MB',
        productGroupId: 'PC',
        outletId: "GS0000001"
      }
    ]
  });

  hoveredService = of(120);

  flushHoveredService(): void {}
}
