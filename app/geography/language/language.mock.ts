import { Language } from './language.model';

export function getLanguageMock(): { [index: string]: Language[] } {
  return {
    languages: [
      { id: 'en-UK', name: 'English (United Kingdom)', representation: 'English (United Kingdom)' },
      { id: 'de-CH', name: 'German (Switzerland)', representation: 'German (Switzerland)' },
      { id: 'fr-CH', name: 'French (Switzerland)', representation: 'French (Switzerland)' },
      { id: 'it-CH', name: 'Italian (Switzerland)', representation: 'Italian (Switzerland)' },
      { id: 'de-DE', name: 'German (Germany)', representation: 'German (Germany)' }
    ]
  };
}

export function getLanguageUS(): Language {
  return {
    id: 'en-US',
    name: 'English (United States)',
    representation: 'English (United States)'
  };
}

export function getLanguageGermanPure(): Language {
  return {
    id: 'de',
    name: 'German',
    representation: 'Deutsch'
  };
}

export function getLanguageEnglishPure(): Language {
  return {
    id: 'en',
    name: 'English',
    representation: 'English'
  };
}

export const languageMockMap = new Map(
  getLanguageMock().languages.map(language => [language.id, language] as [string, Language])
);
