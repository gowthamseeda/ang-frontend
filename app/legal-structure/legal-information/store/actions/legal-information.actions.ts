import { createAction, props } from '@ngrx/store';

import { LegalBusinessSite, LegalCompany } from '../../model/legal-information.model';

import {
  FailurePayload,
  LoadLegalInformationPayload,
  LoadLegalInformationSuccessPayload,
  SaveLegalInformationPayload,
  SaveLegalInformationSuccessPayload
} from './index';

export const loadLegalInformation = createAction(
  '[Legal Information Page] loadLegalInformation',
  props<LoadLegalInformationPayload>()
);

export const loadLegalInformationSuccess = createAction(
  '[Legal Information API] loadLegalInformationSuccess',
  props<LoadLegalInformationSuccessPayload>()
);

export const loadLegalInformationFailure = createAction(
  '[Legal Information API] loadLegalInformationFailure',
  props<FailurePayload>()
);

export const saveLegalInformation = createAction(
  '[Legal Information Page] saveLegalInformation',
  props<SaveLegalInformationPayload>()
);

export const saveLegalInformationSuccess = createAction(
  '[Legal Information API] saveLegalInformationSuccess',
  props<SaveLegalInformationSuccessPayload>()
);

export const confirmSaveLegalInformationSuccess = createAction(
  '[Legal Information API] confirmSaveLegalInformationSuccess',
  props<SaveLegalInformationSuccessPayload>()
);

export const saveLegalInformationFailure = createAction(
  '[Legal Information API] saveLegalInformationFailure',
  props<FailurePayload>()
);

export const updateLegalCompany = createAction(
  '[User Action] updateLegalCompany',
  props<LegalCompany>()
);

export const updateLegalBusinessSite = createAction(
  '[User Action] updateLegalBusinessSite',
  props<LegalBusinessSite>()
);
