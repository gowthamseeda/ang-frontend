import { Language } from './language.model';

export function getLanguageListMock(): Language[] {
  return [
    {
      id: 'en',
      name: 'English',
      representation: 'English',
      lock: false
    },
    {
      id: 'en-US',
      name: 'English (United States)',
      representation: 'English (United States)',
      lock: true
    },
    {
      id: 'de-DE',
      name: 'German (Germany)',
      representation: 'Deutsch (Deutschland)',
      lock: false
    }
  ];
}
