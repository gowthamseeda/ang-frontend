import { UntypedFormControl } from '@angular/forms';

import { Times } from '../../models/opening-hour.model';

export interface GroupedOpeningHourColumn {
  columnDef: string;
  brandId?: string;
  productGroups?: ProductGroup[];
  cell: (arg: UntypedFormControl) => string | OpeningHourAs24HourTimeFormat;
  isLastOfBrand?: boolean;
  isEnabled?: boolean;
}

export interface ProductGroup {
  id: string;
  hasMoveLeftAction: boolean;
  hasMoveRightAction: boolean;
  isActionEnabled?: boolean;
}

// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/time
export interface OpeningHourAs24HourTimeFormat {
  closed?: boolean;
  times?: Times[];
}

export interface BrandProductGroupSelection {
  brandId: string;
  productGroupId: string;
  isOnliestProduct: boolean;
  isLastColumnOfBrand?: boolean;
}
