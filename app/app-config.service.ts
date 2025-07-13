import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

export interface AppConfig {
  environment: string;
  urlExtern: string;
  production: boolean;
  backend: string;
  releaseVersion: string;
  enableHideableCompanyNavigation: boolean;
  enableCompanyNavigationOnNewPage: boolean;
  enableMultiSelect: boolean;
  enableHistorizationPostgres: boolean;
}

@Injectable()
export class WindowUrlProvider {
  getCurrentUrl(): string {
    return window.location.href;
  }
}

@Injectable()
export class AppConfigProvider {
  getAppConfig(): AppConfig {
    return environment.settings;
  }
}

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  constructor() {}
}
