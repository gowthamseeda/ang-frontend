import { createAction, props } from '@ngrx/store';

import {
  FailurePayload,
  LoadContractStatusSuccessPayload,
  LoadLegalInformationPayload,
  RemoveContractStatusPayload,
  SaveContractStatusPayload,
  SaveContractStatusSuccessPayload,
  UpdateContractStatusPayload
} from './index';

export const loadContractStatus = createAction(
  '[Contract Status API] loadContractStatus',
  props<LoadLegalInformationPayload>()
);

export const loadContractStatusSuccess = createAction(
  '[Contract Status API] loadContractStatusSuccess',
  props<LoadContractStatusSuccessPayload>()
);

export const loadContractStatusFailure = createAction(
  '[Contract Status API] loadContractStatusFailure',
  props<FailurePayload>()
);

export const saveContractStatus = createAction(
  '[Legal Information Page] saveContractStatus',
  props<SaveContractStatusPayload>()
);

export const saveContractStatusSuccess = createAction(
  '[Contract Status API] saveContractStatusSuccess',
  props<SaveContractStatusSuccessPayload>()
);

export const saveContractStatusFailure = createAction(
  '[Contract Status API] saveContractStatusFailure',
  props<FailurePayload>()
);

export const addContractStatus = createAction('[User Action] addContractStatus');

export const removeContractStatus = createAction(
  '[User Action] removeContractStatus',
  props<RemoveContractStatusPayload>()
);

export const updateContractStatus = createAction(
  '[User Action] updateContractStatus',
  props<UpdateContractStatusPayload>()
);
