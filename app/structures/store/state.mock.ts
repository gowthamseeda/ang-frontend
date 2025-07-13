import * as fromCountryStructureDescription from '../country-structure-description/store/reducers';
import * as fromOutletStructure from '../outlet-structure/store/reducers';
import * as fromRegionalCenter from '../regional-center/store/reducers';

import { StructuresState } from './index';

export function getInitialStructuresState(): StructuresState {
  return {
    countryStructureDescription: { ...fromCountryStructureDescription.initialState },
    outletStructure: { ...fromOutletStructure.initialState },
    regionalCenter: { ...fromRegionalCenter.initialState }
  };
}
