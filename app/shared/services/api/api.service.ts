import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { concat, forkJoin, Observable, of, throwError } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { LoggingService } from '../logging/logging.service';

import { ObjectStatus } from './objectstatus.model';

const httpDefault = {
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
};
const GENERIC_API_ERROR = 'GENERIC_API_ERROR';

export class ApiError {
  message: string;
  traceId?: string;
  state?: number;

  constructor(message: string, traceId?: string, state?: number) {
    this.message = message;
    this.traceId = traceId;
    this.state = state;
  }
}

@Injectable()
export class ApiService {
  constructor(private http: HttpClient, private logger: LoggingService) {}

  get<T>(url: string, params?: HttpParams, responseType?: string): Observable<T> {
    const httpOptions =
      params || responseType ? { ...httpDefault, ...{ params }, ...{ responseType } } : httpDefault;
    return this.http
      .get<T>(this.buildRequestUrl(url), httpOptions)
      .pipe(catchError(error => this.handleError(error)));
  }

  put(url: string, payload: any, params?: HttpParams): Observable<ObjectStatus> {
    const httpOptions = params ? { ...httpDefault, ...{ params } } : httpDefault;
    this.clearEmptyPropertiesOfObject(payload);
    return this.http
      .put<ObjectStatus>(this.buildRequestUrl(url), this.mapToJson(payload), httpOptions)
      .pipe(catchError(error => this.handleError(error)));
  }

  putCustom<T>(url: string, payload: any, params?: HttpParams): Observable<T> {
    const httpOptions = params ? { ...httpDefault, ...{ params } } : httpDefault;
    this.clearEmptyPropertiesOfObject(payload);
    return this.http
      .put<T>(this.buildRequestUrl(url), this.mapToJson(payload), httpOptions)
      .pipe(catchError(error => this.handleError(error)));
  }

  patch(url: string, payload: any, params?: HttpParams): Observable<ObjectStatus> {
    this.clearEmptyPropertiesOfObject(payload);
    const httpOptions = params ? { ...httpDefault, ...{ params } } : httpDefault;
    return this.http
      .patch<ObjectStatus>(this.buildRequestUrl(url), this.mapToJson(payload), httpOptions)
      .pipe(catchError(error => this.handleError(error)));
  }

  patchCustom<T>(url: string, payload: any, params?: HttpParams): Observable<T> {
    this.clearEmptyPropertiesOfObject(payload);
    const httpOptions = params ? { ...httpDefault, ...{ params } } : httpDefault;
    return this.http
      .patch<T>(this.buildRequestUrl(url), this.mapToJson(payload), httpOptions)
      .pipe(catchError(error => this.handleError(error)));
  }

  post(url: string, payload: any, params?: HttpParams): Observable<ObjectStatus> {
    const httpOptions = params ? { ...httpDefault, ...{ params } } : httpDefault;
    this.clearEmptyPropertiesOfObject(payload);
    return this.http
      .post<ObjectStatus>(this.buildRequestUrl(url), JSON.stringify(payload), httpOptions)
      .pipe(catchError(error => this.handleError(error)));
  }

  postFile<T>(url: string, payload: FormData, params?: HttpParams): Observable<T> {
    const httpMultiPart = {
      headers: {
        Accept: 'application/json'
      },
      responseType: 'text' as 'json'
    };

    const httpOptions = params ? { ...httpMultiPart, ...{ params } } : httpMultiPart;
    return this.http
      .post<T>(
        this.buildRequestUrl(url),
        payload,
        httpOptions
      ).pipe(catchError(error => this.handleError(error)));
  }

  postBlob(url: string, payload: any): Observable<Blob> {
    const httpOptions = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      responseType: 'blob' as 'json'
    };
    this.clearEmptyPropertiesOfObject(payload);
    return this.http
      .post<Blob>(this.buildRequestUrl(url), payload, httpOptions)
      .pipe(catchError(error => this.handleError(error)));
  }

  postCustom<T>(url: string, payload: any, params?: HttpParams): Observable<T> {
    const httpOptions = params ? { ...httpDefault, ...{ params } } : httpDefault;
    this.clearEmptyPropertiesOfObject(payload);
    return this.http
      .post<T>(this.buildRequestUrl(url), JSON.stringify(payload), httpOptions)
      .pipe(catchError(error => this.handleError(error)));
  }

  delete(url: string, payload?: any): Observable<ObjectStatus> {
    this.clearEmptyPropertiesOfObject(payload);
    const httpOptions = payload ? { ...httpDefault, body: JSON.stringify(payload) } : httpDefault;
    return this.http
      .request<ObjectStatus>('delete', this.buildRequestUrl(url), httpOptions)
      .pipe(catchError(error => this.handleError(error)));
  }

  deleteCustom<T>(url: string, payload?: any): Observable<T> {
    this.clearEmptyPropertiesOfObject(payload);
    const httpOptions = payload ? { ...httpDefault, body: JSON.stringify(payload) } : httpDefault;
    return this.http
      .request<T>('delete', this.buildRequestUrl(url), httpOptions)
      .pipe(catchError(error => this.handleError(error)));
  }

  private buildRequestUrl(url: string): string {
    return environment.settings.backend + (url.startsWith('/') ? url : '/' + url);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    this.logger.error('API call failed...', error);
    const traceId = error.headers.get('x-b3-traceid') || undefined;

    return throwError(
      this.is4xx(error) && error.error
        ? new ApiError(this.extractErrorMessage(error.error), traceId, error.status)
        : new ApiError(GENERIC_API_ERROR, traceId, error.status)
    );
  }

  private is4xx(error: HttpErrorResponse): boolean {
    return error.status >= 400 && error.status < 500;
  }

  private extractErrorMessage(error: any): string {
    if (error.messages instanceof Array) {
      return error.messages.join(' - ');
    }
    if (typeof error.message === 'string') {
      return error.message;
    }
    return GENERIC_API_ERROR;
  }

  private clearEmptyPropertiesOfObject(object: any): void {
    for (const property in object) {
      if (object.hasOwnProperty(property)) {
        if (typeof object[property] === 'object') {
          this.clearEmptyPropertiesOfObject(object[property]);
        }
        if (this.isEmptyObject(object[property])) {
          delete object[property];
        }
      }
    }
  }

  private mapToJson(map: any): any {
    if (map instanceof Map) {
      const result = {};
      map.forEach(function (value, key): any {
        if (key instanceof String) {
          Object.assign(result, { [key.toString()]: value });
        }
      });
      return result;
    }
    return map;
  }

  private isEmptyObject(object: any): boolean {
    return (
      object === '' ||
      object === null ||
      object === undefined ||
      (Object.getOwnPropertyNames(object).length === 0 &&
        typeof object !== 'number' &&
        typeof object !== 'boolean')
    );
  }
}

export function concatRequests(...observables: Observable<any>[][]): Observable<any> {
  if (observables.length === 0) {
    return of({});
  }

  return concat(...observables.map(value => concat(...value)));
}

export function concatRequestsWithDelay(
  delayInMs: number,
  ...observables: Observable<any>[][]
): Observable<any> {
  if (observables.length === 0) {
    return of({});
  }

  return concat(...observables.map(value => forkJoinWithDelay(value, delayInMs)));
}

export function forkJoinWithDelay(
  observables: Observable<any>[],
  delayInMs: number
): Observable<any> {
  if (observables.length === 0) {
    of({});
  }

  return forkJoin(observables).pipe(delay(delayInMs));
}
