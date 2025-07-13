import { Mock } from '../../../testing/test-utils/mock';

import { MasterTranslation } from './master-translation.model';

export class MasterTranslationMock extends Mock {
  static mock: { [id: string]: MasterTranslation } = {
    'en-UK': {
      serviceName: 'Service',
      serviceDescription: 'Service'
    },
    'de-CH': {
      serviceName: 'Werkstatt',
      serviceDescription: 'Werkstatt'
    },
    'fr-CH': {
      serviceName: 'Service',
      serviceDescription: 'Service'
    },
    'ru-RU': {
      serviceName: 'Сервис',
      serviceDescription: 'Сервис'
    },
    'tr-TR': {
      serviceName: 'Service',
      serviceDescription: "Service"
    }
  };
}

export class MasterLanguageGermanMock extends Mock {
  static mock: { [languageId: string]: MasterTranslation } = {
    'de-DE': {
      serviceName: 'Deutsch',
      serviceDescription: 'Deutsch'
    }
  };
}
