import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';

import communications from '../../../../../../contracts/communications.json';
import contracts from '../../../../../../contracts/contracts.json';
import featureToggle from '../../../../../../contracts/feature-toggle.json';
import geography from '../../../../../../contracts/geography.json';
import historization from '../../../../../../contracts/historization.json';
import iam from '../../../../../../contracts/iam.json';
import investors from '../../../../../../contracts/investors.json';
import legalStructure from '../../../../../../contracts/legal-structure.json';
import notifications from '../../../../../../contracts/notifications.json';
import search from '../../../../../../contracts/search.json';
import services from '../../../../../../contracts/services.json';
import structures from '../../../../../../contracts/structures.json';
import tasks from '../../../../../../contracts/tasks.json';
import tpro from '../../../../../../contracts/tpro-gssnplus.json';
import traits from '../../../../../../contracts/traits.json';
import userSettings from '../../../../../../contracts/user-settings.json';

import { HttpContract } from './http-contract';

const stubContracts: Array<HttpContract> = [
  ...communications,
  ...contracts,
  ...featureToggle,
  ...geography,
  ...historization,
  ...iam,
  ...investors,
  ...legalStructure,
  ...notifications,
  ...search,
  ...services,
  ...structures,
  ...tasks,
  ...tpro,
  ...traits,
  ...userSettings,
];

@Injectable()
export class ContractStubBackendInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const params = this.queryPartsBy(request);
    const url: string = params.length > 0 ? request.url + '?' + params.join('&') : request.url;
    const method: string = request.method;

    return this.responseFromContract(url, method);
  }

  private queryPartsBy(request: HttpRequest<any>): string[] {
    const queryParts: string[] = [];
    request.params.keys().forEach(key => {
      const values = request.params.getAll(key);
      if (values) {
        values.forEach(value => {
          queryParts.push(key + '=' + value);
        });
      }
    });
    return queryParts;
  }

  private responseFromContract(url: string, method: string): Observable<HttpEvent<any>> {
    const contract = this.getContractBy(url, method);

    return new Observable(response => {
      this.notifySubscriber(url, response, contract);
      response.complete();
    });
  }

  private getContractBy(url: string, method: string): HttpContract {
    const candidateContracts = stubContracts
      .filter(contract => contract.request.url === url && contract.request.method === method)
      .sort((first, second) => first.response.status - second.response.status);
    return candidateContracts[0];
  }

  private notifySubscriber(
    url: string,
    subscriber: Subscriber<any>,
    contract?: HttpContract
  ): void {
    if (contract) {
      const httpResponse = this.toHttpResponse(contract);
      subscriber.next(httpResponse);
    } else {
      subscriber.error({
        status: 503,
        error: 'Contract not found for URL: ' + url
      });
    }
  }

  private toHttpResponse(contract: HttpContract): HttpResponse<any> {
    const body = contract.response.body ? JSON.parse(contract.response.body) : null;

    return new HttpResponse({
      status: contract.response.status,
      headers: new HttpHeaders(contract.response.headers),
      body: body
    });
  }
}
