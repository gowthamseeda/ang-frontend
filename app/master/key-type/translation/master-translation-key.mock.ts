import { Mock } from '../../../testing/test-utils/mock';

import { MasterTranslationKey } from './master-translation-key.model';

export class MasterTranslationKeyMock extends Mock {
  static mock: { [id: string]: MasterTranslationKey } = {
    'en-UK': {
      description: 'Service'
    },
    'de-CH': {
      description: 'Werkstatt'
    },
    'fr-CH': {
      description: 'Service'
    },
    'ru-RU': {
      description: 'Сервис'
    },
    'tr-TR': {
      description: 'Service'
    }
  };
}

export class MasterLanguageGermanKeyMock extends Mock {
  static mock: { [languageId: string]: MasterTranslationKey } = {
    'de-DE': {
      description: 'Deutsch'
    }
  };
}
