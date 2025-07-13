import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Optional } from '@angular/core';
import { finalize, take } from 'rxjs/operators';

import { UserSettingsService } from '../user-settings/user-settings/services/user-settings.service';
import { environment } from '../../environments/environment';

@Injectable()
export class CustomLazyMapsAPILoader {
  protected _scriptLoadingPromise: Promise<void>;
  protected readonly _SCRIPT_ID: string = 'agmGoogleMapsApiScript';
  protected readonly callbackName: string = `agmLazyMapsAPILoader`;
  protected language: string | undefined;

  constructor(
    private userSettingsService: UserSettingsService,
    @Optional() @Inject(DOCUMENT) document: Document
  ) {}

  load(): Promise<void> {
    const window = <any>document.defaultView;
    if (window.google && window.google.maps) {
      // Google maps already loaded on the page.
      return Promise.resolve();
    }

    if (this._scriptLoadingPromise) {
      return this._scriptLoadingPromise;
    }

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.defer = true;
    script.id = this._SCRIPT_ID;

    this.userSettingsService
      .getLanguageId()
      .pipe(
        take(1),
        finalize(() => {
          if (!document.getElementById(this._SCRIPT_ID)) {
            script.src = this._getScriptSrc(this.callbackName);
            document.body.appendChild(script);
          }
        })
      )
      .subscribe(languageId => {
        this.language = languageId ?? 'en';
      });

    this._assignScriptLoadingPromise(script);
    return this._scriptLoadingPromise;
  }

  private _assignScriptLoadingPromise(scriptElem: HTMLElement): void {
    this._scriptLoadingPromise = new Promise<void>((resolve: Function, reject: Function) => {
      (<any>window)[this.callbackName] = () => {
        resolve();
      };

      scriptElem.onerror = (error: Event) => {
        reject(error);
      };
    });
  }

  private _getScriptSrc(callbackName: string): string {
    const isIntranetUrl = window.location.origin.includes('intra.corpintra.net');
    const nonProdBackendUrl = isIntranetUrl
      ? 'https://gssnplus-int.intra.corpintra.net'
      : 'https://gssnplus-int.i.mercedes-benz.com';
    const prodBackendUrl = isIntranetUrl
      ? 'https://gssnplus.intra.corpintra.net'
      : 'https://gssnplus.i.mercedes-benz.com';
    const localBackendUrl = 'https://minikube:30443';
    const javasriptVersion = 3;
    const language = this.language || 'en';
    const baseUrl = environment.settings.baseUrl;
    const isProductionEnvironment = environment.settings.production;
    const isLocalEnvironment = environment.settings.environment == 'LOCAL';

    if (isLocalEnvironment) {
      return `${localBackendUrl}/geography/api/v1/google/map/javascript/versions/${javasriptVersion}/languages/${language}`;
    }

    if (isProductionEnvironment) {
      return `${prodBackendUrl}/geography/api/v1/google/map/javascript/versions/${javasriptVersion}/languages/${language}`;
    }

    return `${nonProdBackendUrl}${baseUrl}geography/api/v1/google/map/javascript/versions/${javasriptVersion}/languages/${language}`;
  }
}
