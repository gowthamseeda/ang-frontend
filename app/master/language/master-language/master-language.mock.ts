import { Mock } from '../../../testing/test-utils/mock';

import { MasterLanguage } from './master-language.model';

export class MasterLanguageMock extends Mock {
  static mock: { [id: string]: MasterLanguage } = {
    'en-UK': {
      id: 'en-UK',
      name: 'English (United Kingdom)',
      representation: 'English (United Kingdom)'
    },
    'de-CH': {
      id: 'de-CH',
      name: 'German (Switzerland)',
      representation: 'German (Switzerland)'
    },
    'fr-CH': {
      id: 'fr-CH',
      name: 'French (Switzerland)',
      representation: 'French (Switzerland)'
    },
    'it-CH': {
      id: 'it-CH',
      name: 'Italian (Switzerland)',
      representation: 'Italian (Switzerland)'
    },
    'de-DE': {
      id: 'de-DE',
      name: 'German (Germany)',
      representation: 'German (Germany)'
    }
  };
}

export class MasterLanguageGermanMock extends Mock {
  static mock: { [id: string]: MasterLanguage } = {
    'de-DE': {
      id: 'de-DE',
      name: 'Deutsch',
      representation: 'Deutsch'
    }
  };
}
