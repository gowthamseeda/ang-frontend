import {
  mockCountry_AF,
  mockCountry_DE,
  mockCountry_NL,
  mockRegionalCenterSuperviseeCountry_AF,
  mockRegionalCenterSuperviseeCountry_NL,
  mockRegionalCenter_GS0MRC001
} from '../../model/regional-center.mock';

import {
  TranslatedAddress,
  TranslatedSuperviseeCountry
} from './view-regional-centers.component.state';
import { RegionalCenterViewState } from './view-regional-centers.component.state';

export function mockedServiceResponse(): RegionalCenterViewState[] {
  const translatedCountry_AF: TranslatedSuperviseeCountry = {
    ...mockRegionalCenterSuperviseeCountry_AF(),
    name: mockCountry_AF.name,
    translations: mockCountry_AF.translations
  };

  const translatedCountry_NL: TranslatedSuperviseeCountry = {
    ...mockRegionalCenterSuperviseeCountry_NL(),
    name: mockCountry_NL.name,
    translations: mockCountry_NL.translations
  };

  const regionalCenter = mockRegionalCenter_GS0MRC001();

  const translatedAddress: TranslatedAddress = {
    ...regionalCenter.address,
    name: mockCountry_DE.name,
    translations: mockCountry_DE.translations
  };

  return [
    {
      ...regionalCenter,
      address: translatedAddress,
      superviseeCountries: [translatedCountry_AF, translatedCountry_NL]
    }
  ];
}
