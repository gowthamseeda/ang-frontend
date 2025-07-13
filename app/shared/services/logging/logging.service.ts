import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../../environments/environment';

@Injectable()
export class LoggingService {
  constructor(private httpClient: HttpClient) {}

  error(message?: any, ...optionalParams: any[]): void {
    console.error(message, optionalParams);

    let backendErrorMessage = message;
    if (optionalParams.length > 0) {
      backendErrorMessage += ' ' + JSON.stringify(optionalParams);
    }

    let baseUrl = environment.settings.baseUrl;
    if (baseUrl === '/local/') {
      return
    }
    this.sendBackendLog(backendErrorMessage, 'ERROR');
  }

  private sendBackendLog(message: string, level: string): void {
    this.httpClient
      .post(environment.settings.backend + '/app/logs', message, {
        headers: {
          level: level
        }
      })
      .subscribe();
  }
}
