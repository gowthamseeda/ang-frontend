import { createAction, props } from '@ngrx/store';

import { ApiError } from '../../../../shared/services/api/api.service';
import { MarketStructure } from '../../../market-structure/market-structure.model';
import { Company } from '../../model/company.model';
import { OutletStructure, OutletStructureOutlets } from '../../model/outlet-structure.model';

export const loadOutletStructures = createAction(
  '[API Load Outlet Structures] Load Outlet Structures',
  props<{ outletId: string }>()
);

export const loadOutletStructureSuccess = createAction(
  '[API Load Outlet Structure Success] Load Outlet Structure Success',
  props<{
    company: Company;
    outletStructure: OutletStructure;
    outletId: string;
  }>()
);

export const loadOutletStructureFailure = createAction(
  '[API Load Outlet Structure Failure] Load Outlet Structure Failure',
  props<{ error: ApiError }>()
);

export const removeSublets = createAction(
  '[User Action Remove Sublets] Remove Sublets',
  props<{ outletId: string }>()
);

export const removeSubletsFailure = createAction(
  '[Structure API] Remove Sublets Failure',
  props<{ error: any }>()
);

export const createMarketStructure = createAction(
  '[API Create Market Structure] Create Market Structure',
  props<{
    marketStructure: MarketStructure;
    sourceOutlet: {
      isSublet: boolean;
      siblingOutletIds: string[];
      sourceParentId: string;
    };
  }>()
);

export const createMarketStructureFailure = createAction(
  '[API Create Market Structure Failure] Create Market Structure Failure',
  props<{ error: any }>()
);

export const moveSubletTo = createAction(
  '[API Move Sublet To] Move Sublet To',
  props<{
    targetOutletId: string;
    sourceOutlet: OutletStructureOutlets;
    siblingOutletIds: string[];
    targetSubletIds: string[];
    sourceParentId: string;
  }>()
);

export const moveSubletToFailure = createAction(
  '[API Move Sublet To Failure] Move Sublet To Failure',
  props<{ error: any }>()
);
export const deleteFromMarketStructure = createAction(
  '[User Action] Detach From Market Structure',
  props<{ outletId: string; mainOutlet: boolean; subOutlet: boolean }>()
);

export const deleteFromMarketStructureFailure = createAction(
  '[Structure API] Detach From Market Structure Failure',
  props<{ error: any }>()
);
