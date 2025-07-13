import { CommunicationFieldFormat } from './communication-field-format';
import { CommunicationFieldType } from './communication-field-type';
import { CommunicationField } from './communication-field.model';

export const communicationFieldMock: CommunicationField[] = [
  {
    id: 'TEL',
    name: 'Telephone',
    type: CommunicationFieldType.STANDARD,
    template: '0049',
    format: CommunicationFieldFormat.TEL,
    position: 0,
    translations: {
      'de-CH': 'Telefon'
    }
  },
  {
    id: 'FIRSTNAME',
    name: 'First Name',
    type: CommunicationFieldType.STANDARD,
    position: 1,
    translations: {
      'de-CH': 'Vorname'
    }
  },
  {
    id: 'URL',
    name: 'URL',
    type: CommunicationFieldType.STANDARD,
    position: 3,
    uiFieldSize: 5,
    translations: {
      'de-CH': 'Webseitenadresse'
    }
  },
  {
    id: 'INSTAGRAM',
    name: 'Instagram',
    type: CommunicationFieldType.SOCIAL_MEDIA,
    position: 5,
    translations: {
      'de-CH': 'Instagram-DE'
    }
  }
];
