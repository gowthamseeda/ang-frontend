import { getInitialState } from '../../../store/legal-structure-state.mock';
import { LegalStructureState } from '../../../store';
import { ViewEventStatus } from '../../model/legal-information.model';
import * as fromLegalInformation from '../reducers';
import { LegalInformationState } from '../state.model';
import { getLegalInformationState_fully_initialized } from '../state.mock';

import { selectInitializedState, selectLegalInformation } from './legal-information.selectors';

describe('Legal information selectors test suite', () => {
  describe('selectLegalInformation should', () => {
    test('return correct node from store slice', () => {
      const state: LegalStructureState = getInitialState();
      const initialLegalInformationState = fromLegalInformation.initialState;
      const selection = selectLegalInformation.projector(state);
      expect(selection).toStrictEqual(initialLegalInformationState);
    });
  });

  describe('selectInitializedState should', () => {
    test('return true if outlet id matches', () => {
      const state: LegalInformationState = getLegalInformationState_fully_initialized();
      const selection = selectInitializedState.projector(state);
      expect(selection).toBe(true);
    });

    test('return false if outlet id does not match', () => {
      const state: LegalInformationState = {
        ...getLegalInformationState_fully_initialized(),
        savingStatus: {
          contentStatus: ViewEventStatus.DEFAULT
        }
      };
      const selection = selectInitializedState.projector(state);
      expect(selection).toBe(false);
    });
  });
});
