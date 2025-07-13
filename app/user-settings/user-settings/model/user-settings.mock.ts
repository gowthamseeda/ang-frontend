import { UserSettings } from './user-settings.model';

export const hansSettingsMock: UserSettings = {
  languageId: 'de-DE',
  showMarginalColumn: true,
  defaultCountry: 'DE',
  searchOutletByDefaultCountry: true,
  searchOutletByActiveOutlet: true,
  doNotShowMultiSelectConfirmationDialog: false
};

export const hansSettingNoDefaultCountryMock: UserSettings = {
  languageId: 'de-DE',
  showMarginalColumn: true
};
