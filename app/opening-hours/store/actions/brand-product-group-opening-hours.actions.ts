import { createAction, props } from '@ngrx/store';

import { TaskData } from '../../../tasks/task.model';
import { Response } from '../../models/opening-hour-response.model';
import { OpeningHoursPermissions } from '../../models/opening-hours-permissions.model';
import { Hours, Outlet, Service } from '../reducers';
import { MultiSelectOfferedServiceIds } from '../../../services/service/models/multi-select.model';

export enum Direction {
  Left = 1,
  Right
}

export const updateSavingStatus = createAction(
  '[OpeningHours API] saving status updated',
  props<{ updated: boolean }>()
);

export const openingHoursLoad = createAction(
  '[OpeningHours API] Load OpeningHours',
  props<{
    outletId: string;
    productCategoryId: number;
    serviceId: number;
    serviceCharacteristicId?: number;
    isTaskPresent?: boolean;
  }>()
);

export const openingHoursReload = createAction(
  '[OpeningHours API] Reload OpeningHours',
  props<{
    response: Response;
  }>()
);

export const openingHoursLoadSuccess = createAction(
  '[OpeningHours API] Load OpeningHours Success',
  props<{
    response: Response;
  }>()
);

export const brandProductGroupOpeningHoursLoadSuccess = createAction(
  '[OpeningHours API] Load BrandProductGroupOpeningHours Success',
  props<{
    service: Service;
    hours: Hours;
    outlet: Outlet;
    permissions: OpeningHoursPermissions;
  }>()
);

export const openingHoursSubmit = createAction(
  '[User Action] Submit OpeningHours',
  props<{
    hours: Hours;
    service: Service;
    businessSiteId: string;
    taskData?: TaskData;
  }>()
);

export const openingHoursUpdateSuccess = createAction(
  '[OpeningHours API] Update OpeningHours Success',
  props<{
    hours: Hours;
    taskData?: TaskData;
  }>()
);

export const openingHoursApiFailure = createAction(
  '[OpeningHours API] Failure',
  props<{ error: any }>()
);

export const specialOpeningHoursFirstDaySelected = createAction(
  '[User Action] First Day selected',
  props<{ date: number }>()
);

export const specialOpeningHoursSecondDaySelected = createAction(
  '[User Action] Second Day selected',
  props<{ creationDate: number; firstDateSelected: number; secondDateSelected: number }>()
);

export const removeUnchangedSpecialOpeningHours = createAction(
  '[User Action] unchanged special opening hours removed'
);

export const specialOpeningHoursChangedFirstTime = createAction(
  '[User Action] unchanged special opening hour was changed',
  props<{ date: number; hours: Hours }>()
);

export const deleteSpecialOpeningHours = createAction(
  '[User Action] delete special opening hours',
  props<{ date: number }>()
);

export const resetSpecialOpeningHours = createAction(
  '[User Action] reset special opening hours',
  props<{ date: number; restrictedBrands: string[]; restrictedProductGroups: string[] }>()
);

export const detachProductGroupFromBrand = createAction(
  '[User Action] detach product group from brand',
  props<{ brandId: string; productGroupId: string; startDate?: number }>()
);

export const dropProductGroupColumn = createAction(
  '[User Action] drop product group column',
  props<{ brandId: string; productGroupId: string; startDate?: number }>()
);

export const moveStandardOpeningHoursProductGroup = createAction(
  '[User Action] move standard opening hours product group',
  props<{ brandId: string; productGroupId: string; direction: Direction }>()
);

export const moveSpecialOpeningHoursProductGroup = createAction(
  '[User Action] move special opening hours product group',
  props<{ brandId: string; productGroupId: string; startDate: number; direction: Direction }>()
);

export const updateOpeningHours = createAction(
  '[User Action] update opening hours',
  props<{ date: number; hours: Hours }>()
);

export const loadTaskSuccess = createAction(
  '[OpeningHours Task Effect] task data load success',
  props<{ dataChangeTaskPresent?: boolean; verificationTaskPresent?: boolean }>()
);

export const initMultiEditOpeningHours = createAction(
  '[System Action] Init Multi Edit Opening Hours',
  props<{
    hours: Hours;
  }>()
);

export const multiEditOpeningHoursSubmit = createAction(
  '[User Action] Submit Multi Edit OpeningHours',
  props<{
    hours: Hours;
    multiSelectOfferedServices: MultiSelectOfferedServiceIds[];
    taskData?: TaskData;
  }>()
);
