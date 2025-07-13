import { initialState as initialStateBusinessSite } from '../businessSite/store/reducers';
import { initialState as initialStateLegalInformation } from '../legal-information/store/reducers';

import { LegalStructureState } from './index';

export function getInitialState(): LegalStructureState {
  return {
    businessSiteState: initialStateBusinessSite,
    legalInformation: initialStateLegalInformation
  };
}
