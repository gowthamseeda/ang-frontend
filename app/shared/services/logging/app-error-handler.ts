import { ErrorHandler, Injectable, Injector } from '@angular/core';

import { LoggingService } from './logging.service';

@Injectable()
export class AppErrorHandler implements ErrorHandler {
  constructor(private injector: Injector) {}

  handleError(error: any): void {
    const errorMessage = error ? (error.message ? error.message : error.toString()) : '';
    const errorStack = error && error.stack ? error.stack : new Error().stack;

    const loggingService = this.injector.get(LoggingService);
    loggingService.error(errorMessage, errorStack);
  }
}
