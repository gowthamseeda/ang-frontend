import { AppConfig } from './app-config.service';

export const appConfigMock: AppConfig = {
  environment: 'local-test',
  urlExtern: 'https://extern_current_url',
  production: false,
  backend: '',
  releaseVersion: '',
  enableHideableCompanyNavigation: false,
  enableCompanyNavigationOnNewPage: false,
  enableMultiSelect: false,
  enableHistorizationPostgres: false
};
