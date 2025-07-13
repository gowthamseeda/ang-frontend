import { TestBed } from '@angular/core/testing';
import { provideAutoSpy, Spy } from 'jest-auto-spies';

import { ApiError, ApiService } from '../../../shared/services/api/api.service';
import { ObjectStatus } from '../../../shared/services/api/objectstatus.model';
import { LoggingService } from '../../../shared/services/logging/logging.service';
import { LegalInformationResponse } from '../model/legal-information-response';

import { LegalInformationPutResource } from './../model/legal-information-response';
import { LegalInformationApiService } from './legal-information-api.service';

describe('legal information API service contract test suite', () => {
  let legalInformationApiService: LegalInformationApiService;
  let apiServiceSpy: Spy<ApiService>;
  const legalFooter = 'some footer';
  const businessSiteId = '2';
  const companyId = '1';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LegalInformationApiService, LoggingService, provideAutoSpy(ApiService)]
    });

    legalInformationApiService = TestBed.inject(LegalInformationApiService);
    apiServiceSpy = TestBed.inject<any>(ApiService);
  });

  test('should create', () => {
    expect(legalInformationApiService).toBeTruthy();
  });

  describe('loadLegalInformation should', () => {
    test('return the legal information if it was found.', done => {
      const expected: LegalInformationResponse = { companyId, businessSiteId, legalFooter };
      apiServiceSpy.get.nextWith(expected);

      legalInformationApiService
        .loadLegalInformation(companyId, businessSiteId)
        .subscribe(response => {
          expect(response).toEqual(expected);
          done();
        });
    });

    test('return the error if other than the legal information not found.', done => {
      const error = { state: 503 } as ApiError;
      apiServiceSpy.get.throwWith(error);

      legalInformationApiService
        .loadLegalInformation(companyId, businessSiteId)
        .subscribe(result => {
          expect(result).toEqual(error);
          done();
        });
    });

    test('return the business site and company ids if no legal information found.', done => {
      const expected: LegalInformationResponse = { companyId, businessSiteId };
      apiServiceSpy.get.throwWith({ state: 404 } as ApiError);

      legalInformationApiService
        .loadLegalInformation(companyId, businessSiteId)
        .subscribe(result => {
          expect(result).toEqual(expected);
          done();
        });
    });
  });

  describe('saveLegalInformation should', () => {
    test('update the legal information.', done => {
      const resource: LegalInformationPutResource = {
        legalFooter: 'legalFooter',
        legalFooterTranslations: {},
        taxNo: 'taxNo',
        vatNo: 'vatNo'
      };

      const expected: ObjectStatus = { id: 'id', status: 'UPDATED' };
      apiServiceSpy.put.nextWith(expected);

      legalInformationApiService
        .saveLegalInformation(companyId, businessSiteId, resource)
        .subscribe(result => {
          expect(result.status).toBe(expected.status);
          done();
        });
    });
  });
});
